import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Speed is cheap",
  description: "The faster we move, the less it's all worth",
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
    <html lang="en" className="light">
      <head>
        <link
          rel="icon"
          href="/favicon.ico"
          sizes="16x16"
          type="image/x-icon"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
