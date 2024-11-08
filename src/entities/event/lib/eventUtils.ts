import { getWeekDates, isDateInRange } from '../../calendar/lib/dateUtils';
import { Event } from '../model/types';

/**
 * 특정 날짜 범위 내의 이벤트들만 필터링합니다.
 */
function filterEventsByDateRange(events: Event[], start: Date, end: Date): Event[] {
  return events.filter((event) => {
    const eventDate = new Date(event.date);
    return isDateInRange(eventDate, start, end);
  });
}

/**
 * target에 대소문자 구분 없이 검색어(term)가 포함됐는지 여부를 확인합니다.
 */
function containsTerm(target: string, term: string) {
  return target.toLowerCase().includes(term.toLowerCase());
}

/**
 * 검색어(term)로 이벤트를 필터링합니다.
 */
function searchEvents(events: Event[], term: string) {
  return events.filter(
    ({ title, description, location }) =>
      containsTerm(title, term) || containsTerm(description, term) || containsTerm(location, term)
  );
}

/**
 * 특정 주에 속한 이벤트를 필터링합니다.
 */
function filterEventsByDateRangeAtWeek(events: Event[], currentDate: Date) {
  const weekDates = getWeekDates(currentDate);
  return filterEventsByDateRange(events, weekDates[0], weekDates[6]);
}

/**
 * 특정 달에 속한 이벤트를 필터링합니다.
 */
function filterEventsByDateRangeAtMonth(events: Event[], currentDate: Date) {
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  return filterEventsByDateRange(events, monthStart, monthEnd);
}

/**
 * 검색어와 날짜 범위를 모두 적용한 최종 필터링 결과 이벤트들을 리턴합니다.
 */
export function getFilteredEvents(
  events: Event[],
  searchTerm: string,
  currentDate: Date,
  view: 'week' | 'month'
): Event[] {
  const searchedEvents = searchEvents(events, searchTerm);

  if (view === 'week') {
    return filterEventsByDateRangeAtWeek(searchedEvents, currentDate);
  }

  if (view === 'month') {
    return filterEventsByDateRangeAtMonth(searchedEvents, currentDate);
  }

  return searchedEvents;
}
