import { Ref, useCallback } from "react";

export const useCombinedRefs = <T>(...refs: Ref<T>[]) => {
  return useCallback((element: T | null) => {
    for (const ref of refs) {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(element);
      } else {
        (ref as any).current = element;
      }
    }
  }, [refs])
}
