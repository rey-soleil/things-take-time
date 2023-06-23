import { Roboto, Roboto_Slab } from "next/font/google";
import Link from "next/link";
import Provider from "../../components/Provider";
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

const roboto_slab = Roboto_Slab({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-roboto-slab",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${roboto.variable} ${roboto_slab.variable}`}>
      <Provider>
        <body className="bg-[#F2F2F2]">
          <header className="flex w-screen justify-center py-10">
            <h1 className="text-4xl font-bold italic text-gray-500 md:text-5xl">
              <Link href="/">things take time</Link>
            </h1>
          </header>
          {children}
        </body>
      </Provider>
    </html>
  );
}
