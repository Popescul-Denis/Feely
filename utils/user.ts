import {db} from "@/lib/prisma";

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });
    return user;
  }catch (error) {
    console.error("Eroare la obținerea utilizatorului:", error);
    throw new Error("Eroare la obținerea utilizatorului");
  }
}