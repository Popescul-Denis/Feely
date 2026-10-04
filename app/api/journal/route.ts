import { NextRequest, NextResponse } from "next/server";
import { createJournal, deleteJournal, getJournalByAuthorId, setHasJournalBoolean } from "@lib/journal";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";

export async function POST(req : NextRequest){
  try{
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Neautorizat' },
        { status: 401 }
      )
    }

    const {journalTitle} = await req.json();

    if(!journalTitle ){
      return NextResponse.json(
        { error: 'Titlu jurnal necesar' },
        { status: 400 }
      )
    }

    const userId = session.user.id;

    const journal = await createJournal(journalTitle, userId);

    if ('error' in journal) {
      return NextResponse.json(
        {error : journal.error},
        {status : 400}
      )
    }

    await setHasJournalBoolean(session.user.id, true);

    return NextResponse.json({success : "Jurnal creat cu succes"}, { status: 201 })
  }catch(error : unknown){
    console.error('Error creating journal', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Eroare la crearea jurnalului' },
      { status: 500 }
    )
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

    const journal = await getJournalByAuthorId(session.user.id);
    const journalId = journal?.id;

    if (!journalId) {
      return NextResponse.json(
        { error: 'ID jurnal necesar' },
        { status: 400 }
      )
    }

    await deleteJournal(journalId);

    await setHasJournalBoolean(session.user.id, false);

    return NextResponse.json({ success: "Jurnal șters cu succes" }, { status: 200 });
  } catch (error : unknown) {
    console.error('Error deleting journal:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Eroare la ștergerea jurnalului' },
      { status: 500 }
    );
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

    return NextResponse.json({ journal }, { status: 200 });
  }catch (error : unknown) {
    console.error('Error fetching journal:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Eroare la obținerea jurnalului' },
      { status: 500 }
    );
  }
}