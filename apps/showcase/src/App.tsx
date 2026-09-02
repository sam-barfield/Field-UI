import { useState } from 'react';
import { ThemeProvider, ToastProvider } from '@field/react';
import { Header } from './components/Header';
import { StickerSheet } from './components/StickerSheet';
import { ThemeEditor } from './components/ThemeEditor';
import { RealWorldDemos } from './components/RealWorldDemos';
import { DocsViewer } from './components/DocsViewer';
import { ComponentCatalog } from './components/ComponentCatalog';

export function AppContent() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'stickersheet' | 'theme-editor' | 'demos' | 'docs'>('catalog');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getViewportWidth = () => {
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
          padding: viewport === 'desktop' ? '32px 24px' : '24px 0',
          transition: 'padding 0.2s ease',
        }}
      >
        <div
          style={{
            width: getViewportWidth(),
            maxWidth: viewport === 'desktop' ? '1440px' : getViewportWidth(),
            transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: viewport !== 'desktop' ? '0 0 30px rgba(0, 0, 0, 0.6)' : 'none',
            border: viewport !== 'desktop' ? '1px solid var(--field-border-strong)' : 'none',
            borderRadius: viewport !== 'desktop' ? '16px' : '0',
            padding: viewport !== 'desktop' ? '20px' : '0',
            backgroundColor: 'var(--field-surface-base)',
            overflow: 'hidden',
          }}
        >
          {activeTab === 'catalog' && <ComponentCatalog />}
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
