import { useState, useEffect } from 'react'

interface UseApiDataOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  initialData?: T
  enabled?: boolean
}

interface UseApiDataReturn<T> {
  data: T | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useApiData<T>(
  fetcher: () => Promise<T>,
  options: UseApiDataOptions<T> = {}
): UseApiDataReturn<T> {
  const { onSuccess, onError, initialData, enabled = true } = options
  const [data, setData] = useState<T | undefined>(initialData)
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    if (!enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetcher()
      setData(result)
      onSuccess?.(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [enabled])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  }
}

interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: Error, variables: TVariables) => void
}

interface UseMutationReturn<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<void>
  isLoading: boolean
  error: Error | null
  data: TData | undefined
}

export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseMutationOptions<TData, TVariables> = {}
): UseMutationReturn<TData, TVariables> {
  const { onSuccess, onError } = options
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<TData | undefined>(undefined)

  const mutate = async (variables: TVariables) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await mutationFn(variables)
      setData(result)
      onSuccess?.(result, variables)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      onError?.(error, variables)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    mutate,
    isLoading,
    error,
    data,
  }
}
