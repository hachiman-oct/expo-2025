Run npm run build
  npm run build
  shell: /usr/bin/bash -e {0}

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
Error: NOTION_API_KEY is not defined in .env.local
    at 8258 (.next/server/pages/pavilions/[id].js:1:3388)
    at o (.next/server/webpack-runtime.js:1:127)
    at <unknown> (.next/server/pages/pavilions/[id].js:1:344)
    at o.a (.next/server/webpack-runtime.js:1:866)
    at 2011 (.next/server/pages/pavilions/[id].js:1:235)
    at o (.next/server/webpack-runtime.js:1:127)
    at <unknown> (.next/server/pages/pavilions/[id].js:1:3987)
    at o.a (.next/server/webpack-runtime.js:1:866)
    at 9593 (.next/server/pages/pavilions/[id].js:1:3588)
    at o (.next/server/webpack-runtime.js:1:127)

> Build error occurred
[Error: Failed to collect page data for /pavilions/[id]] {
  type: 'Error'
}
Error: Process completed with exit code 1.