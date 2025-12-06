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
    <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2 group">
      {/* Logo simplifié - Lettres AA uniquement */}
      <div className={`${sizeClasses[size]} relative flex items-center flex-shrink-0`}>
        <svg 
          viewBox="0 0 80 60" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-full w-auto"
        >
          {/* Lettres AA grandes */}
          <text 
            x="5" 
            y="45" 
            fill={variant === 'light' ? '#ffffff' : '#1f2937'}
            style={{
              fontSize: '42px',
              fontWeight: '900',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            A
          </text>
          <text 
            x="38" 
            y="45" 
            fill={variant === 'light' ? '#fbbf24' : '#f97316'}
            style={{
              fontSize: '42px',
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
        <div className="hidden sm:flex items-center">
          <span className={`text-base md:text-lg font-bold ${variant === 'light' ? 'text-white' : 'text-gray-800'} whitespace-nowrap`}>
            Annonce<span className={variant === 'light' ? 'text-accent-400' : 'text-accent-500'}>Auto</span><span className={variant === 'light' ? 'text-white' : 'text-gray-800'}>.ci</span>
          </span>
        </div>
      )}
    </Link>
  );
}

