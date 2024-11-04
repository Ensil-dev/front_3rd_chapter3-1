import { useMemo, useState } from 'react';

import { Event } from '../types';
import { getFilteredEvents } from '../utils/eventUtils';

/**
 * 주어진 이벤트 목록(events)에서 검색어(searchTerm)와 현재 날짜(currentDate)를 기준으로
 * 날짜 범위(주/월, view)에 맞는 이벤트들을 필터링하는 커스텀 훅
 */
export const useSearch = (events: Event[], currentDate: Date, view: 'week' | 'month') => {
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * 검색어(searchTerm)를 기준으로 필터링된 결과를 메모이제이션합니다.
   */
  const filteredEvents = useMemo(() => {
    return getFilteredEvents(events, searchTerm, currentDate, view);
  }, [events, searchTerm, currentDate, view]);

  return {
    searchTerm,
    setSearchTerm,
    filteredEvents,
  };
};
