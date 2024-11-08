import { Event } from '../../event/model/types';

const 초 = 1000;
const 분 = 초 * 60;

/**
 * 알람 예정인 이벤트를 필터링한 결과를 리턴합니다.
 */
export function getUpcomingEvents(events: Event[], now: Date, notifiedEvents: string[]) {
  return events.filter((event) => {
    const eventStart = new Date(`${event.date}T${event.startTime}`);
    const timeDiff = (eventStart.getTime() - now.getTime()) / 분;
    return (
      timeDiff > 0 && // 아직 시작하지 않은 이벤트
      timeDiff <= event.notificationTime && // 알림 시간 이내
      timeDiff >= event.notificationTime && // 알림 시간 초과하지 않음
      !notifiedEvents.includes(event.id) // 아직 알림을 보내지 않은 이벤트
    );
  });
}

/**
 * 알람 메세지 문자열을 생성합니다.
 */
export function createNotificationMessage({ notificationTime, title }: Event) {
  return `${notificationTime}분 후 ${title} 일정이 시작됩니다.`;
}
