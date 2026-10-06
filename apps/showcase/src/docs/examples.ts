import type { ComponentType } from 'react';

/**
 * Example files live in ./examples/<component>/<NN-name>.tsx and default-export
 * a component. Each file is imported twice: once as a module (rendered live) and
 * once as raw text (shown as code), so the snippet always matches the preview.
 *
 * The first comment lines set the heading:
 *   // title: Variants
 *   // description: Use one primary button per view.
 */
export interface DocExample {
  id: string;
  title?: string;
  description?: string;
  code: string;
  Component: ComponentType;
}

const modules = import.meta.glob<{ default: ComponentType }>('./examples/**/*.tsx', { eager: true });
const sources = import.meta.glob<string>('./examples/**/*.tsx', { eager: true, query: '?raw', import: 'default' });

function parse(path: string): DocExample {
  const raw = sources[path].replace(/\r\n/g, '\n');
  const lines = raw.split('\n');
  let title: string | undefined;
  let description: string | undefined;
  let i = 0;
  for (; i < lines.length; i++) {
    const m = lines[i].match(/^\/\/\s*(title|description):\s*(.*)$/);
    if (!m) break;
    if (m[1] === 'title') title = m[2].trim();
    else description = (description ? `${description} ` : '') + m[2].trim();
  }
  const code = lines.slice(i).join('\n').trim() + '\n';
  return { id: path, title, description, code, Component: modules[path].default };
}

const byFolder = new Map<string, DocExample[]>();
for (const path of Object.keys(modules).sort()) {
  const folder = path.split('/')[2];
  if (!byFolder.has(folder)) byFolder.set(folder, []);
  byFolder.get(folder)!.push(parse(path));
}

/** Examples for a component page, in file-name order. */
export function getExamples(folder: string): DocExample[] {
  return byFolder.get(folder) ?? [];
}
