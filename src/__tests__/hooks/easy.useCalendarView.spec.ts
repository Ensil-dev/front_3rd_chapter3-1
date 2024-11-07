import { act, renderHook } from '@testing-library/react';

import { useCalendarView } from '../../hooks/useCalendarView.ts';
import { assertDate } from '../utils.ts';

describe('초기 상태', () => {
  it('view는 "month"이어야 한다', () => {
    const { result } = renderHook(() => useCalendarView());
    const { view } = result.current;

    expect(view).toBe('month');
  });

  it('currentDate는 오늘 날짜인 "2024-10-01"이어야 한다', () => {
    const { result } = renderHook(() => useCalendarView());
    const { currentDate } = result.current;

    assertDate(currentDate, new Date('2024-10-1'));
  });

  it('holidays는 10월 휴일인 개천절, 한글날이 지정되어 있어야 한다', () => {
    const { result } = renderHook(() => useCalendarView());
    const { holidays } = result.current;

    expect(holidays).toEqual({
      '2024-10-03': '개천절',
      '2024-10-09': '한글날',
    });
  });
});

describe('view 변경', () => {
  it("view를 'week'으로 변경 시 적절하게 반영된다", () => {
    const { result } = renderHook(() => useCalendarView());
    act(() => result.current.setView('week'));

    expect(result.current.view).toBe('week');
  });
});

describe('currentDate 변경에 따른 휴일 업데이트', () => {
  it("currentDate가 '2024-01-01' 변경되면 1월 휴일 '신정'으로 업데이트되어야 한다", () => {
    const { result } = renderHook(() => useCalendarView());
    act(() => result.current.setCurrentDate(new Date('2024-01-01')));

    expect(result.current.holidays).toEqual({
      '2024-01-01': '신정',
    });
  });
});

describe('view 네비게이션', () => {
  describe('주간 view 네비게이션', () => {
    it("주간 view에서 다음으로 navigate시 7일 후 '2024-10-08' 날짜로 지정이 된다", () => {
      const { result } = renderHook(() => useCalendarView());
      act(() => result.current.setView('week'));
      act(() => result.current.navigate('next'));

      assertDate(result.current.currentDate, new Date('2024-10-08'));
    });

    it("주간 view에서 이전으로 navigate시 7일 후 '2024-09-24' 날짜로 지정이 된다", () => {
      const { result } = renderHook(() => useCalendarView());
      act(() => result.current.setView('week'));
      act(() => result.current.navigate('prev'));

      assertDate(result.current.currentDate, new Date('2024-09-24'));
    });
  });

  describe('월간 view 네비게이션', () => {
    it("월간 view에서 다음으로 navigate시 한 달 전 '2024-11-01' 날짜여야 한다", () => {
      const { result } = renderHook(() => useCalendarView());
      act(() => result.current.navigate('next'));

      assertDate(result.current.currentDate, new Date('2024-11-01'));
    });

    it("월간 view에서 이전으로 navigate시 한 달 전 '2024-09-01' 날짜여야 한다", () => {
      const { result } = renderHook(() => useCalendarView());
      act(() => result.current.navigate('prev'));

      assertDate(result.current.currentDate, new Date('2024-09-01'));
    });
  });
});
