/**
 * Post-build SSG script: Vite로 클라이언트 번들을 빌드한 후 실행.
 * React 컴포넌트를 서버에서 렌더링해 각 라우트를 정적 HTML 파일로 생성한다.
 * bun이 TSX를 네이티브 지원하므로 별도 컴파일 불필요.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { render } from '../src/entry-server';
import { ARTICLES } from '../src/data/articles';

const distDir = resolve(import.meta.dir, '../dist');

const routes = [
  '/',
  '/story',
  ...ARTICLES.map((a) => `/story/${a.slug}`),
];

const template = readFileSync(resolve(distDir, 'index.html'), 'utf-8');

let generated = 0;
for (const route of routes) {
  const appHtml = render(route);
  const html = template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`,
  );

  const outPath =
    route === '/'
      ? resolve(distDir, 'index.html')
      : resolve(distDir, `${route.slice(1)}/index.html`);

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  generated++;
  console.log(`  ✓ ${route}`);
}

console.log(`\n[ssg] ${generated} pages generated.`);
