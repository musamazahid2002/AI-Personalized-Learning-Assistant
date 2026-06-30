"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  GraduationCap,
  Lightbulb,
  MessageCircle,
  Rocket,
  Send,
  Target,
  TriangleAlert,
  TrendingUp,
} from "lucide-react";

const STORAGE_KEY = "interneeTutorProgress";

const modules = [
  {
    id: "html",
    title: "HTML Basics",
    icon: "🟧",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200",
    lessons: ["Tags", "Forms", "Tables", "Semantic HTML"],
  },
  {
    id: "css",
    title: "CSS Styling",
    icon: "🎨",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200",
    lessons: ["Selectors", "Flexbox", "Grid", "Responsive Design"],
  },
  {
    id: "js",
    title: "JavaScript",
    icon: "🟨",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200",
    lessons: ["Variables", "Functions", "DOM", "Async JS"],
  },
  {
    id: "next",
    title: "Next.js",
    icon: "⚫",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200",
    lessons: ["Routing", "Components", "API Routes", "Deployment"],
  },
];

const features = [
  {
    title: "Dynamic Lesson Plans",
    icon: CalendarDays,
  },
  {
    title: "AI-Powered Answers",
    icon: MessageCircle,
  },
  {
    title: "Track Progress",
    icon: TrendingUp,
  },
  {
    title: "Identify Weak Areas",
    icon: TriangleAlert,
  },
];

