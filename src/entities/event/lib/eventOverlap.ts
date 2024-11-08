import { Event, EventForm } from '../entities/Event/model/types';

/**
 * 날짜 문자열과 시간 문자열을 조합하여 Date 객체를 생성합니다.
 */
export function parseDateTime(date: string, time: string) {
  return new Date(`${date}T${time}`);
}

/**
 * 이벤트 객체를 시작/종료 시간 범위로 변환합니다.
 */
export function convertEventToDateRange({ date, startTime, endTime }: Event | EventForm) {
  return {
    start: parseDateTime(date, startTime),
    end: parseDateTime(date, endTime),
  };
}

/**
 * 두 이벤트의 시간 중복 여부를 확인합니다.
 */
export function isOverlapping(event1: Event | EventForm, event2: Event | EventForm) {
  const { start: start1, end: end1 } = convertEventToDateRange(event1);
  const { start: start2, end: end2 } = convertEventToDateRange(event2);

  return start1 < end2 && start2 < end1;
}

/**
 * 기존 이벤트들 중에서 새이벤트와 중복되는 이벤트를 찾습니다.
 */
export function findOverlappingEvents(newEvent: Event | EventForm, events: Event[]) {
  return events.filter(
    (event) => event.id !== (newEvent as Event).id && isOverlapping(event, newEvent)
  );
}
