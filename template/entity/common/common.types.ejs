import type { SuccessPayload, ErrorPayload } from '@repo/dto';
import type {
  UseQueryOptions,
  UseMutationOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
  QueryKey
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export type QueryOptionType<T> = UseQueryOptions<
  SuccessPayload<T>,
  AxiosError<ErrorPayload>,
  T
>;

export type InfiniteQueryOptionType<
  T,
  TPageParam = unknown
> = Omit<
  UseInfiniteQueryOptions<
    SuccessPayload<T>,
    AxiosError<ErrorPayload>,
    SuccessPayload<T>,
    QueryKey,
    TPageParam
  >,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>;

export type InfiniteQueryOptionTypeFor<
  TQueryFnData = unknown,
  TPageParam = unknown,
  TError = unknown
> = Omit<
  UseInfiniteQueryOptions<
    TQueryFnData,
    TError,
    InfiniteData<TQueryFnData>,
    QueryKey,
    TPageParam
  >,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>;

export type MutationOptionsType<TData, TVariables> = Omit<
  UseMutationOptions<TData, AxiosError<ErrorPayload>, TVariables>,
  'mutationFn'
>;

export type OpenGraphType
  = | 'article'
    | 'book'
    | 'music.song'
    | 'music.album'
    | 'music.playlist'
    | 'music.radio_station'
    | 'profile'
    | 'website'
    | 'video.tv_show'
    | 'video.other'
    | 'video.movie'
    | 'video.episode';

export interface SiteMetadata {
  title: string;
  url: string;
  description?: string;
  author?: string;
  keywords?: string;
  type?: OpenGraphType;
  tags?: string;
  section?: string;
  created?: string;
  updated?: string;
  imageLink?: string;
  imageAlt?: string;
  robots?:
    | 'index, follow'
    | 'noindex, nofollow'
    | 'index, nofollow'
    | 'noindex, follow';
}
