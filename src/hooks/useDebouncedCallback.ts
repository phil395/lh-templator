import { useRef, useEffect, useCallback } from "react"

type AnyFunc = (...args: any[]) => any

export const useDebouncedCallback = <T extends AnyFunc>(func: T, delay: number) => {
  const timerId = useRef<number | null>(null)

  const cancel = useCallback(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
  }, []);

  useEffect(() => () => cancel(), [cancel])

  return useCallback((...args: Parameters<T>) => {
    cancel()
    timerId.current = setTimeout(func, delay, ...args) as unknown as number
  }, [delay, func, cancel])
}
