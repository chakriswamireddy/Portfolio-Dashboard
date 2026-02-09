import { NextResponse } from "next/server";
 

export async function POST(req: Request) {
  try {

    const response = NextResponse.json({
      success: true
    });

    response.cookies.set({
      name: "userId",
      value: "",
      path: "/",
      expires: new Date(0),
    });

    response.cookies.set({
      name: "userName",
      value: "",
      path: "/",
      expires: new Date(0),
    });
 
    return response;

  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
