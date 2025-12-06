import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ variant = 'dark', showText = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-11',
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-gray-800';
  const accentColor = variant === 'light' ? 'text-accent-400' : 'text-accent-500';

  return (
    <Link href="/" className="flex items-center space-x-2 group">
      {/* Icône de voiture - Style mobile moderne */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Fond du logo */}
          <rect width="40" height="40" rx="8" className={variant === 'light' ? 'fill-white/10' : 'fill-gray-100'} />
          
          {/* Icône voiture simplifiée */}
          <g transform="translate(8, 12)">
            {/* Carrosserie */}
            <path
              d="M2 8L3.5 4H20.5L22 8V14C22 14.5 21.5 15 21 15H3C2.5 15 2 14.5 2 14V8Z"
              className={variant === 'light' ? 'fill-white' : 'fill-accent-500'}
            />
            {/* Toit */}
            <path
              d="M5 4L6.5 1H17.5L19 4H5Z"
              className={variant === 'light' ? 'fill-white opacity-80' : 'fill-accent-600'}
            />
            {/* Roues */}
            <circle cx="7" cy="15" r="2" className={variant === 'light' ? 'fill-gray-700' : 'fill-gray-800'} />
            <circle cx="17" cy="15" r="2" className={variant === 'light' ? 'fill-gray-700' : 'fill-gray-800'} />
            {/* Fenêtre */}
            <rect x="6" y="2" width="12" height="2" rx="0.5" className={variant === 'light' ? 'fill-blue-300 opacity-40' : 'fill-blue-400 opacity-30'} />
          </g>
        </svg>
      </div>

      {/* Texte du logo */}
      {showText && (
        <div className="flex items-center">
          <span className={`text-xl font-bold ${textColor}`}>
            Annonce<span className={accentColor}>Auto</span><span className={textColor}>.ci</span>
          </span>
        </div>
      )}
    </Link>
  );
}

