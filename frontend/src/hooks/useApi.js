import { useState, useEffect, useCallback } from 'react'

export const useApi = (apiFunction, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...params) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiFunction(...params)
      setData(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFunction])

  useEffect(() => {
    if (options.autoFetch !== false) {
      execute()
    }
  }, [execute])

  return { data, loading, error, refetch: execute }
}