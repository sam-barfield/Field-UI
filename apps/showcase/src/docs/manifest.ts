import manifestJson from '../../../../docs/COMPONENT_MANIFEST.json';

export interface ManifestProp {
  type: string;
  required: boolean;
  default?: string;
  description?: string;
}

export interface ManifestComponent {
  category: string;
  source: string;
  description: string;
  props: Record<string, ManifestProp>;
  inherits?: string[];
  examples?: string[];
}

export interface Manifest {
  version: string;
  components: Record<string, ManifestComponent>;
  hooks: Record<string, { signature?: string; description: string }>;
}

/** Generated from the library source by `npm run docs:manifest`. */
export const manifest = manifestJson as unknown as Manifest;
