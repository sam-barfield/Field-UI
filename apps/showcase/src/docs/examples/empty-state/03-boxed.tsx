// title: Boxed variant
// description: Set variant="boxed" to enclose the empty state in a defined border and elevated card container.
import { EmptyState, Button } from '@sam.barfield/field-react';
import { Search, RotateCcw } from 'lucide-react';

export default function EmptyStateBoxed() {
  return (
    <div className="example-col" style={{ width: '100%', maxWidth: 520 }}>
      <EmptyState
        variant="boxed"
        icon={<Search size={22} />}
        title="No search results"
        description="We couldn't find any documents matching your filters. Try clearing filters or searching with different keywords."
        actions={
          <Button variant="outline" leftIcon={<RotateCcw size={16} />}>
            Reset filters
          </Button>
        }
      />
    </div>
  );
}
