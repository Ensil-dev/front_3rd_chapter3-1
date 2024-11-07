import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { setupEvents } from '../utils.ts';

describe('검색어가 비어있을 때 현재 뷰(주간/월간)에 해당하는 모든 이벤트들을 반환합니다', () => {
  it('현재 뷰(주간)에 해당하는 이벤트만 반환합니다.', async () => {
    const events = await setupEvents();
    const { result } = renderHook(() => useSearch(events, new Date('2024-11-07'), 'week'));

    expect(result.current.filteredEvents).toEqual([
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
    ]);
  });

  it('현재 뷰(월간)에 해당하는 이벤트만 반환합니다.', async () => {
    const events = await setupEvents();
    const { result } = renderHook(() => useSearch(events, new Date('2024-11-07'), 'month'));

    expect(result.current.filteredEvents).toEqual([
      {
        id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
        title: '팀 회의',
        date: '2024-11-20',
        startTime: '10:00',
        endTime: '11:00',
        description: '주간 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
      {
        id: '09702fb3-a478-40b3-905e-9ab3c8849dcd',
        title: '점심 약속',
        date: '2024-11-21',
        startTime: '12:30',
        endTime: '13:30',
        description: '동료와 점심 식사',
        location: '회사 근처 식당',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
      {
        id: 'da3ca408-836a-4d98-b67a-ca389d07552b',
        title: '프로젝트 마감',
        date: '2024-11-25',
        startTime: '09:00',
        endTime: '18:00',
        description: '분기별 프로젝트 마감',
        location: '사무실',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
      {
        id: 'dac62941-69e5-4ec0-98cc-24c2a79a7f81',
        title: '생일 파티',
        date: '2024-11-28',
        startTime: '19:00',
        endTime: '22:00',
        description: '친구 생일 축하',
        location: '친구 집',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
      {
        id: '80d85368-b4a4-47b3-b959-25171d49371f',
        title: '운동',
        date: '2024-11-22',
        startTime: '18:00',
        endTime: '19:00',
        description: '주간 운동',
        location: '헬스장',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 1,
      },
      {
        id: '1e9c664d-579d-4694-bcf7-d82e1ce4f104',
        title: '테스트 일정',
        date: '2024-11-07',
        startTime: '20:49',
        endTime: '23:16',
        description: '테스트 일정',
        location: '테스트 일정',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 60,
      },
      {
        id: '3bcdf622-09c7-440b-b6f1-02632053e230',
        title: '테스트 일정2',
        date: '2024-11-08',
        startTime: '22:50',
        endTime: '23:50',
        description: '테스트 일정2',
        location: '테스트 일정2',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
      {
        id: 'f598e848-a7bd-42fe-92e5-efc5264c530f',
        title: '이벤트 2',
        date: '2024-11-27',
        startTime: '15:37',
        endTime: '16:39',
        description: '이벤트 2',
        location: '',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
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
});

describe('검색어 입력 시 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
  it('제목(title)에 맞는 이벤트를 반환해야 한다', async () => {
    const events = await setupEvents();
    const { result } = renderHook(() => useSearch(events, new Date('2024-11-15'), 'month'));
    act(() => result.current.setSearchTerm('테스트'));

    expect(result.current.filteredEvents).toEqual([
      {
        id: '1e9c664d-579d-4694-bcf7-d82e1ce4f104',
        title: '테스트 일정',
        date: '2024-11-07',
        startTime: '20:49',
        endTime: '23:16',
        description: '테스트 일정',
        location: '테스트 일정',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 60,
      },
      {
        id: '3bcdf622-09c7-440b-b6f1-02632053e230',
        title: '테스트 일정2',
        date: '2024-11-08',
        startTime: '22:50',
        endTime: '23:50',
        description: '테스트 일정2',
        location: '테스트 일정2',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
    ]);
  });

  it('설명(description)에 맞는 이벤트를 반환해야 한다', async () => {
    const events = await setupEvents();
    const { result } = renderHook(() => useSearch(events, new Date('2024-11-15'), 'month'));
    act(() => result.current.setSearchTerm('테스트'));

    expect(result.current.filteredEvents).toEqual([
      {
        id: '1e9c664d-579d-4694-bcf7-d82e1ce4f104',
        title: '테스트 일정',
        date: '2024-11-07',
        startTime: '20:49',
        endTime: '23:16',
        description: '테스트 일정',
        location: '테스트 일정',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 60,
      },
      {
        id: '3bcdf622-09c7-440b-b6f1-02632053e230',
        title: '테스트 일정2',
        date: '2024-11-08',
        startTime: '22:50',
        endTime: '23:50',
        description: '테스트 일정2',
        location: '테스트 일정2',
        category: '업무',
        repeat: { type: 'none', interval: 1 },
        notificationTime: 10,
      },
    ]);
  });

  it('장소(location)에 맞는 이벤트를 필터링해야 한다', async () => {
    const events = await setupEvents();
    const { result } = renderHook(() => useSearch(events, new Date('2024-11-15'), 'month'));
    act(() => result.current.setSearchTerm('회의실'));

    expect(result.current.filteredEvents).toEqual([
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

it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", async () => {
  const events = await setupEvents();
  const { result } = renderHook(() => useSearch(events, new Date('2024-11-15'), 'month'));
  act(() => result.current.setSearchTerm('회의'));

  expect(result.current.filteredEvents).toEqual([
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

  act(() => result.current.setSearchTerm('점심'));
  expect(result.current.filteredEvents).toEqual([
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
  ]);
});
