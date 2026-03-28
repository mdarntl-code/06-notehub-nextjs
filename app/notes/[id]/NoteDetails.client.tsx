'use client';

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import css from "./details.module.css";

export default function NoteDetailsClient({ id }: { id: string }) {
  
  const { data: note, isError, isLoading } = useQuery({
    queryKey: ['notes', id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) return <p className={css.status}>Loading, please wait...</p>;
  if (isError || !note) return <p className={css.error}>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        
        {note.tag && <p className={css.tag}>{note.tag}</p>}
        
        <p className={css.content}>{note.content}</p>
        
        <p className={css.date}>
          Created: {new Date(note.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}