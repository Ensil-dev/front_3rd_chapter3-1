import { Event } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

const DEFAULT_DATE = '2024-07-01';
const DEFAULT_TIME = '14:30';
const INVALID_DATE = new Date('Invalid Date');

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const targetParsedDataTime = parseDateTime(DEFAULT_DATE, DEFAULT_TIME);
    expect(targetParsedDataTime).toEqual(new Date('2024-07-01T14:30:00.000Z'));
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const invalidDate = '2024-07-99';

    expect(parseDateTime(invalidDate, DEFAULT_TIME)).toEqual(INVALID_DATE);
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const invalidTime = '99:99';
    expect(parseDateTime(DEFAULT_DATE, invalidTime)).toEqual(INVALID_DATE);
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    expect(parseDateTime('', DEFAULT_TIME)).toEqual(INVALID_DATE);
  });
});

describe('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', async () => {
    const generalMockEvent: Event = {
      id: '0698ce16-3af6-4ecd-b980-322f79ebd3a0',
      title: '전사 회의',
      date: DEFAULT_DATE,
      startTime: '14:06',
      endTime: '15:06',
      description: '전사 회의',
      location: '회의실 b',
      category: '업무',
      repeat: { type: 'monthly', interval: 1 },
      notificationTime: 60,
    };

    expect(convertEventToDateRange(generalMockEvent)).toEqual({
      start: new Date('2024-07-01T14:06:00.000Z'),
      end: new Date('2024-07-01T15:06:00.000Z'),
    });
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const invalidDateMockEvent: Event = {
      id: '0698ce16-3af6-4ecd-b980-322f79ebd3a0',
      title: '전사 회의',
      date: '2024-11-33',
      startTime: '14:06',
      endTime: '15:06',
      description: '전사 회의',
      location: '회의실 b',
      category: '업무',
      repeat: { type: 'monthly', interval: 1 },
      notificationTime: 60,
    };

    expect(convertEventToDateRange(invalidDateMockEvent)).toEqual({
      start: INVALID_DATE,
      end: INVALID_DATE,
    });
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const invalidTimeMockEvent: Event = {
      id: '0698ce16-3af6-4ecd-b980-322f79ebd3a0',
      title: '전사 회의',
      date: '2024-11-01',
      startTime: '54:06',
      endTime: '15:86',
      description: '전사 회의',
      location: '회의실 b',
      category: '업무',
      repeat: { type: 'monthly', interval: 1 },
      notificationTime: 60,
    };

    expect(convertEventToDateRange(invalidTimeMockEvent)).toEqual({
      start: INVALID_DATE,
      end: INVALID_DATE,
    });
  });
});

describe('isOverlapping', () => {
  const overLappingEvent1: Event = {
    id: '0698ce16-3af6-4ecd-b980-322f79ebd3a0',
    title: '전사 회의',
    date: DEFAULT_DATE,
    startTime: '14:06',
    endTime: '15:06',
    description: '전사 회의',
    location: '회의실 b',
    category: '업무',
    repeat: { type: 'monthly', interval: 1 },
    notificationTime: 60,
  };

  const overLappingEvent2: Event = {
    id: '2421nq31-2ma2-5qzc-s212-972k36czq9d2',
    title: '전사 회의',
    date: DEFAULT_DATE,
    startTime: '14:36',
    endTime: '15:36',
    description: '전사 회의',
    location: '회의실 b',
    category: '업무',
    repeat: { type: 'monthly', interval: 1 },
    notificationTime: 60,
  };

  const nonOverLappingEvent: Event = {
    id: '2we2fb1-bbb2-333c-1111-wf2e6h4tr9ff3',
    title: '테스트 코드 스터디',
    date: DEFAULT_DATE,
    startTime: '20:36',
    endTime: '22:36',
    description: '테스트 코드 스터디',
    location: 'zep',
    category: '개인',
    repeat: { type: 'monthly', interval: 1 },
    notificationTime: 60,
  };

  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    expect(isOverlapping(overLappingEvent1, overLappingEvent2)).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    expect(isOverlapping(overLappingEvent1, nonOverLappingEvent)).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  const mockEvents: Event[] = [
    {
      id: '0698ce16-3af6-4ecd-b980-322f79ebd3a0',
      title: '전사 회의',
      date: DEFAULT_DATE,
      startTime: '14:06',
      endTime: '15:06',
      description: '전사 회의',
      location: '회의실 b',
      category: '업무',
      repeat: { type: 'monthly', interval: 1 },
      notificationTime: 60,
    },
    {
      id: '2we2fb1-bbb2-333c-1111-wf2e6h4tr9ff3',
      title: '테스트 코드 스터디',
      date: DEFAULT_DATE,
      startTime: '20:36',
      endTime: '22:36',
      description: '테스트 코드 스터디',
      location: 'zep',
      category: '개인',
      repeat: { type: 'monthly', interval: 1 },
      notificationTime: 60,
    },
  ];

  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const newMockEvent: Event = {
      id: '2421nq31-2ma2-5qzc-s212-972k36czq9d2',
      title: '전사 회의',
      date: DEFAULT_DATE,
      startTime: '14:36',
      endTime: '15:36',
      description: '전사 회의',
      location: '회의실 b',
      category: '업무',
      repeat: { type: 'monthly', interval: 1 },
      notificationTime: 60,
    };

    expect(findOverlappingEvents(newMockEvent, mockEvents)).toEqual([
      {
        id: '0698ce16-3af6-4ecd-b980-322f79ebd3a0',
        title: '전사 회의',
        date: DEFAULT_DATE,
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

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const newMockEvent: Event = {
      id: 'fae2l1jg-3baa-2qwh-1n2n-ar2sd4fl3w13',
      title: '아침 러닝',
      date: DEFAULT_DATE,
      startTime: '06:00',
      endTime: '06:50',
      description: '아침 러닝',
      location: '공원',
      category: '개인',
      repeat: { type: 'monthly', interval: 1 },
      notificationTime: 60,
    };

    expect(findOverlappingEvents(newMockEvent, mockEvents)).toEqual([]);
  });
});
