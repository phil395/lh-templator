import { memo, type FC } from "react";
import { Button } from "../../../Button";
import { defineComponent } from "../defineComponent";
import { useTemplateEditorStore } from "../../../../store";
import type { ConditionNode } from "../../../../models";
import styles from "./Condition.module.css";

interface Props extends ConditionNode {}

const renderItem = (
  type: "if" | "then" | "else",
  nodes: Props["nodes"][typeof type],
) => (
  <div key={type} className={styles.item}>
    <h6>{type}</h6>
    <div>{nodes.map(defineComponent)}</div>
  </div>
);

export const Condition: FC<Props> = memo(({ id, nodes }) => {
  const removeCondition = useTemplateEditorStore(
    ({ removeCondition }) => removeCondition,
  );

  return (
    <div className={styles.condition}>
      <Button icon="close" color="dark" onClick={() => removeCondition(id)} />
      <div className={styles.items}>
        {(["if", "then", "else"] as const).map((type) => {
          return renderItem(type, nodes[type]);
        })}
      </div>
    </div>
  );
});
