import {
  formatDate,
  formatWeek,
  formatMonth,
  getDaysInMonth,
  getWeekDates,
  getWeeksAtMonth,
  getEventsForDay,
  isDateInRange,
  fillZero,
} from '../../entities/calendar/lib/dateUtils';
import { setupEvents } from '../utils';

describe('formatDate', () => {
  describe('월(Month)이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    const singleDigitMonthDate = new Date('2024-02-22');

    it('날짜를 YYYY-MM-DD 형식으로 포맷팅한다', () => {
      expect(formatDate(singleDigitMonthDate)).toBe('2024-02-22');
    });

    it('day 파라미터가 제공되면 해당 일자로 포맷팅한다', () => {
      expect(formatDate(singleDigitMonthDate, 29)).toBe('2024-02-29');
    });
  });

  describe('일(Day)이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    const singleDigitDayDate = new Date('2024-11-09');

    it('날짜를 YYYY-MM-DD 형식으로 포맷팅한다', () => {
      expect(formatDate(singleDigitDayDate)).toBe('2024-11-09');
    });
  });
});

describe('formatWeek', () => {
  it('월의 중간 날짜에 대해 올바른 주 정보를 반환한다', () => {
    const targetMiddleDate = formatWeek(new Date('2024-11-15'));

    expect(targetMiddleDate).toBe('2024년 11월 2주');
  });

  it('월의 첫 주에 대해 올바른 주 정보를 반환한다', () => {
    const targetFirstWeekDate = formatWeek(new Date('2024-11-03'));

    expect(targetFirstWeekDate).toBe('2024년 11월 1주');
  });

  it('월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const targetLastWeekDate = formatWeek(new Date('2024-11-27'));

    expect(targetLastWeekDate).toBe('2024년 11월 4주');
  });

  it('연도가 바뀌는 주에 대해 올바른 주 정보를 반환한다', () => {
    const targetYearChangeWeek = formatWeek(new Date('2024-12-31'));

    expect(targetYearChangeWeek).toBe('2025년 1월 1주');
  });

  it('윤년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const leapYearFebruaryLastWeekDate = formatWeek(new Date('2024-02-29'));

    expect(leapYearFebruaryLastWeekDate).toBe('2024년 2월 5주');
  });

  it('평년 2월의 마지막 날이 다음 달 첫 주로 계산되는 것을 확인한다', () => {
    const leapYearFebruaryLastWeekDate = formatWeek(new Date('2021-02-28'));

    expect(leapYearFebruaryLastWeekDate).toBe('2021년 3월 1주');
  });
});

describe('formatMonth', () => {
  it("2024년 7월 10일을 '2024년 7월'로 반환한다", () => {
    expect(formatMonth(new Date('2024-07-10'))).toBe('2024년 7월');
  });
});

describe('getDaysInMonth', () => {
  describe('일반적인 월의 일수', () => {
    it('31일이 있는 월을 정확히 처리한다', () => {
      expect(getDaysInMonth(2024, 3)).toBe(31);
      expect(getDaysInMonth(2024, 8)).toBe(31);
    });

    it('30일이 있는 월을 정확히 처리한다', () => {
      expect(getDaysInMonth(2024, 6)).toBe(30);
      expect(getDaysInMonth(2024, 9)).toBe(30);
    });
  });

  describe('2월 특수 케이스', () => {
    it('윤년의 2월은 29일이다', () => {
      expect(getDaysInMonth(2020, 2)).toBe(29);
      expect(getDaysInMonth(2024, 2)).toBe(29);
    });

    it('평년의 2월은 28일이다', () => {
      expect(getDaysInMonth(2021, 2)).toBe(28);
      expect(getDaysInMonth(2023, 2)).toBe(28);
    });
  });

  describe('예외 처리', () => {
    it('유효하지 않은 월에 대해 false를 반환한다', () => {
      expect(getDaysInMonth(2024, 0)).toBe(0); // 0월
      expect(getDaysInMonth(2024, 13)).toBe(0); // 13월
      expect(getDaysInMonth(2024, -1)).toBe(0); // 음수 월
    });
  });
});

