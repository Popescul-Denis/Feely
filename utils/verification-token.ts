import {db} from '@lib/prisma'

export const getVerificationTokenByEmail = async (email: string) => {
  try{
    const token = await db.verificationToken.findFirst({
      where: { email },
    });
    return token;
  }catch (error : unknown) {
    console.error('Error fetching verification token:', error);
    throw new Error('Error fetching verification token');
  }
}

export const getVerificationTokenByToken = async (token: string) => {
  try{
    const verificationToken = await db.verificationToken.findFirst({
      where: { token },
    });
    return verificationToken;
  }catch (error : unknown) {
    console.error('Error fetching verification token:', error);
    throw new Error('Error fetching verification token');
  }
}
