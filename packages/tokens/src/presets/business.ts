import { FieldThemePair } from '../types.js';
import { createThemePair } from '../create.js';

/*
 * Theme pairs for customer-facing websites (brochure sites, shops, bookings).
 * They are light-first: use `<ThemeProvider themePair={roasteryPair} defaultMode="light">`.
 *
 * Each preset sets a font stack. The named webfonts are not bundled; load them
 * (e.g. from Google Fonts) or the stack falls back to the system fonts listed after them.
 */

const systemSans = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const systemSerif = '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif';

/** Cafés, bakeries, restaurants: warm cream and espresso with a terracotta accent and a soft serif. */
export const roasteryPair: FieldThemePair = createThemePair({
  id: 'roastery',
  label: 'Roastery (Café)',
  shared: {
    fonts: { display: `"Fraunces", ${systemSerif}`, sans: `"DM Sans", ${systemSans}` },
    radii: { sm: '6px', md: '10px', lg: '16px', xl: '24px' },
  },
  light: {
    semantics: {
      surfaces: { base: '#FBF7F1', raised: '#FFFFFF', overlay: '#FFFFFF', sunken: '#F3ECE2', subtle: '#EFE6DA', active: '#E6D9C8' },
      borders: { subtle: 'rgba(68, 40, 20, 0.10)', default: 'rgba(68, 40, 20, 0.16)', strong: 'rgba(68, 40, 20, 0.28)', focus: '#B4532A', highlight: 'rgba(180, 83, 42, 0.2)' },
      text: { primary: '#2B1D14', secondary: '#5E4A3C', tertiary: '#806A5A', inverse: '#FBF7F1', disabled: '#B9A999' },
      accent: { primary: '#B4532A', hover: '#9C4422', active: '#833A1D', subtle: 'rgba(180, 83, 42, 0.10)', subtleHover: 'rgba(180, 83, 42, 0.18)', contrast: '#FFFFFF' },
    },
  },
  dark: {
    semantics: {
      surfaces: { base: '#1A1310', raised: '#231A15', overlay: '#2B211B', sunken: '#120D0B', subtle: '#33271F', active: '#3F3027' },
      borders: { subtle: 'rgba(246, 238, 230, 0.08)', default: 'rgba(246, 238, 230, 0.14)', strong: 'rgba(246, 238, 230, 0.24)', focus: '#E07A4F', highlight: 'rgba(224, 122, 79, 0.25)' },
      text: { primary: '#F6EEE6', secondary: '#CDBBAA', tertiary: '#9C8877', inverse: '#1A1310', disabled: '#6B5A4C' },
      accent: { primary: '#E07A4F', hover: '#EA916B', active: '#C9653C', subtle: 'rgba(224, 122, 79, 0.14)', subtleHover: 'rgba(224, 122, 79, 0.22)', contrast: '#1A1310' },
    },
  },
});

/** Plumbers, electricians, builders: sturdy navy with a high-visibility orange and tight corners. */
export const workshopPair: FieldThemePair = createThemePair({
  id: 'workshop',
  label: 'Workshop (Trades)',
  shared: {
    fonts: { display: `"Archivo", ${systemSans}`, sans: `"Inter", ${systemSans}` },
    radii: { xs: '2px', sm: '3px', md: '4px', lg: '6px', xl: '8px' },
  },
  light: {
    semantics: {
      surfaces: { base: '#F7F8FA', raised: '#FFFFFF', overlay: '#FFFFFF', sunken: '#EDF0F4', subtle: '#E6EAF0', active: '#DCE2EA' },
      borders: { subtle: 'rgba(15, 27, 45, 0.08)', default: 'rgba(15, 27, 45, 0.14)', strong: 'rgba(15, 27, 45, 0.26)', focus: '#C2410C', highlight: 'rgba(194, 65, 12, 0.2)' },
      text: { primary: '#0F1B2D', secondary: '#3B4A5E', tertiary: '#5F6F84', inverse: '#F7F8FA', disabled: '#A3AEBC' },
      accent: { primary: '#C2410C', hover: '#9A3412', active: '#7C2D12', subtle: 'rgba(194, 65, 12, 0.08)', subtleHover: 'rgba(194, 65, 12, 0.16)', contrast: '#FFFFFF' },
    },
  },
  dark: {
    semantics: {
      surfaces: { base: '#0B1220', raised: '#111A2B', overlay: '#172236', sunken: '#070C16', subtle: '#1E2A40', active: '#26344D' },
      borders: { subtle: 'rgba(241, 245, 249, 0.08)', default: 'rgba(241, 245, 249, 0.14)', strong: 'rgba(241, 245, 249, 0.24)', focus: '#F97316', highlight: 'rgba(249, 115, 22, 0.25)' },
      text: { primary: '#F1F5F9', secondary: '#B6C2D1', tertiary: '#8392A6', inverse: '#0B1220', disabled: '#4B5A70' },
      accent: { primary: '#F97316', hover: '#FB8A3C', active: '#EA580C', subtle: 'rgba(249, 115, 22, 0.14)', subtleHover: 'rgba(249, 115, 22, 0.22)', contrast: '#0B1220' },
    },
  },
});

