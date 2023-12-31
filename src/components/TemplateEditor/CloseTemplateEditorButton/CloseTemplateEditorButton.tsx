import { FC } from "react";
import { Button } from "../../Button";
import { useTemplateEditorStore } from "../../../store";
import { useModal } from "../../../context";
import { SaveDialog } from "../SaveDialog";

export const CloseTemplateEditorButton: FC = () => {
  const { closeEditor, hasChanges } = useTemplateEditorStore(
    ({ closeEditor, hasChanges }) => ({
      closeEditor,
      hasChanges,
    }),
  );
  const { show } = useModal();

  const handler = () => {
    if (hasChanges) show(<SaveDialog />);
    else closeEditor();
  };

  return <Button icon="close" color="red" content="Close" onClick={handler} />;
};
