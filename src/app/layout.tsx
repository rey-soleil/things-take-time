import NavBar from "components/NavBar";
import { Roboto, Roboto_Slab } from "next/font/google";
import Provider from "../../components/Provider";
import "./globals.css";
import { NAVBAR_HEIGHT } from "./utils";

export const metadata = {
  title: "things take time",
  description: "a web app for tracking how you spend your time",
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
    <html lang="en" className={`${roboto.variable} ${roboto_slab.variable} h-full`}>
      <Provider>
        <body className='h-full'>
          <div className={`bg-[#F2F2F2] h-full pb-[${NAVBAR_HEIGHT}] overflow-y-auto`}>
            {children}
          </div>
          <NavBar />
        </body>
      </Provider>
    </html >
  );
}
