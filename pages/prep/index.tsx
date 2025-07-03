// pages/index.tsx
import { GetStaticProps } from 'next';
import { NotionAPI } from 'notion-client'; // react-notion-x のクライアント
import { ExtendedRecordMap } from 'notion-types';
import { NotionRenderer } from 'react-notion-x';
import Head from 'next/head';
import { useEffect } from 'react';

// CSS をインポートすることで Notiion のスタイルを適用
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css'; // コードブロックのハイライト用 (NotionRendererの依存)
import 'katex/dist/katex.min.css'; // 数式のレンダリング用 (NotionRendererの依存)

// カスタム CSS ファイル
// import './style.css';

const NOTION_PREP_PAGE_ID = process.env.NOTION_PREP_PAGE_ID as string;

interface PageProps {
    recordMap: ExtendedRecordMap;
}

// リンク書き換え用の共通関数
function updateNotionBlockLink(blockId: string, href: string) {
    const el = document.querySelector<HTMLAnchorElement>(`a.notion-block-${blockId}`);
    if (el) {
        el.href = href;
    }
}

export default function Page({ recordMap }: PageProps) {
    useEffect(() => {
        updateNotionBlockLink("21d7953a3deb80778af2df0c17ac03a5", "/prep");
        updateNotionBlockLink("2157953a3deb804a9813c104ae24a32e", "/pavilions");
    }, []);

    if (!recordMap) {
        return <div>ページの読み込みに失敗しました。</div>;
    }

    return (
        <div>
            <Head>
                <title>Expo 2025 - Main</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
                <link rel="icon" href="/expo-2025/favicon.ico" />
                <link rel="manifest" href="/expo-2025/manifest.json" />
            </Head>

            <main>
                <NotionRenderer recordMap={recordMap} fullPage={true} darkMode={false} />
            </main>
        </div>
    );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
    const notionApi = new NotionAPI();
    const recordMap = await notionApi.getPage(NOTION_PREP_PAGE_ID);

    return {
        props: {
            recordMap,
        }
    };
};