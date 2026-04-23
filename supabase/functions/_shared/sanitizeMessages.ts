/**
 * Sanitizes a message array for the Anthropic Messages API.
 *
 * - Trims leading assistant turns (API requires user-first)
 * - Merges consecutive same-role messages (API rejects them)
 * - Caps total message count to avoid oversized payloads
 */

export interface Message {
  role: string;
  content: string;
}

export function sanitizeMessages(messages: Message[], maxMessages = 20): Message[] {
  // Drop leading assistant turns
  let start = 0;
  while (start < messages.length && messages[start].role === "assistant") {
    start++;
  }
  const trimmed = messages.slice(start, start + maxMessages);

  if (trimmed.length === 0) return [];

  // Merge consecutive same-role messages
  const merged: Message[] = [];
  for (const msg of trimmed) {
    const last = merged[merged.length - 1];
    if (last && last.role === msg.role) {
      last.content += "\n" + msg.content;
    } else {
      merged.push({ role: msg.role, content: msg.content });
    }
  }

  return merged;
}
