

interface BannerProps {
    text ?: string;
}

export default function Banner({ text }: BannerProps) {
  return (
    <div className=" bg-rose-500 w-full text-foreground px-4 py-3">
      <p className="flex justify-center text-sm">
        <a href="#" className="group">
           {text || "مرحبًا بكم في متجر المانجا الإلكتروني"}
         
        </a>
      </p>
    </div>
  )
}
