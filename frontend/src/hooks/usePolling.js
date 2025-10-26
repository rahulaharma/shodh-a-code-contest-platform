import { useEffect, useRef } from 'react'

export function usePolling(callback, interval = 2000, options = {}) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (options.disabled) return undefined

    const id = setInterval(() => {
      savedCallback.current?.()
    }, interval)

    return () => clearInterval(id)
  }, [interval, options.disabled])
}
