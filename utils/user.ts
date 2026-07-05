import {db} from "@/lib/prisma";

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });
    return user;
  }catch (error : unknown) {
    console.error("Eroare la obținerea utilizatorului:", error);
    throw new Error("Eroare la obținerea utilizatorului");
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });
    return user;
  }catch (error : unknown) {
    console.error("Eroare la obținerea utilizatorului:", error);
    throw new Error("Eroare la obținerea utilizatorului");
  }
}