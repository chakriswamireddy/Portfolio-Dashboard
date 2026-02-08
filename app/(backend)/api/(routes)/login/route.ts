import { NextResponse } from "next/server";
import { db } from "../../drizzle/setup";
import { users } from "../../models/user";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword)
    const user = await db.select().from(users).where( eq(users.email, email) );   

    if (user.length === 0) {
      return NextResponse.json(
        { error: "User Not Found" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (! passwordMatch) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }


    const response = NextResponse.json({
      success: true
    });

    response.cookies.set({
      name: "userId",
      value: user[0].id,
      httpOnly: true,
      path: "/",
      sameSite: "lax"
    });

    return response;

  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
