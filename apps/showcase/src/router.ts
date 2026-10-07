import { useCallback, useEffect, useState } from 'react';

/**
 * Minimal hash router so every docs page has a shareable URL
 * (e.g. `#/components/select`) without a server or routing library.
 */
export type Route =
  | { page: 'docs'; slug: string }
  | { page: 'components'; slug: string }
  | { page: 'sticker-sheet' }
  | { page: 'theme-editor' }
  | { page: 'examples' };

export const DEFAULT_ROUTE: Route = { page: 'docs', slug: 'introduction' };

export function parseHash(hash: string): Route {
  // Drop any ?query (e.g. a shared theme on #/theme-editor?theme=...).
  const [, section, slug] = hash.replace(/^#/, '').split('?')[0].split('/');
  switch (section) {
    case 'docs':
      return { page: 'docs', slug: slug || 'introduction' };
    case 'components':
      return { page: 'components', slug: slug || 'button' };
    case 'sticker-sheet':
    case 'theme-editor':
    case 'examples':
      return { page: section };
    default:
      return DEFAULT_ROUTE;
  }
}

export function routeToHash(route: Route): string {
  return 'slug' in route ? `#/${route.page}/${route.slug}` : `#/${route.page}`;
}

export function useHashRoute(): [Route, (route: Route) => void] {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === 'undefined' ? DEFAULT_ROUTE : parseHash(window.location.hash)
  );

  useEffect(() => {
    const handleChange = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', handleChange);
    return () => window.removeEventListener('hashchange', handleChange);
  }, []);

  const navigate = useCallback((next: Route) => {
    window.location.hash = routeToHash(next);
  }, []);

  return [route, navigate];
}
