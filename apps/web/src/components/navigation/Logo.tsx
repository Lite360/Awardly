import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  light?: boolean;
}

export default function Logo({ className = '', light = false }: LogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-3 group ${className}`} aria-label="Awardly Home">
      {/* Brand Emblem */}
      <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          <rect x="5" y="5" width="90" height="90" rx="24" fill="#007A4D" />
          <rect x="9" y="9" width="82" height="82" rx="20" fill="none" stroke="#EBF700" strokeWidth="3" opacity="0.7" />
          {/* Trophy emblem */}
          <path
            d="M32 30 C32 25, 68 25, 68 30 C68 35, 58 45, 58 55 C58 65, 68 70, 68 75 C68 78, 32 78, 32 75 C32 70, 42 65, 42 55 C42 45, 32 35, 32 30 Z"
            fill="#EBF700"
          />
          <path d="M35 30 L45 55 L35 75 M65 30 L55 55 L65 75 M42 30 L48 55 L42 75 M58 30 L52 55 L58 75" stroke="#007A4D" strokeWidth="2.5" fill="none" />
          <ellipse cx="50" cy="30" rx="18" ry="5" fill="#FFFFFF" opacity="0.9" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-display font-extrabold text-lg leading-none tracking-tight ${light ? 'text-white' : 'text-[#0B2B1B]'}`}>
          Awardly
        </span>
        <span className="text-[10px] text-[#007A4D] font-bold tracking-widest uppercase mt-0.5">
          Awards 2026
        </span>
      </div>
    </Link>
  );
}
