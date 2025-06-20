import { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Speed is cheap",
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
    <html lang="en" className="h-full">
      <body className="antialiased h-full m-0 p-0 overflow-hidden">
        {children}
      </body>
    </html>
  );
}
