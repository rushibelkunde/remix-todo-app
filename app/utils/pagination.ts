// app/utils/pagination.ts
// Helpers for building Prisma skip/take params from URL search params.

export const DEFAULT_RECORDS = 5;

export interface PaginationInput {
  page: number;
  records: number;
}

export interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  records: number;
}

/**
 * Extracts pagination values from URL search params with safe defaults.
 */
export function buildPaginationParams(
  searchParams: URLSearchParams
): PaginationResult {
  const page = parseInt(searchParams.get("page") ?? "0", 10) || 0;
  const records =
    parseInt(searchParams.get("records") ?? String(DEFAULT_RECORDS), 10) ||
    DEFAULT_RECORDS;

  return {
    page,
    records,
    skip: page * records,
    take: records,
  };
}

/**
 * Calculates the total number of pages given a total count and page size.
 */
export function calcTotalPages(totalCount: number, records: number): number {
  return Math.ceil(totalCount / records);
}
