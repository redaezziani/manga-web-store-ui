import Navbar from "@/app/ui/header";
import "./globals.css";
import Banner from "./ui/banner";
import SmoothScrolling from "./ui/smooth-scroll";



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
        <SmoothScrolling>
        {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}
