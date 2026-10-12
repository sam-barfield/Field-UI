import React from 'react';

const IS_REACT_19 = parseInt(React.version, 10) >= 19;

/**
 * Props for the `fetchpriority` attribute in the spelling the installed React accepts: React 19
 * knows `fetchPriority`, React 18 warns about it and only passes the lowercase attribute through.
 */
export function fetchPriorityProps(value?: 'high' | 'low' | 'auto'): Record<string, string> {
  if (!value) return {};
  return IS_REACT_19 ? { fetchPriority: value } : { fetchpriority: value };
}
