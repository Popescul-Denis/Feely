import {db} from '@lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@lib/auth'
import { getJournalByAuthorId } from '@lib/journal'

export async function POST(req : NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Neautorizat' },
      { status: 401 }
    )
  }

  const {journalpageData} = await req.json();

  if(!journalpageData.date || !journalpageData.feeling || !journalpageData.title || !journalpageData.textPiece || !journalpageData.userHope){
    return NextResponse.json(
      { error: 'Toate câmpurile sunt necesare' },
      { status: 400 }
    )
  }

  if(!journalpageData.textPiece.text || !journalpageData.textPiece.color){
    return NextResponse.json(
      { error: 'Textul și culoarea sunt necesare' },
      { status: 400 }
    )
  }

  if(typeof journalpageData.highlight !== 'boolean'){
    return NextResponse.json(
      { error: 'Highlight trebuie să fie un boolean' },
      { status: 400 }
    )
  }

  if( isNaN(Date.parse(journalpageData.date))) {
    return NextResponse.json(
      { error: 'Data jurnalului este invalidă' },
      { status: 400 }
    )
  }

  try{
    const journal = await db.journal.findFirst({
      where : {
        authorId : session.user.id
      }
    })

    if(!journal){
      return NextResponse.json(
        { error: 'Jurnalul nu a fost găsit' },
        { status: 404 }
      )
    }

    const journalPage = await db.journalPage.create({
      data : {
        date : new Date(journalpageData.date),
        feeling : journalpageData.feeling,
        title : journalpageData.title,
        textPiece : journalpageData.textPiece,
        userHope : journalpageData.userHope,
        highlight : journalpageData.highlight,
        journalId : journal.id
      }
    })

    return NextResponse.json({ journalPage }, { status: 201 });
  }catch(error : unknown){
    console.error('Error creating journal page', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Eroare la crearea paginii jurnalului' },
      { status: 500 }
    )
  }
}

export async function GET(req : NextRequest){
  try{
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      )
    }
  
    const journal = await getJournalByAuthorId(session.user.id);
  
    if (!journal) {
      return NextResponse.json(
        { error: 'Jurnal inexistent' },
        { status: 404 }
      )
    }
  
    const journalPages = await db.journalPage.findMany({
      where : {
        journalId : journal.id,
      }
    })

    if(!journalPages) {
      return NextResponse.json(
        {error : "Pagini de jurnal neexistente"},
        {status : 404}
      )
    }

    return NextResponse.json({journalPages}, {status : 200});
  }catch (error : unknown) {
    console.error('Error fetching journal:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Eroare la obținerea jurnalului' },
      { status: 500 }
    );
  }
}

export async function DELETE(req : NextRequest){
  try{
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      )
    }

    const body = await req.json();
    const { journalPageId } = body;

    if (!journalPageId) {
      return NextResponse.json(
        { error: 'ID pagina jurnal necesar' },
        { status: 400 }
      )
    }

    const journalPage = await db.journalPage.findUnique({
      where: {
        id: journalPageId,
      },
    });

    if (!journalPage) {
      return NextResponse.json(
        { error: 'Pagina jurnalului nu a fost găsită' },
        { status: 404 }
      )
    }

    await db.journalPage.delete({
      where: {
        id: journalPageId,
      },
    });

    return NextResponse.json({ success: "Pagina jurnalului a fost ștearsă cu succes" }, { status: 200 });

  } catch (error : unknown) {
    console.error('Error deleting journal page:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Eroare la ștergerea paginii jurnalului' },
      { status: 500 }
    );
  }
}
