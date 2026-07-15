import {db} from '@lib/prisma'
import { getResetCodeByEmail } from '@utils/reset-code'

export const createResetCodeInDB = async (codeString : string, email : string) => {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Codul expira in 15 minute

  const existingCode = await getResetCodeByEmail(email);

  if(existingCode){
    await db.resetPasswordCode.delete({
      where : {id: existingCode.id}
    })
  }

  //creare
  const verificationCode = await db.resetPasswordCode.create({
    data: {
      email,
      code: codeString,
      expires: expiresAt,
    }
  })

  return verificationCode;
}