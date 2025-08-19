import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { MutationOptionsType } from '@/_entities/common/common.types';
import { Api } from '@/_libs/tools/axios.tools';

/**
 * DELETE 요청을 위한 뮤테이션 훅 매개변수
 */
interface DeleteMutationParams<TData, TVariables> {
  /** API 엔드포인트 URL 경로 배열 (예: ['api', 'users', userId]) */
  url: Array<string | number | undefined>;
  /** 무효화할 쿼리 키 (createQueryKeys 객체 또는 배열 형태) */
  key: { queryKey: readonly (string | number | Record<string, any>)[] } | string | Array<string | number | Record<string, any>>;
  /** React Query 뮤테이션 옵션 (선택사항) */
  options?: MutationOptionsType<TData, TVariables | void>;
}

/**
 * DELETE 요청을 위한 커스텀 뮤테이션 훅
 *
 * @template TData - 응답 데이터 타입
 * @template TVariables - 요청 변수 타입 (선택사항)
 * @param params - 뮤테이션 설정 매개변수
 * @param params.url - API 엔드포인트 URL 경로 배열
 * @param params.key - 성공 시 무효화할 쿼리 키
 * @param params.options - 추가 뮤테이션 옵션
 * @returns React Query 뮤테이션 객체
 *
 * @example
 * ```typescript
 * // 데이터 없이 DELETE 요청
 * const deleteUser = useDelete<DeleteUserResponse>({
 *   url: ['api', 'users', userId],
 *   key: usersKeys.all(),
 *   options: {
 *     onSuccess: () => {
 *       console.log('사용자 삭제 성공');
 *     }
 *   }
 * });
 *
 * // 데이터와 함께 DELETE 요청
 * const deleteUserWithData = useDelete<DeleteUserResponse, DeleteUserRequest>({
 *   url: ['api', 'users', userId],
 *   key: usersKeys.all(),
 *   options: {
 *     onSuccess: (data) => {
 *       console.log('사용자 삭제 성공:', data);
 *     }
 *   }
 * });
 * ```
 */
export function useDelete<TData = any, TVariables = any>({
  url,
  key,
  options,
}: DeleteMutationParams<TData, TVariables>) {
  const queryClient = useQueryClient();

  const queryKey = Array.isArray(key)
    ? key
    : typeof key === 'object' && 'queryKey' in key
      ? [ ...key.queryKey, ]
      : [ key, ];

  const urlPath = url.filter(Boolean).join('/');

  const fullUrl = `/${urlPath}`;

  return useMutation({
    mutationFn: async (variables?: TVariables) => {
      if (variables) {
        const response = await Api.deleteWithDataQuery<TData, TVariables>(
          fullUrl,
          variables
        );
        return response.data;
      }
      const response = await Api.deleteQuery<TData>(fullUrl);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey, });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}
