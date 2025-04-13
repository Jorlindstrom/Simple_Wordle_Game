import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Hantera __dirname i ES-moduler
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5080;

// Endpoint för att hämta ett slumpmässigt ord
app.get("/random-word", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "words.json");
    const data = await fs.readFile(filePath, "utf8");
    const words = JSON.parse(data).words;
    const randomWord = words[Math.floor(Math.random() * words.length)];
    res.json({ word: randomWord });
  } catch (err) {
    console.error("Error reading words.json:", err);
    res.status(500).send("Server Error");
  }
});

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
})

app.get("/", (req, res) => {
  res.send("Hello World");
});

// app.get('/api/tasks', (req, res) => {
//     res.json({
//       data: [
//         { label: 'learnHTML', completed: true },
//         { label: 'learnCSS', completed: false },
//         { label: 'learnJS', completed: false },
//         { label: 'learnReact', completed: false },
//       ],
//     });
//   });

// Starta servern
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});