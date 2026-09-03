import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Checkbox } from './Controls';

/* --- Compound Table Subcomponents --- */

export interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}
export const TableHeader: React.FC<TableHeaderProps> = ({ children, className = '' }) => (
  <thead className={`field-table-header ${className}`}>{children}</thead>
);

export interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}
export const TableBody: React.FC<TableBodyProps> = ({ children, className = '' }) => (
  <tbody className={`field-table-body ${className}`}>{children}</tbody>
);

export interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}
export const TableRow: React.FC<TableRowProps> = ({
  children,
  className = '',
  onClick,
  isSelected = false,
}) => (
  <tr
    className={`field-table-row ${isSelected ? 'selected' : ''} ${className}`}
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : undefined }}
  >
    {children}
  </tr>
);

export interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  sortable?: boolean;
  sortOrder?: 'asc' | 'desc' | null;
  onSort?: () => void;
}
export const TableHead: React.FC<TableHeadProps> = ({
  children,
  className = '',
  style,
  sortable = false,
  sortOrder = null,
  onSort,
}) => (
  <th className={`field-table-head ${className}`} style={style}>
    {sortable ? (
      <button type="button" className="field-table-sort-btn" onClick={onSort}>
        <span>{children}</span>
        {sortOrder === 'asc' ? (
          <ArrowUp size={13} color="var(--field-accent-primary)" />
        ) : sortOrder === 'desc' ? (
          <ArrowDown size={13} color="var(--field-accent-primary)" />
        ) : (
          <ArrowUpDown size={13} color="var(--field-text-tertiary)" />
        )}
      </button>
    ) : (
      children
    )}
  </th>
);

export interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  colSpan?: number;
}
export const TableCell: React.FC<TableCellProps> = ({
  children,
  className = '',
  style,
  colSpan,
}) => (
  <td className={`field-table-cell ${className}`} style={style} colSpan={colSpan}>
    {children}
  </td>
);

/* --- Data-Driven Table Component --- */

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  width?: string | number;
  sortable?: boolean;
  sortComparator?: (a: T, b: T) => number;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface TableProps<T = any> {
  columns?: Column<T>[];
  data?: T[];
  keyExtractor?: (row: T, index: number) => string | number;
  emptyMessage?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;

  // Sorting
  defaultSortKey?: string;
  defaultSortOrder?: 'asc' | 'desc';
  onSortChange?: (sortKey: string | null, sortOrder: 'asc' | 'desc') => void;

  // Selection
  selectable?: boolean;
  selectedKeys?: (string | number)[];
  onSelectionChange?: (selectedKeys: (string | number)[]) => void;
  renderBulkActions?: (selectedKeys: (string | number)[], clearSelection: () => void) => React.ReactNode;

  // Expandable
  expandable?: boolean;
  renderExpandedRow?: (row: T, index: number) => React.ReactNode;
}

