import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@components/ComponentBars/Navbar";
import Footer from "@components/ComponentBars/Footer";
import Provider from "@components/Provider/Provider";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Feely",
  description: "Impartaseste-ti trairile, gandurile, sentimentele si experientele intr-un jurnal propriu sau cu un AI care te poate intelege si sustine.",
};

const RootLayout = ({
  children,
}: Readonly<{ children: React.ReactNode;}>) => {
  return (
    <html
      lang="en"
    >
      <body className="min-h-full flex flex-col">
        <Provider>
          <Navbar />
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}

export default RootLayout;
