// pages/index.tsx
import { GetStaticProps } from 'next';
import { NotionAPI } from 'notion-client'; // react-notion-x のクライアント
import { ExtendedRecordMap } from 'notion-types';
import { NotionRenderer } from 'react-notion-x';
import Head from 'next/head';

// CSS をインポートすることで Notiion のスタイルを適用
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css'; // コードブロックのハイライト用 (NotionRendererの依存)
import 'katex/dist/katex.min.css'; // 数式のレンダリング用 (NotionRendererの依存)

const NOTION_MAIN_PAGE_ID = process.env.NOTION_MAIN_PAGE_ID as string;

interface HomePageProps {
    recordMap: ExtendedRecordMap;
}

export default function HomePage({ recordMap }: HomePageProps) {
    if (!recordMap) {
        return <div>ページの読み込みに失敗しました</div>;
    }

    return (
        <div>
            <Head>
                <title>Expo 2025 - Main</title>
                <meta name="description" content="Expo 2025 Infomations by hachiman-oct" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
                <link rel="icon" href="/expo-2025/favicon.ico" />
                <link rel="manifest" href="/expo-2025/manifest.json" />
                <link rel="apple-touch-icon" href="/expo-2025/icons/icon-180.png" />
            </Head>

            <main>
                <NotionRenderer recordMap={recordMap} fullPage={true} darkMode={false} />
            </main>
        </div>
    );
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
    const notionApi = new NotionAPI();
    const recordMap = await notionApi.getPage(NOTION_MAIN_PAGE_ID);

    return {
        props: {
            recordMap,
        }
    };
};