// StudyBuddy secure AI tutor backend (Node.js 18+)
import express from "express";
import OpenAI from "openai";
const app = express();
const port = process.env.PORT || 3000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
app.use(express.json({ limit: "20kb" }));
app.use(express.static("."));
app.post("/api/tutor", async (req, res) => {
  const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
  if (!question || question.length > 1500) return res.status(400).json({ error: "Please enter a question under 1,500 characters." });
  try {
    const result = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions: "You are StudyBuddy, a friendly GCSE revision tutor. Explain concepts clearly at GCSE level, use short sections and examples, encourage the student to think, and create practice questions when asked. Be honest when uncertain. Do not claim your answer is an official exam-board mark scheme.",
      input: question,
      max_output_tokens: 700
    });
    res.json({ answer: result.output_text });
  } catch (error) {
    console.error("AI tutor request failed:", error.message);
    res.status(500).json({ error: "The AI tutor couldn't answer just now. Please try again." });
  }
});
app.listen(port, () => console.log(`StudyBuddy running at http://localhost:${port}`));
