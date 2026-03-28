'use client';

import ReactPaginate from 'react-paginate';
import css from "./Pagination.module.css";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  
  const handlePageClick = (event: { selected: number }) => {
    onPageChange(event.selected + 1);
  };

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      previousLabel="<"
      onPageChange={handlePageClick}
      pageRangeDisplayed={3}
      pageCount={totalPages}
      forcePage={currentPage - 1}
      renderOnZeroPageCount={null}
      
      containerClassName={css.pagination}
      pageClassName={css.pageItem}
      activeClassName={css.active}
      previousClassName={css.prev}
      nextClassName={css.next}
      disabledClassName={css.disabled}
    />
  );
}