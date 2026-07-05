import { getVerificationTokenByEmail } from '@utils/verification-token';

import { v4 as uuidv4 } from 'uuid';
import {db} from '@lib/prisma'

export const generateVerificationToken = async ( email: string) => {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Token expira in 15 minute
 
  // verifica daca exista deja un token pentru acest email si il sterge
  const existingToken = await getVerificationTokenByEmail(email);

  if(existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  // creeaza un nou token
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires: expiresAt,
    }
  });

  return verificationToken;
}