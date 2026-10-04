import React from 'react'
import { JournalForm } from '@components/Forms/sections'
import { Prompt } from 'next/font/google'

const prompt = Prompt({subsets: ['latin'], weight: '400'})

const JournalPage = () => {
  return (
    <div style={prompt.style}>
      <JournalForm />
    </div>
  )
}

export default JournalPage