/** Online shops: clean white, near-black buttons and generous radii that let product photos lead. */
export const storefrontPair: FieldThemePair = createThemePair({
  id: 'storefront',
  label: 'Storefront (E-commerce)',
  shared: {
    fonts: { display: `"Manrope", "Inter", ${systemSans}`, sans: `"Inter", ${systemSans}` },
    radii: { sm: '6px', md: '8px', lg: '14px', xl: '20px' },
  },
  light: {
    semantics: {
      surfaces: { base: '#FFFFFF', raised: '#FFFFFF', overlay: '#FFFFFF', sunken: '#F6F6F7', subtle: '#F1F1F3', active: '#E7E7EA' },
      borders: { subtle: 'rgba(0, 0, 0, 0.07)', default: 'rgba(0, 0, 0, 0.12)', strong: 'rgba(0, 0, 0, 0.22)', focus: '#2563EB', highlight: 'rgba(37, 99, 235, 0.2)' },
      text: { primary: '#111111', secondary: '#4B4B52', tertiary: '#6E6E78', inverse: '#FFFFFF', disabled: '#B4B4BC' },
      accent: { primary: '#111111', hover: '#2E2E33', active: '#000000', subtle: 'rgba(17, 17, 17, 0.06)', subtleHover: 'rgba(17, 17, 17, 0.1)', contrast: '#FFFFFF' },
    },
  },
  dark: {
    semantics: {
      surfaces: { base: '#0A0A0B', raised: '#141416', overlay: '#1A1A1D', sunken: '#050506', subtle: '#202024', active: '#2A2A2F' },
      borders: { subtle: 'rgba(255, 255, 255, 0.07)', default: 'rgba(255, 255, 255, 0.12)', strong: 'rgba(255, 255, 255, 0.22)', focus: '#60A5FA', highlight: 'rgba(96, 165, 250, 0.25)' },
      text: { primary: '#FAFAFA', secondary: '#B4B4BC', tertiary: '#85858F', inverse: '#0A0A0B', disabled: '#4E4E56' },
      accent: { primary: '#FAFAFA', hover: '#E4E4E7', active: '#D4D4D8', subtle: 'rgba(255, 255, 255, 0.08)', subtleHover: 'rgba(255, 255, 255, 0.14)', contrast: '#0A0A0B' },
    },
  },
});