describe('getWeekDates', () => {
  it('주중의 날짜(수요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const targetWednesday = new Date('2024-11-06');

    expect(getWeekDates(targetWednesday)).toEqual([
      new Date('2024-11-03'),
      new Date('2024-11-04'),
      new Date('2024-11-05'),
      new Date('2024-11-06'),
      new Date('2024-11-07'),
      new Date('2024-11-08'),
      new Date('2024-11-09'),
    ]);
  });

  it('주의 시작(일요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const targetSundayDate = new Date('2024-10-27');

    expect(getWeekDates(targetSundayDate)).toEqual([
      new Date('2024-10-27'),
      new Date('2024-10-28'),
      new Date('2024-10-29'),
      new Date('2024-10-30'),
      new Date('2024-10-31'),
      new Date('2024-11-01'),
      new Date('2024-11-02'),
    ]);
  });

  it('주의 끝(토요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const targetSaturdayDate = new Date('2024-11-09');

    expect(getWeekDates(targetSaturdayDate)).toEqual([
      new Date('2024-11-03'),
      new Date('2024-11-04'),
      new Date('2024-11-05'),
      new Date('2024-11-06'),
      new Date('2024-11-07'),
      new Date('2024-11-08'),
      new Date('2024-11-09'),
    ]);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연말)', () => {
    const newYearsEve = new Date('2024-12-31');

    expect(getWeekDates(newYearsEve)).toEqual([
      new Date('2024-12-29'),
      new Date('2024-12-30'),
      new Date('2024-12-31'),
      new Date('2025-01-01'),
      new Date('2025-01-02'),
      new Date('2025-01-03'),
      new Date('2025-01-04'),
    ]);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연초)', () => {
    const newYearsDay = new Date('2025-01-01');

    expect(getWeekDates(newYearsDay)).toEqual([
      new Date('2024-12-29'),
      new Date('2024-12-30'),
      new Date('2024-12-31'),
      new Date('2025-01-01'),
      new Date('2025-01-02'),
      new Date('2025-01-03'),
      new Date('2025-01-04'),
    ]);
  });

  it('윤년의 2월 29일을 포함한 주를 올바르게 처리한다', () => {
    const leapYearDay = new Date('2024-02-29');

    expect(getWeekDates(leapYearDay)).toEqual([
      new Date('2024-02-25'),
      new Date('2024-02-26'),
      new Date('2024-02-27'),
      new Date('2024-02-28'),
      new Date('2024-02-29'),
      new Date('2024-03-01'),
      new Date('2024-03-02'),
    ]);
  });

  it('월의 마지막 날짜를 포함한 주를 올바르게 처리한다', () => {
    const targetLastMonthDay = new Date('2024-10-31');

    expect(getWeekDates(targetLastMonthDay)).toEqual([
      new Date('2024-10-27'),
      new Date('2024-10-28'),
      new Date('2024-10-29'),
      new Date('2024-10-30'),
      new Date('2024-10-31'),
      new Date('2024-11-01'),
      new Date('2024-11-02'),
    ]);
  });
});

describe('getWeeksAtMonth', () => {
  it('2024년 7월 1일의 올바른 주 정보를 반환해야 한다', () => {
    const targetDate = new Date('2024-07-01');
    expect(getWeeksAtMonth(targetDate)).toEqual([
      [null, 1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 31, null, null, null],
    ]);
  });
});

