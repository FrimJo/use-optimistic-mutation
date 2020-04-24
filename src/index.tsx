import {
  useMutation,
  queryCache,
  MutationFunction,
  MutationOptions,
  MutateFunction,
  MutationResult,
  AnyQueryKey,
  AnyVariables,
} from 'react-query';
import React from 'react';

type OptimisticMutateFunction<
  TResults,
  TVariables extends object
> = MutateFunction<TResults, TVariables>;

/**
 * Proivded updateQuery key is used to expose a function to optimistically mutate that query.
 * When using exposed mutate function, query will be set to provided value, while running the mutation,
 * if the mutation fails, query is reset to previous value.
 *
 * @param queryKey The query key of the query to optimistically mutate.
 * @param mutationFn  The function to use to mutate the query.
 * @param mutationOptions Options to use in the useMutation hook.
 */
export default function useOptimisticMutation<
  TResults,
  TKey extends AnyQueryKey,
  TVariables extends AnyVariables = []
>(
  queryKey:
    | TKey
    | false
    | null
    | undefined
    | (() => TKey | false | null | undefined), // Use same api for query key as useQuery
  mutationFn: MutationFunction<TResults, TVariables>,
  mutationOptions: MutationOptions<TResults, TVariables> = {}
): [OptimisticMutateFunction<TResults, TVariables>, MutationResult<TResults>] {
  const key = React.useMemo(
    () => (typeof queryKey === 'function' ? queryKey() : queryKey),
    [queryKey]
  );

  return useMutation(mutationFn, {
    ...mutationOptions,
    onMutate: newVariables => {
      if (key === undefined || key === false || key === null) {
        return undefined;
      }

      // Snapshot the previous value
      const previousVariables = queryCache.getQueryData(key) as TResults;

      // Optimistically update to the new value
      queryCache.setQueryData(key, newVariables);

      // Return the snapshotted value
      return previousVariables;
    },
    onError: previousVariables => {
      if (key === undefined || key === false || key === null) {
        return;
      }
      queryCache.setQueryData(key, previousVariables);
    },
    onSettled: () => {
      if (key === undefined || key === false || key === null) {
        return;
      }
      return queryCache.refetchQueries(key);
    },
  });
}
