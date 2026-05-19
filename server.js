import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { fileURLToPath } from "url";
import lessons from "./data/lessons.js";
import foundation from "./data/foundation.js";
import flashcards from "./data/flashcards.js";
import challenges from "./data/challenges.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("pages/home", { title: "Salvation Trainer", lessons });
});

app.get("/foundation", (req, res) => {
  res.render("pages/foundation", { title: "Foundation: Why the Bible?", foundation });
});

app.get("/lessons", (req, res) => {
  res.render("pages/lessons", { title: "Lessons", lessons });
});

app.get("/lesson/:id", (req, res) => {
  const lesson = lessons.find(l => String(l.id) === String(req.params.id));
  if (!lesson) return res.status(404).render("pages/404", { title: "Lesson Not Found" });
  res.render("pages/lesson", { title: lesson.title, lesson });
});

app.get("/flashcards", (req, res) => {
  res.render("pages/flashcards", { title: "Flashcards", flashcards });
});

app.get("/essay", (req, res) => {
  res.render("pages/essay", { title: "Essay Scaffold" });
});

app.get("/challenge", (req, res) => {
  res.render("pages/challenge", { title: "Challenge Training", challenges });
});

app.get("/teacher", (req, res) => {
  res.render("pages/teacher", { title: "Teacher Dashboard", lessons });
});

app.get("/videos", (req, res) => {
  res.render("pages/videos", { title: "Video Lessons", lessons });
});

app.get("/reflection", (req, res) => {
  res.render("pages/student-reflection", {
    title: "Student Reflection"
  });
});


app.get("/api/lessons", (req, res) => res.json(lessons));
app.get("/api/foundation", (req, res) => res.json(foundation));
app.get("/api/flashcards", (req, res) => res.json(flashcards));
app.get("/api/challenges", (req, res) => res.json(challenges));

app.use((req, res) => {
  res.status(404).render("pages/404", { title: "Page Not Found" });
});

app.listen(PORT, () => {
  console.log(`Salvation Trainer running on http://localhost:${PORT}`);
});
