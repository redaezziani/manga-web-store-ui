import Navbar from "@/app/ui/header";
import "./globals.css";
import Banner from "./ui/banner";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      className="flex w-full flex-col relative min-h-screen justify-start items-center"
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
