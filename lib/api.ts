import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const noteInstance = axios.create({
    baseURL: 'https://notehub-public.goit.study/api',
    headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    }
})

export interface FetchNotesParams{
    page: number;
    perPage: number;
    search?: string;
}

export interface FetchNotesResponse{
    notes: Note[];
    totalPages: number;
}

export const fetchNotes = async ({page, perPage, search} : FetchNotesParams): Promise<FetchNotesResponse> => {
    const response = await noteInstance.get<FetchNotesResponse>('/notes' , {
        params: {
            page,
            perPage,
            search
        },
    })
    return response.data;
}

export interface CreateNoteParams {
    title: string;
    content: string;
    tag: NoteTag;
}

export const createNote = async (noteData: CreateNoteParams):Promise<Note> => {
    const response = await noteInstance.post<Note>('/notes', noteData);
    return response.data;
}

export const deleteNote = async (noteId: string): Promise<Note> => {
    const response = await noteInstance.delete<Note>(`/notes/${noteId}`);
    return response.data;
}

export const fetchNoteById = async (noteId: string): Promise<Note> => {
    const response = await noteInstance.get<Note>(`/notes/${noteId}`);
    return response.data;
}