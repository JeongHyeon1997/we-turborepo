import { createApp } from '../src/main';

let cachedApp: Awaited<ReturnType<typeof createApp>> | null = null;

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
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
