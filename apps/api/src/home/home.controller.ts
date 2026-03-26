import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from '../common/decorators/public.decorator';

@Controller()
export class HomeController {
  @Get()
  @Public()
  home(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(HTML);
  }
}

const HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>We API</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: #0d0d0d;
      color: #e2e8f0;
      font-family: 'Courier New', Courier, monospace;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }

    .container {
      width: 100%;
      max-width: 680px;
    }

    .header {
      margin-bottom: 36px;
    }

    .badge {
      display: inline-block;
      background: #1a1a2e;
      border: 1px solid #2d2d5e;
      border-radius: 6px;
      padding: 3px 10px;
      font-size: 11px;
      color: #818cf8;
      letter-spacing: 0.08em;
      margin-bottom: 14px;
    }

    h1 {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #f9a8d4 0%, #a78bfa 50%, #67e8f9 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
    }

    .subtitle {
      color: #64748b;
      font-size: 13px;
    }

    .tree {
      background: #111111;
      border: 1px solid #1e1e1e;
      border-radius: 12px;
      padding: 24px 28px;
      line-height: 1.9;
      font-size: 13px;
    }

    .tree-root {
      color: #94a3b8;
      margin-bottom: 4px;
    }

    .group { margin-bottom: 2px; }

    .group-label {
      color: #64748b;
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-top: 16px;
      margin-bottom: 2px;
      padding-left: 20px;
    }

    .line { color: #2d2d2d; }

    .method {
      display: inline-block;
      width: 46px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-align: center;
      border-radius: 3px;
      padding: 1px 0;
      margin-right: 8px;
    }

    .get    { background: #0c2340; color: #38bdf8; }
    .post   { background: #0c2d1f; color: #4ade80; }
    .put    { background: #2d1f08; color: #fb923c; }
    .delete { background: #2d0c0c; color: #f87171; }

    .path { color: #e2e8f0; }
    .path-dim { color: #475569; }
    .path-param { color: #a78bfa; }

    .desc {
      color: #334155;
      font-size: 11px;
      margin-left: 8px;
    }

    .footer {
      margin-top: 24px;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    a.btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-family: inherit;
      text-decoration: none;
      transition: opacity 0.15s;
    }
    a.btn:hover { opacity: 0.75; }

    .btn-swagger {
      background: #1a1f35;
      border: 1px solid #2d3a6b;
      color: #818cf8;
    }

    .btn-health {
      background: #0f2318;
      border: 1px solid #1a4731;
      color: #4ade80;
    }

    .dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #4ade80;
      display: inline-block;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">WE API · v1.0</div>
      <h1>We API</h1>
      <p class="subtitle">커플 &nbsp;·&nbsp; 펫 &nbsp;·&nbsp; 웨딩 &nbsp;통합 REST API</p>
    </div>

    <div class="tree">
      <div class="tree-root">📡 &nbsp;api.we.app</div>

      <div class="group-label">── auth</div>
      <div><span class="line">   ├ </span><span class="method post">POST</span><span class="path">/api/auth/<span class="path-dim">signup</span></span></div>
      <div><span class="line">   ├ </span><span class="method post">POST</span><span class="path">/api/auth/<span class="path-dim">login</span></span></div>
      <div><span class="line">   ├ </span><span class="method post">POST</span><span class="path">/api/auth/<span class="path-dim">refresh</span></span></div>
      <div><span class="line">   └ </span><span class="method post">POST</span><span class="path">/api/auth/<span class="path-dim">logout</span></span></div>

      <div class="group-label">── users</div>
      <div><span class="line">   ├ </span><span class="method get">GET</span><span class="path">/api/users/<span class="path-dim">me</span></span></div>
      <div><span class="line">   └ </span><span class="method put">PUT</span><span class="path">/api/users/<span class="path-dim">me</span></span></div>

      <div class="group-label">── couple</div>
      <div><span class="line">   ├ </span><span class="method get">GET</span><span class="path">/api/couple</span></div>
      <div><span class="line">   ├ </span><span class="method post">POST</span><span class="path">/api/couple/<span class="path-dim">request</span></span></div>
      <div><span class="line">   ├ </span><span class="method post">POST</span><span class="path">/api/couple/<span class="path-dim">confirm</span></span></div>
      <div><span class="line">   ├ </span><span class="method put">PUT</span><span class="path">/api/couple</span></div>
      <div><span class="line">   ├ </span><span class="method delete">DEL</span><span class="path">/api/couple</span></div>
      <div><span class="line">   ├ </span><span class="method get">GET</span><span class="path">/api/couple/<span class="path-dim">diary</span></span></div>
      <div><span class="line">   ├ </span><span class="method post">POST</span><span class="path">/api/couple/<span class="path-dim">diary</span></span></div>
      <div><span class="line">   ├ </span><span class="method get">GET</span><span class="path">/api/couple/<span class="path-dim">community/posts</span></span></div>
      <div><span class="line">   └ </span><span class="method post">POST</span><span class="path">/api/couple/<span class="path-dim">community/posts</span></span></div>

      <div class="group-label">── pet</div>
      <div><span class="line">   ├ </span><span class="method get">GET</span><span class="path">/api/pet/<span class="path-dim">family</span></span></div>
      <div><span class="line">   ├ </span><span class="method post">POST</span><span class="path">/api/pet/<span class="path-dim">family/invite</span></span></div>
      <div><span class="line">   ├ </span><span class="method post">POST</span><span class="path">/api/pet/<span class="path-dim">family/join</span></span></div>
      <div><span class="line">   ├ </span><span class="method get">GET</span><span class="path">/api/pet/<span class="path-dim">pets</span></span></div>
      <div><span class="line">   ├ </span><span class="method post">POST</span><span class="path">/api/pet/<span class="path-dim">pets</span></span></div>
      <div><span class="line">   ├ </span><span class="method get">GET</span><span class="path">/api/pet/<span class="path-dim">diary</span></span></div>
      <div><span class="line">   └ </span><span class="method get">GET</span><span class="path">/api/pet/<span class="path-dim">community/posts</span></span></div>

      <div class="group-label">── marriage</div>
      <div><span class="line">   ├ </span><span class="method get">GET</span><span class="path">/api/marriage</span></div>
      <div><span class="line">   ├ </span><span class="method post">POST</span><span class="path">/api/marriage/<span class="path-dim">request</span></span></div>
      <div><span class="line">   └ </span><span class="method post">POST</span><span class="path">/api/marriage/<span class="path-dim">confirm</span></span></div>

      <div class="group-label">── etc</div>
      <div><span class="line">   ├ </span><span class="method get">GET</span><span class="path">/api/announcements</span></div>
      <div><span class="line">   ├ </span><span class="method post">POST</span><span class="path">/api/storage/<span class="path-dim">presigned-upload-url</span></span></div>
      <div><span class="line">   └ </span><span class="method get">GET</span><span class="path">/api/health</span></div>
    </div>

    <div class="footer">
      <a class="btn btn-swagger" href="/docs" target="_blank">
        📄 Swagger UI
      </a>
      <a class="btn btn-health" href="/api/health" target="_blank">
        <span class="dot"></span> Health Check
      </a>
    </div>
  </div>
</body>
</html>`;
