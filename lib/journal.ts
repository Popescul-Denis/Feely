import {db} from "@lib/prisma";

export const getJournalByAuthorId = async (authorId : string) => {
  try{
    const journal = await db.journal.findFirst({
      where : {
        authorId
      }
    })

    return journal;
  }catch(error : unknown){
    console.error('Error fetching journal:', error);
    throw new Error('Error fetching journal');
  }
}

export const createJournal = async (journalTitle : string, authorId : string) => {

  const existingJournal = await getJournalByAuthorId(authorId);

  if(existingJournal) {
    return {error : "Deja ai un jurnal!"}
  }

  const journal = await db.journal.create({
    data: {
      journalTitle,
      authorId,
    }
  })

  return journal;
}

export const deleteJournal = async (journalId : string) => {

  if(!journalId){
    throw new Error('journalId is required');
  }

  await db.journal.delete({
    where : {
      id : journalId
    }
  })

  // sterge si paginile asociate jurnalului
  await db.journalPage.deleteMany({
    where : {
      journalId
    }
  })
}

export const setHasJournalBoolean = async (userId : string, value : boolean) => {
  await db.user.update({
    where : {
      id : userId
    },
    data : {
      hasJournal : value
    }
  })
}