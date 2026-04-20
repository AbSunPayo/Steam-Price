import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CounterStrike Price API",
  description: "API sem banco para monitorar skins do Steam Market e alertar no Discord.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
