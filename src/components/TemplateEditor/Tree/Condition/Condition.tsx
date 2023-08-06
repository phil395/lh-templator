import { memo, useLayoutEffect, useRef, type FC } from "react";
import { Button } from "../../../Button";
import { defineComponent } from "../defineComponent";
import { useTemplateEditorStore } from "../../../../store";
import { useCSSTransition, type CSSTransitionClasses } from "../../../../hooks";
import type { ConditionNode } from "../../../../models";
import styles from "./Condition.module.css";

interface Props extends ConditionNode {}

const transitionStyles: CSSTransitionClasses = {
  enter: styles.enter,
  enterFrom: styles.enterFrom,
  enterTo: styles.enterTo,
  leave: styles.leave,
  leaveFrom: styles.leaveFrom,
  leaveTo: styles.leaveTo,
};

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
  const ref = useRef<HTMLDivElement>(null);
  const abortController = useRef<AbortController | null>(null);
  const { show, hide } = useCSSTransition(transitionStyles);

  /** Starting the transition of the disappearance of the condition block and the text block that follows it
   *  After the transition is completed, an action is sent to delete the condition block */
  const onCloseButtonClick = async () => {
    const ac = abortController.current;
    const conditionEl = ref.current;
    const nextTextareaEl = conditionEl?.nextElementSibling;
    await Promise.all([
      hide(conditionEl, ac?.signal),
      hide(nextTextareaEl, ac?.signal),
    ]);
    removeCondition(id);
  };

  /** Starting the transition of the appearance of the condition block and the text block that follows it */
  useLayoutEffect(() => {
    const ac = new AbortController();
    abortController.current = ac;
    const conditionEl = ref.current;
    const nextTextareaEl = conditionEl?.nextElementSibling;
    show(conditionEl, ac.signal);
    show(nextTextareaEl, ac.signal);
    return () => {
      abortController.current?.abort();
    };
  }, []); // eslint-disable-line

  return (
    <div ref={ref} className={styles.condition}>
      <Button icon="close" color="dark" onClick={onCloseButtonClick} />
      <div className={styles.items}>
        {(["if", "then", "else"] as const).map((type) => {
          return renderItem(type, nodes[type]);
        })}
      </div>
    </div>
  );
});
