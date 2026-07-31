import { NextRequest, NextResponse } from 'next/server'
import { getUserById } from '@utils/user'

export async function GET({ params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'ID-ul utilizatorului este necesar' },
        { status: 400 }
      )
    }

    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json(
        { error: 'Utilizator negăsit' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      image: user.image || null,
    })

  } catch (error : unknown) {
    console.error('Error fetching profile image:', error)
    return NextResponse.json(
      { error: 'Eroare la obținerea imaginii' },
      { status: 500 }
    )
  }
}