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

export function generateRecommendations(metrics: Record<string, number>): string[] {
  const tips: string[] = [];
  
  if (metrics.exerciseMin < 30) {
    tips.push("Add a 20–30 min brisk walk before dinner to boost HRV and sleep quality.");
  }
  
  if (metrics.kcal > 2500) {
    tips.push("Aim for a higher-protein dinner (~30g) to improve satiety and reduce late snacks.");
  }
  
  if (metrics.hrv < 50) {
    tips.push("Keep tonight's workout easy (Zone 2) and add 10 minutes of wind-down breathing.");
  }
  
  if (metrics.rhr > 65) {
    tips.push("Hydrate + 10k easy steps; avoid hard intervals today.");
  }
  
  if (metrics.nutrition < 70) {
    tips.push("Swap one processed snack for fruit + nuts; target 25–30g fiber/day.");
  }
  
  return tips.slice(0, 5);
}
