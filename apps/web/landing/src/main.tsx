import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { App } from './App';
import { StoryPage } from './pages/StoryPage';
import { ArticlePage } from './pages/ArticlePage';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/story', element: <StoryPage /> },
  { path: '/story/:slug', element: <ArticlePage /> },
  { path: '*', element: <App /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
