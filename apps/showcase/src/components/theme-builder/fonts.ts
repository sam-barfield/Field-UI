/** Popular Google Fonts with the weights to request, for previewing font pairings. */
export const GOOGLE_FONTS: { family: string; weights: string; category: 'sans' | 'serif' | 'display' }[] = [
  { family: 'Inter', weights: 'wght@400..800', category: 'sans' },
  { family: 'Archivo', weights: 'wght@400..900', category: 'sans' },
  { family: 'DM Sans', weights: 'wght@400..800', category: 'sans' },
  { family: 'IBM Plex Sans', weights: 'wght@400;500;600;700', category: 'sans' },
  { family: 'Lato', weights: 'wght@400;700;900', category: 'sans' },
  { family: 'Manrope', weights: 'wght@400..800', category: 'sans' },
  { family: 'Montserrat', weights: 'wght@400..900', category: 'sans' },
  { family: 'Nunito Sans', weights: 'wght@400..900', category: 'sans' },
  { family: 'Outfit', weights: 'wght@400..900', category: 'sans' },
  { family: 'Poppins', weights: 'wght@400;500;600;700;800', category: 'sans' },
  { family: 'Roboto', weights: 'wght@400;500;700;900', category: 'sans' },
  { family: 'Source Sans 3', weights: 'wght@400..900', category: 'sans' },
  { family: 'Space Grotesk', weights: 'wght@400..700', category: 'display' },
  { family: 'Work Sans', weights: 'wght@400..900', category: 'sans' },
  { family: 'Fraunces', weights: 'wght@400..900', category: 'serif' },
  { family: 'Libre Baskerville', weights: 'wght@400;700', category: 'serif' },
  { family: 'Lora', weights: 'wght@400..700', category: 'serif' },
  { family: 'Merriweather', weights: 'wght@400;700;900', category: 'serif' },
  { family: 'Playfair Display', weights: 'wght@400..900', category: 'serif' },
];

const FALLBACK = {
  sans: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  display: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
};

export function fontStack(family: string): string {
  const font = GOOGLE_FONTS.find(f => f.family === family);
  return `"${family}", ${FALLBACK[font?.category ?? 'sans']}`;
}

/** First family in a font stack, without quotes. */
export function firstFamily(stack: string | undefined): string {
  return stack?.split(',')[0].replace(/["']/g, '').trim() ?? '';
}

const loaded = new Set<string>();

/** Loads a Google Font for the preview (once per family). Unknown families are requested at 400. */
export function loadGoogleFont(family: string) {
  if (!family || loaded.has(family) || typeof document === 'undefined') return;
  loaded.add(family);
  const font = GOOGLE_FONTS.find(f => f.family === family);
  const spec = `${family.replace(/ /g, '+')}${font ? `:${font.weights}` : ''}`;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${spec}&display=swap`;
  document.head.appendChild(link);
}
