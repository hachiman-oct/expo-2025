// pages/_app.tsx

import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function updateLinks(linkMap: [string, string][], currentBasePath: string) {
  document.querySelectorAll('a').forEach((el) => {
    const anchor = el as HTMLAnchorElement;
    const originalHref = anchor.getAttribute('href'); // 元のhrefを取得

    if (!originalHref) {
      return; // href属性がない場合はスキップ
    }

    // linkMapと照合して、一致するものを更新
    for (const [fromUrl, toUrl] of linkMap) {
      // basePathを考慮した完全なFrom URLを生成
      const fullFromUrl = fromUrl.startsWith('/') ? `${currentBasePath}${fromUrl}` : fromUrl;
      const fullToUrl = toUrl.startsWith('/') ? `${currentBasePath}${toUrl}` : toUrl;

      // 元のhrefがfromUrlと一致するか、またはfromUrlの末尾が元のhrefと一致するかを確認
      // Notionの内部リンクがパスの末尾にIDを持つことがあるため、部分一致も考慮
      if (originalHref === fromUrl || originalHref.endsWith(fromUrl)) {
        anchor.href = fullToUrl;
        console.log(`リンクを更新しました: ${originalHref} から ${fullToUrl} へ`);
        break; // マッチしたら次のアンカー要素へ
      }
    }
  });
}

// 更新したいリンクのマッピングを定義（_app.tsx内で定義）
const linkMapping: [string, string][] = [
  ["/20f7953a3deb8019ab38fca64d2fda63", "/"],
  ["/21d7953a3deb80778af2df0c17ac03a5", "/prep"],
  ["/2157953a3deb804a9813c104ae24a32e", "/pavilions"],
  ["/21f7953a3deb80398167c09a78bbc93f", "/prep/apps"],
];

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const basePath = router.basePath || '';

  useEffect(() => {
    updateLinks(linkMapping, basePath);

    const handleRouteChange = (url: string) => {
      console.log(`Route changed to: ${url}, updating links...`);
      setTimeout(() => updateLinks(linkMapping, basePath), 100);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, basePath]);

  return <Component {...pageProps} />;
}