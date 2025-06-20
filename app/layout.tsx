import { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Speed is Cheap",
  description: "The faster we move, the less it all means",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
