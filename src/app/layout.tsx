import "./globals.css";

export const metadata = {
  title: "the next right thing",
  description: "created by rey barceló",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
