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
  const tips: Recommendation[] = [];
  
  if (metrics.exerciseMin < 30) {
    tips.push({
      action: "Add a 20–30 min brisk walk before dinner",
      why: "Your exercise is 13 min below the recommended daily amount. Light movement boosts HRV and improves sleep quality."
    });
  }
  
  if (metrics.hrv < 50) {
    tips.push({
      action: "Keep tonight's workout easy (Zone 2) and add 10 min of breathing",
      why: "Your HRV is 14 points below optimal recovery range. Light training and breathwork help your nervous system reset."
    });
  }
  
  if (metrics.rhr > 65) {
    tips.push({
      action: "Hydrate well and aim for 10k easy steps today",
      why: "Your resting heart rate is elevated by 7 bpm. Gentle movement and hydration support cardiovascular recovery."
    });
  }
  
  if (metrics.nutrition < 70) {
    tips.push({
      action: "Swap one processed snack for fruit + nuts today",
      why: "Your nutrition score is 10 points below target. Small swaps improve micronutrient intake and energy levels."
    });
  }
  
  if (metrics.kcal > 2500) {
    tips.push({
      action: "Aim for a higher-protein dinner (~30g protein)",
      why: "You're 400 kcal above your daily target. Protein increases satiety and reduces late-night snacking."
    });
  }
  
  return tips.slice(0, 3);
}
