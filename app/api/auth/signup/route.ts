import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import validator from "validator";
import bcrypt from "bcryptjs";

export async function POST( req : NextRequest) {
  try{
    const body = await req.json();
    const {email, password, name} = body;

    if(!email || typeof email !== 'string' || !password || typeof password !== 'string' || !name || typeof name!== 'string')
    {
      return NextResponse.json({error: "Date necesare"},{status: 400});
    }

    const normalizedEmail = email.toLowerCase().trim();

    if(!validator.isEmail(normalizedEmail)){
      return NextResponse.json({error: "Te rog introdu o adresa de email valida"},{status: 400});
    }

    if(password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password))
    {
      return NextResponse.json({error: "Parola trebuie sa aiba cel putin 8 caractere, o litera mare si un numar"},{status: 400});
    }

    const existingUser = await db.user.findUnique({
      where: {email: email},
    });

    if(existingUser){
      return NextResponse.json({error: "Utilizatorul exista deja"},{status: 409});
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await db.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
        emailVerified: new Date(),
      },
    });

    return NextResponse.json({message: "Utilizator creat cu succes", user: {
      id: newUser.id,
      email: newUser.email,
    }}, {status: 201});

  }catch(error : unknown){
    if(error instanceof Error){
      return NextResponse.json({error: error.message}, {status: 500});
    }
    return NextResponse.json({error: "Eroare necunoscuta"}, {status: 500});
  }
}