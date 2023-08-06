import { FocusedTextarea } from "../../../../store";

/** The function provides focusing of the element, if necessary */
export const ensureFocus = (
  element: HTMLTextAreaElement,
  id: string,
  getFocusedTextarea: () => FocusedTextarea | null,
) => {
  const data = getFocusedTextarea();
  if (!data) return;
  const { id: focusedId, selectionStart, selectionEnd } = data;
  if (focusedId === id) {
    element.focus();
    element.selectionStart = selectionStart;
    element.selectionEnd = selectionEnd;
  }
};
