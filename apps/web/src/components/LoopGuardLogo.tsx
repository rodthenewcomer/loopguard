interface LoopGuardLogoProps {
  className?: string;
  markClassName?: string;
  size?: number;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

export default function LoopGuardLogo({
  className = '',
  markClassName = '',
  size = 32,
  showWordmark = false,
  wordmarkClassName = '',
}: LoopGuardLogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`.trim()}>
      <svg
        width={size}
        height={Math.round(size * 0.58)}
        viewBox="0 0 132 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={markClassName}
        aria-hidden="true"
      >
        <path
          d="M10 38C18 23 28 14 40 14C54 14 62 24 72 38C82 52 90 62 104 62C116 62 124 54 124 38"
          stroke="rgba(255,255,255,0.24)"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 38C18 53 28 62 40 62C54 62 62 52 72 38C82 24 90 14 104 14C116 14 124 22 124 38"
          stroke="rgba(255,255,255,0.24)"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 38C18 23 28 14 40 14C54 14 62 24 72 38C82 52 90 62 104 62C116 62 124 54 124 38"
          stroke="white"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 38C18 53 28 62 40 62C54 62 62 52 72 38C82 24 90 14 104 14C116 14 124 22 124 38"
          stroke="white"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark && (
        <span className={wordmarkClassName || 'font-bold tracking-tight text-white'}>
          LoopGuard
        </span>
      )}
    </span>
  );
}
