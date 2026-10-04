import React from 'react'
import { JournalWritingPage } from '@components/Forms/form'
import { Prompt } from 'next/font/google'

const prompt = Prompt({subsets: ['latin'], weight: '400'})

const WriteJournalPage = () => {
  return (
    <div style={prompt.style}>
      <JournalWritingPage />
    </div>
  )
}

export default WriteJournalPage