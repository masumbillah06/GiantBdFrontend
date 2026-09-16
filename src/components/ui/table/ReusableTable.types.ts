import type { ReactNode } from "react";

/**
 * Any row rendered by ReusableTable can expose an `id` or use `getRowId`.
 * This is what powers selection, React keys, and the Actions column.
 */
export interface RowBase {
  id?: string | number;
}

export type RowId<T extends RowBase> = T["id"] extends string | number
  ? T["id"]
  : string | number;

export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

/**
 * Describes one data column that sits between the built-in ID column
 * and the built-in Actions column.
 */
export interface ColumnDef<T extends RowBase> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  /** Alignment of column header and cell text. Defaults to "left". */
  align?: "left" | "center" | "right";
  /** Whether column is sortable */
  sortable?: boolean;
  /** Optional custom sort field key (defaults to String(key)) */
  sortKey?: string;
}

export interface ReusableTableProps<
  T extends RowBase,
  TId extends string | number = RowId<T>
> {
  /** Row data. */
  data: T[];
  /** Data columns rendered between the ID column and the Actions column. */
  columns: ColumnDef<T>[];
  /**
   * Optional custom resolver for unique row ID.
   * Defaults to `(row) => row.id!`.
   */
  getRowId?: (row: T) => TId;
  /**
   * Called whenever the selection changes, with the full list of
   * currently selected row IDs.
   */
  onSelectionChange?: (selectedIds: Array<TId>) => void;
  /**
   * Renders the content of the Actions cell for a given row.
   * If omitted, the Actions column is rendered empty unless showActions is false.
   */
  renderActions?: (row: T) => ReactNode;
  /** Optional label for the Actions column header. Defaults to "Action". */
  actionsLabel?: string;
  /** Whether to render the Actions column. Defaults to true. */
  showActions?: boolean;
  /** Whether to render the selection checkbox column. Defaults to true. */
  showCheckbox?: boolean;
  /** Whether to render the built-in ID column. Defaults to true. */
  showId?: boolean;
  /** Optional custom header label for the ID column. Defaults to "ID". */
  idLabel?: string;
  /** Optional minimum width for the table (matches the original `min-w-[...]` behavior). */
  minWidth?: string;
  /** Optional controlled selection (uncontrolled by default). */
  selectedIds?: Array<TId>;
  /** Optional empty-state content shown when `data` is empty and not loading. */
  emptyState?: ReactNode;
  /** Whether the table is currently fetching data from an API. */
  isLoading?: boolean;
  /** Number of skeleton placeholder rows to render while loading. Defaults to 5. */
  loadingRowCount?: number;
  /** Optional error message or ReactNode shown when an API request fails. */
  error?: string | Error | ReactNode | null;
  /** Optional callback invoked when the user clicks the Retry button on an error. */
  onRetry?: () => void;
  /** Active sort configuration { field, direction }. */
  sortConfig?: SortConfig | null;
  /** Callback invoked when a sortable column header is clicked. */
  onSortChange?: (field: string, direction: SortDirection) => void;
}
