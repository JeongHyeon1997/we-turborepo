import { createApp } from '../src/main';

let cachedApp: Awaited<ReturnType<typeof createApp>> | null = null;

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (!cachedApp) {
    cachedApp = await createApp();
    await cachedApp.init();
  }
  const instance = cachedApp.getHttpAdapter().getInstance();
  instance(req, res);
}
