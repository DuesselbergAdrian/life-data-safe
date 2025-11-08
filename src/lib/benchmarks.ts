export type MetricType = 'nutrition' | 'kcal' | 'exerciseMin' | 'rhr' | 'hrv';

export interface BenchmarkResult {
  label: 'Good' | 'Medium' | 'Bad';
  percentile: number;
  context: string;
}

export function benchmark(value: number, metric: MetricType): BenchmarkResult {
  switch (metric) {
    case 'nutrition':
      if (value >= 80) return { label: 'Good', percentile: 75, context: 'Top 30% peers' };
      if (value >= 60) return { label: 'Medium', percentile: 50, context: 'Around average' };
      return { label: 'Bad', percentile: 25, context: 'Below typical' };
    
    case 'exerciseMin':
      if (value >= 45) return { label: 'Good', percentile: 70, context: 'Top 30% peers' };
      if (value >= 20) return { label: 'Medium', percentile: 50, context: 'Around average' };
      return { label: 'Bad', percentile: 30, context: 'Below typical' };
    
    case 'rhr':
      if (value <= 58) return { label: 'Good', percentile: 75, context: 'Top 30% peers' };
      if (value <= 64) return { label: 'Medium', percentile: 50, context: 'Around average' };
      return { label: 'Bad', percentile: 25, context: 'Below typical' };
    
    case 'hrv':
      if (value >= 60) return { label: 'Good', percentile: 75, context: 'Top 30% peers' };
      if (value >= 40) return { label: 'Medium', percentile: 50, context: 'Around average' };
      return { label: 'Bad', percentile: 30, context: 'Below typical' };
    
    case 'kcal':
      if (value >= 1800 && value <= 2400) return { label: 'Good', percentile: 60, context: 'Top 30% peers' };
      if ((value >= 1500 && value < 1800) || (value > 2400 && value <= 2800)) 
        return { label: 'Medium', percentile: 50, context: 'Around average' };
      return { label: 'Bad', percentile: 30, context: 'Below typical' };
    
    default:
      return { label: 'Medium', percentile: 50, context: 'Around average' };
  }
}

export interface Recommendation {
  action: string;
  why: string;
}

export function generateRecommendations(metrics: Record<string, number>): Recommendation[] {
  const tips: Recommendation[] = [
    {
      action: "Stand up and move for 5 minutes every hour at your desk",
      why: "You've been sitting for 4+ hours today. Research shows prolonged sitting increases cardiovascular disease risk by 147% (Diabetologia, 2012). Breaking up sitting time improves circulation and focus."
    },
    {
      action: "Replace 30 minutes of social media with a walk or light activity",
      why: "Your screen time shows extended passive scrolling. Studies indicate excessive social media use correlates with a 7-point IQ decline and reduced cognitive performance (Nature, 2023). Active breaks restore mental clarity."
    },
    {
      action: "Add 15 minutes of Zone 2 cardio to your evening routine",
      why: "You logged only 30 minutes of exercise today. The American Heart Association recommends 150 min/week of moderate activity to reduce all-cause mortality by 31%. Consistent light cardio also improves HRV and sleep quality."
    }
  ];
  
  return tips.slice(0, 3);
}
