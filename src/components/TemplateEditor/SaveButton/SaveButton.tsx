import type { FC } from "react";
import { useTemplateEditorStore } from "../../../store";
import { Button } from "../../Button";

export const SaveButton: FC = () => {
  const save = useTemplateEditorStore(({ save }) => save);

  return <Button onClick={save} content="Save" icon="done" color="green" />;
};
