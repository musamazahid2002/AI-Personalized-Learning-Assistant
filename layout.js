import "./globals.css";

export const metadata = {
  title: "AI Personalized Learning Assistant",
  description: "A personalized AI tutor dashboard for learning progress, weak-area tracking, and lesson planning."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
