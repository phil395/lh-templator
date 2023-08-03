export type TextNode = {
  id: string;
  type: "text";
  value: string;
};

export type ConditionNode = {
  id: string;
  type: "condition";
  nodes: {
    if: TemplateNode[];
    then: TemplateNode[];
    else: TemplateNode[];
  };
};

export type TemplateNode = TextNode | ConditionNode;

export type Template = {
  usedVarNames: string[];
  nodes: TemplateNode[];
};
