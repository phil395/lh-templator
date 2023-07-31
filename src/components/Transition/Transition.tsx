import { useLayoutEffect, useReducer, useRef, type FC } from "react";
import { usePrevious } from "../../hooks";
import styles from './Transition.module.css'

interface Props {
  children: React.ReactElement | null | false
  enter?: string
  enterFrom?: string
  enterTo?: string
  leave?: string
  leaveFrom?: string
  leaveTo?: string
}

/**
 * Lightweight implementation https://headlessui.com/react/transition
 * For props "enter" ... "leaveTo" - pass single css class (it is forbidden to pass multiple classes).
 * To start the "enter" transition, pass the jsx component as children prop.
 * To start the "leave" transition, pass "null" or "false" as children prop.
 * @example
 * <Transition
 *   enter="transition-opacity" // single css class
 *   enterFrom="opacity-0"
 *   enterTo="opacity-100"
 *   leave="transition-opacity"
 *   leaveFrom="opacity-100"
 *   leaveTo="opacity-0"
 * >
 *    {open ? <div>I will fade in and out</div> : null}
 * </Transition>
 */
export const Transition: FC<Props> = ({
  children,
  enter = styles["transition-opacity"],
  enterFrom = styles["opacity-0"],
  enterTo = styles["opacity-100"],
  leave = styles["transition-opacity"],
  leaveFrom = styles["opacity-100"],
  leaveTo = styles["opacity-0"],
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const previousChildren = usePrevious(children)
  const [, forcedUpdate] = useReducer(x => x + 1, 0)

  const show = async (element: Nullable<HTMLDivElement>, signal: AbortSignal) => {
    if (!element) return
    element.classList.remove(leaveTo, leave)
    element.classList.add(enterFrom, enter)
    requestAnimationFrame(() => {
      element.classList.add(enterTo)
      element.classList.remove(enterFrom)
    })
    element.addEventListener('transitionend', () => {
      element.classList.remove(enter)
    }, { once: true, signal })
  }

  const hide = async (element: Nullable<HTMLDivElement>, signal: AbortSignal) => {
    if (!element) return
    element.classList.remove(enterTo, enter)
    element.classList.add(leaveFrom, leave)
    requestAnimationFrame(() => {
      element.classList.add(leaveTo)
      element.classList.remove(leaveFrom)
    })
    element.addEventListener('transitionend', () => {
      forcedUpdate()
    }, { once: true, signal })
  }

  useLayoutEffect(() => {
    const abortController = new AbortController();
    // This is the moment when the "null" ("false") children is replaced by the jsx component
    if (!previousChildren && children) {
      show(ref.current, abortController.signal)
    }
    // This is the moment when "null" ("false") children came as children
    if (!children && previousChildren) {
      hide(ref.current, abortController.signal)
    }
    return () => { abortController.abort() }
  }, [children]) // eslint-disable-line


  if (children) {
    return <div ref={ref}>{children}</div>
  }

  if (previousChildren) {
    return <div ref={ref}>{previousChildren}</div>
  }

  return null
}
