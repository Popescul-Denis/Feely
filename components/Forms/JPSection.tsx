'use client'
import React, {useState, useEffect} from 'react'
import { useSession } from 'next-auth/react'
import {useRouter} from 'next/navigation'
import { JournalData, JournalPageData } from '@utils/data-types/user-data'

const JPPopup = ({showPopup, onDelete, pageId} : { showPopup : (x:boolean) => void, onDelete: (id : string) => void, pageId : string}) => {

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4' role='presentation'>
      <div className='flex w-full max-w-lg flex-col items-center gap-5 rounded-xl bg-[#f9eada] p-6 shadow-2xl' role='dialog' aria-modal='true' aria-labelledby='journal-popup-title'>
        <h1 id='journal-popup-title' className='font-bold text-[1.1rem]'>Esti sigur ca vrei sa stergi pagina din jurnal?</h1>
        <div className='flex gap-10'>
          <button className='cursor-pointer self-end rounded-lg border border-[#c7afaf] bg-[#f5e4c5] px-3 py-1 hover:bg-[#edd19c] disabled:cursor-not-allowed disabled:opacity-50'
          onClick={()=> showPopup(false)}>
            Anuleaza
          </button>
          <button
          className='cursor-pointer self-end rounded-lg border border-[#c7afaf] bg-[#f5e4c5] px-3 py-1 hover:bg-[#edd19c] disabled:cursor-not-allowed disabled:opacity-50'
          onClick={() => {
            onDelete(pageId);
          }}
          >
            Sterge
          </button>
        </div>
      </div>
    </div>
  )
}

export const JPSection = () => {
  const {data : session, status} = useSession();
  const router = useRouter();

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showPopup , setShowpopup] = useState<boolean>(false);
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  
  const [journalPageData, setJournalPageData] = useState<JournalPageData[]>([{
    id: '',
    date : new Date(),
    title : '',
    textPiece : {text : '', color: ''},
    feeling : '',
    userHope : '',
    highlight: false,
  }])

  useEffect(() => {
    const fetchJournalPages = async () => {
      try{
        const res = await fetch('/api/journal/journal-page', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Eroare la incarcarea paginilor de jurnal');
          throw new Error(data.error || 'Eroare la incarcarea paginilor de jurnal');
        }

        const data = await res.json();

        setJournalPageData(data.journalPages);

      }catch(error : unknown){
        setError(error instanceof Error ? error.message : 'Eroare la incarcarea paginilor de jurnal');
        console.error('Error fetching journal pages:', error);
      }
    }

    fetchJournalPages();
  }, [])

  const deletePage = async (journalPageId: string) => {
    try{
      const res = await fetch('/api/journal/journal-page', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ journalPageId })
      })

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Eroare la ștergerea paginii de jurnal');
        throw new Error(data.error || 'Eroare la ștergerea paginii de jurnal');
      }

      setJournalPageData(prevPages => prevPages.filter(page => page.id !== journalPageId));
      setShowpopup(false);
      setSuccess('Pagina de jurnal a fost ștearsă cu succes');
    }catch(error : unknown){
      setError(error instanceof Error ? error.message : 'Eroare la ștergerea paginii de jurnal');
      console.error('Error deleting journal page:', error);
    }
  }

  useEffect(() => {
    if(status === 'unauthenticated'){
      router.push('/log-in');
    }
  }, [status, router])

  return (
    <div className='flex flex-col justify-center items-center mb-20'>
      {error && <p className='text-red-500'>error</p>}
      {success && <p className='text-green-500'>{success}</p>}
      <h1 className='text-4xl mt-15'>Paginile de jurnal</h1>
      <div className="border-2 border-gray-700 w-[80%] h-fit mt-10 rounded-2xl p-2 divide-y-2 divide-gray-700">
        {journalPageData.map((page, index) => (
          <div key={index} className="flex items-center gap-10 py-5">
            <p className="font-bold">{index + 1}.</p>
            <p>{page.date.toString().slice(0, 10)}</p>
            <p>{page.title}</p>
            <button className='bg-red-500 text-white p-3 rounded-2xl ml-auto cursor-pointer mr-5 hover:bg-red-400' onClick={() => {setShowpopup(true); setSelectedPageId(page.id)}}>Sterge</button>
          </div>
        ))}
      </div>
      {showPopup && <JPPopup showPopup={setShowpopup} onDelete={deletePage} pageId={selectedPageId}/>}
    </div>
  )
}