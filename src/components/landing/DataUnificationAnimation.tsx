import { useEffect, useRef, useState } from "react";
import { Heart, FileSpreadsheet, Activity, Circle, TrendingUp } from "lucide-react";

export const DataUnificationAnimation = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const sectionTop = rect.top;
      const windowHeight = window.innerHeight;

      // Calculate progress: 0 when section enters viewport, 1 when it leaves
      const startScroll = windowHeight - sectionTop;
      const progress = Math.max(0, Math.min(1, startScroll / (sectionHeight + windowHeight)));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logos = [
    { 
      id: 'oura', 
      icon: Circle, 
      color: 'bg-blue-600',
      startX: 15,
      startY: 10,
      name: 'Oura'
    },
    { 
      id: 'excel', 
      icon: FileSpreadsheet, 
      color: 'bg-green-600',
      startX: 85,
      startY: 10,
      name: 'Excel'
    },
    { 
      id: 'health', 
      icon: Heart, 
      color: 'bg-red-500',
      startX: 10,
      startY: 75,
      name: 'Apple Health'
    },
    { 
      id: 'whoop', 
      icon: Activity, 
      color: 'bg-gray-900',
      startX: 35,
      startY: 80,
      name: 'Whoop'
    },
    { 
      id: 'strava', 
      icon: TrendingUp, 
      color: 'bg-orange-500',
      startX: 90,
      startY: 75,
      name: 'Strava'
    },
  ];

  const getLogoPosition = (logo: typeof logos[0]) => {
    const centerX = 50;
    const centerY = 50;
    
    const currentX = logo.startX + (centerX - logo.startX) * scrollProgress;
    const currentY = logo.startY + (centerY - logo.startY) * scrollProgress;
    const scale = 1 - (scrollProgress * 0.5);
    const opacity = 1 - (scrollProgress * 0.9);
    
    return {
      left: `${currentX}%`,
      top: `${currentY}%`,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity,
    };
  };

  return (
    <div 
      ref={sectionRef}
      className="relative h-[600px] flex items-center justify-center overflow-hidden"
    >
      <div className="relative w-full h-full">
        {/* Scattered Logos */}
        {logos.map((logo) => {
          const Icon = logo.icon;
          const position = getLogoPosition(logo);
          
          return (
            <div
              key={logo.id}
              className="absolute"
              style={position}
            >
              <div className={`${logo.color} rounded-2xl p-4 md:p-6 shadow-2xl`}>
                <Icon className="h-12 w-12 md:h-16 md:w-16 text-white" strokeWidth={1.5} />
              </div>
              <p 
                className="text-xs md:text-sm text-muted-foreground text-center mt-2 font-medium whitespace-nowrap"
                style={{ opacity: position.opacity }}
              >
                {logo.name}
              </p>
            </div>
          );
        })}

        {/* Center Health Vault Logo */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            opacity: Math.min(1, scrollProgress * 2),
            transform: `translate(-50%, -50%) scale(${0.75 + scrollProgress * 0.25})`,
          }}
        >
          <div className="relative">
            <div 
              className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150"
              style={{ opacity: scrollProgress }}
            />
            <div className="relative bg-background border-2 border-foreground rounded-full px-8 md:px-12 py-4 md:py-6 shadow-2xl">
              <h2 className="text-2xl md:text-4xl font-bold whitespace-nowrap">Health Vault</h2>
            </div>
          </div>
        </div>

        {/* Subtitle after animation */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center px-4"
          style={{
            opacity: Math.max(0, (scrollProgress - 0.3) * 2),
            transform: `translate(-50%, ${(1 - scrollProgress) * 30}px)`,
          }}
        >
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            All your health data, unified in one secure place
          </p>
        </div>

        {/* Connection lines effect */}
        {scrollProgress > 0.5 && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-px h-24 bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0"
                style={{
                  transform: `rotate(${i * 30}deg) translateY(-150px)`,
                  opacity: (scrollProgress - 0.5) * 2,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
