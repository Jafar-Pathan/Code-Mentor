/**
 * Prompt Injection Defense
 * Sanitizes user input before it reaches the LLM prompt.
 * Layers: character stripping, pattern detection, length capping, context isolation.
 */

// Known injection attack patterns
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)/i,
  /forget\s+(all\s+)?(your|the|previous|above)/i,
  /disregard\s+(all\s+)?(your|the|previous|instructions)/i,
  /you\s+are\s+now/i,
  /new\s+instructions?\s*:/i,
  /system\s*:/i,
  /\[INST\]|<\|im_start\|>|<\|im_end\|>/i, // LLaMA/ChatML tokens
  /<\|system\|>/i,
  /\\boxed\{/i,
  /jailbreak/i,
  /DAN\s*(\d*\.?\d*)/i, // "DAN" prompts
  /pretend\s+(you\s+are|to\s+be)/i,
  /act\s+as\s+(if|a|an)/i,
  /roleplay\s+as/i,
  /persona\s*:/i,
  /you\s+are\s+a\s+(helpful|evil|malicious|unfiltered|unrestricted)/i,
  /bypass\s+(safety|filter|restriction)/i,
  /override\s+(safety|filter|restriction|security)/i,
  /do\s+not\s+follow/i,
  /break\s+out\s+of/i,
  /escape\s+(your|the)\s+(instructions|rules|constraints)/i,
  /hidden\s+(prompt|instruction|command)/i,
  /simulate\s+(a\s+)?(conversation|dialogue|chat)/i,
  /output\s+(the\s+)?(following|this)/i,
  /repeat\s+(the\s+)?(following|this|above)/i,
  /translate.*?to\s+(malicious|evil|harmful)/i,
  /translate.*?the\s+(above|following)/i,
];

/**
 * Detects if input likely contains a prompt injection attempt.
 * Returns { safe: false, reason: string } if injection detected.
 */
export function detectPromptInjection(
  input: string
): { safe: true } | { safe: false; reason: string } {
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return {
        safe: false,
        reason: `Input matches a known injection pattern`,
      };
    }
  }
  return { safe: true };
}

/**
 * Sanitizes user input for safe inclusion in prompts.
 * - Strips control characters
 * - Normalizes whitespace
 * - Caps length
 * - Wraps in defensive framing
 */
export function sanitizePromptInput(
  input: string,
  maxLen: number = 2000
): string {
  // Remove control characters except newline, tab
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Normalize whitespace (but keep single newlines)
  sanitized = sanitized.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n");

  // Trim and cap length
  sanitized = sanitized.trim().slice(0, maxLen);

  return sanitized;
}

/**
 * Builds a safely-framed user message block.
 * Wraps the user content in XML-like tags to create clear boundaries.
 */
export function frameUserContent(content: string, label: string = "user_message"): string {
  const sanitized = sanitizePromptInput(content);
  return `<${label}>
${sanitized}
</${label}>`;
}

/**
 * Builds the topic context safely — escapes and truncates.
 */
export function safeTopicContext(topic: string): string {
  const sanitized = sanitizePromptInput(topic, 100);
  return `The student is currently studying: ${sanitized}. Focus your explanations on this topic, but answer any programming questions they ask.`;
}

/**
 * Hallucination detection hints to append to system prompts.
 * Instructs the LLM to self-check and provide source attribution.
 */
export const HALLUCINATION_GUARD = `

IMPORTANT — Accuracy & Hallucination Prevention:
- Only state facts you are confident about. If unsure, say "I'm not 100% certain, but..." and explain your confidence level.
- Never fabricate code that doesn't exist (e.g., fictional library methods, nonexistent APIs).
- When explaining concepts, use widely-accepted definitions. If there are multiple valid perspectives, mention that.
- For specific API/language details, prefer giving general guidance over claiming exact syntax you're not sure about.
- If the user asks about a topic outside your training data, acknowledge the limitation honestly.
- When providing code examples, ensure they are syntactically correct and would actually compile/run.
- Do not invent benchmark numbers, performance metrics, or version-specific details unless certain.
- Attribute general knowledge; don't claim proprietary information.`;

/**
 * Post-response hallucination check — flags suspicious patterns in LLM output.
 * This is a heuristic, not definitive.
 */
export function flagSuspiciousResponse(response: string): {
  suspicious: boolean;
  flags: string[];
} {
  const flags: string[] = [];

  // Check for fabricated URLs
  if (/https?:\/\/[a-z0-9-]+\.(example|fake|dummy|placeholder)\.com/i.test(response)) {
    flags.push("Contains placeholder/fake URLs");
  }

  // Check for extremely confident claims about very specific numbers
  if (/(?:exactly|precisely)\s+\d{4,}/i.test(response)) {
    flags.push("Contains suspiciously precise numbers");
  }

  // Check for code that claims to be from a specific library but looks fabricated
  if (/(?:import|from)\s+['"](?:fake|nonexistent|madeup)['"]/i.test(response)) {
    flags.push("References nonexistent modules");
  }

  // Check for contradictory statements (simple heuristic)
  const sentences = response.split(/[.!?]\s+/);
  const lower = sentences.map((s) => s.toLowerCase());
  for (let i = 0; i < lower.length - 1; i++) {
    for (let j = i + 1; j < Math.min(i + 5, lower.length); j++) {
      if (lower[i] === lower[j] && lower[i].length > 50) {
        flags.push("Contains near-duplicate sentences");
        break;
      }
    }
    if (flags.length > 0) break;
  }

  return {
    suspicious: flags.length > 0,
    flags,
  };
}
