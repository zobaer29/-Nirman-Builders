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

async function getOpenAIReply(messages) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || "OpenAI request failed");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
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

    try {
      reply = await getOpenAIReply(messages);
    } catch (err) {
      console.error("OpenAI error:", err.message);
    }

    if (!reply) {
      reply = getFallbackReply(lastUser.content);
    }

    return Response.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
