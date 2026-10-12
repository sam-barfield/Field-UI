// title: Flat, under a card grid
// description: surface={false} drops the raised bar (padding, top border and background) that suits a table footer.
import { useState } from 'react';
import { Pagination } from '@sam.barfield/field-react';

export default function PaginationFlat() {
  const [page, setPage] = useState(2);
  return (
    <div className="example-wide">
      <Pagination surface={false} currentPage={page} totalPages={8} onPageChange={setPage} />
    </div>
  );
}
