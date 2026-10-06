import { lazy, Suspense } from 'react';
import { ThemeProvider, ToastProvider, Spinner, CodeHighlighterProvider } from '@sam.barfield/field-react';
import { Header } from './components/Header';
import { DocsLayout } from './docs/DocsLayout';
import { useHashRoute } from './router';
import { prismHighlighter } from './docs/highlighter';

// Large, standalone pages are split out of the main bundle.
const StickerSheet = lazy(() => import('./components/StickerSheet').then(m => ({ default: m.StickerSheet })));
const ThemeEditor = lazy(() => import('./components/ThemeEditor').then(m => ({ default: m.ThemeEditor })));
const RealWorldDemos = lazy(() => import('./components/RealWorldDemos').then(m => ({ default: m.RealWorldDemos })));

function AppContent() {
  const [route] = useHashRoute();

  return (
    <div className="showcase-app">
      <a className="showcase-skip-link" href="#main-content">
        Skip to content
      </a>
      <Header route={route} />
      {route.page === 'docs' || route.page === 'components' ? (
        <DocsLayout route={route} />
      ) : (
        <main className="showcase-main" id="main-content">
          <Suspense fallback={<div className="showcase-loading"><Spinner size={24} /></div>}>
            {route.page === 'sticker-sheet' && <StickerSheet />}
            {route.page === 'theme-editor' && <ThemeEditor />}
            {route.page === 'examples' && <RealWorldDemos />}
          </Suspense>
        </main>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultMode="dark" storageKey="field-showcase-mode">
      <ToastProvider>
        <CodeHighlighterProvider highlighter={prismHighlighter}>
          <AppContent />
        </CodeHighlighterProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
