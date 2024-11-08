export interface CalendarViewProps {
  currentDate: Date;
  events: Event[];
  notifiedEvents: string[];
  holidays?: Record<string, string>;
}
