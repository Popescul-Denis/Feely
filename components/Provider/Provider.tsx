'use client'

import React from 'react'

import {SessionProvider} from 'next-auth/react'
import type {Session} from 'next-auth'

interface ProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

const Provider : React.FC<ProviderProps> = ({ children, session}) => {
  return (
    <SessionProvider session={session ?? undefined}>
      {children}
    </SessionProvider>
  )
}

export default Provider