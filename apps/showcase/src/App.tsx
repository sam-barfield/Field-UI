import { useState } from 'react';
import { ThemeProvider, ToastProvider } from '@sam.barfield/field-react';
import { Header } from './components/Header';
import { StickerSheet } from './components/StickerSheet';
import { ThemeEditor } from './components/ThemeEditor';
import { RealWorldDemos } from './components/RealWorldDemos';
import { DocsViewer } from './components/DocsViewer';
import { ComponentCatalog } from './components/ComponentCatalog';

export function AppContent() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'stickersheet' | 'theme-editor' | 'demos' | 'docs'>('catalog');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Only full-page composite demos resize the outer application container.
  // In the component catalog, viewport resizes the component preview canvas.
  const isOuterContainerResize = activeTab === 'demos';

  const getViewportWidth = () => {
    if (!isOuterContainerResize) return '100%';
    switch (viewport) {
      case 'mobile':
        return '390px';
      case 'tablet':
        return '768px';
      case 'desktop':
      default:
        return '100%';
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--field-surface-base)',
        color: 'var(--field-text-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        viewport={viewport}
        onViewportChange={setViewport}
      />

      {/* Main Container with dynamic viewport resizing support */}
      <main
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: isOuterContainerResize && viewport !== 'desktop' ? '24px 0' : '32px 24px',
          transition: 'padding 0.2s ease',
        }}
      >
        <div
          style={{
            width: getViewportWidth(),
            maxWidth: isOuterContainerResize && viewport !== 'desktop' ? getViewportWidth() : '1440px',
            transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: isOuterContainerResize && viewport !== 'desktop' ? '0 0 30px rgba(0, 0, 0, 0.6)' : 'none',
            border: isOuterContainerResize && viewport !== 'desktop' ? '1px solid var(--field-border-strong)' : 'none',
            borderRadius: isOuterContainerResize && viewport !== 'desktop' ? '16px' : '0',
            padding: isOuterContainerResize && viewport !== 'desktop' ? '20px' : '0',
            backgroundColor: 'var(--field-surface-base)',
            overflow: 'hidden',
          }}
        >
          {activeTab === 'catalog' && (
            <ComponentCatalog viewport={viewport} onViewportChange={setViewport} />
          )}
          {activeTab === 'stickersheet' && <StickerSheet />}
          {activeTab === 'theme-editor' && <ThemeEditor />}
          {activeTab === 'demos' && <RealWorldDemos />}
          {activeTab === 'docs' && <DocsViewer />}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultMode="dark">
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}
