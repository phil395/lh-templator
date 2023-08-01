import { useEffect, useRef } from "react";
import autosize from "autosize";

export const useAutosize = (deps: unknown) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    autosize(element);
    return () => {
      autosize.destroy(element);
    };
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    autosize.update(element);
  }, [deps]);

  return ref;
};
