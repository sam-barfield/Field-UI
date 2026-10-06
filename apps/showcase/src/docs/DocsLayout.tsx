import React, { useEffect, useMemo, useState } from 'react';
import { Button, Drawer, TextInput } from '@sam.barfield/field-react';
import { Menu, Search } from 'lucide-react';
import type { Route } from '../router';
import { guides } from './guides';
import { CATEGORY_ORDER, componentPages } from './componentPages';
import { ComponentPage } from './ComponentPage';

interface NavLink {
  href: string;
  label: string;
  active: boolean;
  keywords: string;
}

interface NavGroup {
  title: string;
  links: NavLink[];
}

function useNavGroups(route: Route): NavGroup[] {
  return useMemo(() => {
    const isActive = (page: string, slug: string) => route.page === page && 'slug' in route && route.slug === slug;
    const guideGroups = (['Getting started', 'Guides'] as const).map(group => ({
      title: group,
      links: guides
        .filter(g => g.group === group)
        .map(g => ({ href: `#/docs/${g.slug}`, label: g.title, active: isActive('docs', g.slug), keywords: g.title })),
    }));
    const componentGroups = CATEGORY_ORDER.map(category => ({
      title: category,
      links: componentPages
        .filter(p => p.category === category)
        .map(p => ({
          href: `#/components/${p.id}`,
          label: p.name,
          active: isActive('components', p.id),
          keywords: `${p.name} ${p.api.join(' ')} ${p.summary}`,
        })),
    }));
    return [...guideGroups, ...componentGroups];
  }, [route]);
}

const SidebarNav: React.FC<{ route: Route; onNavigate?: () => void }> = ({ route, onNavigate }) => {
  const [query, setQuery] = useState('');
  const groups = useNavGroups(route);
  const q = query.trim().toLowerCase();
  const filtered = groups
    .map(g => ({ ...g, links: q ? g.links.filter(l => l.keywords.toLowerCase().includes(q)) : g.links }))
    .filter(g => g.links.length > 0);

  return (
    <nav className="docs-nav" aria-label="Documentation">
      <div className="docs-nav-search">
        <TextInput
          aria-label="Search docs"
          placeholder="Search components…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          leftAdornment={<Search size={14} />}
        />
      </div>
      {filtered.length === 0 && <p className="docs-nav-empty">No matches for "{query}".</p>}
      {filtered.map(group => (
        <div key={group.title} className="docs-nav-group">
          <div className="docs-nav-title">{group.title}</div>
          <ul>
            {group.links.map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={link.active ? 'docs-nav-link active' : 'docs-nav-link'}
                  aria-current={link.active ? 'page' : undefined}
                  onClick={onNavigate}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export const DocsLayout: React.FC<{ route: Route }> = ({ route }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useEffect(() => setMobileNavOpen(false), [route]);

  let content: React.ReactNode;
  if (route.page === 'components') {
    content = <ComponentPage key={route.slug} id={route.slug} />;
  } else {
    const slug = route.page === 'docs' ? route.slug : 'introduction';
    const guide = guides.find(g => g.slug === slug) ?? guides[0];
    const Guide = guide.render;
    content = <Guide key={guide.slug} />;
  }

  return (
    <div className="docs-layout">
      <aside className="docs-sidebar">
        <SidebarNav route={route} />
      </aside>
      <div className="docs-mobile-bar">
        <Button size="sm" variant="secondary" leftIcon={<Menu size={14} />} onClick={() => setMobileNavOpen(true)}>
          Browse docs
        </Button>
      </div>
      <Drawer isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} title="Documentation" side="left" width="320px">
        <SidebarNav route={route} onNavigate={() => setMobileNavOpen(false)} />
      </Drawer>
      <main className="docs-content" id="main-content">
        {content}
      </main>
    </div>
  );
};
