import { useEffect } from "react";

type EventHandler = (() => void) | ((event: Event) => void);

interface Options {
  target?: HTMLElement;
  altKey?: true;
  ctrlKey?: true;
  preventDefault?: true;
}

export const useKeyPress = (
  key: string | string[],
  handler: EventHandler,
  options: Options = {},
): void => {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      const altKeyMatch =
        typeof options.altKey !== "undefined"
          ? options.altKey === e.altKey
          : true;
      const ctrlKeyMatch =
        typeof options.ctrlKey !== "undefined"
          ? options.ctrlKey === e.ctrlKey
          : true;
      const keyMatch = Array.isArray(key) ? key.includes(e.key) : key === e.key;
      if (!keyMatch || !altKeyMatch || !ctrlKeyMatch) {
        return;
      }
      if (options.preventDefault) e.preventDefault();
      handler(e);
    };
    const target = options.target ?? document;
    target.addEventListener("keydown", listener as EventListener);
    return () => {
      target.removeEventListener("keydown", listener as EventListener);
    };
  }, [handler, key, options.altKey, options.ctrlKey, options.target, options.preventDefault]);
};
