import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      )
    }

    const { journalCode } = await req.json()

    if (!journalCode || !Array.isArray(journalCode) || journalCode.length !== 6) {
      return NextResponse.json(
        { error: 'Cod jurnal invalid' },
        { status: 400 }
      )
    }

    await db.user.update({
      where: { email: session.user.email },
      data: { journalPassword: journalCode.join('') },
    })

    return NextResponse.json({
      success: true,
      message: 'Cod jurnal actualizat cu succes',
    })
  } catch (error : unknown) {
    console.error('Error updating journal code:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Eroare la actualizarea codului jurnal' },
      { status: 500 }
    )
  }
}