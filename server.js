import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import { PROVIDERS } from "./utils/providers.js";

// Load environment variables from .env file
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.APP_PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "dist")));

app.post("/api/ask-ai", async (req, res) => {
  const { prompt, html, previousPrompt, provider } = req.body;
  if (!prompt) {
    return res.status(400).send({
      ok: false,
      message: "Missing required fields",
    });
  }

  // Set up response headers for streaming
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let systemPrompt = `ONLY USE HTML, CSS AND JAVASCRIPT. No explanations, ONLY CODE. If you want to use ICON make sure to import the library first. Try to create the best UI possible by using only HTML, CSS and JAVASCRIPT. Use as much as you can TailwindCSS for the CSS, if you can't do something with TailwindCSS, then use custom CSS (make sure to import <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script> in the head). Also, try to ellaborate as much as you can, to create something unique. ALWAYS GIVE THE RESPONSE INTO A SINGLE HTML FILE`;

  let TOKENS_USED = prompt?.length;
  if (previousPrompt) TOKENS_USED += previousPrompt.length;
  if (html) TOKENS_USED += html.length;

  const DEFAULT_PROVIDER = PROVIDERS.openrouter;
  const selectedProvider =
    provider === "auto"
      ? DEFAULT_PROVIDER
      : PROVIDERS[provider] ?? DEFAULT_PROVIDER;

  if (provider !== "auto" && TOKENS_USED >= selectedProvider.max_tokens) {
    return res.status(400).send({
      ok: false,
      openSelectProvider: true,
      message: `Context is too long. ${selectedProvider.name} allow ${selectedProvider.max_tokens} max tokens.`,
    });
  }

  if (["local", "openrouter"].includes(selectedProvider.id)) {
    try {
      const { ApiKey, ApiUrl, Model } = req.body;
      if (!ApiUrl || !Model) {
        return res.status(400).send({
          ok: false,
          message: "Missing required fields for provider, set API KEY, BASE URL, and MODEL.",
        });
      }
      const response = await fetch(`${ApiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ApiKey}`,
        },
        body: JSON.stringify({
          model: Model,
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            ...(previousPrompt
              ? [
                  {
                    role: "user",
                    content: previousPrompt,
                  },
                ]
              : []),
            ...(html
              ? [
                  {
                    role: "assistant",
                    content: `The current code is: ${html}.`,
                  },
                ]
              : []),
            {
              role: "user",
              content: prompt,
            },
          ],
          stream: true
        })
      });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorBody}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (!line || !line.startsWith('data: ') || line.includes('[DONE]')) continue;

          try {
            if (line.includes('exceeded')) {
              return res.status(402).send({
                ok: false,
                message: line,
              });
            }

            const json = line.slice(6).trim();

            if (!json.startsWith('{')) {
              continue;
            }

            const message = JSON.parse(json);
            const content = message?.choices?.[0]?.delta?.content;

            if (content) {
              res.write(content);
            }
          } catch (e) {
            console.error('Error on line stream:', e.message);
            // continue ao invés de throw, pra não matar tudo por causa de uma linha podre
            continue;
          }
        }

      }
      res.end();
    } catch (error) {
      if (error.message.includes("exceeded")) {
        return res.status(402).send({
          ok: false,
          message: error.message,
        });
      }
      if (!res.headersSent) {
        res.status(500).send({
          ok: false,
          message:
            error.message || "An error occurred while processing your request.",
        });
      } else {
        // Otherwise end the stream
        res.end();
      }
    }
  }
});

app.get("/api/login", (req, res) => {
  res.json({ redirectUrl: "https://huggingface.co/login" });
});

app.get("/api/remix/:user/:repo", async (req, res) => {
  const { user, repo } = req.params;
  // In this stripped down version we simply return a demo HTML.
  const html = `<html><body>Remixed ${user}/${repo}</body></html>`;
  res.json({ ok: true, html, isOwner: true, path: `${user}/${repo}` });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
