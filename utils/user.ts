import {db} from "@/lib/prisma";

export async function getUserByEmail(email: string) {
  try {
    const lowerCaseEmail = email.toLowerCase();
    const user = await db.user.findUnique({
      where: { email: lowerCaseEmail },
    });
    return user;
  }catch (error) {
    return null;
  }
}