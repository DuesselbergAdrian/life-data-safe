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
      startX: 2,
      startY: 5,
      name: 'Oura'
    },
    { 
      id: 'excel', 
      icon: FileSpreadsheet, 
      color: 'bg-green-600',
      startX: 98,
      startY: 5,
      name: 'Excel'
    },
    { 
      id: 'health', 
      icon: Heart, 
      color: 'bg-red-500',
      startX: 2,
      startY: 95,
      name: 'Apple Health'
    },
    { 
      id: 'whoop', 
      icon: Activity, 
      color: 'bg-gray-900',
      startX: 50,
      startY: 98,
      name: 'Whoop'
    },
    { 
      id: 'strava', 
      icon: TrendingUp, 
      color: 'bg-orange-500',
      startX: 98,
      startY: 95,
      name: 'Strava'
    },
  ];

  return (
    <div 
      ref={sectionRef}
      className="relative h-[600px] flex items-center justify-center overflow-hidden"
    >
      <div className="relative w-full h-full">
        {/* Scattered Logos */}
        {logos.map((logo, index) => {
          const Icon = logo.icon;
          
          return (
            <div
              key={logo.id}
              className="absolute transition-all duration-[2000ms] ease-out"
              style={{
                left: isAnimating ? '50%' : `${logo.startX}%`,
                top: isAnimating ? '50%' : `${logo.startY}%`,
                transform: isAnimating 
                  ? 'translate(-50%, -50%) scale(0.3)' 
                  : 'translate(-50%, -50%) scale(1)',
                opacity: isAnimating ? 0 : 1,
                transitionDelay: `${index * 150}ms`,
              }}
            >
              <div className={`${logo.color} rounded-2xl p-4 md:p-6 shadow-2xl`}>
                <Icon className="h-12 w-12 md:h-16 md:w-16 text-white" strokeWidth={1.5} />
              </div>
              <p 
                className="text-xs md:text-sm text-muted-foreground text-center mt-2 font-medium whitespace-nowrap"
              >
                {logo.name}
              </p>
            </div>
          );
        })}

        {/* Connection lines effect */}
        {isAnimating && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-px h-24 bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 animate-pulse"
                style={{
                  transform: `rotate(${i * 30}deg) translateY(-150px)`,
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
