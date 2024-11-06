import { getFilteredEvents } from '../../utils/eventUtils';
import { setupEvents } from '../utils';

describe('getFilteredEvents', () => {
  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", async () => {
    const events = await setupEvents();
    const targetDate = new Date('2024-11-06');

    expect(getFilteredEvents(events, '이벤트 2', targetDate, 'month')).toEqual([
      {
        category: '업무',
        date: '2024-11-27',
        description: '이벤트 2',
        endTime: '16:39',
        id: 'f598e848-a7bd-42fe-92e5-efc5264c530f',
        location: '',
        notificationTime: 10,
        repeat: {
          interval: 1,
          type: 'none',
        },
        startTime: '15:37',
        title: '이벤트 2',
      },
    ]);
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', async () => {
    const events = await setupEvents();
    const targetDate = new Date('2024-07-01');

    expect(getFilteredEvents(events, '', targetDate, 'week')).toEqual([
      {
        category: '기타',
        date: '2024-07-01',
        description: '동기 저녁식사 모임',
        endTime: '21:42',
        id: '19b17d95-5ec0-402f-b4f0-3b99799ded11',
        location: '신사역',
        notificationTime: 60,
        repeat: {
          interval: 1,
          type: 'none',
        },
        startTime: '17:42',
        title: '7월 첫째주 이벤트',
      },
    ]);
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', async () => {
    const events = await setupEvents();
    const currentDate = new Date('2024-07-01');

    expect(getFilteredEvents(events, '', currentDate, 'month')).toEqual([
      {
        category: '기타',
        date: '2024-07-01',
        description: '동기 저녁식사 모임',
        endTime: '21:42',
        id: '19b17d95-5ec0-402f-b4f0-3b99799ded11',
        location: '신사역',
        notificationTime: 60,
        repeat: {
          interval: 1,
          type: 'none',
        },
        startTime: '17:42',
        title: '7월 첫째주 이벤트',
      },
      {
        category: '업무',
        date: '2024-07-26',
        description: '전사 회식',
        endTime: '21:32',
        id: 'c24b8708-ddd8-4f44-b7f2-feea31617592',
        location: '회사 근처 고깃집',
        notificationTime: 60,
        repeat: {
          interval: 1,
          type: 'none',
        },
        startTime: '17:45',
        title: '7월 전사 회식',
      },
    ]);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", async () => {
    const events = await setupEvents();
    const targetDate = new Date('2024-11-24');

    expect(getFilteredEvents(events, '이벤트', targetDate, 'week')).toEqual([
      {
        category: '업무',
        date: '2024-11-27',
        description: '이벤트 2',
        endTime: '16:39',
        id: 'f598e848-a7bd-42fe-92e5-efc5264c530f',
        location: '',
        notificationTime: 10,
        repeat: {
          interval: 1,
          type: 'none',
        },
        startTime: '15:37',
        title: '이벤트 2',
      },
    ]);
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', async () => {
    const events = await setupEvents();
    const targetDate = new Date('2024-11-24');

    expect(getFilteredEvents(events, '', targetDate, 'week')).toEqual([
      {
        category: '업무',
        date: '2024-11-25',
        description: '분기별 프로젝트 마감',
        endTime: '18:00',
        id: 'da3ca408-836a-4d98-b67a-ca389d07552b',
        location: '사무실',
        notificationTime: 1,
        repeat: {
          interval: 0,
          type: 'none',
        },
        startTime: '09:00',
        title: '프로젝트 마감',
      },
      {
        category: '개인',
        date: '2024-11-28',
        description: '친구 생일 축하',
        endTime: '22:00',
        id: 'dac62941-69e5-4ec0-98cc-24c2a79a7f81',
        location: '친구 집',
        notificationTime: 1,
        repeat: {
          interval: 0,
          type: 'none',
        },
        startTime: '19:00',
        title: '생일 파티',
      },
      {
        category: '업무',
        date: '2024-11-27',
        description: '이벤트 2',
        endTime: '16:39',
        id: 'f598e848-a7bd-42fe-92e5-efc5264c530f',
        location: '',
        notificationTime: 10,
        repeat: {
          interval: 1,
          type: 'none',
        },
        startTime: '15:37',
        title: '이벤트 2',
      },
      {
        category: '업무',
        date: '2024-11-29',
        description: '전사 회의',
        endTime: '15:06',
        id: '0698ce16-3af6-4ecd-b980-322f79ebd3a0',
        location: '회의실 b',
        notificationTime: 60,
        repeat: {
          interval: 1,
          type: 'monthly',
        },
        startTime: '14:06',
        title: '전사 회의',
      },
    ]);
  });

  describe('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    it('소문자로 검색해도 대문자 결과를 반환합니다', async () => {
      const events = await setupEvents();
      const targetDate = new Date('2024-11-24');

      expect(getFilteredEvents(events, 'a', targetDate, 'month')).toEqual([
        {
          category: '업무',
          date: '2024-11-20',
          description: '주간 팀 미팅',
          endTime: '11:00',
          id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
          location: '회의실 A',
          notificationTime: 1,
          repeat: {
            interval: 0,
            type: 'none',
          },
          startTime: '10:00',
          title: '팀 회의',
        },
      ]);
    });

    it('대문자로 검색해도 소문자 결과를 반환합니다', async () => {
      const events = await setupEvents();
      const targetDate = new Date('2024-11-24');

      expect(getFilteredEvents(events, 'B', targetDate, 'month')).toEqual([
        {
          category: '업무',
          date: '2024-11-29',
          description: '전사 회의',
          endTime: '15:06',
          id: '0698ce16-3af6-4ecd-b980-322f79ebd3a0',
          location: '회의실 b',
          notificationTime: 60,
          repeat: {
            interval: 1,
            type: 'monthly',
          },
          startTime: '14:06',
          title: '전사 회의',
        },
      ]);
    });
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', async () => {
    const events = await setupEvents();
    const targetDate = new Date('2024-11-30');

    expect(getFilteredEvents(events, '', targetDate, 'month')).toEqual([
      {
        category: '업무',
        date: '2024-11-20',
        description: '주간 팀 미팅',
        endTime: '11:00',
        id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
        location: '회의실 A',
        notificationTime: 1,
        repeat: {
          interval: 0,
          type: 'none',
        },
        startTime: '10:00',
        title: '팀 회의',
      },
      {
        category: '개인',
        date: '2024-11-21',
        description: '동료와 점심 식사',
        endTime: '13:30',
        id: '09702fb3-a478-40b3-905e-9ab3c8849dcd',
        location: '회사 근처 식당',
        notificationTime: 1,
        repeat: {
          interval: 0,
          type: 'none',
        },
        startTime: '12:30',
        title: '점심 약속',
      },
      {
        category: '업무',
        date: '2024-11-25',
        description: '분기별 프로젝트 마감',
        endTime: '18:00',
        id: 'da3ca408-836a-4d98-b67a-ca389d07552b',
        location: '사무실',
        notificationTime: 1,
        repeat: {
          interval: 0,
          type: 'none',
        },
        startTime: '09:00',
        title: '프로젝트 마감',
      },
      {
        category: '개인',
        date: '2024-11-28',
        description: '친구 생일 축하',
        endTime: '22:00',
        id: 'dac62941-69e5-4ec0-98cc-24c2a79a7f81',
        location: '친구 집',
        notificationTime: 1,
        repeat: {
          interval: 0,
          type: 'none',
        },
        startTime: '19:00',
        title: '생일 파티',
      },
      {
        category: '개인',
        date: '2024-11-22',
        description: '주간 운동',
        endTime: '19:00',
        id: '80d85368-b4a4-47b3-b959-25171d49371f',
        location: '헬스장',
        notificationTime: 1,
        repeat: {
          interval: 0,
          type: 'none',
        },
        startTime: '18:00',
        title: '운동',
      },
      {
        category: '업무',
        date: '2024-11-07',
        description: '테스트 일정',
        endTime: '23:16',
        id: '1e9c664d-579d-4694-bcf7-d82e1ce4f104',
        location: '테스트 일정',
        notificationTime: 60,
        repeat: {
          interval: 1,
          type: 'none',
        },
        startTime: '20:49',
        title: '테스트 일정',
      },
      {
        category: '업무',
        date: '2024-11-08',
        description: '테스트 일정2',
        endTime: '23:50',
        id: '3bcdf622-09c7-440b-b6f1-02632053e230',
        location: '테스트 일정2',
        notificationTime: 10,
        repeat: {
          interval: 1,
          type: 'none',
        },
        startTime: '22:50',
        title: '테스트 일정2',
      },
      {
        category: '업무',
        date: '2024-11-27',
        description: '이벤트 2',
        endTime: '16:39',
        id: 'f598e848-a7bd-42fe-92e5-efc5264c530f',
        location: '',
        notificationTime: 10,
        repeat: {
          interval: 1,
          type: 'none',
        },
        startTime: '15:37',
        title: '이벤트 2',
      },
      {
        category: '업무',
        date: '2024-11-29',
        description: '전사 회의',
        endTime: '15:06',
        id: '0698ce16-3af6-4ecd-b980-322f79ebd3a0',
        location: '회의실 b',
        notificationTime: 60,
        repeat: {
          interval: 1,
          type: 'monthly',
        },
        startTime: '14:06',
        title: '전사 회의',
      },
    ]);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const targetDate = new Date('2024-11-24');

    expect(getFilteredEvents([], '', targetDate, 'month')).toEqual([]);
  });
});
