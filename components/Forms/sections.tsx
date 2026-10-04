'use client'
import React, {useState, useEffect} from 'react'
import { useSession } from 'next-auth/react'
import {useRouter} from 'next/navigation'
import { Prompt } from 'next/font/google'
import { ProfileImageForm } from './image'
import { NavigationCard} from '../ComponentBars/card'
import { Sidebar } from '../ComponentBars/bars'
import { SideBarType } from '@utils/data-types/sidebar'
import { JournalData, JournalPageData } from '@utils/data-types/user-data'
import CodeInput  from '../Inputs/CodeInput'
import { monthNames } from '@utils/data-types/user-data'

const prompt = Prompt({subsets: ['latin'], weight: '400'})

type JournalPopupProps = {
  setCheckedJournalCode : (x:boolean)  => void;
}

const JournalPopup = ({setCheckedJournalCode} : JournalPopupProps) => {

  const {data : session} = useSession();
  const router= useRouter();

  const [userCode, setUserCode] = useState<string[]>(Array(6).fill(''));
  const [wrongCode, setWrongCode] = useState<boolean>(false);
  const [waitingTime, setWaitingTime] = useState<number>(0);

  useEffect(() => {
    if (!wrongCode || waitingTime <= 0) {
      if (waitingTime <= 0) {
        setWrongCode(false)
      }
      return
    }

    const timer = setTimeout(() => {
      setWaitingTime((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [wrongCode, waitingTime])

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4' role='presentation'>
      <div className='flex w-full max-w-lg flex-col items-center gap-5 rounded-xl bg-[#f9eada] p-6 shadow-2xl' role='dialog' aria-modal='true' aria-labelledby='journal-popup-title'>
        <div className='text-center'>
          <h1 id='journal-popup-title' className='font-bold text-[1.1rem]'>Introdu codul de acces al jurnalului tău</h1>
          <h1 className='font-bold text-[1.1rem]'>Daca nu ai unul, adauga-l din <span className='text-blue-500 underline cursor-pointer' onClick={() => router.push('/settings-page')}>setari</span></h1>
        </div>
        {wrongCode && (
          <p className='w-full rounded-md bg-red-500 p-2 text-center text-white'>
            Codul introdus este incorect. Asteapta {waitingTime} secunde...
          </p>
        )}
        <CodeInput setUserCode={setUserCode} />
        <button
        className='cursor-pointer self-end rounded-lg border border-[#c7afaf] bg-[#f5e4c5] px-3 py-1 hover:bg-[#edd19c] disabled:cursor-not-allowed disabled:opacity-50'
        disabled={wrongCode && waitingTime > 0}
        onClick={() => {
          if (wrongCode && waitingTime > 0) return

          if (userCode.join('') === session?.user.journalPassword) {
            setCheckedJournalCode(true)
          } else {
            setWrongCode(true)
            setWaitingTime(3)
          }
        }}
        >
          {wrongCode && waitingTime > 0 ? `Asteapta ${waitingTime}s` : 'Verifica Codul'}
        </button>
      </div>
    </div>
  )
}

const CreateJournalPopup = ({setPopup} : {setPopup : (x:boolean ) => void}) => {
  const {data : session} = useSession();
  const router = useRouter();

  const [journalData, setJournalData] = useState<JournalData>({
    journalTitle: '',
    journalPages: [],
  })

  const createJournal = async () => {
    if(!journalData.journalTitle){
      alert('Titlu jurnal necesar');
      return;
    }

    try{
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          journalTitle: journalData.journalTitle,
        })
      })

      if (!res.ok) {
        throw new Error('Error creating journal');
      }

      router.refresh();
      
    } catch (error) {
      console.error('Error creating journal:', error);
      alert('Eroare la crearea jurnalului');
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4' role='presentation'>
      <div className='flex w-full max-w-lg flex-col items-center gap-5 rounded-xl bg-[#f9eada] p-6 shadow-2xl' role='dialog' aria-modal='true' aria-labelledby='journal-popup-title'>
        <h1 className='font-bold text-2xl'>Creeaza un jurnal</h1>
        <div className='flex flex-col gap-1'>
          <label htmlFor='journalTitle' className='font-bold'>Titlu jurnal</label>
          <input 
            type='text'
            id='journalTitle'
            name='journalTitle'
            maxLength={20}
            spellCheck={false}
            placeholder='Maximum 20 de caractere'
            value={journalData.journalTitle}
            onChange={(e) => setJournalData({...journalData, journalTitle: e.target.value})}
            className='w-full rounded-lg border border-[#d4c5a9] bg-[#fcfaf8] px-3 py-2 text-[#7f6042] outline-none transition-colors focus:border-[#7f6042] focus:ring-2 focus:ring-[#b48f64]/30 '
          />
        </div>
        <div className='flex flex-row gap-10'>
          <button className='hover:opacity-85 cursor-pointer'
          onClick={() => setPopup(false)}>Anuleaza</button>
          <button className='hover:opacity-85 cursor-pointer'
          onClick={createJournal}>Creeaza</button>
        </div>
      </div>
    </div>
  )
}

export const JournalForm = () => {
  const {data : session, status} = useSession();
  const router = useRouter();

  const [checkedJournalCode, setCheckedJournalCode] = useState<boolean>(false);
  const [createJournal, setCreateJournal] = useState<boolean>(false);
  

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/log-in')
    }
  }, [router, status])

  return (
    <div className='flex flex-col items-center mt-6 w-full h-full p-4' style={prompt.style}>
      {!checkedJournalCode && (
        <JournalPopup setCheckedJournalCode={setCheckedJournalCode} />
      )}

      {createJournal && (
        <CreateJournalPopup  setPopup={setCreateJournal}/>
      )}
      <h1 className='font-bold text-[1.5rem] mb-10'>Jurnalul tau</h1>
      {!session?.user.hasJournal && 
        <div className='gap-3 flex flex-col items-center mt-10'>
          <h1 className='font-bold text-6xl text-black'>Se pare ca nu ai inca un jurnal!</h1>
          <button className='bg-[#FCFAF8] border-2 border-black p-1.5 text-black rounded-xl cursor-pointer hover:bg-[#efe9e2]'
          onClick={()=> setCreateJournal(true)}>Creeaza unul</button>
        </div>}
      {session?.user.hasJournal && (
        <div className='flex flex-col gap-20 items-center w-full'>
          <DiaryDesign /> 
          <button className='bg-green-400 border border-green-700 py-2 px-4 rounded-4xl font-bold w-fit cursor-pointer hover:bg-green-200' onClick={() => router.push('write-journal-page')}>+ Scrie</button>
        </div>)}
    </div>
  )
}

