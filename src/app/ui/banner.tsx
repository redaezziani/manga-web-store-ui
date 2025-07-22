"use client";
interface BannerProps {
  text?: string;
}

export default function Banner({ text }: BannerProps) {
  return (
    <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 w-full text-white px-4 py-3 overflow-hidden">
      {/* Shine effect overlay */}
      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/3 animate-[shine_2s_ease-in-out_infinite]" 
           style={{
             animation: 'shine 2s ease-in-out infinite',
             transform: 'skewX(-12deg)',
           }} />
      
      <h2 className="flex justify-center text-sm relative z-10">
        <a href="#" className="group font-medium">
          {text || "مرحبًا بكم في متجر المانجا الإلكتروني"}
        </a>
      </h2>
      
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(300%) skewX(-12deg);
          }
        }
      `}</style>
    </div>
  )
}