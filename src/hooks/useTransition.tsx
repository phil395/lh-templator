import { useMemo } from "react";

/**
 * The idea is taken from https://headlessui.com/react/transition
 * Every field - single css class */
export interface CSSTransitionClasses {
  enter: string;
  enterFrom: string;
  enterTo: string;
  leave: string;
  leaveFrom: string;
  leaveTo: string;
}

type CSSTransitionFn = (
  element: Nullable<Element>,
  signal?: AbortSignal,
) => Promise<void>;

interface CSSTransitionActions {
  show: CSSTransitionFn;
  hide: CSSTransitionFn;
}

/** Disable the animation for people who can't stand to watch it. */
const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : undefined;

export const useCSSTransition = ({
  enter,
  enterFrom,
  enterTo,
  leave,
  leaveFrom,
  leaveTo,
}: CSSTransitionClasses) => {
  return useMemo<CSSTransitionActions>(
    () => ({
      show: (element, signal) => {
        return new Promise((resolve) => {
          if (!element || signal?.aborted || prefersReducedMotion) {
            resolve();
            return;
          }
          element.classList.remove(leaveTo, leave);
          element.classList.add(enterFrom, enter);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              element.classList.add(enterTo);
              element.classList.remove(enterFrom);
            });
          });
          const onEnd = () => {
            element?.classList.remove(enter);
            resolve();
          };
          const handler = () => {
            onEnd();
            signal?.removeEventListener("abort", onEnd);
          };
          element.addEventListener("transitionend", handler, {
            once: true,
            signal,
          });
          signal?.addEventListener("abort", onEnd, { once: true });
        });
      },
      hide: (element, signal) => {
        return new Promise((resolve) => {
          if (!element || signal?.aborted || prefersReducedMotion) {
            resolve();
            return;
          }
          element.classList.remove(enterTo, enter);
          element.classList.add(leaveFrom, leave);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              element.classList.add(leaveTo);
              element.classList.remove(leaveFrom);
            });
          });
          const onEnd = () => {
            resolve();
          };
          const handler = () => {
            onEnd();
            signal?.removeEventListener("abort", onEnd);
          };
          element.addEventListener("transitionend", handler, {
            once: true,
            signal,
          });
          signal?.addEventListener("abort", onEnd, { once: true });
        });
      },
    }),
    [enter, enterFrom, enterTo, leave, leaveFrom, leaveTo],
  );
};
