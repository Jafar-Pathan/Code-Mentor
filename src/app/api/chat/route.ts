import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

const SYSTEM_PROMPT = `You are CodeMentor AI, an expert programming tutor. Your role is to help students learn programming through clear, patient, and adaptive teaching.

Guidelines:
- Explain concepts step by step with concrete examples
- When explaining code, always provide well-commented examples
- Use analogies to make complex topics accessible
- If a student makes a mistake, gently guide them to the correct answer
- Adjust difficulty based on the student's questions
- Cover: Data Structures, Algorithms, Java, Python, JavaScript, SQL, System Design, and Interview Preparation
- Format code with proper syntax highlighting using markdown code blocks
- Be concise but thorough

When responding, use markdown formatting for:
- Code blocks with language tags: \`\`\`java, \`\`\`python, \`\`\`javascript, \`\`\`sql
- Bold for key terms
- Numbered lists for step-by-step explanations
- Tables for comparisons`;

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, topic } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const zai = await getZAI();

    const systemContent = topic
      ? `${SYSTEM_PROMPT}\n\nThe student is currently studying: ${topic}. Focus your explanations on this topic.`
      : SYSTEM_PROMPT;

    const chatMessages = [
      { role: "assistant" as const, content: systemContent },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const completion = await zai.chat.completions.create({
      messages: chatMessages,
      thinking: { type: "disabled" },
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process your message. Please try again." },
      { status: 500 }
    );
  }
}