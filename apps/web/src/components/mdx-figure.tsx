import Image from "next/image";

interface MdxFigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export default function MdxFigure({
  src,
  alt,
  caption,
  width = 800,
  height = 500,
}: MdxFigureProps) {
  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-xl border border-amber-200/40 shadow-md">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto object-cover"
          sizes="(max-width: 768px) 100vw, 66vw"
          quality={80}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-slate-500 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}