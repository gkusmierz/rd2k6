export interface PaginationInput {
    page: number;
    limit: number;
}
export interface PaginatedList<T> {
    items: T[];
    totalCount: number;
    page: number;
    limit: number;
    hasMore: boolean;
}
export declare function paginate<T>(items: T[], totalCount: number, input: PaginationInput): PaginatedList<T>;
//# sourceMappingURL=pagination.d.ts.map