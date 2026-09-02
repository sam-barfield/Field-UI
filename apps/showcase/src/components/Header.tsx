import React from 'react';
import {
  useTheme,
  Button,
  IconButton,
  Badge,
  SegmentedControl,
} from '@field/react';
import {
  Sun,
  Moon,
  Laptop,
  Tablet,
  Smartphone,
  Layers,
  Sliders,
  LayoutDashboard,
  Bot,
} from 'lucide-react';

export interface HeaderProps {
  activeTab: 'stickersheet' | 'theme-editor' | 'demos' | 'docs';
  onTabChange: (tab: 'stickersheet' | 'theme-editor' | 'demos' | 'docs') => void;
  viewport: 'desktop' | 'tablet' | 'mobile';
  onViewportChange: (vp: 'desktop' | 'tablet' | 'mobile') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  viewport,
  onViewportChange,
}) => {
  const { mode, toggleMode, theme } = useTheme();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--field-surface-raised)',
        borderBottom: '1px solid var(--field-border-default)',
        backdropFilter: 'blur(12px)',
        padding: '12px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {/* Brand & Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--field-radius-sm)',
              backgroundColor: 'var(--field-accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }}
          >
            <Layers size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  letterSpacing: '0.05em',
                  fontFamily: 'var(--field-font-sans)',
                  color: 'var(--field-text-primary)',
                }}
              >
                FIELD
              </span>
              <Badge variant="accent">v0.1</Badge>
              <span style={{ fontSize: '0.75rem', color: 'var(--field-text-secondary)' }}>
                {theme.label}
              </span>
            </div>
          </div>
        </div>

        {/* Center Main Nav Tabs */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <Button
            size="sm"
            variant={activeTab === 'stickersheet' ? 'primary' : 'ghost'}
            leftIcon={<Layers size={14} />}
            onClick={() => onTabChange('stickersheet')}
          >
            Sticker Sheet
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'theme-editor' ? 'primary' : 'ghost'}
            leftIcon={<Sliders size={14} />}
            onClick={() => onTabChange('theme-editor')}
          >
            Theme Editor
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'demos' ? 'primary' : 'ghost'}
            leftIcon={<LayoutDashboard size={14} />}
            onClick={() => onTabChange('demos')}
          >
            Live Composites
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'docs' ? 'primary' : 'ghost'}
            leftIcon={<Bot size={14} />}
            onClick={() => onTabChange('docs')}
          >
            Docs & Agents
          </Button>
        </div>

        {/* Right Controls: Viewport switch + Dark/Light toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Viewport switcher */}
          <SegmentedControl
            size="sm"
            value={viewport}
            onChange={onViewportChange}
            options={[
              { value: 'desktop', label: <span title="Desktop Viewport"><Laptop size={14} /></span> },
              { value: 'tablet', label: <span title="Tablet (768px)"><Tablet size={14} /></span> },
              { value: 'mobile', label: <span title="Mobile (390px)"><Smartphone size={14} /></span> },
            ]}
          />

          {/* Theme Mode Toggle */}
          <IconButton
            icon={mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            variant="secondary"
            size="sm"
            onClick={toggleMode}
          />
        </div>
      </div>
    </header>
  );
};