describe('getEventsForDay', () => {
  // realEvents.json의 실제 데이터로 테스트
  it('특정 날짜(20일)에 해당하는 이벤트를 정확히 반환한다', async () => {
    const events = await setupEvents();
    const filteredEvents = getEventsForDay(events, 20);

    expect(filteredEvents).toEqual([
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
    ]);
  });

  it('특정 날짜(2일)에 이벤트가 없을 경우 빈 배열을 반환하고, 이벤트들이 있을 경우 해당하는 첫 번째 이벤트를 반환한다.', async () => {
    const events = await setupEvents();
    const filteredEvents = getEventsForDay(events, 2);
    const result = filteredEvents.length === 0 ? [] : filteredEvents;

    expect(result).toEqual([]);
  });

  it('날짜가 0일 경우 빈 배열을 반환한다', async () => {
    const events = await setupEvents();
    const filteredEvents = getEventsForDay(events, 0);

    expect(filteredEvents).toEqual([]);
  });

  it('날짜가 32일 이상인 경우 빈 배열을 반환한다', async () => {
    const events = await setupEvents();
    const filteredEvents = getEventsForDay(events, 32);

    expect(filteredEvents).toEqual([]);
  });
});

describe('isDateInRange', () => {
  const rangeStart = new Date('2024-07-01');
  const rangeEnd = new Date('2024-07-31');

  describe('타겟 날짜가 정상 범위 (7월 1일 ~ 7월 31일)일 때', () => {
    it('범위 내의 날짜 2024-07-10에 대해 true를 반환한다', () => {
      const targetRangeDate = new Date('2024-07-10');
      expect(isDateInRange(targetRangeDate, rangeStart, rangeEnd)).toBe(true);
    });

    it('범위의 시작일 2024-07-01에 대해 true를 반환한다', () => {
      const targetRangeDate = new Date('2024-07-01');
      expect(isDateInRange(targetRangeDate, rangeStart, rangeEnd)).toBe(true);
    });

    it('범위의 종료일 2024-07-31에 대해 true를 반환한다', () => {
      const targetRangeDate = new Date('2024-07-31');
      expect(isDateInRange(targetRangeDate, rangeStart, rangeEnd)).toBe(true);
    });

    it('범위 이전의 날짜 2024-06-30에 대해 false를 반환한다', () => {
      const targetRangeDate = new Date('2024-06-30');
      expect(isDateInRange(targetRangeDate, rangeStart, rangeEnd)).toBe(false);
    });

    it('범위 이후의 날짜 2024-08-01에 대해 false를 반환한다', () => {
      const targetRangeDate = new Date('2024-08-01');
      expect(isDateInRange(targetRangeDate, rangeStart, rangeEnd)).toBe(false);
    });
  });

  describe('시작일과 종료일이 잘못된 범위일 때', () => {
    it('시작일이 종료일보다 늦은 경우 모든 날짜에 대해 false를 반환한다', () => {
      expect(
        isDateInRange(new Date('2024-07-15'), new Date('2024-07-31'), new Date('2024-07-01'))
      ).toBe(false);
    });
  });
});

describe('fillZero', () => {
  describe('size 파라미터를 생략하면 기본값 2를 사용한다', () => {
    test("5를 2자리로 변환하면 '05'를 반환한다", () => {
      expect(fillZero(5)).toBe('05');
    });

    test("10을 2자리로 변환하면 '10'을 반환한다", () => {
      expect(fillZero(10)).toBe('10');
    });

    test("0을 2자리로 변환하면 '00'을 반환한다", () => {
      expect(fillZero(0)).toBe('00');
    });
  });

  test("3을 3자리로 변환하면 '003'을 반환한다", () => {
    expect(fillZero(3, 3)).toBe('003');
  });

  test("1을 5자리로 변환하면 '00001'을 반환한다", () => {
    expect(fillZero(1, 5)).toBe('00001');
  });

  test("소수점이 있는 3.14를 5자리로 변환하면 '03.14'를 반환한다", () => {
    expect(fillZero(3.14, 5)).toBe('03.14');
  });

  test('value가 지정된 size보다 큰 자릿수를 가지면 원래 값을 그대로 반환한다', () => {
    expect(fillZero(123, 1)).toBe('123');
  });
});
