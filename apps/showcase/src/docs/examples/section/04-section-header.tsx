// title: SectionHeader with eyebrow and action
// description: SectionHeader provides a standard header block for page sections with an eyebrow, title, description, and responsive action placement.
import { SectionHeader, Button } from '@sam.barfield/field-react';
import { ArrowRight } from 'lucide-react';

export default function SectionHeaderExample() {
  return (
    <div className="example-col" style={{ width: '100%', maxWidth: 720 }}>
      <SectionHeader
        eyebrow="Archival Collection"
        title="Permanent Exhibits & Relics"
        description="Explore original flight logs, navigation instruments, and firsthand accounts preserved from 1941 through 1945."
        action={
          <Button variant="outline" rightIcon={<ArrowRight size={16} />}>
            Browse archive
          </Button>
        }
      />
    </div>
  );
}
