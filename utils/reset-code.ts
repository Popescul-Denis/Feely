import {db} from '@lib/prisma'

export const getResetCodeByEmail = async (email: string) => {
  try{
    const code = await db.resetPasswordCode.findFirst({
      where: {email},
    })

    return code;
  }catch(error :unknown){
    console.error('Error fetching reset code:', error);
    throw new Error('Error fetching reset code');
  }
}

export const getResetCodeByCode = async (code: string) => {
  try{
    const resetCode = await db.resetPasswordCode.findFirst({
      where: { code },
    });
    return resetCode;
  }catch (error : unknown) {
    console.error('Error fetching reset code:', error);
    throw new Error('Error fetching reset code:');
  }
}