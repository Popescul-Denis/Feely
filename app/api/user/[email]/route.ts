import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserByEmail } from "@utils/user";

export async function GET(request: NextRequest, { params }: { params: Promise<{ email: string }> }){
  try{
    const session = await getServerSession(authOptions);
    if(!session?.user?.email) {
      return NextResponse.json({error: "Neautorizat"},{status: 401});
    }

    const { email } = await params;
    if (!email) {
      return NextResponse.json({error: "Email lipsa"}, {status: 400});
    }

    const user = await getUserByEmail(email);

    if(!user){
      return NextResponse.json({error: "Utilizatorul nu a fost gasit"},{status: 404});
    }
    return NextResponse.json({user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    }}, {status: 200});
  }catch(error : unknown){
    const message = error instanceof Error ? error.message : 'Eroare necunoscuta';
    return NextResponse.json({error: message}, {status: 500});
  }
}