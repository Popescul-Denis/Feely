import {db} from '@lib/prisma'
import {getResetCodeByCode} from './reset-code'
import { getUserByEmail } from './user'
import bcrypt from 'bcryptjs'

export const resetPassword = async (password: string, codeString: string) => {
  const verifCode = await getResetCodeByCode(codeString);

  if(!verifCode){
    return {error: "Userul nu poate fi updatat. Cod sters."}
  }

  const user = await getUserByEmail(verifCode.email);

  if(!user) {
    return {error: "Nu exista un user cu acest email"}
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await db.user.update({
    where : {id : user.id},
    data : {password : hashedPassword}
  })

  await db.resetPasswordCode.delete({
    where: {id : verifCode.id}
  })

  return {success: "Parola schimbata cu succes. Acum te poti autentifica"}
}

export const checkCode = async (codeString : string) => {
  const code = await getResetCodeByCode(codeString);

  if(!code) {
    return {error: "Codul este invalid"}
  }

  const hasExpired = code.expires < new Date();

  if(hasExpired) {
    return {error: "Cod expirat"}
  }

  return {success : "Codul este valid"}
}