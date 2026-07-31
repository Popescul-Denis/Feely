import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@lib/email";
import { createResetCodeInDB } from "@lib/code";
import { getUserByEmail } from "@utils/user";

export async function POST(req : Request) {
  try{
    const body = await req.json();
    const { email, codeString} = body;

    const existingUser = await getUserByEmail(email);

    if(!existingUser) {
      return NextResponse.json({error: "User neexistent pentru adresa de email scrisa"}, {status: 400});
    }

    const verificationCode = await createResetCodeInDB(codeString, email);

    await sendPasswordResetEmail(email, codeString);

    return NextResponse.json({message: "Codul de verificare a fost creat cu succes si trimis prin email"})
  }catch (error : unknown){
    const message = error instanceof Error ? error.message : "Eroare necunoscuta";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
