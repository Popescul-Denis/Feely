import React from 'react'
import {EditJournalForm} from '@components/Forms/EditJournalForm'
import { Prompt } from 'next/font/google'
import { useParams } from 'next/navigation'

const prompt = Prompt({ subsets: ['latin'], weight: '400' })

const EditJournalPage = () => {

  return (
    <div style={prompt.style} className='flex flex-col items-center justify-center w-full h-full'>
      <EditJournalForm  />
    </div>
  )
}

export default EditJournalPage