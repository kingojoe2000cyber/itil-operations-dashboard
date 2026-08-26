import type { Metadata } from "next";
import { DigitalLightCursor } from "@/components/digital-light-cursor";
import "./globals.css";

const repositoryName = (process.env.GITHUB_REPOSITORY ?? "").split("/")[1] ?? "";
const githubIconPrefix =
  process.env.GITHUB_PAGES === "true" &&
  repositoryName &&
  !repositoryName.endsWith(".github.io")
    ? `/${repositoryName}`
    : "";

export const metadata: Metadata = {
  title: "Richmond Kwadwo Sarpong — ITIL Operations Command Center",
  description:
    "Richmond Kwadwo Sarpong’s connected ITIL operations dashboard with 75 working resources, professional portfolio, searchable glossary, download center and offline knowledge assistant.",
  icons: {
    icon: `${githubIconPrefix}/favicon.svg`,
    shortcut: `${githubIconPrefix}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="codex-preview" content="development" />
      </head>
      <body className="min-h-screen bg-[#081320] antialiased">
        <DigitalLightCursor />
        {children}
      </body>
    </html>
  );
}