export function Table<T = any>({
  columns = [],
  data = [],
  keyExtractor = (_row, idx) => idx,
  emptyMessage = 'No data available',
  className = '',
  children,
  defaultSortKey,
  defaultSortOrder = 'asc',
  onSortChange,
  selectable = false,
  selectedKeys: controlledSelectedKeys,
  onSelectionChange,
  renderBulkActions,
  expandable = false,
  renderExpandedRow,
}: TableProps<T>) {
  if (children) {
    return (
      <div className={`field-table-wrapper ${className}`}>
        <table className="field-table">{children}</table>
      </div>
    );
  }

  const [internalSelectedKeys, setInternalSelectedKeys] = useState<(string | number)[]>([]);
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey || null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(defaultSortOrder);
  const [expandedRowKeys, setExpandedRowKeys] = useState<Set<string | number>>(new Set());

  const selectedKeys = controlledSelectedKeys !== undefined ? controlledSelectedKeys : internalSelectedKeys;

  const handleSelectAll = (checked: boolean) => {
    const allKeys = checked ? data.map((row, idx) => keyExtractor(row, idx)) : [];
    if (onSelectionChange) {
      onSelectionChange(allKeys);
    } else {
      setInternalSelectedKeys(allKeys);
    }
  };

  const handleSelectRow = (key: string | number, checked: boolean) => {
    let next: (string | number)[];
    if (checked) {
      next = [...selectedKeys, key];
    } else {
      next = selectedKeys.filter(k => k !== key);
    }
    if (onSelectionChange) {
      onSelectionChange(next);
    } else {
      setInternalSelectedKeys(next);
    }
  };

  const handleSort = (colKey: string) => {
    let nextOrder: 'asc' | 'desc' = 'asc';
    let nextKey: string | null = colKey;
    if (sortKey === colKey) {
      if (sortOrder === 'asc') {
        nextOrder = 'desc';
      } else {
        nextKey = null;
      }
    }
    setSortKey(nextKey);
    setSortOrder(nextOrder);
    if (onSortChange) {
      onSortChange(nextKey, nextOrder);
    }
  };

  const toggleExpand = (key: string | number) => {
    setExpandedRowKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Sort data if sortable column is active and no external handler takes over
  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find(c => c.key === sortKey);
    if (!col) return data;

    const copy = [...data];
    copy.sort((a, b) => {
      if (col.sortComparator) {
        const comp = col.sortComparator(a, b);
        return sortOrder === 'asc' ? comp : -comp;
      }
      const valA = (a as any)[sortKey];
      const valB = (b as any)[sortKey];
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [data, columns, sortKey, sortOrder]);

  const allSelected = data.length > 0 && selectedKeys.length === data.length;
  const isPartiallySelected = selectedKeys.length > 0 && selectedKeys.length < data.length;

  const totalCols = columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0);

  return (
    <div className={`field-table-container ${className}`}>
      {selectable && renderBulkActions && selectedKeys.length > 0 && (
        <div className="field-table-bulk-bar">
          <div className="field-text-sm" style={{ fontWeight: 600, color: 'var(--field-accent-primary)' }}>
            {selectedKeys.length} selected
          </div>
          <div>
            {renderBulkActions(selectedKeys, () => {
              if (onSelectionChange) onSelectionChange([]);
              else setInternalSelectedKeys([]);
            })}
          </div>
        </div>
      )}

      <table className="field-table">
        <TableHeader>
          <TableRow>
            {expandable && <TableHead style={{ width: '40px' }}>{null}</TableHead>}
            {selectable && (
              <TableHead style={{ width: '40px' }}>
                <Checkbox
                  checked={allSelected || isPartiallySelected}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </TableHead>
            )}
            {columns.map(col => (
              <TableHead
                key={col.key}
                style={{ width: col.width }}
                sortable={col.sortable}
                sortOrder={sortKey === col.key ? sortOrder : null}
                onSort={() => handleSort(col.key)}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={totalCols} style={{ textAlign: 'center', padding: '36px' }}>
                {typeof emptyMessage === 'string' ? (
                  <span style={{ color: 'var(--field-text-secondary)' }}>{emptyMessage}</span>
                ) : (
                  emptyMessage
                )}
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((row, idx) => {
              const rowKey = keyExtractor(row, idx);
              const isSelected = selectedKeys.includes(rowKey);
              const isExpanded = expandedRowKeys.has(rowKey);

              return (
                <React.Fragment key={rowKey}>
                  <TableRow isSelected={isSelected}>
                    {expandable && (
                      <TableCell style={{ width: '40px', padding: '8px' }}>
                        <button
                          type="button"
                          className="field-table-expand-btn"
                          style={{ transform: isExpanded ? 'rotate(90deg)' : 'none' }}
                          onClick={() => toggleExpand(rowKey)}
                          aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </TableCell>
                    )}
                    {selectable && (
                      <TableCell style={{ width: '40px', padding: '8px 12px' }}>
                        <Checkbox
                          checked={isSelected}
                          onChange={chk => handleSelectRow(rowKey, chk)}
                          aria-label={`Select row ${rowKey}`}
                        />
                      </TableCell>
                    )}
                    {columns.map(col => (
                      <TableCell key={col.key}>
                        {col.render ? col.render(row, idx) : (row as any)[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expandable && isExpanded && renderExpandedRow && (
                    <tr className="field-table-expanded-row">
                      <TableCell colSpan={totalCols} style={{ backgroundColor: 'var(--field-surface-sunken)', padding: '16px' }}>
                        {renderExpandedRow(row, idx)}
                      </TableCell>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </table>
    </div>
  );
}

/* --- Pagination Component --- */

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  totalItems?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  totalItems,
  className = '',
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = totalItems !== undefined ? Math.min(currentPage * pageSize, totalItems) : currentPage * pageSize;

  return (
    <div className={`field-pagination-container ${className}`}>
      <div className="field-pagination-info">
        {totalItems !== undefined ? (
          <span>
            Showing <strong style={{ color: 'var(--field-text-primary)' }}>{startItem}–{endItem}</strong> of{' '}
            <strong style={{ color: 'var(--field-text-primary)' }}>{totalItems}</strong> items
          </span>
        ) : (
          <span>
            Page <strong style={{ color: 'var(--field-text-primary)' }}>{currentPage}</strong> of{' '}
            <strong style={{ color: 'var(--field-text-primary)' }}>{totalPages}</strong>
          </span>
        )}
      </div>

      <div className="field-pagination-controls">
        {onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--field-text-tertiary)' }}>Rows per page:</span>
            <select
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
              style={{
                background: 'var(--field-surface-sunken)',
                color: 'var(--field-text-primary)',
                border: '1px solid var(--field-border-default)',
                borderRadius: 'var(--field-radius-xs)',
                padding: '3px 6px',
                fontSize: '0.8125rem',
                outline: 'none',
              }}
            >
              {pageSizeOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="button"
          className="field-pagination-btn"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          aria-label="First page"
        >
          <ChevronsLeft size={14} />
        </button>
        <button
          type="button"
          className="field-pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          return (
            <button
              key={pageNum}
              type="button"
              className={`field-pagination-btn ${pageNum === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          className="field-pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
        <button
          type="button"
          className="field-pagination-btn"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label="Last page"
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
};
