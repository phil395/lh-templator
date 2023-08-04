import { useEffect, memo, type FC, useRef } from "react";
import { useAutosize } from "../../../../hooks";
import { useTemplateEditorStore } from "../../../../store";
import type { TextNode } from "../../../../models";

interface Props extends TextNode { }

export const Textarea: FC<Props> = memo(({ id, value }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const { updateTextNode, getFocusedTextarea } = useTemplateEditorStore(
    ({ updateTextNode, getFocusedTextarea }) => ({ updateTextNode, getFocusedTextarea }),
  );

  const onBlur = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    const { value: v, selectionStart, selectionEnd } = e.target;
    updateTextNode({ id, value: v, selectionStart, selectionEnd });
  };

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.value = value
    const focused = getFocusedTextarea()
    if (!focused) return
    const { id: focusedId, selectionStart, selectionEnd } = focused
    if (focusedId === id) {
      el.focus()
      el.selectionStart = selectionStart
      el.selectionEnd = selectionEnd
    }
  }, [value]); // eslint-disable-line

  useAutosize(ref, [value])

  return (
    <textarea
      ref={ref}
      className="text-field"
      rows={1}
      defaultValue={value}
      placeholder="Optional text"
      onBlur={onBlur}
      spellCheck={true}
    ></textarea>
  );
});
