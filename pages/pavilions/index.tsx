// pages/pavilions/index.tsx
import { GetStaticProps } from 'next';
import { notion } from '../../lib/notion'; // 作成済みの Notion クライアントをインポート
import { PageObjectResponse, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import Link from 'next/link';
import Head from 'next/head';

// 環境変数からデータベースIDを取得
const NOTION_PAVILIONS_DATABASE_ID = process.env.NOTION_PAVILIONS_DATABASE_ID as string;

// ★ 修正: パビリオンデータの型定義を拡張 ★
interface Pavilion {
    id: string;
    name: string;
    duration?: string; // 所要時間
    location?: string; // Location
    operatingHours?: string; // 運営時間
    receptionMethod?: string; // 受付方法 (select プロパティ)
    // 必要に応じて他のプロパティもここに追加
}

// ページコンポーネントのPropsの型定義
interface PavilionsPageProps {
    pavilions: Pavilion[];
}

// パビリオン一覧ページコンポーネント
export default function PavilionsPage({ pavilions }: PavilionsPageProps) {
    return (
        <div>
            <Head>
                <title>Expo 2025 - Pavilions</title>
                <meta name="description" content="Expo 2025 大阪・関西万博で行きたいパビリオンの一覧" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
                <link rel="icon" href="/expo-2025/favicon.ico" />
                <link rel="manifest" href="/expo-2025/manifest.json" />
            </Head>

            <main>
                <h1>Expo 2025 行きたいパビリオン一覧</h1>
                {pavilions.length === 0 ? (
                    <p>パビリオン情報が見つかりませんでした。NotionデータベースのID、共有設定、またはデータを確認してください。</p>
                ) : (
                    <table className="pavilions-table">
                        <thead>
                            <tr>
                                <th>パビリオン名</th>
                                <th>所要時間</th>
                                <th>場所</th>
                                <th>運営時間</th>
                                <th>受付方法</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pavilions.map((pavilion) => (
                                <tr key={pavilion.id}>
                                    <td>
                                        <Link href={`/pavilions/${pavilion.id}`} style={{ textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>
                                            {pavilion.name}
                                        </Link>
                                    </td>
                                    <td>{pavilion.duration || '不明'}</td>
                                    <td>{pavilion.location || '不明'}</td>
                                    <td>{pavilion.operatingHours || '不明'}</td>
                                    <td>{pavilion.receptionMethod || '不明'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
}

// ビルド時に静的プロパティを生成 (SSG)
export const getStaticProps: GetStaticProps<PavilionsPageProps> = async () => {
    if (!NOTION_PAVILIONS_DATABASE_ID) {
        console.error('エラー: NOTION_PAVILIONS_DATABASE_ID が .env.local で設定されていません。');
        return {
            props: {
                pavilions: [],
            },
            revalidate: 1,
        };
    }

    try {
        const response: QueryDatabaseResponse = await notion.databases.query({
            database_id: NOTION_PAVILIONS_DATABASE_ID,
            sorts: [
                {
                    property: 'Name', // タイトル列のプロパティ名
                    direction: 'ascending',
                },
            ],
            page_size: 100,
        });

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

        const pavilions: Pavilion[] = response.results
            .map((page) => {
                if (!('properties' in page)) {
                    return null;
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
                    id: page.id,
                    name,
                    duration,
                    location,
                    operatingHours,
                    receptionMethod,
                };
            })
            .filter(Boolean) as Pavilion[];

        return {
            props: {
                pavilions,
            }
        };
    } catch (error) {
        console.error('Notion からのパビリオン情報の取得に失敗しました:', error);
        return {
            props: {
                pavilions: [],
            }
        };
    }
};