import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

// Helper to construct the system prompt based on user profile
function buildSystemPrompt(profile: any, action: string) {
  let complexity = "";
  if (profile.level === "Beginner") {
    complexity = "Use very simple language, analogies, and short sentences. Avoid jargon entirely. Explain as if speaking to a 10-year-old.";
  } else if (profile.level === "Intermediate") {
    complexity = "Use standard terminology but explain clearly. Provide structured explanations and step-by-step reasoning.";
  } else if (profile.level === "Advanced") {
    complexity = "Provide deep technical dives, complex challenges, and real-world applications. Do not hold back on advanced terminology.";
  }

  const baseLanguage = profile.language || "English";
  let prompt = `You are EduBridge AI, a friendly, patient, and highly encouraging AI tutor specifically designed for underserved students. 
Your student's name is ${profile.name}. 
They are learning ${profile.subject} at a ${profile.level} level.

CRITICAL REQUIREMENT: You MUST respond entirely in ${baseLanguage}.

CORE INSTRUCTIONS:
1. ${complexity}
2. BE ENCOURAGING: Always validate their effort and use a warm, supportive tone (e.g., "Great question!", "You're doing awesome!").
3. NEVER be judgmental.
4. BE CONCISE: Do not output massive walls of text. Break down explanations into small, digestible chunks.
5. AFTER EXPLAINING a new concept, ALWAYS ask 1 or 2 short, simple questions (a mini-quiz) to check their understanding before moving on.
6. If they struggle with the quiz, gently correct them and try explaining it in a slightly different, simpler way.
7. Use Markdown for formatting (bolding key terms, using bullet points, etc).`;

  if (action === "career") {
    prompt += `\n\nSPECIAL REQUEST: The user just asked for CAREER GUIDANCE. Please ignore normal tutoring for this response and instead:
    - Suggest 3 real-world, accessible career paths related to ${profile.subject}.
    - Explain simply how what they are learning applies to these jobs.
    - End with a highly motivating statement.`;
  }

  return prompt;
}

export async function POST(req: Request) {
  try {
    const { messages, profile, action } = await req.json();

    if (!profile) {
      return NextResponse.json({ error: "Profile missing" }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(profile, action);
    
    // Inject system prompt at the beginning
    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    // Check if real API key is present
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'dummy_key') {
      // Mock mode fallback for Hackathon if no key
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      
      const lastUserMsg = messages[messages.length - 1].content.toLowerCase();
      let mockReply = `That's a great question about **${profile.subject}**, ${profile.name}! `;
      
      if (profile.level === "Beginner") {
         mockReply += "\n\nSince you're a beginner, think of it like this: it's like learning to ride a bike. Let's start with training wheels.\n\n* **Step 1:** Balance\n* **Step 2:** Pedal\n\n### Quick Quiz\nDo you want to try a practice question about this?";
      } else {
         mockReply += "\n\nLet's dive deeper into that. Here is a step-by-step breakdown...\n\n### Application\nNow, how would you apply this to a real-world problem?";
      }

      if (action === "career") {
        mockReply = `Here are 3 great careers using **${profile.subject}**:\n1. **Teacher:** Share your knowledge.\n2. **Analyst:** Use facts to make decisions.\n3. **Engineer:** Build the future.\n\nYou have what it takes!`;
      }

      return NextResponse.json({ reply: mockReply });
    }

    // Initialize Groq here to ensure it uses the latest process.env value
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: apiMessages,
      model: "llama-3.1-8b-instant", // Updated to the current supported model
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't process that right now.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process chat request";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
