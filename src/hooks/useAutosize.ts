import { useEffect } from "react";
import autosize from "autosize";

export const useAutosize = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  deps: unknown[],
) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    autosize(element);
    return () => {
      autosize.destroy(element);
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    autosize.update(element);
  }, [deps]); // eslint-disable-line
};
