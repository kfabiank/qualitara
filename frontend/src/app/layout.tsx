import "./globals.css";

export const metadata = {
  title: "Staff Fullstack Interview",
  description: "Next.js + Node/Express API",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
