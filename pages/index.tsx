// pages/index.tsx
import { GetStaticProps } from 'next';
import { NotionAPI } from 'notion-client'; // react-notion-x のクライアント
import { ExtendedRecordMap } from 'notion-types';
import { NotionRenderer } from 'react-notion-x';
import Head from 'next/head';
import Script from 'next/script';

// CSS をインポートすることで Notiion のスタイルを適用
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css'; // コードブロックのハイライト用 (NotionRendererの依存)
import 'katex/dist/katex.min.css'; // 数式のレンダリング用 (NotionRendererの依存)

// カスタム CSS ファイル
import styles from './index.module.css';

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
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <NotionRenderer recordMap={recordMap} fullPage={true} darkMode={false} />
            </main>

            <Script
                src="link-updater.js" // public フォルダからのパス
                strategy="lazyOnload" // ロード戦略: ページがインタラクティブになった後、またはビューポートに入った後にロード
            />
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