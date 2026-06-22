"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "internee_genai_tutor_progress_v2";

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop",
  html: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&auto=format&fit=crop",
  css: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&auto=format&fit=crop",
  js: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop",
  next: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop",
  ai: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop",
};

const MODULES = [
  {
    id: "html",
    title: "HTML Basics",
    level: "Beginner",
    image: IMAGES.html,
    lessons: ["Tags", "Forms", "Tables", "Semantic HTML"],
  },
  {
    id: "css",
    title: "CSS Styling",
    level: "Beginner",
    image: IMAGES.css,
    lessons: ["Selectors", "Flexbox", "Grid", "Responsive Design"],
  },
  {
    id: "js",
    title: "JavaScript",
    level: "Intermediate",
    image: IMAGES.js,
    lessons: ["Variables", "Functions", "DOM", "Async JS"],
  },
  {
    id: "next",
    title: "Next.js",
    level: "Intermediate",
    image: IMAGES.next,
    lessons: ["Routing", "Components", "API Routes", "Deployment"],
  },
];

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

export default function Page() {
  const [selectedModuleId, setSelectedModuleId] = useState("html");
  const [completed, setCompleted] = useState({});
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([
    {
      id: createId(),
      role: "ai",
      text: "Welcome! I am your personalized GenAI Tutor. Select a module, complete lessons, and ask me anything.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const selectedModule = useMemo(() => {
    return MODULES.find((module) => module.id === selectedModuleId) || MODULES[0];
  }, [selectedModuleId]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCompleted(JSON.parse(saved));
      }
    } catch {
      setCompleted({});
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch {
      console.error("Progress could not be saved.");
    }
  }, [completed]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const totalLessons = useMemo(() => {
    return MODULES.reduce((total, module) => total + module.lessons.length, 0);
  }, []);

  const completedCount = useMemo(() => {
    return Object.values(completed).filter(Boolean).length;
  }, [completed]);

  const progress = useMemo(() => {
    if (totalLessons === 0) return 0;
    return Math.round((completedCount / totalLessons) * 100);
  }, [completedCount, totalLessons]);

  const weakAreas = useMemo(() => {
    const areas = [];

    MODULES.forEach((module) => {
      module.lessons.forEach((lesson) => {
        const key = `${module.id}-${lesson}`;
        if (!completed[key]) {
          areas.push(`${module.title}: ${lesson}`);
        }
      });
    });

    return areas.slice(0, 5);
  }, [completed]);

  const moduleCompletedLessons = useMemo(() => {
    return selectedModule.lessons.filter(
      (lesson) => completed[`${selectedModule.id}-${lesson}`]
    ).length;
  }, [completed, selectedModule]);

  const lessonPlan = useMemo(() => {
    const unfinished = selectedModule.lessons.filter(
      (lesson) => !completed[`${selectedModule.id}-${lesson}`]
    );

    if (unfinished.length === 0) {
      return `Excellent work! You completed ${selectedModule.title}. Now build a mini project and revise your weak areas.`;
    }

    return `Today, focus on "${unfinished[0]}". First understand the concept, then practice one example, then build a small real-world task.`;
  }, [completed, selectedModule]);

  const toggleLesson = useCallback((moduleId, lesson) => {
    const key = `${moduleId}-${lesson}`;

    setCompleted((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const generateTutorAnswer = useCallback(
    (userQuestion) => {
      return `Great question!

Module: ${selectedModule.title}
Your question: "${userQuestion}"

Simple explanation:
Start by understanding the basic concept first. Then write a small example and connect it with a real project task.

Recommended steps:
1. Read the topic.
2. Practice one small example.
3. Build a mini feature.
4. Check your mistakes.
5. Mark the lesson as complete.

Your current progress is ${progress}%.

Weak areas to improve:
${weakAreas.length ? weakAreas.map((area) => `• ${area}`).join("\n") : "No weak areas found. Great job!"}

Mini task:
Create a small project section using this topic and explain it in your own words.`;
    },
    [progress, selectedModule.title, weakAreas]
  );

  const askTutor = useCallback(async () => {
    const cleanQuestion = question.trim();

    if (!cleanQuestion || loading) return;

    setQuestion("");
    setLoading(true);

    setChat((prev) => [
      ...prev,
      {
        id: createId(),
        role: "user",
        text: cleanQuestion,
      },
    ]);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const answer = generateTutorAnswer(cleanQuestion);

      setChat((prev) => [
        ...prev,
        {
          id: createId(),
          role: "ai",
          text: answer,
        },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        {
          id: createId(),
          role: "ai",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [generateTutorAnswer, loading, question]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter") {
        askTutor();
      }
    },
    [askTutor]
  );

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div>
          <p style={styles.badge}>Internee.pk Learning Platform</p>
          <h1 style={styles.title}>Personalized GenAI Tutor</h1>
          <p style={styles.subtitle}>
            A smart learning assistant that creates lesson plans, answers
            questions, tracks progress, and identifies weak areas.
          </p>

          <div style={styles.stats}>
            <div style={styles.statBox}>
              <strong>{progress}%</strong>
              <span>Progress</span>
            </div>

            <div style={styles.statBox}>
              <strong>{completedCount}</strong>
              <span>Completed</span>
            </div>

            <div style={styles.statBox}>
              <strong>{totalLessons}</strong>
              <span>Total Lessons</span>
            </div>
          </div>
        </div>

        <img src={IMAGES.hero} alt="AI tutor guidance" style={styles.heroImage} />
      </section>

      <section style={styles.layout}>
        <aside style={styles.panel}>
          <h2 style={styles.heading}>Modules</h2>

          {MODULES.map((module) => {
            const active = module.id === selectedModuleId;

            return (
              <button
                key={module.id}
                type="button"
                onClick={() => setSelectedModuleId(module.id)}
                style={{
                  ...styles.moduleButton,
                  ...(active ? styles.activeModule : styles.inactiveModule),
                }}
              >
                <span>{module.title}</span>
                <small>{module.level}</small>
              </button>
            );
          })}
        </aside>

        <section style={styles.panel}>
          <img
            src={selectedModule.image}
            alt={selectedModule.title}
            style={styles.moduleImage}
          />

          <div style={styles.moduleHeader}>
            <div>
              <h2 style={styles.heading}>{selectedModule.title}</h2>
              <p style={styles.muted}>
                {moduleCompletedLessons} of {selectedModule.lessons.length} lessons completed
              </p>
            </div>

            <span style={styles.level}>{selectedModule.level}</span>
          </div>

          <div style={styles.planBox}>
            <strong>Dynamic Lesson Plan</strong>
            <p>{lessonPlan}</p>
          </div>

          <h3 style={styles.smallHeading}>Lessons</h3>

          {selectedModule.lessons.map((lesson) => {
            const key = `${selectedModule.id}-${lesson}`;
            const checked = Boolean(completed[key]);

            return (
              <label key={key} style={styles.lesson}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleLesson(selectedModule.id, lesson)}
                />
                <span style={{ textDecoration: checked ? "line-through" : "none" }}>
                  {lesson}
                </span>
              </label>
            );
          })}
        </section>

        <aside style={styles.panel}>
          <h2 style={styles.heading}>Performance</h2>

          <div style={styles.progressOuter}>
            <div style={{ ...styles.progressInner, width: `${progress}%` }}>
              {progress}%
            </div>
          </div>

          <h3 style={styles.smallHeading}>Weak Areas</h3>

          {weakAreas.length === 0 ? (
            <p style={styles.success}>No weak areas. Excellent work!</p>
          ) : (
            weakAreas.map((area) => (
              <p key={area} style={styles.weak}>
                ⚠ {area}
              </p>
            ))
          )}

          <img src={IMAGES.ai} alt="AI learning assistant" style={styles.moduleImage} />
        </aside>
      </section>

      <section style={styles.chatPanel}>
        <h2 style={styles.heading}>Ask AI Tutor</h2>

        <div style={styles.chatBox}>
          {chat.map((message) => (
            <div
              key={message.id}
              style={{
                ...styles.message,
                ...(message.role === "user" ? styles.userMessage : styles.aiMessage),
              }}
            >
              {message.text}
            </div>
          ))}

          {loading && <div style={{ ...styles.message, ...styles.aiMessage }}>Thinking...</div>}
          <div ref={chatEndRef} />
        </div>

        <div style={styles.inputRow}>
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about HTML, CSS, JavaScript, Next.js..."
            style={styles.input}
          />

          <button
            type="button"
            onClick={askTutor}
            disabled={loading}
            style={{
              ...styles.askButton,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Wait..." : "Ask"}
          </button>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: 24,
    background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
    color: "#111827",
    fontFamily: "Inter, Arial, sans-serif",
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
    alignItems: "center",
    background: "white",
    padding: 28,
    borderRadius: 24,
    boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
    marginBottom: 24,
  },
  badge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: 999,
    background: "#e0e7ff",
    color: "#3730a3",
    fontWeight: 700,
    marginBottom: 12,
  },
  title: {
    fontSize: "clamp(32px, 5vw, 56px)",
    lineHeight: 1,
    margin: "0 0 14px",
  },
  subtitle: {
    fontSize: 18,
    color: "#4b5563",
    lineHeight: 1.7,
    maxWidth: 650,
  },
  heroImage: {
    width: "100%",
    height: 300,
    objectFit: "cover",
    borderRadius: 22,
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginTop: 24,
  },
  statBox: {
    background: "#f8fafc",
    padding: 16,
    borderRadius: 16,
    textAlign: "center",
    border: "1px solid #e5e7eb",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
  },
  panel: {
    background: "white",
    padding: 22,
    borderRadius: 22,
    boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
  },
  heading: {
    margin: "0 0 16px",
    fontSize: 24,
  },
  smallHeading: {
    marginTop: 20,
    marginBottom: 12,
  },
  moduleButton: {
    width: "100%",
    border: "none",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    fontWeight: 800,
  },
  activeModule: {
    background: "#111827",
    color: "white",
  },
  inactiveModule: {
    background: "#f3f4f6",
    color: "#111827",
  },
  moduleImage: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    borderRadius: 18,
    marginBottom: 18,
  },
  moduleHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  muted: {
    color: "#6b7280",
    marginTop: -8,
  },
  level: {
    padding: "8px 12px",
    borderRadius: 999,
    background: "#dcfce7",
    color: "#166534",
    fontWeight: 800,
    fontSize: 13,
  },
  planBox: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    padding: 16,
    borderRadius: 16,
    lineHeight: 1.7,
  },
  lesson: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    background: "#f9fafb",
    marginBottom: 10,
    cursor: "pointer",
  },
  progressOuter: {
    height: 34,
    background: "#e5e7eb",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressInner: {
    height: "100%",
    background: "linear-gradient(90deg, #22c55e, #16a34a)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    transition: "width 0.3s ease",
  },
  weak: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: 12,
    borderRadius: 12,
    fontWeight: 700,
  },
  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: 12,
    borderRadius: 12,
    fontWeight: 700,
  },
  chatPanel: {
    marginTop: 24,
    background: "white",
    padding: 22,
    borderRadius: 22,
    boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
  },
  chatBox: {
    height: 340,
    overflowY: "auto",
    background: "#f8fafc",
    padding: 16,
    borderRadius: 18,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    border: "1px solid #e5e7eb",
  },
  message: {
    maxWidth: "82%",
    padding: 14,
    borderRadius: 16,
    lineHeight: 1.6,
    whiteSpace: "pre-line",
  },
  userMessage: {
    alignSelf: "flex-end",
    background: "#2563eb",
    color: "white",
  },
  aiMessage: {
    alignSelf: "flex-start",
    background: "white",
    color: "#111827",
    border: "1px solid #e5e7eb",
  },
  inputRow: {
    display: "flex",
    gap: 12,
    marginTop: 14,
  },
  input: {
    flex: 1,
    padding: 15,
    borderRadius: 14,
    border: "1px solid #d1d5db",
    fontSize: 16,
    outline: "none",
  },
  askButton: {
    padding: "0 26px",
    border: "none",
    borderRadius: 14,
    background: "#111827",
    color: "white",
    fontWeight: 900,
    fontSize: 16,
  },
};