export const ProfilePage = () => {

  const {data : session, status} = useSession();
  const router = useRouter();

  const [loading, setloading] = useState<boolean>(false);

  useEffect(() => {
    if(status === "unauthenticated"){
      router.push('/log-in')
    }
  }, [router, status])

  return (
    <div className='flex flex-col items-center mt-6' style={prompt.style}>
      <ProfileImageForm />
      <div className='flex flex-row items-center mt-6'>
        <NavigationCard title="PROPRIUL TAU JURNAL" description="Noteaza-ti trairile, gandurile, sentimentele sau orice altceva doresti sa impartasesti intr-un jurnal pe care doar tu il poti accesa." link="/journal-page" icon='/icons/journal-icon.png' tag='jurnal' />
        <NavigationCard title="FEELY AI" description="Incepe o conversatie cu un agent AI specializat care sa iti analizeze starea si cu care poti discuta" link="/" icon='/icons/feely-ai-icon-gray.png' tag='feely ai' />
        <NavigationCard title="RAPOARTELE EMOTIVE" description="Observa-ti comportamentul si starea emotionala prin analizarea proprie a rapoartelor noastre asupra ta." link="/" icon='/icons/report-icon-gray.png' tag='rapoarte' />
        <NavigationCard title="CALENDARUL SENTIMENTELOR" description="Urmareste-ti progresul cu ajutorul unui calendar si descopera prin ce schimbari ai trecut. " link="/" icon='/icons/calendar-icon.png' tag='calendar' />
      </div>
    </div>
  )
}

export const SettingsPage = () => {

  return (
    <div className='flex flex-col items-center mt-6' style={prompt.style}>
      <ProfileImageForm u_image_text='Setarile contului'/>
      <div className='flex flex-row items-start mt-6 gap-3 w-full bg-[#f5e4c5] p-5'>
        <Sidebar bar_type={SideBarType.settings}/>
        {/* bara verticala de separare */}
        <div className='border border-[#c7afaf] self-stretch'></div>
        <SettingForm  type='journal'/>
      </div>
    </div>
  )
}

