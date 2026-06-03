import { NextResponse } from "next/server"

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:5000/api/simulacion/ejecutar"

export async function POST(request: Request) {
  try {
    const requestBody = await request.json()

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend responded with status ${response.status}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown backend error"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
