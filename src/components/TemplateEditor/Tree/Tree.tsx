import type { FC } from "react";
import { useTemplateEditorStore } from "../../../store";
import { defineComponent } from "./defineComponent";
import styles from "./Tree.module.css";

export const Tree: FC = () => {
  const nodes = useTemplateEditorStore(({ nodes }) => nodes);

  if (!nodes) return null;

  return <div className={styles.root}>{nodes.map(defineComponent)}</div>;
};
