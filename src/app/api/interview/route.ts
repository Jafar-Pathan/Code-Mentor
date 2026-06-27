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
    const { type, topic, count = 5 } = await request.json();

    const zai = await getZAI();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "assistant",
          content: `You are a senior technical interviewer at a top tech company. Generate realistic interview questions.
          
Respond with valid JSON only:
{
  "title": "Interview: Topic",
  "questions": [
    {
      "id": "q1",
      "question": "The full question",
      "type": "${type || "coding"}",
      "difficulty": "medium",
      "hints": ["Hint 1", "Hint 2"],
      "timeLimit": 30,
      "followUps": ["Follow-up question 1"]
    }
  ]
}`
        },
        {
          role: "user",
          content: `Generate ${count} ${type || "coding"} interview questions about ${topic || "Data Structures and Algorithms"}.
          
For coding questions: include practical problems with clear input/output expectations.
For behavioral questions: use STAR method framework.
For system design: cover scalability, trade-offs, and real-world constraints.

Difficulty should range from medium to hard. Each question should have 2-3 hints and appropriate time limits (20-45 minutes).`
        },
      ],
      thinking: { type: "disabled" },
    });

    let response = completion.choices[0]?.message?.content || "";
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      response = jsonMatch[0];
    }

    const interview = JSON.parse(response);
    return NextResponse.json(interview);
  } catch (error) {
    console.error("Interview API error:", error);
    return NextResponse.json(
      { error: "Failed to generate interview. Please try again." },
      { status: 500 }
    );
  }
}