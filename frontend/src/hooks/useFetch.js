import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

export function useFetch(fetchFn, deps = [], options = {}) {
  const { immediate = true, onSuccess, onError, errorMessage } = options
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError]     = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn(...args)
      setData(result)
      onSuccess?.(result)
      return result
    } catch (err) {
      const msg = err?.response?.data?.message || errorMessage || 'Something went wrong'
      setError(msg)
      onError?.(err)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => {
    if (immediate) execute()
  }, [execute, immediate])

  return { data, loading, error, refetch: execute }
}
