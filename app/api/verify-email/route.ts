import { NextResponse } from "next/server";
import { newVerification } from "@/utils/new-verification";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body?.token === "string" ? body.token : "";

    if (!token) {
      return NextResponse.json({ error: "Token invalid" }, { status: 400 });
    }

    const result = await newVerification(token);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: result.success }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Eroare necunoscuta";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
