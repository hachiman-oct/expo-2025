// pages/pavilions/[id].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import { notion } from '../../lib/notion'; // 作成済みの Notion クライアントをインポート
import { NotionAPI } from 'notion-client'; // react-notion-x のクライアント
import { ExtendedRecordMap } from 'notion-types';
import { NotionRenderer } from 'react-notion-x';
import Head from 'next/head';
import Link from 'next/link'; // 一覧に戻るリンク用

// NotionRenderer のスタイルシートをインポート
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css'; // コードブロックのハイライト用
import 'katex/dist/katex.min.css'; // 数式のレンダリング用

// 環境変数からデータベースIDを取得
// .env.local に NOTION_PAVILIONS_DATABASE_ID=YOUR_PAVILIONS_DATABASE_ID を設定してください
const NOTION_PAVILIONS_DATABASE_ID = process.env.NOTION_PAVILIONS_DATABASE_ID as string;

// パビリオン詳細ページのPropsの型定義
interface PavilionDetailPageProps {
    pavilion: {
        id: string;
        name: string;
        // 必要に応じて Notion データベースの他のプロパティも追加
        duration?: string; // 所要時間
        location?: string; // Location
        operatingHours?: string; // 運営時間
        receptionMethod?: string; // 受付方法 (select プロパティ)
    };
    recordMap: ExtendedRecordMap;
}

// パビリオン詳細ページコンポーネント
export default function PavilionDetailPage({ pavilion, recordMap }: PavilionDetailPageProps) {
    if (!pavilion || !recordMap) {
        return (
            <div>
                <p>パビリオン情報の読み込みに失敗しました。</p>
                <Link href="/pavilions" style={{ textDecoration: 'none', color: '#0070f3' }}>
                    一覧に戻る
                </Link>
            </div>
        );
    }

    return (

        <div>
            <Head>
                <title>Expo 2025 - {pavilion.name}の詳細</title>
                <meta name="description" content={`Expo 2025 のパビリオン ${pavilion.name} の詳細情報`} />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
                <link rel="icon" href="/expo-2025/favicon.ico" />
                <link rel="manifest" href="/expo-2025/manifest.json" />
            </Head>

            <main>
                <h1>{pavilion.name}</h1>
                {/* ★ 追加: プロパティ情報を表示 ★ */}
                <p><strong>所要時間:</strong> {pavilion.duration || '不明'}</p>
                <p><strong>場所:</strong> {pavilion.location || '不明'}</p>
                <p><strong>運営時間:</strong> {pavilion.operatingHours || '不明'}</p>
                <p><strong>受付方法:</strong> {pavilion.receptionMethod || '不明'}</p>
                {/* ... 必要に応じて、他のプロパティもここに追加 ... */}

                <hr/>
                {/* Notion のページコンテンツをレンダリング */}
                <NotionRenderer recordMap={recordMap} fullPage={false} darkMode={false} />

                <hr/>
                <Link href="/pavilions" style={{ textDecoration: 'none', color: '#0070f3' }}>
                    &larr; パビリオン一覧に戻る
                </Link>
            </main>
        </div>
    );
}


// どのパス (ID) を静的に生成するかを Next.js に伝える
export const getStaticPaths: GetStaticPaths = async () => {
    if (!NOTION_PAVILIONS_DATABASE_ID) {
        console.error('エラー: NOTION_PAVILIONS_DATABASE_ID が .env.local で getStaticPaths 用に設定されていません。');
        return {
            paths: [],
            fallback: 'blocking', // エラー時は新しいリクエスト時に生成を試みる
        };
    }

    try {
        const response = await notion.databases.query({
            database_id: NOTION_PAVILIONS_DATABASE_ID,
            // 公開したいエントリのみをフィルタリングする例
            // 例: Status プロパティが '公開' のものを対象とする
            // filter: {
            //   property: 'Status',
            //   status: {
            //     equals: '公開',
            //   },
            // },
            page_size: 100, // 取得するアイテムの最大数。必要に応じて調整
        });

        const paths = response.results.map((page) => ({
            params: { id: page.id },
        }));

        return {
            paths,
            fallback: 'blocking', // 新しいページが追加された場合、次回のリクエスト時に生成 (ISR)
        };
    } catch (error) {
        console.error('Notion からのパビリオンパスの取得に失敗しました:', error);
        return {
            paths: [],
            fallback: 'blocking',
        };
    }
};

// 各パス (ID) に対応するページデータを取得
export const getStaticProps: GetStaticProps<PavilionDetailPageProps> = async ({ params }) => {
    const pavilionId = params?.id as string;

    if (!pavilionId) {
        return {
            notFound: true, // IDがない場合は404ページを表示
        };
    }

    try {
        // データベースエントリ（ページ）のプロパティを取得
        const page = await notion.pages.retrieve({ page_id: pavilionId });

        // PageObjectResponse 型であることを確認
        if (!('properties' in page)) {
            return { notFound: true };
        }

        // ページ内のブロックコンテンツを取得 (react-notion-x 用)
        const notionApi = new NotionAPI();
        const recordMap = await notionApi.getPage(pavilionId);

        function getRichTextPlainText(property: any, propertyType: string): string | undefined {
            if (
                property &&
                property.type === propertyType &&
                Array.isArray(property[propertyType]) &&
                property[propertyType].length > 0 &&
                property[propertyType][0].plain_text
            ) {
                return property[propertyType][0].plain_text;
            }
            return undefined;
        }

        const name = getRichTextPlainText(page.properties.Name, 'title') || `無題のパビリオン (ID: ${page.id.substring(0, 8)}...)`;
        const duration = getRichTextPlainText(page.properties.所要時間, 'rich_text');
        const location = getRichTextPlainText(page.properties.Location, 'rich_text');
        const operatingHours = getRichTextPlainText(page.properties.運営時間, 'rich_text');
        const receptionMethodProperty = page.properties.受付方法;
        let receptionMethod: string | undefined;
        if (
            receptionMethodProperty &&
            receptionMethodProperty.type === 'select' &&
            receptionMethodProperty.select &&
            typeof receptionMethodProperty.select === 'object' &&
            receptionMethodProperty.select !== null &&
            'name' in receptionMethodProperty.select &&
            typeof receptionMethodProperty.select.name === 'string'
        ) {
            receptionMethod = receptionMethodProperty.select.name;
        }
        return {
            props: {
                pavilion: {
                    id: pavilionId,
                    name: name,
                    // 必要に応じて他のプロパティもここに追加
                    duration,
                    location,
                    operatingHours,
                    receptionMethod,
                },
                recordMap,
            }
        };
    } catch (error) {
        console.error(`パビリオンID ${pavilionId} の詳細情報の取得に失敗しました:`, error);
        return {
            notFound: true, // エラー発生時も404ページを表示
            revalidate: 1, // エラー時はすぐに再検証
        };
    }
};