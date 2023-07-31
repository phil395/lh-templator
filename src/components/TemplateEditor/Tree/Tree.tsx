import type { FC } from "react";
import { useTemplateEditorStore } from "../../../store";
import { defineComponent } from "./defineComponent";

export const Tree: FC = () => {
  const nodes = useTemplateEditorStore(({ nodes }) => nodes)

  if (!nodes) return null

  return (
    <div>
      {nodes.map(defineComponent)}
    </div>
  )
}
