'use client';

import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Checkbox } from './Controls.js';
import { Skeleton } from './Primitives.js';
import { mergeClassNames } from '../utils/polymorphic.js';

/* --- Compound Table Subcomponents --- */

export type TableAlign = 'left' | 'center' | 'right';
export type TableSortOrder = 'asc' | 'desc' | null;
export type TableRowKey = string | number;

export type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>;
/**
 * Compound table `<thead>`.
 */
export const TableHeader: React.FC<TableHeaderProps> = ({ children, className = '', ...props }) => (
  <thead className={mergeClassNames('field-table-header', className)} {...props}>
    {children}
  </thead>
);

export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;
/**
 * Compound table `<tbody>`.
 */
export const TableBody: React.FC<TableBodyProps> = ({ children, className = '', ...props }) => (
  <tbody className={mergeClassNames('field-table-body', className)} {...props}>
    {children}
  </tbody>
);

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Highlight the row as selected. */
  isSelected?: boolean;
}
/**
 * Compound table row. `isSelected` highlights it; `onClick` makes it clickable.
 */
export const TableRow: React.FC<TableRowProps> = ({ children, className = '', onClick, isSelected = false, ...props }) => (
  <tr
    className={mergeClassNames('field-table-row', isSelected && 'selected', onClick && 'clickable', className)}
    onClick={onClick}
    aria-selected={isSelected || undefined}
    {...props}
  >
    {children}
  </tr>
);

function renderSortIcon(sortOrder: TableSortOrder) {
  if (sortOrder === 'asc') return <ArrowUp size={13} className="field-table-sort-icon active" aria-hidden="true" />;
  if (sortOrder === 'desc') return <ArrowDown size={13} className="field-table-sort-icon active" aria-hidden="true" />;
  return <ArrowUpDown size={13} className="field-table-sort-icon" aria-hidden="true" />;
}

export interface TableHeadProps extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** Render the header as a sort button. */
  sortable?: boolean;
  /** Current sort direction for this column (`null` = unsorted). */
  sortOrder?: TableSortOrder;
  /** Called when the sort button is clicked. */
  onSort?: () => void;
  align?: TableAlign;
}
/**
 * Compound header cell. Set `sortable` + `sortOrder` + `onSort` for a sort button with `aria-sort`.
 */
export const TableHead: React.FC<TableHeadProps> = ({
  children,
  className = '',
  style,
  sortable = false,
  sortOrder = null,
  onSort,
  align,
  scope = 'col',
  ...props
}) => {
  let ariaSort: React.AriaAttributes['aria-sort'];
  if (sortable) ariaSort = sortOrder === 'asc' ? 'ascending' : sortOrder === 'desc' ? 'descending' : 'none';
  return (
    <th
      scope={scope}
      aria-sort={ariaSort}
      className={mergeClassNames('field-table-head', align && `align-${align}`, className)}
      style={{ textAlign: align, ...style }}
      {...props}
    >
      {sortable ? (
        <button type="button" className="field-table-sort-btn" onClick={onSort}>
          <span>{children}</span>
          {renderSortIcon(sortOrder)}
        </button>
      ) : (
        children
      )}
    </th>
  );
};

export interface TableCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  align?: TableAlign;
}
/**
 * Compound body cell with optional `align`.
 */
export const TableCell: React.FC<TableCellProps> = ({ children, className = '', style, align, ...props }) => (
  <td className={mergeClassNames('field-table-cell', className)} style={{ textAlign: align, ...style }} {...props}>
    {children}
  </td>
);

/* --- Data-Driven Table Component --- */

