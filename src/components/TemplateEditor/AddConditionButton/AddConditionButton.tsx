import { FC } from "react";
import { Button } from "../../Button";
import { useTemplateEditorStore } from "../../../store";
import styles from "./AddConditionButton.module.css";
import clsx from "clsx";

interface Props {
  colored?: boolean;
  major?: boolean;
}

export const AddConditionButton: FC<Props> = ({
  colored = true,
  major = true,
}) => {
  const addCondition = useTemplateEditorStore(
    ({ addCondition }) => addCondition,
  );
  return (
    <Button
      icon="condition"
      className={clsx(styles.button, {
        [styles.colored]: colored,
        [styles.major]: major,
      })}
      content={
        <>
          <span>if</span>|<span>then</span>|<span>else</span>
        </>
      }
      onClick={addCondition}
    />
  );
};
