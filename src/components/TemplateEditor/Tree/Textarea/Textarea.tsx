import { useEffect, memo, type FC, useRef } from "react";
import { useAutosize } from "../../../../hooks";
import { useTemplateEditorStore } from "../../../../store";
import { ensureFocus } from "./Textarea.utils";
import type { TextNode } from "../../../../models";

interface Props extends TextNode {}

export const Textarea: FC<Props> = memo(({ id, value }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const { updateTextNode, getFocusedTextarea, setLastTextarea } =
    useTemplateEditorStore(
      ({ updateTextNode, getFocusedTextarea, setLastTextarea }) => ({
        updateTextNode,
        getFocusedTextarea,
        setLastTextarea,
      }),
    );

  const onBlur = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    const { value: inputValue, selectionStart, selectionEnd } = e.target;
    if (value !== inputValue) updateTextNode(id, inputValue);
    setLastTextarea({ id, value: inputValue, selectionStart, selectionEnd });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.value = value;
    ensureFocus(el, id, getFocusedTextarea);
  }, [value]); // eslint-disable-line

  useAutosize(ref, [value]);

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
