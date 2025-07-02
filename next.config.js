/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 静的エクスポートを有効にする

  // ここが最も重要です！
  // あなたのリポジトリ名は 'expo-2025' なので、正確に '/expo-2025' を設定します。
  basePath: process.env.NODE_ENV === 'production' ? '/expo-2025' : '', 
  assetPrefix: process.env.NODE_ENV === 'production' ? '/expo-2025/' : '', // assetPrefixは末尾にスラッシュが必要です

  images: {
    unoptimized: true, // GitHub Pagesではサーバー側の画像最適化ができないため無効化
  }
};

module.exports = nextConfig;