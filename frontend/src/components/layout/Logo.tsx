import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ variant = 'dark', showText = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
  };

  return (
    <Link href="/" className="flex items-center group">
      {/* Logo professionnel avec silhouette de voiture et AA */}
      <div className={`${sizeClasses[size]} relative flex items-center flex-shrink-0`}>
        <svg 
          viewBox="0 0 180 60" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-full w-auto"
        >
          {/* Silhouette de voiture */}
          <g transform="translate(10, 15)">
            {/* Carrosserie principale */}
            <path
              d="M5 20 L15 10 L50 8 L80 10 L90 20 L85 25 L5 25 Z"
              fill={variant === 'light' ? 'rgba(255,255,255,0.3)' : 'rgba(209,213,219,0.4)'}
              stroke={variant === 'light' ? 'rgba(255,255,255,0.5)' : 'rgba(156,163,175,0.5)'}
              strokeWidth="1.5"
            />
            {/* Toit */}
            <path
              d="M25 10 L35 3 L60 3 L70 10"
              fill={variant === 'light' ? 'rgba(255,255,255,0.2)' : 'rgba(229,231,235,0.3)'}
              stroke={variant === 'light' ? 'rgba(255,255,255,0.6)' : 'rgba(156,163,175,0.6)'}
              strokeWidth="1.5"
            />
            {/* Roue avant */}
            <ellipse 
              cx="20" 
              cy="25" 
              rx="5" 
              ry="2.5" 
              fill={variant === 'light' ? '#fbbf24' : '#f97316'}
            />
            {/* Roue arrière */}
            <ellipse 
              cx="75" 
              cy="25" 
              rx="5" 
              ry="2.5" 
              fill={variant === 'light' ? '#fbbf24' : '#f97316'}
            />
            {/* Phare */}
            <circle 
              cx="85" 
              cy="18" 
              r="1.5" 
              fill={variant === 'light' ? '#fcd34d' : '#fb923c'}
            />
          </g>

          {/* Lettres AA grandes */}
          <text 
            x="110" 
            y="40" 
            fill={variant === 'light' ? '#ffffff' : '#1f2937'}
            style={{
              fontSize: '38px',
              fontWeight: '900',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            A
          </text>
          <text 
            x="138" 
            y="40" 
            fill={variant === 'light' ? '#fbbf24' : '#f97316'}
            style={{
              fontSize: '38px',
              fontWeight: '900',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            A
          </text>
        </svg>
      </div>

      {/* Texte du logo - Visible sur tablette+ */}
      {showText && (
        <div className="hidden md:flex flex-col ml-1 leading-none">
          <span className={`text-sm font-bold ${variant === 'light' ? 'text-white' : 'text-gray-800'} whitespace-nowrap`}>
            Annonce<span className={variant === 'light' ? 'text-accent-400' : 'text-accent-500'}>Auto</span><span className={variant === 'light' ? 'text-accent-400' : 'text-accent-500'}>.ci</span>
          </span>
        </div>
      )}
    </Link>
  );
}

