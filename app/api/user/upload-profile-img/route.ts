import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/prisma'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const image = formData.get('image')

    if (!image || !(image instanceof File) || !image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Nicio imagine validă selectată' },
        { status: 400 }
      )
    }

    const userId = session.user.id ?? session.user.email.replace(/[^a-zA-Z0-9_-]/g, '_')
    const extension = image.type.split('/')[1] ?? 'jpg'
    const folderPath = path.join(process.cwd(), 'public', 'profile-images')
    await fs.mkdir(folderPath, { recursive: true })

    const fileName = `${userId}.${extension}`
    const filePath = path.join(folderPath, fileName)
    const fileBuffer = Buffer.from(await image.arrayBuffer())

    await fs.writeFile(filePath, fileBuffer)
    const imageUrl = `/profile-images/${fileName}`

    await db.user.update({
      where: { email: session.user.email },
      data: { image: imageUrl },
    })

    return NextResponse.json({
      success: true,
      imageUrl,
    })

  } catch (error : unknown) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Eroare la încărcare' },
      { status: 500 }
    )
  }
}