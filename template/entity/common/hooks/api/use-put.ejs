import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { MutationOptionsType } from '@/_entities/common/common.types';
import { Api } from '@/_libs/tools/axios.tools';

/**
 * PUT 요청을 위한 뮤테이션 훅 매개변수
 */
interface MutationWithDataParams<TData, TVariables> {
  /** API 엔드포인트 URL 경로 배열 (예: ['api', 'users', userId]) */
  url: Array<string | number | undefined>;
  /** 무효화할 쿼리 키 (createQueryKeys 객체 또는 배열 형태) */
  key: { queryKey: readonly (string | number | Record<string, any>)[] } | string | Array<string | number | Record<string, any>>;
  /** React Query 뮤테이션 옵션 (선택사항) */
  options?: MutationOptionsType<TData, TVariables>;
}

/**
 * PUT 요청을 위한 커스텀 뮤테이션 훅
 *
 * @template TData - 응답 데이터 타입
 * @template TVariables - 요청 변수 타입
 * @param params - 뮤테이션 설정 매개변수
 * @param params.url - API 엔드포인트 URL 경로 배열
 * @param params.key - 성공 시 무효화할 쿼리 키
 * @param params.options - 추가 뮤테이션 옵션
 * @returns React Query 뮤테이션 객체
 *
 * @example
 * ```typescript
 * const updateUser = usePut<UpdateUserResponse, UpdateUserRequest>({
 *   url: ['api', 'users', userId],
 *   key: usersKeys.all(),
 *   options: {
 *     onSuccess: (data) => {
 *       console.log('사용자 업데이트 성공:', data);
 *     }
 *   }
 * });
 * ```
 */
export function usePut<TData = any, TVariables = any>({
  url,
  key,
  options,
}: MutationWithDataParams<TData, TVariables>) {
  const queryClient = useQueryClient();

  const queryKey = Array.isArray(key)
    ? key
    : typeof key === 'object' && 'queryKey' in key
      ? [ ...key.queryKey, ]
      : [ key, ];

  const urlPath = url.filter(Boolean).join('/');

  const fullUrl = `/${urlPath}`;

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const response = await Api.putQuery<TData, TVariables>(fullUrl, variables);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey, });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}
