export function FishIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M2 12c0 0 4-6 10-6s10 6 10 6-4 6-10 6S2 12 2 12z" opacity="0.15" />
      <path
        d="M21 12c-1.5 2-4 4-7 4.5-1 .2-2 .2-3 0-3-.5-5.5-2.5-7-4.5 1.5-2 4-3.5 7-4 1-.1 2-.1 3 0 3 .5 5.5 2 7 4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M21 12l2-1.5v3L21 12z" fill="currentColor" stroke="none" />
      <circle cx="8" cy="11.5" r="1" />
    </svg>
  );
}
