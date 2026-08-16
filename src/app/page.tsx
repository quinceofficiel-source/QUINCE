import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-black px-8">
      <Image
        src="/splash-logo.png"
        alt="Quince"
        width={228}
        height={277}
        priority
        className="h-auto w-[min(46vw,240px)]"
      />
    </div>
  );
}
