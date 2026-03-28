'use client'
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import { useState } from "react";
import css from "./notes.module.css"; 
import SearchBox from "../../components/SearchBox/SearchBox";
import Pagination from "../../components/Pagination/Pagination";
import NoteList from "../../components/NoteList/NoteList";
import Modal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";

function NotesClient(){
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

     const {data, isError, isLoading} = useQuery({
        queryKey: ['notes', { page, perPage: 6, search }],
        queryFn: () => fetchNotes({ page, perPage: 6, search }),
      }) 

      const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
      }

      return ( <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onChange={handleSearch} />
          
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
  
        <main>
          {isLoading && <p className={css.status}>Завантаження нотаток...</p>}
          {isError && <p className={css.error}>Сталася помилка при завантаженні нотаток.</p>}
          
          {data && (
            <NoteList notes={data.notes} />
          )}
        </main>
  
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm onClose={() => setIsModalOpen(false)} />
          </Modal>
        )}
      </div>
    )
}

export default NotesClient;