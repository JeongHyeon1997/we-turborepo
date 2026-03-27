import { createApp } from '../src/main';

let cachedApp: Awaited<ReturnType<typeof createApp>> | null = null;

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export default async function handler(req: any, res: any) {
  // Handle CORS preflight immediately — before NestJS boots
  if (req.method === 'OPTIONS') {
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      res.setHeader(key, value);
    }
    res.statusCode = 204;
    res.end();
    return;
  }

  if (!cachedApp) {
    cachedApp = await createApp();
    await cachedApp.init();
  }
  const instance = cachedApp.getHttpAdapter().getInstance();
  instance(req, res);
}
