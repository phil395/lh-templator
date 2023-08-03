import type { FC } from "react";
import { useTemplateEditorStore } from "../../../store";
import styles from "./Variables.module.css";

export const Variables: FC = () => {
  const { insertVarName, arrVarNames } = useTemplateEditorStore(
    ({ insertVarName, props }) => ({
      insertVarName,
      arrVarNames: props?.arrVarNames,
    }),
  );

  if (!arrVarNames) return null;

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
