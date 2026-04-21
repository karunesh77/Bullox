export interface CalendarEvent {
  id: string;
  title: string;
  country: string;
  date: string;
  time: string;
  impact: 'low' | 'medium' | 'high';
  forecast: string | null;
  previous: string | null;
  actual: string | null;
  currency: string;
  unit: string;
}

export type ImpactLevel = 'low' | 'medium' | 'high';
