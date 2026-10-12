/**
 * Merges class names, filtering out falsy values.
 */
export function mergeClassNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ');
}
