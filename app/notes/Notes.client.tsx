'use client';

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import { useState, useEffect } from "react";
import css from "./notes.module.css"; 
import SearchBox from "../../components/SearchBox/SearchBox";
import Pagination from "../../components/Pagination/Pagination";
import NoteList from "../../components/NoteList/NoteList";
import Modal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isError, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['notes', { page, perPage: 6, search: debouncedSearch }],
    queryFn: () => fetchNotes({ page, perPage: 6, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox  onChange={handleSearch} />
        
        {data && data.totalPages > 1 && (
          <Pagination 
            totalPages={data.totalPages} 
            currentPage={page} 
            onPageChange={setPage} 
          />
        )}
        
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main style={{ opacity: isPlaceholderData ? 0.6 : 1, transition: 'opacity 0.2s' }}>
        {isLoading && !data && <p className={css.status}>Завантаження нотаток...</p>}
        {isError && <p className={css.error}>Сталася помилка при завантаженні нотаток.</p>}
        
        {data && <NoteList notes={data.notes} />}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

export default NotesClient;