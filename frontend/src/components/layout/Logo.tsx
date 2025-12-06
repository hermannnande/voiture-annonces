import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ variant = 'dark', showText = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-gray-800';
  const accentColor = variant === 'light' ? 'text-accent-400' : 'text-accent-500';

  return (
    <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2 group">
      {/* Logo "Aac" - Style moderne avec lettres */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center flex-shrink-0 rounded-lg bg-gradient-to-br ${variant === 'light' ? 'from-white/20 to-white/10' : 'from-accent-500 to-accent-600'} shadow-md`}>
        <span className={`font-black ${textSizeClasses[size]} ${variant === 'light' ? 'text-white' : 'text-white'}`} style={{ letterSpacing: '-1px' }}>
          Aac
        </span>
      </div>

      {/* Texte du logo - Masqué sur très petit écran */}
      {showText && (
        <div className="hidden sm:flex items-center">
          <span className={`text-lg md:text-xl font-bold ${textColor} whitespace-nowrap`}>
            Annonce<span className={accentColor}>Auto</span><span className={textColor}>.ci</span>
          </span>
        </div>
      )}
    </Link>
  );
}

