import React from 'react';
import {
  useTheme,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarActions,
  IconButton,
  Badge,
  SegmentedControl,
} from '@sam.barfield/field-react';
import pkg from '../../package.json';
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
  Component,
} from 'lucide-react';

export interface HeaderProps {
  activeTab: 'catalog' | 'stickersheet' | 'theme-editor' | 'demos' | 'docs';
  onTabChange: (tab: 'catalog' | 'stickersheet' | 'theme-editor' | 'demos' | 'docs') => void;
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
    <Navbar sticky blurred bordered maxWidth={1440} style={{ padding: '0 24px', height: '64px' }}>
      {/* Left: Brand & Identity */}
      <NavbarContent align="start">
        <NavbarBrand>
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
            <Badge variant="accent">v{pkg.version}</Badge>
            <span style={{ fontSize: '0.75rem', color: 'var(--field-text-secondary)' }}>
              {theme.label}
            </span>
          </div>
        </NavbarBrand>
      </NavbarContent>

      {/* Center: Main Nav Links */}
      <NavbarContent align="center" variant="underline" animated gap="4px">
        <NavbarItem
          isActive={activeTab === 'catalog'}
          onClick={() => onTabChange('catalog')}
        >
          <Component size={14} />
          <span>Component Catalog</span>
        </NavbarItem>
        <NavbarItem
          isActive={activeTab === 'stickersheet'}
          onClick={() => onTabChange('stickersheet')}
        >
          <Layers size={14} />
          <span>Sticker Sheet</span>
        </NavbarItem>
        <NavbarItem
          isActive={activeTab === 'theme-editor'}
          onClick={() => onTabChange('theme-editor')}
        >
          <Sliders size={14} />
          <span>Theme Editor</span>
        </NavbarItem>
        <NavbarItem
          isActive={activeTab === 'demos'}
          onClick={() => onTabChange('demos')}
        >
          <LayoutDashboard size={14} />
          <span>Live Composites</span>
        </NavbarItem>
        <NavbarItem
          isActive={activeTab === 'docs'}
          onClick={() => onTabChange('docs')}
        >
          <Bot size={14} />
          <span>Docs & Agents</span>
        </NavbarItem>
      </NavbarContent>

      {/* Right: Viewport switch + Dark/Light toggle */}
      <NavbarContent align="end">
        <NavbarActions gap="10px">
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
        </NavbarActions>
      </NavbarContent>
    </Navbar>
  );
};
