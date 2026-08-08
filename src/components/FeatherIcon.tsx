export function FeatherIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 20c8-1 12-6 16-14 0 0-5 2-8 6-3-4-8-8-8-8z" />
      <path d="M4 20c2-4 6-8 10-10" />
    </svg>
  );
}
