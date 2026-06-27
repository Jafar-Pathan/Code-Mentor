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
    const { code, language } = await request.json();

    if (!code || !language) {
      return NextResponse.json({ error: "Code and language are required" }, { status: 400 });
    }

    const zai = await getZAI();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "assistant",
          content: `You are an expert code reviewer. Analyze code for bugs, performance issues, readability, security vulnerabilities, and best practices. Always suggest improvements with refactored code.

Respond in markdown format with these sections:
## Overall Assessment
Brief summary of code quality (1-2 sentences)

## Issues Found
For each issue:
- **Severity**: Critical/Warning/Info
- **Category**: Bug/Performance/Readability/Security
- **Description**: What's wrong
- **Suggestion**: How to fix it

## Complexity Analysis
- Time Complexity: O(?)
- Space Complexity: O(?)
- Cyclomatic Complexity: Rating (Low/Medium/High)

## Refactored Code
\`\`\`${language}
// Improved version
\`\`\`

## Key Improvements
Numbered list of main improvements made.`
        },
        { role: "user", content: `Review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`` },
      ],
      thinking: { type: "disabled" },
    });

    const review = completion.choices[0]?.message?.content;
    return NextResponse.json({ review });
  } catch (error) {
    console.error("Review API error:", error);
    return NextResponse.json(
      { error: "Failed to review code. Please try again." },
      { status: 500 }
    );
  }
}