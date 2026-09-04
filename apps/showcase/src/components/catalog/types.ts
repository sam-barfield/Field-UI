import { ComponentType } from 'react';

export interface ComponentPropDoc {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface ComponentVariant {
  id: string;
  name: string;
  description: string;
  code: string;
  render: ComponentType;
}

export interface ComponentDoc {
  id: string;
  name: string;
  category: 'Actions' | 'Forms' | 'Navigation' | 'Layout' | 'Data Display' | 'Feedback' | 'Typography';
  description: string;
  importCode: string;
  usageCode: string;
  compositionTree?: string;
  primaryDemo: {
    code: string;
    render: ComponentType;
  };
  variants?: ComponentVariant[];
  props?: ComponentPropDoc[];
  usefulNotes?: string[];
  keyboardInteractions?: { key: string; description: string }[];
}
