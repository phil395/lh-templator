import type { TemplateNode } from "../template.types";

export interface MessageTemplatorActions {
  addCondition(textNodeId: string, textBefore: string, textAfter: string): void;
  removeCondition(conditionNodeId: string): void;
  updateTextNode(textNodeId: string, newText: string): void;
  getNodes(): TemplateNode[];
}
