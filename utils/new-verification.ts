'use server'

import { db } from "@/lib/prisma";
import { getUserByEmail } from "./user";
import { getVerificationTokenByToken } from "./verification-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return {error: "Token invalid sau expirat"};
  }

  const hasExpired = existingToken.expires < new Date();

  if (hasExpired) {
    return {error: "Token expirat"};
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {error: "Utilizatorul nu exista"};
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: { emailVerified: new Date() },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  })

  return {success: "Email verificat cu succes. Poti inchide aceasta fereastra. Intoarce-te la pagina de login pentru a te autentifica."};
}