const DeleteConfirmationPopup = ({setShow, setSuccess, setError} : {setShow : (x :boolean) => void, setSuccess : (x : string) => void , setError : (x:string) => void}) => {

  const {data : session}  = useSession();

  const deleteJournal = async () => {
    try{
      const res = await fetch('/api/journal', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      })

      if (!res.ok) {
        throw new Error('Error deleting journal');
      }

      setShow(false);
      const data = await res.json();

      if(data.error){
        setError(data.error);
      }else{
        setSuccess(data.success);
      }
      
    } catch (error) {
      console.error('Error creating journal:', error);
      alert('Eroare la crearea jurnalului');
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4' role='presentation'>
      <div className='flex w-full max-w-lg flex-col items-center gap-5 rounded-xl bg-[#f9eada] p-6 shadow-2xl' role='dialog' aria-modal='true' aria-labelledby='journal-popup-title'>
        <div className='flex flex-col text-center gap-5'>
          <h1>Esti sigur ca vrei sa stergi jurnalul?</h1>
          <div className='flex flex-row gap-10'>
            <button className='bg-gray-500 border-0 rounded-lg px-3 py-2 w-fit text-white font-bold cursor-pointer hover:bg-gray-400' onClick={() => setShow(false)}>Anuleaza</button>
            <button className='bg-red-500 border-0 rounded-lg px-3 py-2 w-fit text-white font-bold cursor-pointer hover:bg-red-400' onClick={() => deleteJournal()}>Confirma</button>
          </div>
        </div>
      </div>
    </div>
  )
}

type SettingFormProps = {
  type : string,
}

const SettingForm = ({type} : SettingFormProps) => {
  const [journalCode, setJournalCode] = useState<string[]>(Array(6).fill(''));
  const {data : session} = useSession();  
  const router = useRouter();

  const [message, setMessage] = useState<string>('');
  const [showPopup, setShowpopup] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>('');
  const [error, setError] = useState<string>('');

  // if k is pressed show session.user in console
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k') {
        console.log('user:', session?.user);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [session?.user.journalPassword]);

  const onSubmit= async (e : React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setJournalCode(journalCode);

    try {
      const response = await fetch('/api/user/set-journal-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ journalCode }),
      });

      if (!response.ok) {
        const data = await response.json();
        setMessage(data.error || 'Eroare la actualizarea codului jurnal');
        throw new Error(data.error || 'Eroare la actualizarea codului jurnal');
      }

      const data = await response.json();
      setMessage(data.message || 'Cod jurnal actualizat cu succes');
    } catch (error) {
      console.error('Error updating journal code:', error);
      alert(`Eroare la actualizarea codului jurnal: ${error instanceof Error ? error.message : 'Eroare necunoscuta'}`);
      setMessage(`Eroare la actualizarea codului jurnal: ${error instanceof Error ? error.message : 'Eroare necunoscuta'}`);
    }
  };

  /* formularul trebuie sa se intinda pe toata inaltimea */
  return (
    <div className='w-full bg-[#f9eada] rounded-lg flex flex-col gap-5 p-5 self-stretch'>
      <div className='flex flex-col gap-5 p-5'>
        {type==='journal' && (
          <div className='flex flex-col gap-5'>
            <div>
              <h1 className='font-bold text-[1.1rem]'>Detalii cont</h1>
              <div className='w-full h-px bg-[#d9d9d9] mt-3'></div>
              <div className='flex flex-col gap-2 mt-3'>
                <p className='text-[#333] '>Email : <span className='font-semibold'>{session?.user?.email}</span></p>
                <p className='text-[#333] '>Nume : <span className='font-semibold'>{session?.user?.name}</span></p>
                <p className='text-[#333] '>Parola : <span className='font-semibold'>********</span>  <span className='text-blue-500 hover:underline cursor-pointer' onClick={() => {
                  router.push('/reset-password')
                }}>(Ai uitat parola?)</span></p>
              </div>
              <div className='w-full h-px bg-[#d9d9d9] mt-3'></div>
            </div>
            <div>
              <h1 className='font-bold text-[1.1rem]'>Configurare jurnal</h1>
              <div className='w-full h-px bg-[#d9d9d9] mt-3'></div>
              <div className='flex flex-col gap-2 mt-3'>
                {message && <p className='text-green-500'>{message}</p>}
                <p className='text-[#333] '>Cheie de acces jurnal : </p>
                <CodeInput  setUserCode={setJournalCode} journalCode={session?.user.journalPassword?.split('')}/>
                <button className='bg-[#f5e4c5] border border-[#c7afaf] rounded-lg px-3 py-1 w-fit hover:bg-[#edd19c] self-end cursor-pointer ' onClick={onSubmit}>Salveaza</button>
              </div>
              <div className='flex flex-row gap-20 items-center'>
                {success && <p className='text-green-500'>{success}</p>}
                {error && <p className='text-red-500'>{error}</p>}
                <p className='text-[#333]'>Sterge jurnalul</p>
                <button className='bg-red-500 border-0 rounded-lg px-3 py-3 w-fit text-white font-bold cursor-pointer hover:bg-red-400' onClick={() => setShowpopup(true)}>Sterge</button>
              </div>
              <div className='flex flex-col mt-10  text-[#333]'>
                <p>Configureaza paginile de jurnal <span className='text-blue-400 underline cursor-pointer hover:text-blue-300' onClick={() =>router.push('/settings-page/journal-page-config')}>aici</span></p>
              </div>
              <div className='w-full h-px bg-[#d9d9d9] mt-3'></div>
            </div>
            <h1 className='font-bold text-[1.1rem]'>Accesibilitate</h1>
            <div className='w-full h-px bg-[#d9d9d9] mt-3'></div>
            {showPopup && (<DeleteConfirmationPopup setShow={setShowpopup} setSuccess = {setSuccess} setError = {setError}/>)}
          </div>
        )}
      </div>
    </div>
  )
}

