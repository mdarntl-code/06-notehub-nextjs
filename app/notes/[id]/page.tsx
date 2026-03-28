import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';

export default async function NoteDetails({ params }: { params: Promise<{ id: string }>}) {
    const {id} = await params; 
    const queryClient = new QueryClient();
 
 await queryClient.prefetchQuery({
   queryKey: ['notes', id],
   queryFn: () => fetchNoteById(id),
 }) 
 
 return <HydrationBoundary state={dehydrate(queryClient)}>
     <NoteDetailsClient id={id}/>
 </HydrationBoundary>
 }