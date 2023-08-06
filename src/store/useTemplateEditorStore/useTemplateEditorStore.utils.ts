import type { MessageTemplator, TextNode } from "../../models";
import type { FocusedTextarea, LastTextarea } from "./useTemplateEditorStore";

/** Extract data from the first TextNode to set it as LastTextarea
 *  until the user selects another textarea
 */
export const getInitialTextarea = (
  templator: MessageTemplator,
): LastTextarea => {
  const { id, value } = templator.getNodes()[0] as TextNode;
  return {
    id,
    value,
    selectionStart: value.length,
    selectionEnd: value.length,
  };
};

/** Split the lastTextarea into two parts: textBefore and textAfter,
 *  variables or conditions are inserted between them
 */
export const splitLastTextarea = (
  lastTextarea: LastTextarea,
): {
  id: LastTextarea["id"];
  textBefore: string;
  textAfter: string;
} => {
  const { id, value, selectionStart, selectionEnd } = lastTextarea;
  return {
    id,
    textBefore: value.slice(0, selectionStart),
    textAfter: value.slice(selectionEnd),
  };
};

/** The function builds an object corresponding to the specified interface.
 *  At the same time, take care of the processing of missing values */
export const buildFocusedTextarea = (
  id: string,
  start?: number,
  end?: number,
): FocusedTextarea => {
  if (!start && !end) {
    return { id, selectionStart: 0, selectionEnd: 0 };
  }
  if (!end) {
    return { id, selectionStart: start!, selectionEnd: start! };
  }
  return { id, selectionStart: start!, selectionEnd: end };
};
