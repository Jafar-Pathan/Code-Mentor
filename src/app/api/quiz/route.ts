import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export async function POST(request: NextRequest) {
  try {
    const { category, difficulty, count = 5 } = await request.json();

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    const zai = await getZAI();

    const prompt = `Generate ${count} multiple-choice quiz questions about ${category} programming topic at ${difficulty || "medium"} difficulty level.

Respond with valid JSON only in this exact format, no other text:
{
  "title": "Quiz title",
  "questions": [
    {
      "id": "unique-id-1",
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Detailed explanation of why the correct answer is right and others are wrong",
      "codeSnippet": "optional code snippet in markdown format"
    }
  ]
}

Make questions challenging but fair. Include code snippets where relevant. Each question must have exactly 4 options with one correct answer (correctIndex 0-3).`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: "You are a quiz generator for programming education. Generate high-quality, accurate multiple-choice questions." },
        { role: "user", content: prompt },
      ],
      thinking: { type: "disabled" },
    });

    let response = completion.choices[0]?.message?.content || "";
    
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      response = jsonMatch[0];
    }

    const quiz = JSON.parse(response);
    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Quiz API error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz. Please try again." },
      { status: 500 }
    );
  }
}
