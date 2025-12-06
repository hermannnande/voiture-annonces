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

  const textColor = variant === 'light' ? 'text-white' : 'text-navy-900';
  const accentColor = variant === 'light' ? 'text-accent-400' : 'text-accent-500';

  return (
    <Link href="/" className="flex items-center space-x-2 group">
      {/* Icône de voiture stylisée */}
      <div className={`${sizeClasses[size]} aspect-square relative`}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Carrosserie */}
          <path
            d="M12 32L16 22H48L52 32V44C52 46.2 50.2 48 48 48H16C13.8 48 12 46.2 12 44V32Z"
            className={variant === 'light' ? 'fill-white' : 'fill-accent-500'}
          />
          {/* Toit */}
          <path
            d="M20 22L24 14H40L44 22H20Z"
            className={variant === 'light' ? 'fill-white opacity-80' : 'fill-accent-600'}
          />
          {/* Roue gauche */}
          <circle cx="22" cy="46" r="6" className={variant === 'light' ? 'fill-navy-900' : 'fill-navy-800'} />
          <circle cx="22" cy="46" r="3" className={variant === 'light' ? 'fill-white' : 'fill-accent-400'} />
          {/* Roue droite */}
          <circle cx="42" cy="46" r="6" className={variant === 'light' ? 'fill-navy-900' : 'fill-navy-800'} />
          <circle cx="42" cy="46" r="3" className={variant === 'light' ? 'fill-white' : 'fill-accent-400'} />
          {/* Fenêtres */}
          <path
            d="M22 20L25 15H39L42 20H22Z"
            className={variant === 'light' ? 'fill-navy-900 opacity-30' : 'fill-navy-600 opacity-40'}
          />
          {/* Phare */}
          <circle cx="50" cy="32" r="2" className={variant === 'light' ? 'fill-accent-400' : 'fill-white'} />
        </svg>
      </div>

      {/* Texte du logo */}
      {showText && (
        <div className="hidden sm:flex flex-col leading-tight">
          <span className={`text-lg font-bold ${textColor} group-hover:${accentColor} transition-colors`}>
            Annonce<span className={accentColor}>Auto</span>.ci
          </span>
          <span className={`text-[10px] ${variant === 'light' ? 'text-white/70' : 'text-gray-600'} -mt-1`}>
            La plateforme auto des particuliers
          </span>
        </div>
      )}
    </Link>
  );
}

