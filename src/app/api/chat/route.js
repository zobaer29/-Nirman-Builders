import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are Nirman Builders' AI assistant on the company website.
You help visitors in Bangladesh with residential and commercial construction questions:
cost estimates (BDT), timelines, materials, design ideas, and how to start a project.
Be friendly, concise, and practical. If you lack details, ask one short clarifying question.
Do not invent specific project names from their portfolio unless the user mentions them.`;

function getFallbackReply(userText) {
  const text = userText.toLowerCase();

  if (
    text.includes("villa") ||
    text.includes("banani") ||
    text.includes("bedroom") ||
    text.includes("estimate") ||
    text.includes("cost") ||
    text.includes("price")
  ) {
    return (
      "For a premium 3-bedroom villa in Banani (~2,500 sqft), a rough estimate is typically " +
      "৳1.2Cr–৳1.8Cr depending on finishes, structure type, and interior spec. " +
      "Share your plot size and target finish level (standard / premium / luxury) and I can narrow that range. " +
      "Would you like a breakdown for structure, MEP, and interiors?"
    );
  }

  if (
    text.includes("material") ||
    text.includes("cement") ||
    text.includes("tmt") ||
    text.includes("brick")
  ) {
    return (
      "We typically specify graded TMT bars, OPC/PPC cement per structural engineer approval, " +
      "and quality bricks or blocks based on soil and design. Material choice affects both cost and durability. " +
      "What type of project are you planning—residential, commercial, or renovation?"
    );
  }

  if (
    text.includes("time") ||
    text.includes("timeline") ||
    text.includes("how long") ||
    text.includes("duration")
  ) {
    return (
      "A mid-size residential build often takes 12–18 months from design approval to handover, " +
      "depending on approvals, weather, and finish complexity. " +
      "Tell me your approximate built-up area and I can suggest a realistic phase-wise timeline."
    );
  }

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey")
  ) {
    return (
      "Hello! I'm the Nirman AI assistant. Ask me about project estimates, materials, timelines, " +
      "or how to get started with your build."
    );
  }

  return (
    "Thanks for your question. Nirman Builders handles residential, commercial, and renovation work across Bangladesh. " +
    "For a useful answer, share your location, approximate size (sqft), and project type. " +
    "I can help with rough cost ranges, timelines, and next steps to book a consultation."
  );
}

/** Gemini history must start with a user turn; skip UI-only welcome message. */
function buildGeminiHistory(messages) {
  const turns = messages.filter(
    (m) => m.role === "user" || m.role === "assistant"
  );

  let start = 0;
  while (start < turns.length && turns[start].role === "assistant") {
    start += 1;
  }

  const sliced = turns.slice(start);
  if (sliced.length === 0) return { history: [], lastMessage: "" };

  const last = sliced[sliced.length - 1];
  const prior = sliced.slice(0, -1);

  const history = prior.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  return {
    history,
    lastMessage: last.role === "user" ? last.content : "",
  };
}

async function getGeminiReply(messages) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  const { history, lastMessage } = buildGeminiHistory(messages);
  if (!lastMessage.trim()) return null;

  const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_PROMPT,
  });

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(lastMessage);
  return result.response.text()?.trim() || null;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const messages = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser?.content?.trim()) {
      return Response.json({ error: "No user message found" }, { status: 400 });
    }

    let reply = null;
    let source = "fallback";
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return Response.json(
        {
          error:
            "GEMINI_API_KEY is missing. Add it to .env and restart the dev server.",
        },
        { status: 503 }
      );
    }

    try {
      reply = await getGeminiReply(messages);
      if (reply) source = "gemini";
    } catch (err) {
      console.error("Gemini error:", err.message);
      if (err.message?.includes("429") || err.status === 429) {
        return Response.json(
          {
            error:
              "Gemini rate limit reached. Wait a minute and try again, or check billing in Google AI Studio.",
          },
          { status: 429 }
        );
      }
    }

    if (!reply) {
      reply = getFallbackReply(lastUser.content);
      source = "fallback";
    }

    return Response.json({ reply, source });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
