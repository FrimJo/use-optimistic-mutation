import {
  useMutation,
  queryCache,
  MutationFunction,
  MutationOptions,
  MutateFunction,
  MutationResult,
  AnyQueryKey,
} from 'react-query'

type OptimisticMutateFunction<TResults, TVariables extends object> = MutateFunction<
  TResults,
  TVariables
>

/**
 * Proivded updateQuery key is used to expose a function to optimistically mutate that query.
 * When using exposed mutate function, query will be set to provided value, while running the mutation,
 * if the mutation fails, query is reset to previous value.
 *
 * @param queryKey The query key of the query to optimistically mutate.
 * @param mutationFn  The function to use to mutate the query.
 * @param mutationOptions Options to use in the useMutation hook.
 */
export default function useOptimisticMutation<TResults, TVariables extends object>(
  queryKey: AnyQueryKey | string,
  mutationFn: MutationFunction<TResults, TVariables>,
  mutationOptions: MutationOptions<TResults, TVariables> = {}
): [OptimisticMutateFunction<TResults, TVariables>, MutationResult<TResults>] {
  return useMutation(mutationFn, {
    ...mutationOptions,
    onMutate: (newVariables) => {
      if (!queryKey) {
        return undefined
      }

      // Snapshot the previous value
      const previousTodo = queryCache.getQueryData(queryKey) as TResults

      // Optimistically update to the new value
      queryCache.setQueryData(queryKey, newVariables)

      // Return the snapshotted value
      return previousTodo
    },
    onError: (previousVariables) => {
      queryCache.setQueryData(queryKey, previousVariables)
    },
    onSettled: () => {
      return queryCache.refetchQueries(queryKey)
    },
  })
}
