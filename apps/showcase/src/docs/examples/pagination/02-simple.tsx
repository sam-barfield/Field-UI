// title: Simple
// description: variant="simple" replaces the numbered page window with prev/next and a page status. Add showFirstLast for jump buttons.
import { useState } from 'react';
import { Pagination, Stack } from '@sam.barfield/field-react';

export default function PaginationSimple() {
  const [page, setPage] = useState(4);
  const [feedPage, setFeedPage] = useState(1);
  return (
    <Stack gap={16} className="example-wide">
      <Pagination variant="simple" currentPage={feedPage} totalPages={12} onPageChange={setFeedPage} />
      <Pagination
        variant="simple"
        showFirstLast
        currentPage={page}
        totalPages={48}
        totalItems={1180}
        pageSize={25}
        onPageChange={setPage}
      />
    </Stack>
  );
}
