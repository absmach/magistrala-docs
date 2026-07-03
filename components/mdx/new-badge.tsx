export function NewBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full bg-fd-primary/10 px-2 py-0.5 text-fd-primary text-xs font-medium leading-none ${className}`}
    >
      New
    </span>
  );
}