export default function PersonalizedTutor() {
  const [selectedModule, setSelectedModule] = useState(modules[0]);
  const [completed, setCompleted] = useState({});
  const [weakAreas, setWeakAreas] = useState(["JavaScript Async", "CSS Grid"]);
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([
    {
      role: "ai",
      text: "Hi intern! I am your GenAI Tutor. Select a module, complete lessons, and ask me questions.",
    },
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCompleted(JSON.parse(saved));
    } catch {
      setCompleted({});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const totalLessons = modules.reduce((sum, item) => sum + item.lessons.length, 0);

  const completedLessons = Object.values(completed).filter(Boolean).length;

  const progress = useMemo(() => {
    return Math.round((completedLessons / totalLessons) * 100);
  }, [completedLessons, totalLessons]);

  const lessonPlan = useMemo(() => {
    const unfinished = selectedModule.lessons.filter(
      (lesson) => !completed[`${selectedModule.id}-${lesson}`]
    );

    if (unfinished.length === 0) {
      return `Excellent! You completed ${selectedModule.title}. Now revise weak areas and build a mini project.`;
    }

    return `Today’s plan for ${selectedModule.title}: Study ${unfinished[0]}, practice it, then complete a small task.`;
  }, [completed, selectedModule]);

  function toggleLesson(moduleId, lesson) {
    const key = `${moduleId}-${lesson}`;

    setCompleted((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    setWeakAreas((prev) =>
      prev.filter((area) => !area.toLowerCase().includes(lesson.toLowerCase()))
    );
  }

  function askTutor() {
    if (!question.trim()) return;

    const userQuestion = question.trim();
    setQuestion("");

    setChat((prev) => [...prev, { role: "user", text: userQuestion }]);

    const answer = `You asked: "${userQuestion}"

For ${selectedModule.title}, follow this method:

1. Understand the topic in simple words.
2. Practice one small example.
3. Build a mini task.
4. Review your mistakes.

Current weak areas: ${weakAreas.length ? weakAreas.join(", ") : "No weak areas detected"}.

Example:
If you are learning Forms, create a login form with name, email, password, and submit button.`;

    setTimeout(() => {
      setChat((prev) => [...prev, { role: "ai", text: answer }]);
    }, 500);
  }

  return (
    <main className="min-h-screen bg-[#f7f9fd] p-4 text-slate-950 md:p-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-white to-blue-100 shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_520px] lg:p-8">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
                <GraduationCap size={36} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                  Personalized GenAI Tutor
                </h1>
              </div>
            </div>

            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              A smart tutor that creates dynamic lesson plans, answers intern
              questions, tracks progress, and identifies weak areas.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-sm font-bold">{feature.title}</h3>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative hidden items-end justify-center lg:flex">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200"
              alt="AI tutor hero"
              className="h-72 w-full rounded-3xl object-cover shadow-md"
            />

            <div className="absolute right-6 top-6 rounded-2xl bg-white px-5 py-4 text-center text-sm font-black shadow-lg">
              Let's
              <br />
              learn together!
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[360px_1fr_440px]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 flex items-center gap-3 text-xl font-black">
            <BookOpen className="text-indigo-600" />
            Learning Modules
          </h2>

          <div className="space-y-3">
            {modules.map((module) => {
              const active = selectedModule.id === module.id;

              return (
                <button
                  key={module.id}
                  onClick={() => setSelectedModule(module)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left font-bold transition ${
                    active
                      ? "border-slate-900 bg-slate-950 text-white shadow-lg"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span className="text-3xl">{module.icon}</span>
                    {module.title}
                  </span>
                  <ChevronRight size={20} />
                </button>
              );
            })}
          </div>

          <div className="mt-12 rounded-2xl bg-violet-50 p-5">
            <p className="flex items-center gap-2 font-black text-violet-800">
              <Rocket size={22} />
              Keep learning, keep growing!
            </p>
            <p className="mt-2 text-sm font-medium text-slate-700">
              You're doing great! 🚀
            </p>
          </div>
        </aside>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 flex items-center gap-3 text-2xl font-black">
            <span className="text-4xl">{selectedModule.icon}</span>
            {selectedModule.title}
          </h2>

          <img
            src={selectedModule.image}
            alt={selectedModule.title}
            className="h-44 w-full rounded-2xl object-cover"
          />

          <div className="mt-5">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-black">
              <CalendarDays className="text-indigo-600" />
              Dynamic Lesson Plan
            </h3>

            <p className="rounded-2xl bg-violet-50 p-5 leading-8 text-slate-700">
              {lessonPlan}
            </p>
          </div>

          <div className="mt-5">
            <h3 className="mb-3 text-lg font-black">Lessons</h3>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              {selectedModule.lessons.map((lesson) => {
                const key = `${selectedModule.id}-${lesson}`;
                const checked = Boolean(completed[key]);

                return (
                  <label
                    key={lesson}
                    className="flex cursor-pointer items-center justify-between border-b border-slate-200 px-4 py-4 last:border-b-0 hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-4 font-semibold">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleLesson(selectedModule.id, lesson)}
                        className="h-5 w-5 accent-indigo-600"
                      />
                      {lesson}
                    </span>

                    {checked ? (
                      <Check className="text-emerald-500" size={20} />
                    ) : (
                      <BookOpen className="text-indigo-500" size={20} />
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-6 flex items-center gap-3 text-xl font-black">
            <TrendingUp className="text-blue-500" />
            Progress Tracker
          </h2>

          <div className="flex items-center gap-6">
            <div
              className="grid h-28 w-28 place-items-center rounded-full"
              style={{
                background: `conic-gradient(#22c55e ${progress * 3.6}deg, #e5e7eb 0deg)`,
              }}
            >
              <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-2xl font-black">
                {progress}%
              </div>
            </div>

            <div>
              <p className="font-black">Overall Progress</p>
              <p className="mt-2 text-sm text-slate-600">
                {completedLessons} / {totalLessons} Lessons Completed
              </p>
              <p className="mt-2 text-sm font-bold text-emerald-600">
                Great job! Keep it up!
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black">
              <Target className="text-red-500" />
              Weak Areas
            </h3>

            <div className="space-y-3">
              {weakAreas.length ? (
                weakAreas.map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700"
                  >
                    <TriangleAlert size={18} />
                    {area}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                  No weak areas detected. Great work!
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black">
              <Lightbulb className="text-yellow-500" />
              Guidance
            </h3>

            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200"
              alt="Guidance"
              className="h-36 w-full rounded-2xl object-cover"
            />
          </div>
        </aside>
      </section>

      <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-5 flex items-center gap-3 text-xl font-black">
          <MessageCircle className="text-indigo-600" />
          Ask AI Tutor
        </h2>

        <div className="flex h-72 flex-col gap-4 overflow-y-auto rounded-2xl bg-slate-50 p-5">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[75%] whitespace-pre-line rounded-2xl px-5 py-3 text-sm leading-7 shadow-sm ${
                msg.role === "user"
                  ? "self-end bg-indigo-600 text-white"
                  : "self-start bg-white text-slate-700"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="mt-4 flex overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askTutor()}
            placeholder="Ask about HTML, CSS, JavaScript, Next.js..."
            className="flex-1 px-5 py-4 outline-none"
          />

          <button
            onClick={askTutor}
            className="flex items-center gap-2 bg-indigo-600 px-8 py-4 font-black text-white transition hover:bg-indigo-700"
          >
            Ask
            <Send size={18} />
          </button>
        </div>
      </section>
    </main>
  );
}