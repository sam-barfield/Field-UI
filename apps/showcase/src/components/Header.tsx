import React from 'react';
import {
  useTheme,
  themePairs,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarActions,
  NavbarToggle,
  NavbarMenu,
  IconButton,
  Badge,
  Select,
  Tooltip,
} from '@sam.barfield/field-react';
import pkg from '../../package.json';
import { Sun, Moon, Layers } from 'lucide-react';
import type { Route } from '../router';

const NAV_ITEMS: { label: string; href: string; match: (r: Route) => boolean }[] = [
  { label: 'Docs', href: '#/docs/introduction', match: r => r.page === 'docs' },
  { label: 'Components', href: '#/components/button', match: r => r.page === 'components' },
  { label: 'Sticker Sheet', href: '#/sticker-sheet', match: r => r.page === 'sticker-sheet' },
  { label: 'Theme Editor', href: '#/theme-editor', match: r => r.page === 'theme-editor' },
  { label: 'Examples', href: '#/examples', match: r => r.page === 'examples' },
];

export const Header: React.FC<{ route: Route }> = ({ route }) => {
  const { mode, toggleMode, themePair, setThemePair } = useTheme();

  return (
    <Navbar sticky blurred variant="underline" animated maxWidth={1440} className="showcase-header">
      <NavbarBrand href="#/docs/introduction" aria-label="Field Design System home">
        <span className="showcase-logo" aria-hidden="true">
          <Layers size={18} />
        </span>
        <span className="showcase-wordmark">FIELD</span>
        <Badge variant="accent" size="sm">v{pkg.version}</Badge>
      </NavbarBrand>

      <NavbarContent align="center" hideOnMobile>
        {NAV_ITEMS.map(item => (
          <NavbarItem key={item.href} href={item.href} isActive={item.match(route)}>
            {item.label}
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarActions gap={8}>
        <div className="showcase-theme-select">
          <Select
            aria-label="Theme"
            value={themePair?.id ?? themePairs[0].id}
            onChange={id => {
              const pair = themePairs.find(p => p.id === id);
              if (pair) setThemePair(pair);
            }}
            options={themePairs.map(p => ({ value: p.id, label: p.label }))}
          />
        </div>
        <Tooltip content={mode === 'dark' ? 'Light mode' : 'Dark mode'} position="bottom">
          <IconButton
            icon={mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            variant="ghost"
            size="sm"
            onClick={toggleMode}
          />
        </Tooltip>
        <NavbarToggle />
      </NavbarActions>

      <NavbarMenu>
        {NAV_ITEMS.map(item => (
          <NavbarItem key={item.href} href={item.href} isActive={item.match(route)}>
            {item.label}
          </NavbarItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
