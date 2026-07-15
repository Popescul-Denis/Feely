import { NextResponse } from "next/server";
import { checkCode } from "@utils/reset-password";

export async function POST(req: Request){
  try{
    const body = await req.json();
    const {userCode} = body;

    if (!userCode || typeof userCode !== 'string') {
      return NextResponse.json(
        { error: "Codul este necesar" },
        { status: 400 }
      );
    }

    if (userCode.length !== 6) {
      return NextResponse.json(
        { error: "Codul trebuie să aibă 6 cifre" },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(userCode)) {
      return NextResponse.json(
        { error: "Codul trebuie să conțină doar cifre" },
        { status: 400 }
      );
    }

    const res = await checkCode(userCode);

    if(res.error) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }

    return NextResponse.json({ success: res.success }, { status: 200 });
  }catch(error:unknown){
    const message = error instanceof Error ? error.message : "Eroare necunoscuta";
    return NextResponse.json({error: message}, {status: 500});
  }
}