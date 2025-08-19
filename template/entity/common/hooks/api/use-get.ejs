import {
  useQuery,
  useInfiniteQuery,
  type InfiniteData
} from '@tanstack/react-query';

import type {
  QueryOptionType,
  InfiniteQueryOptionType
} from '@/_entities/common/common.types';
import { useDone, useLoading } from '@/_entities/common/hooks';
import { Api } from '@/_libs/tools/axios.tools';

/**
 * GET 요청을 위한 쿼리 훅 매개변수
 */
interface GetParams<T = any> {
  /** API 엔드포인트 URL 경로 배열 (예: ['api', 'users']) */
  url: Array<string | number | undefined>;
  /** 쿼리 키 (createQueryKeys 객체 또는 배열 형태) */
  key: { queryKey: readonly (string | number | Record<string, any>)[] } | string | Array<string | number | Record<string, any>>;
  /** URL 쿼리 파라미터 객체 (선택사항) */
  params?: Record<string, any>;
  /** React Query 옵션 (선택사항) */
  options?: QueryOptionType<T>;
}

/**
 * GET 요청을 위한 커스텀 쿼리 훅
 *
 * @template T - 응답 데이터 타입
 * @param params - 쿼리 설정 매개변수
 * @param params.url - API 엔드포인트 URL 경로 배열
 * @param params.key - 쿼리 키
 * @param params.params - URL 쿼리 파라미터
 * @param params.options - 추가 쿼리 옵션
 * @returns 쿼리 결과 객체 (data, loading, done, ...)
 *
 * @example
 * ```typescript
 * const { data: users, loading, done } = useGet<UserInfo[]>({
 *   url: ['api', 'users'],
 *   key: usersKeys.all(),
 *   params: { page: 1, limit: 10 },
 *   options: {
 *     staleTime: 5 * 60 * 1000 // 5분
 *   }
 * });
 * ```
 */
export function useGet<T = any>({
  url,
  key,
  params,
  options,
}: GetParams<T>) {
  // 키 처리: 문자열이면 배열로 변환, 이미 배열이면 그대로 사용
  const queryKey = Array.isArray(key)
    ? key
    : typeof key === 'object' && 'queryKey' in key
      ? [ ...key.queryKey, ]
      : [ key, ];

  // URL 배열을 문자열로 결합하고 undefined 값 필터링
  const urlPath = url.filter(Boolean).join('/');

  // 쿼리 파라미터 문자열 생성
  const queryString = params
    ? '?' + new URLSearchParams(params).toString()
    : '';

  // 최종 URL 생성
  const fullUrl = `/${urlPath}${queryString}`;

  // enabled 조건: URL 배열의 모든 요소가 유효할 때만 실행
  const enabled = url.every(
    (segment) => segment !== undefined && segment !== null && segment !== ''
  );

  const { data, isLoading, isFetching, isSuccess, ...other } = useQuery({
    queryKey: [ ...queryKey, url, params, ],
    queryFn: () => Api.getQuery<T>(fullUrl),
    select: (res) => res.data,
    enabled,
    ...options,
  });

  const loading = useLoading(isLoading, isFetching);
  const done = useDone(loading, isSuccess);

  return {
    data,
    loading,
    done,
    ...other,
  };
}

/**
 * 무한 스크롤 GET 요청을 위한 쿼리 훅 매개변수
 */
interface GetInfiniteParams<T = any> {
  /** API 엔드포인트 URL 경로 배열 (예: ['api', 'users']) */
  url: Array<string | number | undefined>;
  /** 쿼리 키 (createQueryKeys 객체 또는 배열 형태) */
  key: { queryKey: readonly (string | number | Record<string, any>)[] } | string | Array<string | number | Record<string, any>>;
  /** URL 쿼리 파라미터 객체 (선택사항) */
  params?: Record<string, any>;
  /** React Query 무한 쿼리 옵션 (선택사항) */
  options?: InfiniteQueryOptionType<T>;
}

/**
 * 무한 스크롤 GET 요청을 위한 커스텀 쿼리 훅
 *
 * @template T - 응답 데이터 타입
 * @param params - 무한 쿼리 설정 매개변수
 * @param params.url - API 엔드포인트 URL 경로 배열
 * @param params.key - 쿼리 키
 * @param params.params - URL 쿼리 파라미터
 * @param params.options - 추가 무한 쿼리 옵션
 * @returns 무한 쿼리 결과 객체 (data, loading, done, fetchNextPage, hasNextPage, ...)
 *
 * @example
 * ```typescript
 * const {
 *   data: users,
 *   loading,
 *   done,
 *   fetchNextPage,
 *   hasNextPage
 * } = useGetInfinite<UserInfo[]>({
 *   url: ['api', 'users'],
 *   key: usersKeys.lists(),
 *   params: { limit: 20 },
 *   options: {
 *     staleTime: 5 * 60 * 1000
 *   }
 * });
 * ```
 */
export function useGetInfinite<T = any>({
  url,
  key,
  params,
  options,
}: GetInfiniteParams<T>) {
  // 키 처리: 문자열이면 배열로 변환, 이미 배열이면 그대로 사용
  const queryKey = Array.isArray(key)
    ? key
    : typeof key === 'object' && 'queryKey' in key
      ? [ ...key.queryKey, ]
      : [ key, ];

  // URL 배열을 문자열로 결합하고 undefined 값 필터링
  const urlPath = url.filter(Boolean).join('/');

  // enabled 조건: URL 배열의 모든 요소가 유효할 때만 실행
  const enabled = url.every(
    (segment) => segment !== undefined && segment !== null && segment !== ''
  );

  const {
    data,
    isLoading,
    isFetching,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    ...other
  } = useInfiniteQuery({
    queryKey: [ ...queryKey, url, 'infinite', ],
    queryFn: async ({ pageParam = 1, }) => {
      const queryString = params
        ? '?'
        + new URLSearchParams({
          ...params,
          page: pageParam.toString(),
        }).toString()
        : '?page=' + pageParam.toString();

      const fullUrl = `/${urlPath}${queryString}`;
      return Api.getQuery<T>(fullUrl);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // 마지막 페이지가 비어있거나 최대 페이지에 도달했으면 undefined 반환
      if (
        !lastPage.data
        || (Array.isArray(lastPage.data) && lastPage.data.length === 0)
      ) {
        return undefined;
      }
      const nextPage = allPages.length + 1;
      return nextPage;
    },
    enabled,
    ...options,
  });

  const loading = useLoading(isLoading, isFetching);
  const done = useDone(loading, isSuccess);

  // InfiniteData 타입으로 캐스팅하여 타입 안전성 유지
  const infiniteData = data as unknown as
    | InfiniteData<{ data: T }>
    | undefined;

  return {
    data: infiniteData?.pages.flatMap((page) => page.data) || [],
    pageParams: infiniteData?.pageParams || [],
    loading,
    done,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    ...other,
  };
}
