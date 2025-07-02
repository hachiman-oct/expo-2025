
11s
Run npm run build
  npm run build
  shell: /usr/bin/bash -e {0}
  env:
    NOTION_API_KEY: ***
    NOTION_MAIN_PAGE_ID: ***
    NOTION_PREP_PAGE_ID: ***
    NOTION_PREP_APP_PAGE_ID: ***
    NOTION_PAVILIONS_PAGE_ID: 

> expo-2025@0.1.0 build
> next build

⚠ No build cache found. Please configure build caching for faster rebuilds. Read more: https://nextjs.org/docs/messages/no-cache
Attention: Next.js now collects completely anonymous telemetry regarding usage.
This information is used to shape Next.js' roadmap and prioritize features.
You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
https://nextjs.org/telemetry

   ▲ Next.js 15.3.4

   Linting and checking validity of types ...
   Creating an optimized production build ...
 ✓ Compiled successfully in 3.0s
   Collecting page data ...
エラー: NOTION_PAVILIONS_DATABASE_ID が .env.local で getStaticPaths 用に設定されていません。
   Generating static pages (0/5) ...
エラー: NOTION_PAVILIONS_DATABASE_ID が .env.local で設定されていません。
Error occurred prerendering page "/pavilions". Read more: https://nextjs.org/docs/messages/prerender-error
Error: ISR cannot be used with "output: export". See more info here: https://nextjs.org/docs/advanced-features/static-html-export
    at e3 (/home/runner/work/expo-2025/expo-2025/node_modules/next/dist/compiled/next-server/pages.runtime.prod.js:26:663)
    at async exportPagesPage (/home/runner/work/expo-2025/expo-2025/node_modules/next/dist/export/routes/pages.js:80:28)
    at async Span.traceAsyncFn (/home/runner/work/expo-2025/expo-2025/node_modules/next/dist/trace/trace.js:157:20)
    at async exportPage (/home/runner/work/expo-2025/expo-2025/node_modules/next/dist/export/worker.js:357:18)
    at async exportPageWithRetry (/home/runner/work/expo-2025/expo-2025/node_modules/next/dist/export/worker.js:247:26)
    at async Promise.all (index 0)
    at async Object.exportPages (/home/runner/work/expo-2025/expo-2025/node_modules/next/dist/export/worker.js:334:31)
Export encountered an error on /pavilions, exiting the build.
 ⨯ Next.js build worker exited with code: 1 and signal: null
Error: Process completed with exit code 1.