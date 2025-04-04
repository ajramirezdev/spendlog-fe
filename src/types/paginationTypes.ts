export interface IPaginateFunctions {
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  setPageSize: (perPage: number) => void;
  canNextPage: () => boolean;
  canPrevPage: () => boolean;
}