export const DiaryDesign = () => {

  const {data : session} = useSession();

  const [error, setError] = useState<string>('');
  const [error2, setError2] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<number>(0);

  const [journalData, setJournalData] = useState<JournalData>({
    journalTitle: '',
    journalPages: [],
  });

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
    const fetchJournal = async () => {
      try{
        const res = await fetch('/api/journal', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Eroare la incarcarea jurnalului');
          throw new Error(data.error || 'Eroare la incarcarea jurnalului');
        }

        const data = await res.json();

        setJournalData((currentJournalData) => ({
          ...currentJournalData,
          journalTitle: data.journal.journalTitle,
        }));

      }catch(error : unknown){
        setError(error instanceof Error ? error.message : 'Eroare la incarcarea jurnalului');
        console.error('Error fetching journal:', error);
      }
    }

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
          setError2(data.error || 'Eroare la incarcarea paginilor de jurnal');
          throw new Error(data.error || 'Eroare la incarcarea paginilor de jurnal');
        }

        const data = await res.json();

        setJournalPageData(data.journalPages);

      }catch(error : unknown){
        setError2(error instanceof Error ? error.message : 'Eroare la incarcarea paginilor de jurnal');
        console.error('Error fetching journal pages:', error);
      }
    }

    fetchJournal();
    fetchJournalPages();
  }, [])

  const nextPage = () => {
    if(currentPage<journalPageData.length-1) setCurrentPage((prev)=> prev+1);
  }

  const prevPage = () => {
    if(currentPage>0) setCurrentPage((prev)=> prev-1);
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center p-8 font-serif w-[80%]" style={prompt.style}>
      {error && <p className='text-red-500'>{error}</p>}
      {error2 && <p className='text-red-500'>{error2}</p>}
      {/* Container principal */}
      <div className="flex gap-10 relative w-full justify-center">

        
        {/*  COPERTA (STÂNGA) */}
        <div className="relative w-115 h-170 bg-[#fdfaf5] rounded-xl border border-[#dcd3c6] shadow-[inset_0_0_20px_rgba(0,0,0,0.05),0_15px_30px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center p-10">
          
          {/* Titlul jurnalului */}
          <div className="text-center relative w-full">
            <h1 className="text-5xl text-[#8b6d4e] leading-tight tracking-wider drop-shadow-sm">
              {journalData.journalTitle}
            </h1>
          </div>

          {/* Numele utilizatorului */}
          <span className="absolute bottom-10 right-8 text-sm font-bold text-[#8b6d4e]">
            - {session?.user.name}
          </span>

          {/* Numarul de pagini*/}
          {currentPage===0 &&
            <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-[#1a1a1a] text-[#d4af37] rounded-full flex flex-col items-center justify-center shadow-lg border-[3px] border-[#fdfaf5]">
              <span className="text-xl font-bold leading-none">{journalPageData.length}</span>
              <span className="text-xs font-semibold">pagini</span>
            </div>
          }
          {currentPage!==0 &&
            <button className="absolute -bottom-5 -left-5 w-20 h-20 bg-[#1a1a1a] text-[#d4af37] rounded-full flex flex-col items-center justify-center shadow-lg border-[3px] border-[#fdfaf5] cursor-pointer hover:bg-[#2d2b2b] text-[10px]" onClick={prevPage}>
              PAGINA PRECEDENTA
            </button>
          }
        </div>

        {/* PAGINA DE CONTINUT (DREAPTA)*/}
        <div className="w-125 h-170 bg-white rounded-xl border border-[#dcd3c6] shadow-[inset_0_0_30px_rgba(0,0,0,0.03),0_15px_30px_rgba(0,0,0,0.1)] p-5 flex flex-col font-sans text-[10px] text-gray-600">
          
          {/* Bara de sus cu luni */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-1 mb-1">
            <div className="flex gap-2 font-bold text-[#8b6d4e]">
              <span>
                {journalPageData[0]
                  ? monthNames[new Date(journalPageData[currentPage].date).getMonth()]
                  : ''}
              </span>
            </div>
            <div className="cursor-pointer">☰</div>
          </div>

          {/* Rândul cu zilele */}
          <div className="flex gap-1 text-[8px] text-gray-400 mb-3">
            {Array.from({ length: 31 }, (_, i) => (
              <span
                key={i}
                className={`w-3.5 text-center ${
                  journalPageData[0] && i + 1 === new Date(journalPageData[currentPage].date).getDate()
                    ? 'relative z-10 scale-180 font-bold text-[#d4af37]'
                    : ''
                }`}
              >
                {i + 1}
              </span>
            ))}
          </div>

          {/* Conținutul principal pe coloana */}
          <div className="flex min-h-0 flex-1 flex-col gap-4">
            
            {/* Sentimentul utilizatorului : "Astazi ma simt ...!" */}

            <div className=" flex gap-2">
              <p className="font-bold text-[14px] text-gray-400 ">Astazi ma simt {journalPageData[currentPage].feeling}!</p>
            </div>

            {/* Titlul paginii de jurnal */}

            <div className=" flex  gap-2">
              <div className="w-full h-6 bg-[#f5e4c5] rounded-lg border border-[#d4c5a9] flex items-center justify-center">
                <span className="text-[17px] text-[#7f6042] font-bold">{journalPageData[currentPage].title}</span>
              </div>
            </div>

            {/* Continutul paginii de jurnal */}
            <div className="flex min-h-0 flex-1 gap-2">
              <div className="min-h-0 w-full overflow-y-auto rounded-lg border border-[#d4c5a9] bg-[#f5e4c5] p-2">
                <p className="text-[15px] text-[#7f6042] font-semibold bg-clip-content" style={{whiteSpace: 'pre-wrap', color: journalPageData[currentPage].textPiece.color, wordWrap: 'break-word'}}>
                  {journalPageData[currentPage].textPiece.text}
                </p>
              </div>
            </div>

            {/* Speranta utilizatorului de maine : "Sper ca maine sa ..." */}

            <div className="flex gap-2">
              <div className="w-full h-6 bg-[#f5e4c5] rounded-lg border border-[#d4c5a9] flex items-center justify-center">
                <span className="text-[12px] text-[#7f6042] font-bold">{journalPageData[currentPage].userHope}</span>
              </div>
            </div>

            {/* Buton de pagina urmatoare*/}
            <button className="absolute -bottom-5 -right-5 w-20 h-20 bg-[#1a1a1a] text-[#d4af37] rounded-full flex flex-col items-center justify-center shadow-lg border-[3px] border-[#fdfaf5] cursor-pointer hover:bg-[#2d2b2b]" onClick={nextPage}>
              PAGINA URMATOARE
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