export interface Column<T> {
  /** Unique key; also used to read `row[key]` when no `render` is given. */
  key: string;
  header: React.ReactNode;
  width?: string | number;
  align?: TableAlign;
  sortable?: boolean;
  /** Custom comparison for sorting (ascending). Defaults to a locale-aware compare of `row[key]`. */
  sortComparator?: (a: T, b: T) => number;
  /** Value used for default sorting when it differs from `row[key]`. */
  sortValue?: (row: T) => unknown;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface TableProps<T = any> {
  /** Column definitions (data mode). */
  columns?: Column<T>[];
  /** Row objects (data mode). */
  data?: T[];
  /** Stable key for each row. Strongly recommended with selection or expansion. Defaults to the row index. */
  keyExtractor?: (row: T, index: number) => TableRowKey;
  /** Shown when `data` is empty. */
  emptyMessage?: React.ReactNode;
  className?: string;
  /** Compound mode: pass `TableHeader`/`TableBody`/... children instead of `columns`/`data`. */
  children?: React.ReactNode;
  isLoading?: boolean;
  /** Number of skeleton rows while loading. Default 5. */
  loadingRows?: number;
  /** `compact` reduces cell padding. */
  density?: 'default' | 'compact';
  /** Keep the header row visible while the container scrolls (give the table a max height via `style`). */
  stickyHeader?: boolean;
  /** Called when a row is clicked (ignored for clicks on buttons, links and inputs inside the row). */
  onRowClick?: (row: T, index: number) => void;
  /** Accessible table caption (visually hidden). */
  caption?: string;
  style?: React.CSSProperties;

  // Sorting
  /** Controlled sort column. */
  sortKey?: string | null;
  /** Controlled sort direction. */
  sortOrder?: 'asc' | 'desc';
  /** Initially sorted column when uncontrolled. */
  defaultSortKey?: string;
  /** Initial sort direction when uncontrolled. */
  defaultSortOrder?: 'asc' | 'desc';
  /** Called when the user changes sorting. `sortKey` is `null` when sorting is cleared. */
  onSortChange?: (sortKey: string | null, sortOrder: 'asc' | 'desc') => void;
  /** Data is already sorted (e.g. by the server); only report sort changes. */
  manualSorting?: boolean;

  // Selection
  /** Add a checkbox column for row selection. */
  selectable?: boolean;
  /** Controlled selection. Omit to let the table manage selection itself. */
  selectedKeys?: TableRowKey[];
  /** Called with the selected row keys. */
  onSelectionChange?: (selectedKeys: TableRowKey[]) => void;
  /** Toolbar shown above the table while rows are selected. */
  renderBulkActions?: (selectedKeys: TableRowKey[], clearSelection: () => void) => React.ReactNode;

  // Expandable
  /** Add an expand toggle per row. */
  expandable?: boolean;
  /** Content shown under an expanded row. */
  renderExpandedRow?: (row: T, index: number) => React.ReactNode;
}

const INTERACTIVE_SELECTOR = 'button, a, input, select, textarea, label, [role="button"], [role="menuitem"]';
const collator = typeof Intl !== 'undefined' ? new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }) : null;

function defaultCompare(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (collator) return collator.compare(String(a), String(b));
  return String(a) < String(b) ? -1 : 1;
}

/**
 * Data table with sorting, row selection with bulk actions, expandable rows,
 * loading skeletons and an empty state. For full control, use the compound
 * parts (`TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`) as
 * children instead of `columns` / `data`.
 *
 * @example
 * <Table data={instances} keyExtractor={r => r.id} selectable
 *   columns={[
 *     { key: 'name', header: 'Name', sortable: true },
 *     { key: 'state', header: 'State', render: r => <Badge variant="success" dot>{r.state}</Badge> },
 *   ]} />
 */
