// pages/_app.tsx

import type { AppProps } from 'next/app';
// ここにグローバルCSSをインポートします
// 例:
import '../styles/globals.css'; // styles/globals.css を作成した場合
// または、あなたが元々使っていた global.css ファイルへのパス
// import '../pages/style.css'; 

// NotionRenderer用のスタイルもあればここでインポート
// import '../styles/notion-renderer-styles.css'; 

// Script コンポーネントで読み込んでいた link-updater.js を、
// アプリケーション全体で使いたい場合はここにロジックを移動します。
// （public/link-updater.js ファイルは不要になる可能性があります）
import { useEffect } from 'react';
import { useRouter } from 'next/router';

// link-updater.js の updateLinks 関数をここに持ってくる
function updateLinks(linkMap: [string, string][], currentBasePath: string) {
  linkMap.forEach(([fromUrl, toUrl]) => {
    const fullFromUrl = fromUrl.startsWith('/') ? `${currentBasePath}${fromUrl}` : fromUrl;
    const fullToUrl = toUrl.startsWith('/') ? `${currentBasePath}${toUrl}` : toUrl;

    // console.log(`Attempting to update links from ${fullFromUrl} to ${fullToUrl}`); // デバッグ用
    document.querySelectorAll('a').forEach((el) => {
      const anchor = el as HTMLAnchorElement;
      anchor.href = fullToUrl;
      console.log(`リンクを更新しました: ${fullFromUrl} から ${fullToUrl} へ`);
    });
  });
}

// 更新したいリンクのマッピングを定義（_app.tsx内で定義）
const linkMapping: [string, string][] = [
  ["/20f7953a3deb8019ab38fca64d2fda63", "/"],
  ["/21d7953a3deb80778af2df0c17ac03a5", "/prep"],
  ["/2157953a3deb804a9813c104ae24a32e", "/pavilions"],
  ["/21f7953a3deb80398167c09a78bbc93f", "/prep/app"],
];


// ★★★これがカスタムAppコンポーネントの基本形です★★★
export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const basePath = router.basePath || ''; // basePath を取得

  useEffect(() => {
    // 初回ロード時とページ遷移時にリンクを更新
    updateLinks(linkMapping, basePath);

    const handleRouteChange = (url: string) => {
      console.log(`Route changed to: ${url}, updating links...`);
      // ページ遷移後、DOMが更新されてからリンクを再更新
      // 少し遅延させることで、DOMが完全に更新されるのを待つ
      setTimeout(() => updateLinks(linkMapping, basePath), 100); 
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // クリーンアップ関数
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, basePath]);


  return <Component {...pageProps} />;
}