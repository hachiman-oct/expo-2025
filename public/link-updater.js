// public/js/link-updater.js

// リンクを更新する関数
function updateLinks(linkMap) {
  linkMap.forEach(([fromUrl, toUrl]) => {
    // fromUrl に一致する href を持つすべての <a> 要素を選択
    document.querySelectorAll(`a[href="${fromUrl}"]`).forEach((el) => {
      // HTMLAnchorElement に型アサーションして href プロパティに安全にアクセス
      el.href = toUrl;
      console.log(`リンクを更新しました: ${fromUrl} から ${toUrl} へ`);
    });
  });
}

// 更新したいリンクのマッピングを定義
const linkMapping = [
  ["/20f7953a3deb8019ab38fca64d2fda63", "/"],
  ["/21d7953a3deb80778af2df0c17ac03a5", "/prep"],
  ["/2157953a3deb804a9813c104ae24a32e", "/pavilions"],
  ["/21f7953a3deb80398167c09a78bbc93f", "/prep/apps"],
];

// DOM が完全に読み込まれてからリンクの更新を試みる
// これにより、document.querySelectorAll が要素を見つけられることを保証
document.addEventListener('DOMContentLoaded', () => {
  updateLinks(linkMapping);
});