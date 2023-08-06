import type { FC } from "react";
import { useTemplateEditorStore } from "../../../store";
import styles from "./Variables.module.css";

interface Props {
  /** arrVarNames can be obtained from the store,
   *  but it is obtained through the props because it is used not only in the TemplateEditor,
   *  but also in the CommandPalette, where it gets this array in filtered form. */
  arrVarNames: string[];
}

export const Variables: FC<Props> = ({ arrVarNames }) => {
  const insertVarName = useTemplateEditorStore(
    ({ insertVarName }) => insertVarName,
  );

  if (!arrVarNames.length) return null;

  return (
    <ul className={styles.items}>
      {arrVarNames.map((varName, index) => (
        <li className={styles.item} key={index}>
          <button onClick={() => insertVarName(varName)}>
            {"{"}
            {varName}
            {"}"}
          </button>
        </li>
      ))}
    </ul>
  );
};
