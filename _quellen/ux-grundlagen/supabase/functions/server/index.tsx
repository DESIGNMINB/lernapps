import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import OpenAI from "npm:openai";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-74d94287/health", (c) => {
  return c.json({ status: "ok" });
});

// AI Chat Endpoint
app.post("/make-server-74d94287/chat", async (c) => {
  try {
    const { messages } = await c.req.json();
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    
    if (!apiKey) {
      return c.json({ 
        error: "Configuration Error", 
        message: "Der OpenAI API Key fehlt auf dem Server." 
      }, 500);
    }

    const openai = new OpenAI({ apiKey });
    
    const systemPrompt = `Du bist ein erfahrener, freundlicher UX-Design-Tutor für Studenten.
    Deine Themengebiete sind: Usability Heuristiken (Nielsen), Gestaltpsychologie, ISO Normen (9241), Barrierefreiheit und User Research.
    
    Regeln:
    1. Antworte präzise und hilfreich.
    2. Wenn möglich, gib ein konkretes Beispiel aus dem Web- oder App-Design.
    3. Sei ermutigend ("Das ist eine gute Frage!").
    4. Antworte in der Sprache des Nutzers (Deutsch).
    5. Halte die Antworten eher kurz (max. 3-4 Sätze), außer es wird explizit mehr verlangt.`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      model: "gpt-4o-mini",
    });

    return c.json({ response: completion.choices[0].message.content });
  } catch (error: any) {
    // Check for OpenAI authentication error
    if (error instanceof OpenAI.APIError && error.status === 401) {
       console.error("OpenAI Auth Error: Invalid API Key provided.");
       return c.json({ 
        error: "Authentication Error", 
        message: "Der angegebene API-Key ist ungültig. Bitte prüfen Sie den Key in den Einstellungen." 
      }, 401);
    }

    console.error("Chat error:", error);
    return c.json({ error: "Internal Server Error", message: error.message || "Unbekannter Fehler" }, 500);
  }
});

// AI Quiz Endpoint
app.post("/make-server-74d94287/quiz", async (c) => {
  try {
    const { topic } = await c.req.json();
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    
    if (!apiKey) {
      return c.json({ 
        error: "Configuration Error", 
        message: "Der OpenAI API Key fehlt auf dem Server." 
      }, 500);
    }

    const openai = new OpenAI({ apiKey });
    
    const systemPrompt = `Du bist ein strenger UX-Design-Prüfer.
    Erstelle eine Multiple-Choice-Frage zum Thema "${topic}".
    
    Format: JSON.
    Struktur:
    {
      "question": "Die Frage",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0, // Index der richtigen Antwort (0-3)
      "explanation": "Kurze Erklärung, warum die Antwort richtig ist."
    }
    
    Regeln:
    1. Frage muss fachlich korrekt und anspruchsvoll sein.
    2. Nur EINE richtige Antwort.
    3. Antwort auf Deutsch.
    4. Keine Einleitung, nur das JSON-Objekt.`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Generiere eine neue Frage." }
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("Keine Antwort von OpenAI");
    
    const quizData = JSON.parse(content);
    return c.json(quizData);

  } catch (error: any) {
     if (error instanceof OpenAI.APIError && error.status === 401) {
       console.error("OpenAI Auth Error: Invalid API Key provided.");
       return c.json({ 
        error: "Authentication Error", 
        message: "Der angegebene API-Key ist ungültig." 
      }, 401);
    }
    console.error("Quiz error:", error);
    return c.json({ error: "Internal Server Error", message: error.message || "Unbekannter Fehler" }, 500);
  }
});

Deno.serve(app.fetch);