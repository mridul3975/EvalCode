import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, apiKey } = await req.json();

    const keyToUse = apiKey || process.env.GEMINI_API_KEY;

    if (!keyToUse) {
      return NextResponse.json(
        { error: "No Gemini API Key found. Please add GEMINI_API_KEY to .env.local or enter your custom API key in Settings." },
        { status: 400 }
      );
    }

    // Call Google Gemini 2.5 Flash REST Endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${keyToUse}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      return NextResponse.json(
        { error: errData?.error?.message || `Gemini API returned status ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ text: generatedText });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error calling Gemini API" },
      { status: 500 }
    );
  }
}
