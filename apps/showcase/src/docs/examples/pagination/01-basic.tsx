// title: With summary and page size
import { useState } from 'react';
import { Pagination } from '@sam.barfield/field-react';

export default function PaginationBasic() {
  const [page, setPage] = useState(4);
  const [pageSize, setPageSize] = useState(25);
  const total = 1180;
  return (
    <div className="example-wide">
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(total / pageSize)}
        totalItems={total}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={size => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
  );
}
