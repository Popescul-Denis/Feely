'use client'
import React, {useState, useEffect} from 'react'
import { useSession } from 'next-auth/react'
import {useRouter} from 'next/navigation'
import { Prompt } from 'next/font/google'
import { ProfileImageForm } from './image'
import { NavigationCard} from '../ComponentBars/card'
import { Sidebar } from '../ComponentBars/bars'
import { SideBarType } from '@utils/data-types/sidebar'
import  CodeInput  from '../Inputs/CodeInput'

const prompt = Prompt({subsets: ['latin'], weight: '400'})

export const JournalForm = () => {
  const {data : session, status} = useSession();
  const router = useRouter();

  const [checkedJournalCode, setCheckedJournalCode] = useState<boolean>(false);
  const [userCode, setUserCode] = useState<string[]>(Array(6).fill(''));
  const [wrongCode, setWrongCode] = useState<boolean>(false);
  const [waitingTime, setWaitingTime] = useState<number>(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/log-in')
    }
  }, [router, status])

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
    <div className='flex flex-col items-center mt-6 ' style={prompt.style}>
      {!checkedJournalCode && (
        <div className='flex flex-col items-center gap-5'>
          <div className='text-center'>
            <h1 className='font-bold text-[1.1rem]'>Introdu codul de acces al jurnalului tău</h1>
            <h1 className='font-bold text-[1.1rem]'>Daca nu ai unul, adauga-l din <span className='text-blue-500 underline cursor-pointer' onClick={() => router.push('/settings-page')}>setari</span></h1>
          </div>
          {wrongCode && (
            <p className='text-white bg-red-500 p-2'>
              Codul introdus este incorect. Asteapta {waitingTime} secunde...
            </p>
          )}
          <CodeInput setUserCode={setUserCode} />
          <button
            className='bg-[#f5e4c5] border border-[#c7afaf] rounded-lg px-3 py-1 w-fit hover:bg-[#edd19c] self-end cursor-pointer mb-10 disabled:opacity-50 disabled:cursor-not-allowed'
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
      )}
      {checkedJournalCode && (
        <h1 className='font-bold text-[1.1rem]'>Jurnalul tau</h1>
      )}
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

type SettingFormProps = {
  type : string,
}

const SettingForm = ({type} : SettingFormProps) => {
  const [journalCode, setJournalCode] = useState<string[]>(Array(6).fill(''));
  const {data : session} = useSession();  
  const router = useRouter();

  const [message, setMessage] = useState<string>('');

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
              <div className='w-full h-px bg-[#d9d9d9] mt-3'></div>
            </div>
            <h1 className='font-bold text-[1.1rem]'>Accesibilitate</h1>
            <div className='w-full h-px bg-[#d9d9d9] mt-3'></div>
          </div>
        )}
      </div>
    </div>
  )
}
