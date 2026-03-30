import { renderToString } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { App } from './App';
import { StoryPage } from './pages/StoryPage';
import { ArticlePage } from './pages/ArticlePage';

const routes = [
  { path: '/', element: <App /> },
  { path: '/story', element: <StoryPage /> },
  { path: '/story/:slug', element: <ArticlePage /> },
  { path: '*', element: <App /> },
];

export function render(url: string): string {
  const router = createMemoryRouter(routes, {
    initialEntries: [url],
  });
  return renderToString(<RouterProvider router={router} />);
}
