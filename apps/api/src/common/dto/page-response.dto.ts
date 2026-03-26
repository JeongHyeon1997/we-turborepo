export class PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;

  static of<T>(items: T[], total: number, page: number, size: number): PageResponse<T> {
    const totalPages = Math.ceil(total / size);
    const res = new PageResponse<T>();
    res.content = items;
    res.page = page;
    res.size = size;
    res.totalElements = total;
    res.totalPages = totalPages;
    res.last = page >= totalPages - 1;
    return res;
  }
}
