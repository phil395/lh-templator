import { uuid } from "../utils";
import { ConditionNode, TextNode } from "./template.types";


export const getNewTextNode = (value: string = ""): TextNode => ({
  id: uuid(),
  type: "text",
  value,
});

export const getDefaultConditionNode = (): ConditionNode => ({
  id: uuid(),
  type: "condition",
  nodes: {
    if: [getNewTextNode()],
    then: [getNewTextNode()],
    else: [getNewTextNode()],
  },
});
