import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function analyzeEmail(subject, body) {
  const prompt = `
You are an AI email assistant.

Analyze this email.

Subject:
${subject}

Body:
${body}

Return ONLY valid JSON in this exact format:

{
  "summary": "short summary of the email",
  "category": "Important"
}

Category must be exactly one of:
Important, Work, Personal, Promotional, Spam, Other
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
  });

  const text = response.text;

  const cleanText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanText);
}

export async function generateReply(subject, body) {
  const prompt = `
You are an AI email assistant.

Generate a professional and helpful reply to this email.

Subject:
${subject}

Email:
${body}

Rules:
- Keep the reply concise.
- Be polite and professional.
- Do not invent information.
- Return only the email reply.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
  });

  return response.text.trim();
}
