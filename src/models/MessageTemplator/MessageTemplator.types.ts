import type { ConditionNode, TemplateNode, TextNode } from "../template.types";

export interface MessageTemplatorActions {
  addCondition(
    textNodeId: string,
    textBefore: string,
    textAfter: string,
  ):
    | readonly [
        textNodeBefore: TextNode,
        conditionNode: ConditionNode,
        textNodeAfter: TextNode,
      ]
    | undefined;
  removeCondition(conditionNodeId: string): TextNode | undefined;
  updateTextNode(textNodeId: string, newText: string): TextNode | undefined;
  getNodes(): TemplateNode[];
}
