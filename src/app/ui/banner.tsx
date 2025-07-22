

interface BannerProps {
    text ?: string;
}

export default function Banner({ text }: BannerProps) {
  return (
    <div className=" bg-sky-500 w-full text-foreground px-4 py-3">
      <h2 className="flex justify-center text-sm">
        <a href="#" className="group">
           {text || "مرحبًا بكم في متجر المانجا الإلكتروني"}
         
        </a>
      </h2>
    </div>
  )
}
