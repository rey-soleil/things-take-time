import { Roboto } from "next/font/google";
import Provider from "./components/Provider";
import "./globals.css";

export const metadata = {
  title: "the next right thing",
  description: "created by rey barceló",
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${roboto.variable}`}>
      <Provider>
        <body>{children}</body>
      </Provider>
    </html>
  );
}
