export default function Loading() {
  return (
    <div className="mx-auto max-w-[1240px] px-4 py-16">
      <div className="h-10 w-64 animate-pulse rounded-full bg-cream-dark" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="aspect-[5/4] animate-pulse rounded-[1.5rem] bg-cream-dark" />
        ))}
      </div>
    </div>
  );
}
