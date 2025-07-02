import { Client } from '@notionhq/client';

// 必ず環境変数が存在するかチェックしましょう
if (!process.env.NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY is not defined in .env.local');
}

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});