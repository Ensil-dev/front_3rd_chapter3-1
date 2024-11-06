import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';
import { setupEvents } from '../utils';

describe('getUpcomingEvents', () => {
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', async () => {
    const events = await setupEvents();
    const currentTime = new Date('2024-11-29T13:06'); // 14:06 시작 이벤트의 60분 전
    const notifiedEvents: string[] = [];

    const upcomingEvents = getUpcomingEvents(events, currentTime, notifiedEvents);

    expect(upcomingEvents).toEqual([
      {
        id: '0698ce16-3af6-4ecd-b980-322f79ebd3a0',
        title: '전사 회의',
        date: '2024-11-29',
        startTime: '14:06',
        endTime: '15:06',
        description: '전사 회의',
        location: '회의실 b',
        category: '업무',
        repeat: { type: 'monthly', interval: 1 },
        notificationTime: 60,
      },
    ]);
  });

  it('이미 알림이 간 이벤트는 제외한다', async () => {
    const events = await setupEvents();
    const currentTime = new Date('2024-11-29T14:00');
    const notifiedEvents = ['0698ce16-3af6-4ecd-b980-322f79ebd3a0'];

    const upcomingEvents = getUpcomingEvents(events, currentTime, notifiedEvents);

    expect(upcomingEvents).toEqual([]); // 알림이 필요한 이벤트 없음
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', async () => {
    const events = await setupEvents();
    const currentTime = new Date('2024-11-29T13:05'); // 14:06 시작 이벤트의 59분 전, 알람 보내기 1분전
    const notifiedEvents: string[] = [];

    const upcomingEvents = getUpcomingEvents(events, currentTime, notifiedEvents);

    expect(upcomingEvents).toEqual([]);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', async () => {
    const events = await setupEvents();
    const currentTime = new Date('2024-11-29T13:05'); // 14:06 시작 이벤트의 30분 전, 알람 보낸 후
    const notifiedEvents: string[] = [];

    const upcomingEvents = getUpcomingEvents(events, currentTime, notifiedEvents);

    expect(upcomingEvents).toEqual([]);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', async () => {
    const events = await setupEvents();

    expect(createNotificationMessage(events[events.length - 1])).toBe(
      '60분 후 전사 회의 일정이 시작됩니다.'
    );
  });
});
