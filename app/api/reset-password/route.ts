import { NextResponse } from "next/server";
import { resetPassword } from "@utils/reset-password";

export async function PATCH(req : Request){
  try{
    const body = await req.json();
    const {password, codeString} = body;

   if (!password || 
        typeof password !== 'string' ||
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[0-9]/.test(password))
    {
      return NextResponse.json(
        { error: "Parola trebuie să aibă minim 8 caractere, o literă mare și un număr" },
        { status: 400 }
      );
    }

    const res = await resetPassword(password, codeString);

    if(res.error) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }

    return NextResponse.json({ success: res.success }, { status: 200 });
  }catch(error:unknown){
    const message = error instanceof Error ? error.message : "Eroare necunoscuta";
    return NextResponse.json({error: message}, {status: 500});
  }
}