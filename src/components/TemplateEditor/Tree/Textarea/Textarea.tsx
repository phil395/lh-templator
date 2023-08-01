import { useEffect, memo, useState, type FC } from "react";
import { useAutosize } from "../../../../hooks";
import { useTemplateEditorStore } from "../../../../store";
import type { TextNode } from "../../../../models";

interface Props extends TextNode {}

export const Textarea: FC<Props> = memo(({ id, value }) => {
  const [inputValue, setInputValue] = useState(value);
  const updateTextNode = useTemplateEditorStore(
    ({ updateTextNode }) => updateTextNode,
  );
  const ref = useAutosize([value]);

  const onBlur = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    const { value, selectionStart, selectionEnd } = e.target;
    updateTextNode({ id, value, selectionStart, selectionEnd });
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <textarea
      ref={ref}
      className="text-field"
      rows={1}
      value={inputValue}
      placeholder="Optional text"
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={onBlur}
      spellCheck={true}
    ></textarea>
  );
});
