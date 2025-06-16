import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speedcheap",
  description: "The faster we move, the less it's all worth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
