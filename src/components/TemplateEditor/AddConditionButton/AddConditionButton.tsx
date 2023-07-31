import { FC } from "react";
import { Button } from "../../Button";
import { useTemplateEditorStore } from "../../../store";
import styles from "./AddConditionButton.module.css";

export const AddConditionButton: FC = () => {
  const addCondition = useTemplateEditorStore(({ addCondition }) => addCondition)
  return (
    <Button
      icon="condition"
      className={styles.addConditionButton}
      content={<><span>if</span>|<span>then</span>|<span>else</span></>}
      onClick={addCondition}
    />
  )
}
