import "./globals.css";
import React from "react";
import Providers from "./providers";

export const metadata = {
  title: "Ping Pong Game",
  description: "Ping Pong Game Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
