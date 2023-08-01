import { useEffect } from "react";

type EventHandler = (() => void) | ((event: Event) => void);

export const useKeyPress = (
  ref: React.RefObject<Element>,
  handler: EventHandler,
  key: string,
): void => {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (!ref.current || event.key !== key) {
        return;
      }
      handler(event);
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [handler, key, ref]);
};