/** Salons, studios, therapists, florists: calm sage greens, rounded shapes and a gentle serif. */
export const sagePair: FieldThemePair = createThemePair({
  id: 'sage',
  label: 'Sage (Wellness)',
  shared: {
    fonts: { display: `"Lora", ${systemSerif}`, sans: `"Nunito Sans", ${systemSans}` },
    radii: { sm: '8px', md: '14px', lg: '22px', xl: '32px' },
  },
  light: {
    semantics: {
      surfaces: { base: '#F6F7F3', raised: '#FFFFFF', overlay: '#FFFFFF', sunken: '#ECEFE7', subtle: '#E5E9DF', active: '#D9DFD1' },
      borders: { subtle: 'rgba(31, 42, 34, 0.08)', default: 'rgba(31, 42, 34, 0.14)', strong: 'rgba(31, 42, 34, 0.26)', focus: '#4F7A5A', highlight: 'rgba(79, 122, 90, 0.2)' },
      text: { primary: '#1F2A22', secondary: '#4A574D', tertiary: '#6A786E', inverse: '#F6F7F3', disabled: '#AAB4AC' },
      accent: { primary: '#4F7A5A', hover: '#42684C', active: '#36553E', subtle: 'rgba(79, 122, 90, 0.10)', subtleHover: 'rgba(79, 122, 90, 0.18)', contrast: '#FFFFFF' },
    },
  },
  dark: {
    semantics: {
      surfaces: { base: '#121713', raised: '#19201A', overlay: '#1F2820', sunken: '#0C100D', subtle: '#263027', active: '#2F3B31' },
      borders: { subtle: 'rgba(236, 242, 234, 0.08)', default: 'rgba(236, 242, 234, 0.14)', strong: 'rgba(236, 242, 234, 0.24)', focus: '#8DB596', highlight: 'rgba(141, 181, 150, 0.25)' },
      text: { primary: '#ECF2EA', secondary: '#BCC9BE', tertiary: '#8A998D', inverse: '#121713', disabled: '#4F5C52' },
      accent: { primary: '#8DB596', hover: '#A3C5AA', active: '#76A080', subtle: 'rgba(141, 181, 150, 0.14)', subtleHover: 'rgba(141, 181, 150, 0.22)', contrast: '#121713' },
    },
  },
});

/** Law firms, accountants, consultants: trustworthy navy, a classic serif and restrained corners. */
export const counselPair: FieldThemePair = createThemePair({
  id: 'counsel',
  label: 'Counsel (Professional)',
  shared: {
    fonts: { display: `"Libre Baskerville", Baskerville, ${systemSerif}`, sans: `"Source Sans 3", "Source Sans Pro", ${systemSans}` },
    radii: { xs: '2px', sm: '2px', md: '4px', lg: '6px', xl: '8px' },
  },
  light: {
    semantics: {
      surfaces: { base: '#FAFAF8', raised: '#FFFFFF', overlay: '#FFFFFF', sunken: '#F1F1EC', subtle: '#EAEAE3', active: '#DFDFD6' },
      borders: { subtle: 'rgba(20, 33, 61, 0.08)', default: 'rgba(20, 33, 61, 0.14)', strong: 'rgba(20, 33, 61, 0.26)', focus: '#1E3A5F', highlight: 'rgba(30, 58, 95, 0.2)' },
      text: { primary: '#14213D', secondary: '#3D4A63', tertiary: '#626D83', inverse: '#FAFAF8', disabled: '#A9B0BE' },
      accent: { primary: '#1E3A5F', hover: '#172E4D', active: '#10223A', subtle: 'rgba(30, 58, 95, 0.08)', subtleHover: 'rgba(30, 58, 95, 0.14)', contrast: '#FFFFFF' },
    },
  },
  dark: {
    semantics: {
      surfaces: { base: '#0D1424', raised: '#131C30', overlay: '#19243B', sunken: '#090E1A', subtle: '#1F2B45', active: '#283654' },
      borders: { subtle: 'rgba(242, 244, 248, 0.08)', default: 'rgba(242, 244, 248, 0.14)', strong: 'rgba(242, 244, 248, 0.24)', focus: '#D4B15E', highlight: 'rgba(212, 177, 94, 0.25)' },
      text: { primary: '#F2F4F8', secondary: '#B9C2D3', tertiary: '#8592AB', inverse: '#0D1424', disabled: '#4A5670' },
      accent: { primary: '#D4B15E', hover: '#E0C27A', active: '#BF9C49', subtle: 'rgba(212, 177, 94, 0.14)', subtleHover: 'rgba(212, 177, 94, 0.22)', contrast: '#0D1424' },
    },
  },
});

/** Theme pairs designed for customer-facing websites. */
export const businessThemePairs: FieldThemePair[] = [roasteryPair, workshopPair, storefrontPair, sagePair, counselPair];
