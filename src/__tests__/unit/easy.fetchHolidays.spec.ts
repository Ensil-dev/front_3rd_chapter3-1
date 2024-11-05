import { fetchHolidays } from '../../apis/fetchHolidays';

describe('fetchHolidays', () => {
  it('주어진 월의 공휴일만 반환한다', () => {
    const getMarchHolidays = fetchHolidays(new Date('2024-03-22'));

    expect(getMarchHolidays).toEqual({
      '2024-03-01': '삼일절',
    });
  });

  it('공휴일이 없는 월에 대해 빈 객체를 반환한다', () => {
    const getJulyHolidays = fetchHolidays(new Date('2024-07-22'));

    expect(getJulyHolidays).toEqual({});
  });

  it('여러 공휴일이 있는 월에 대해 모든 공휴일을 반환한다', () => {
    const getFebruaryHolidays = fetchHolidays(new Date('2024-02-22'));

    expect(getFebruaryHolidays).toEqual({
      '2024-02-09': '설날',
      '2024-02-10': '설날',
      '2024-02-11': '설날',
    });
  });
});