export function Table<T = any>({
  columns = [],
  data = [],
  keyExtractor = (_row, idx) => idx,
  emptyMessage = 'No data available',
  className = '',
  children,
  isLoading = false,
  loadingRows = 5,
  density = 'default',
  stickyHeader = false,
  onRowClick,
  caption,
  style,
  sortKey: controlledSortKey,
  sortOrder: controlledSortOrder,
  defaultSortKey,
  defaultSortOrder = 'asc',
  onSortChange,
  manualSorting = false,
  selectable = false,
  selectedKeys: controlledSelectedKeys,
  onSelectionChange,
  renderBulkActions,
  expandable = false,
  renderExpandedRow,
}: Readonly<TableProps<T>>) {
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<TableRowKey[]>([]);
  const [internalSortKey, setInternalSortKey] = useState<string | null>(defaultSortKey ?? null);
  const [internalSortOrder, setInternalSortOrder] = useState<'asc' | 'desc'>(defaultSortOrder);
  const [expandedRowKeys, setExpandedRowKeys] = useState<Set<TableRowKey>>(new Set());

  const sortKey = controlledSortKey !== undefined ? controlledSortKey : internalSortKey;
  const sortOrder = controlledSortOrder ?? internalSortOrder;
  const selectedKeys = controlledSelectedKeys ?? internalSelectedKeys;

  const sortedData = useMemo(() => {
    if (!sortKey || manualSorting) return data;
    const col = columns.find(c => c.key === sortKey);
    if (!col) return data;
    const direction = sortOrder === 'asc' ? 1 : -1;
    const getValue = col.sortValue ?? ((row: T) => (row as Record<string, unknown>)[sortKey]);
    return [...data].sort((a, b) =>
      direction * (col.sortComparator ? col.sortComparator(a, b) : defaultCompare(getValue(a), getValue(b)))
    );
  }, [data, columns, sortKey, sortOrder, manualSorting]);

  const tableClassName = mergeClassNames(
    'field-table',
    density === 'compact' && 'field-table-compact',
    stickyHeader && 'field-table-sticky'
  );

  if (children) {
    return (
      <div className={mergeClassNames('field-table-container', className)} style={style}>
        <table className={tableClassName}>{children}</table>
      </div>
    );
  }

  const allKeys = data.map((row, idx) => keyExtractor(row, idx));
  const selectedSet = new Set(selectedKeys);
  const selectedVisibleCount = allKeys.filter(k => selectedSet.has(k)).length;
  const allSelected = allKeys.length > 0 && selectedVisibleCount === allKeys.length;
  const isPartiallySelected = selectedVisibleCount > 0 && !allSelected;

  const updateSelection = (next: TableRowKey[]) => {
    if (controlledSelectedKeys === undefined) setInternalSelectedKeys(next);
    onSelectionChange?.(next);
  };

  const handleSelectAll = (checked: boolean) => updateSelection(checked ? allKeys : []);

  const handleSelectRow = (key: TableRowKey, checked: boolean) => {
    updateSelection(checked ? [...selectedKeys.filter(k => k !== key), key] : selectedKeys.filter(k => k !== key));
  };

  const handleSort = (colKey: string) => {
    let nextOrder: 'asc' | 'desc' = 'asc';
    let nextKey: string | null = colKey;
    if (sortKey === colKey) {
      if (sortOrder === 'asc') nextOrder = 'desc';
      else nextKey = null;
    }
    if (controlledSortKey === undefined) setInternalSortKey(nextKey);
    if (controlledSortOrder === undefined) setInternalSortOrder(nextOrder);
    onSortChange?.(nextKey, nextOrder);
  };

  const toggleExpand = (key: TableRowKey) => {
    setExpandedRowKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const totalCols = columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0);

  const renderTableBody = () => {
    if (isLoading) {
      return Array.from({ length: loadingRows }).map((_, rIdx) => (
        <TableRow key={`skeleton-row-${rIdx}`}>
          {expandable && (
            <TableCell className="field-table-control-cell">
              <Skeleton width={16} height={16} />
            </TableCell>
          )}
          {selectable && (
            <TableCell className="field-table-control-cell">
              <Skeleton width={16} height={16} />
            </TableCell>
          )}
          {columns.map(col => (
            <TableCell key={col.key} align={col.align}>
              <Skeleton width="80%" height="16px" />
            </TableCell>
          ))}
        </TableRow>
      ));
    }

    if (sortedData.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={totalCols} className="field-table-empty">
            {emptyMessage}
          </TableCell>
        </TableRow>
      );
    }

    return sortedData.map((row, idx) => {
      const rowKey = keyExtractor(row, idx);
      const isSelected = selectedSet.has(rowKey);
      const isExpanded = expandedRowKeys.has(rowKey);
      const expandedId = `field-table-expanded-${String(rowKey).replace(/[^a-zA-Z0-9_-]/g, '')}`;

      return (
        <React.Fragment key={rowKey}>
          <TableRow
            isSelected={isSelected}
            onClick={
              onRowClick
                ? e => {
                    if ((e.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) return;
                    onRowClick(row, idx);
                  }
                : undefined
            }
          >
            {expandable && (
              <TableCell className="field-table-control-cell">
                <button
                  type="button"
                  className={mergeClassNames('field-table-expand-btn', isExpanded && 'expanded')}
                  onClick={() => toggleExpand(rowKey)}
                  aria-expanded={isExpanded}
                  aria-controls={isExpanded ? expandedId : undefined}
                  aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                >
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              </TableCell>
            )}
            {selectable && (
              <TableCell className="field-table-control-cell">
                <Checkbox
                  checked={isSelected}
                  onChange={chk => handleSelectRow(rowKey, chk)}
                  aria-label={`Select row ${rowKey}`}
                />
              </TableCell>
            )}
            {columns.map(col => (
              <TableCell key={col.key} align={col.align}>
                {col.render ? col.render(row, idx) : ((row as Record<string, unknown>)[col.key] as React.ReactNode)}
              </TableCell>
            ))}
          </TableRow>
          {expandable && isExpanded && renderExpandedRow && (
            <tr className="field-table-expanded-row" id={expandedId}>
              <TableCell colSpan={totalCols}>{renderExpandedRow(row, idx)}</TableCell>
            </tr>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <div className={mergeClassNames('field-table-container', className)} style={style} aria-busy={isLoading || undefined}>
      {selectable && renderBulkActions && selectedKeys.length > 0 && (
        <div className="field-table-bulk-bar" role="toolbar" aria-label="Bulk actions">
          <div className="field-table-bulk-count" aria-live="polite">
            {selectedKeys.length} item{selectedKeys.length > 1 ? 's' : ''} selected
          </div>
          <div className="field-table-bulk-actions">{renderBulkActions(selectedKeys, () => handleSelectAll(false))}</div>
        </div>
      )}

      <table className={tableClassName}>
        {caption && <caption className="field-sr-only">{caption}</caption>}
        <TableHeader>
          <TableRow>
            {expandable && (
              <TableHead className="field-table-control-cell">
                <span className="field-sr-only">Expand</span>
              </TableHead>
            )}
            {selectable && (
              <TableHead className="field-table-control-cell">
                <Checkbox
                  checked={allSelected}
                  indeterminate={isPartiallySelected}
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
                align={col.align}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{renderTableBody()}</TableBody>
      </table>
    </div>
  );
}

/* --- Pagination Component --- */

export interface PaginationProps {
  /** 1-based current page. */
  currentPage: number;
  /** Total number of pages. */
  totalPages: number;
  /** Rows per page (used for the "Showing x–y" summary). */
  pageSize?: number;
  /** Choices for the rows-per-page select. */
  pageSizeOptions?: number[];
  /** Called with the 1-based page to show. */
  onPageChange: (page: number) => void;
  /** Shows a "Rows per page" select when provided. */
  onPageSizeChange?: (pageSize: number) => void;
  /** Enables the "Showing 1–10 of 240" summary. */
  totalItems?: number;
  /**
   * `full` (default): first/prev, numbered page window, next/last.
   * `simple`: prev/next with a "Page 4 of 48" status between them — for cards, feeds and tight spaces.
   */
  variant?: 'full' | 'simple';
  /**
   * Draw the raised bar (padding, top border and background) that suits a table footer. Set `false` for
   * flat pagination under a grid of cards. Default `true`.
   */
  surface?: boolean;
  /** Show the first/last page buttons. Default `true` for `full`, `false` for `simple`. */
  showFirstLast?: boolean;
  className?: string;
}

/** Page numbers with ellipses: 1 … 4 5 6 … 20 */
function getPageWindow(current: number, total: number): Array<number | 'ellipsis-start' | 'ellipsis-end'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: Array<number | 'ellipsis-start' | 'ellipsis-end'> = [1];
  const start = Math.max(2, Math.min(current - 1, total - 4));
  const end = Math.min(total - 1, Math.max(current + 1, 5));
  if (start > 2) pages.push('ellipsis-start');
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push('ellipsis-end');
  pages.push(total);
  return pages;
}

/**
 * Page navigation with first/prev/next/last, a page window with ellipses and
 * an optional page-size selector. `variant="simple"` swaps the page window for a
 * compact "Page 4 of 48" status between prev/next. Use `surface={false}` for flat pagination under a card grid.
 *
 * @example
 * <Pagination currentPage={page} totalPages={12} onPageChange={setPage} totalItems={118} pageSize={10} />
 * <Pagination variant="simple" currentPage={page} totalPages={12} onPageChange={setPage} />
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  totalItems,
  variant = 'full',
  surface = true,
  showFirstLast = variant === 'full',
  className = '',
}) => {
  const safeTotal = Math.max(1, totalPages);
  const isSimple = variant === 'simple';
  const isBare = !surface;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = totalItems !== undefined ? Math.min(currentPage * pageSize, totalItems) : currentPage * pageSize;
  const pageSizeId = React.useId();

  return (
    <nav
      className={mergeClassNames(
        'field-pagination-container',
        isSimple && 'field-pagination-simple',
        isBare && 'field-pagination-bare',
        className
      )}
      aria-label="Pagination"
    >
      {/* The simple variant shows the page status between prev/next, so the summary is only needed with totalItems. */}
      {(!isSimple || totalItems !== undefined) && (
        <div className="field-pagination-info" aria-live="polite">
          {totalItems !== undefined ? (
            <span>
              Showing <strong>{startItem}–{endItem}</strong> of <strong>{totalItems}</strong> items
            </span>
          ) : (
            <span>
              Page <strong>{currentPage}</strong> of <strong>{safeTotal}</strong>
            </span>
          )}
        </div>
      )}

      <div className="field-pagination-controls">
        {onPageSizeChange && (
          <div className="field-pagination-size">
            <label htmlFor={pageSizeId}>Rows per page</label>
            <select
              id={pageSizeId}
              className="field-pagination-select"
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        {showFirstLast && (
          <button
            type="button"
            className="field-pagination-btn field-pagination-first"
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
            aria-label="First page"
          >
            <ChevronsLeft size={14} aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          className="field-pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} aria-hidden="true" />
        </button>

        {isSimple ? (
          <span className="field-pagination-status" aria-live={totalItems === undefined ? 'polite' : undefined}>
            Page <strong>{currentPage}</strong> of <strong>{safeTotal}</strong>
          </span>
        ) : getPageWindow(currentPage, safeTotal).map(page =>
          typeof page === 'number' ? (
            <button
              key={page}
              type="button"
              className={mergeClassNames('field-pagination-btn', page === currentPage && 'active')}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`Page ${page}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ) : (
            <span key={page} className="field-pagination-ellipsis" aria-hidden="true">
              …
            </span>
          )
        )}

        <button
          type="button"
          className="field-pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= safeTotal}
          aria-label="Next page"
        >
          <ChevronRight size={14} aria-hidden="true" />
        </button>
        {showFirstLast && (
          <button
            type="button"
            className="field-pagination-btn field-pagination-last"
            onClick={() => onPageChange(safeTotal)}
            disabled={currentPage >= safeTotal}
            aria-label="Last page"
          >
            <ChevronsRight size={14} aria-hidden="true" />
          </button>
        )}
      </div>
    </nav>
  );
};
