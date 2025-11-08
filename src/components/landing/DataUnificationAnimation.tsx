import { useEffect, useRef, useState } from "react";
import { Heart, FileSpreadsheet, Activity, Circle, TrendingUp } from "lucide-react";

export const DataUnificationAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isAnimating) {
            setIsAnimating(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isAnimating]);

  const logos = [
    { 
      id: 'oura', 
      icon: Circle, 
      color: 'bg-blue-600',
      initialPosition: 'top-8 left-12',
      name: 'Oura'
    },
    { 
      id: 'excel', 
      icon: FileSpreadsheet, 
      color: 'bg-green-600',
      initialPosition: 'top-8 right-12',
      name: 'Excel'
    },
    { 
      id: 'health', 
      icon: Heart, 
      color: 'bg-red-500',
      initialPosition: 'bottom-16 left-16',
      name: 'Apple Health'
    },
    { 
      id: 'whoop', 
      icon: Activity, 
      color: 'bg-gray-900',
      initialPosition: 'bottom-24 left-1/2 -translate-x-32',
      name: 'Whoop'
    },
    { 
      id: 'strava', 
      icon: TrendingUp, 
      color: 'bg-orange-500',
      initialPosition: 'bottom-16 right-16',
      name: 'Strava'
    },
  ];

  return (
    <div 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background py-32"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="relative w-full max-w-7xl mx-auto px-6">
        {/* Scattered Logos */}
        <div className="relative h-[600px]">
          {logos.map((logo) => {
            const Icon = logo.icon;
            return (
              <div
                key={logo.id}
                className={`absolute ${logo.initialPosition} transition-all duration-1000 ease-out ${
                  isAnimating 
                    ? 'opacity-0 scale-50 !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2' 
                    : 'opacity-100 scale-100'
                }`}
              >
                <div className={`${logo.color} rounded-3xl p-6 shadow-2xl transform hover:scale-110 transition-transform`}>
                  <Icon className="h-16 w-16 text-white" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-muted-foreground text-center mt-3 font-medium">{logo.name}</p>
              </div>
            );
          })}

          {/* Center Health Vault Logo */}
          <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 delay-500 ${
              isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
              <div className="relative bg-background border-2 border-foreground rounded-full px-12 py-6 shadow-2xl">
                <h2 className="text-4xl font-bold whitespace-nowrap">Health Vault</h2>
              </div>
            </div>
          </div>

          {/* Title */}
          <div 
            className={`absolute top-0 left-1/2 -translate-x-1/2 text-center transition-all duration-700 ${
              isAnimating ? 'opacity-0 -translate-y-8' : 'opacity-100 translate-y-0'
            }`}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4">Our Data Lives In Silos</h2>
          </div>

          {/* Subtitle after animation */}
          <div 
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 text-center transition-all duration-700 delay-1000 ${
              isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-xl text-muted-foreground max-w-2xl">
              All your health data, unified in one secure place
            </p>
          </div>
        </div>
      </div>

      {/* Connection lines effect */}
      {isAnimating && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-px h-32 bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0"
              style={{
                transform: `rotate(${i * 18}deg) translateY(-200px)`,
                animation: 'pulse 2s ease-in-out infinite',
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
