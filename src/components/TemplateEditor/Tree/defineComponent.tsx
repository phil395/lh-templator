import { Condition } from "./Condition";
import { Textarea } from "./Textarea";
import type { TemplateNode } from "../../../models";

export const defineComponent = (node: TemplateNode) => {
  if (node.type === "text") {
    return <Textarea key={node.id} {...node} />;
  }
  return <Condition key={node.id} {...node} />;
};
