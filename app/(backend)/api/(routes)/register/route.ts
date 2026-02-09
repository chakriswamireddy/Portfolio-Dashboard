import { NextResponse } from "next/server";
import { db } from "../../drizzle/setup";
import { users } from "../../models/user";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const user = await db.select().from(users).where(eq(users.email, email));

    if (user.length !== 0) {
      return NextResponse.json(
        { error: "User Already Exists" },
        { status: 403 }
      );
    }

    const newUser = await db.insert(users).values({
      email,
      password: await bcrypt.hash(password, 10),
      name
    }).returning();


    const response = NextResponse.json({
      success: true
    });

    response.cookies.set({
      name: "userId",
      value: newUser[0].id,
      httpOnly: true,
      path: "/",
      sameSite: "lax"
    });

    if (!newUser[0].name) return response;

    response.cookies.set({
      name: "userName",
      value: newUser[0].name,
      httpOnly: true,
      path: "/",
      sameSite: "lax"
    });


    return response;

  } catch (e) {
    return NextResponse.json(
      { msg: "Invalid request",
        error : e
       },
      { status: 400 },

    );
  }
}
