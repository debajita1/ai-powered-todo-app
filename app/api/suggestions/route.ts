import { NextRequest } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent";

export async function GET(request: NextRequest) {
  try {
    const topic = request.nextUrl.searchParams.get("topic") || "general";

    if (!GEMINI_API_KEY) {
      return Response.json(
        { suggestions: getFallbackSuggestions(topic) },
        { status: 200 }
      );
    }

    const prompt = `Suggest 5 creative and varied todo items related to "${topic}". Do NOT repeat common suggestions. Generate fresh ideas. Return ONLY a JSON array of strings. Example: ["item 1", "item 2", "item 3", "item 4", "item 5"]`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          topP: 0.8,
          topK: 40,
        },
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.error(
        `Gemini API error: ${response.status} ${await response.text()}`
      );
      return Response.json(
        { suggestions: getFallbackSuggestions(topic) },
        { status: 200 }
      );
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const jsonMatch = text.match(/\[[\s\S]*?\]/);
    const suggestions = jsonMatch
      ? (JSON.parse(jsonMatch[0]) as string[])
      : getFallbackSuggestions(topic);

    return Response.json({ suggestions }, { status: 200 });
  } catch (err) {
    console.error("Suggestions API error:", err);
    const topic = request.nextUrl.searchParams.get("topic") || "general";
    return Response.json(
      { suggestions: getFallbackSuggestions(topic) },
      { status: 200 }
    );
  }
}

function getFallbackSuggestions(topic: string): string[] {
  const t = topic.toLowerCase();

  const keywords: Record<string, string[]> = {
    sleep: [
      "Go to bed by 10 PM",
      "No screens 1 hour before sleep",
      "Read a book before bed",
      "Stick to a consistent wake-up time",
      "Try a bedtime meditation",
    ],
    walk: [
      "Walk for 20 minutes outside",
      "Try a new walking route",
      "Walk after lunch for digestion",
      "Track your daily step count",
      "Invite a friend for a walk",
    ],
    cook: [
      "Try one new recipe this week",
      "Meal prep for the next 3 days",
      "Organize your pantry",
      "Learn a new cooking technique",
      "Plan your weekly meals",
    ],
    read: [
      "Read 20 pages of a book",
      "Start a new book in your genre",
      "Join a book club",
      "Write a summary of what you read",
      "Visit the library this week",
    ],
    code: [
      "Solve one coding challenge",
      "Review your last pull request",
      "Refactor a module you wrote",
      "Read about a new framework or tool",
      "Write unit tests for a feature",
    ],
    work: [
      "Complete project report",
      "Reply to pending emails",
      "Prepare for team meeting",
      "Update task tracker",
      "Review code pull requests",
    ],
    health: [
      "Drink 8 glasses of water",
      "Go for a 30-min walk",
      "Meditate for 10 minutes",
      "Eat a balanced meal",
      "Get 7-8 hours of sleep",
    ],
    learn: [
      "Study a new language for 15 min",
      "Watch an educational video",
      "Practice a coding challenge",
      "Read a book chapter",
      "Write down 3 things you learned",
    ],
  };

  const matched = Object.keys(keywords).find((k) => t.includes(k));
  if (matched) return keywords[matched];

  return [
    `Plan your ${topic} goals`,
    `Research best practices for ${topic}`,
    `Spend 30 minutes on ${topic}`,
    `Review your ${topic} progress`,
    `Schedule time for ${topic} tomorrow`,
  ];
}
