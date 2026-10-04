export type UserData = {
  id: string,
  email: string,
  name: string,
  image: string,
}

export type JournalData = {
  journalTitle : string,
  journalPages : JournalPageData[],
  theme? : string,
} 

export type JournalContentData = {
  text: string,
  color: string,
}

export type JournalPageData = {
  id: string,
  date: Date,
  title: string,
  textPiece: JournalContentData,
  feeling: string,
  userHope: string,
  highlight : boolean,
}

// pentru fiecare luna sa existe prescurtarea de 3 litere a lunii in engleza, pentru a fi folosita in interfata
export const monthNames: { [key: number]: string } = {
  0: 'IANUARIE',
  1: 'FEBRUARIE',
  2: 'MARTIE',
  3: 'APRILIE',
  4: 'MAI',
  5: 'IUNIE',
  6: 'IULIE',
  7: 'AUGUST',
  8: 'SEPTEMBRIE',
  9: 'OCTOMBRIE',
  10: 'NOIEMBRIE',
  11: 'DECEMBRIE',
};