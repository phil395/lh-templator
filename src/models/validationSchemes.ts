import {
  object,
  array,
  string,
  union,
  literal,
  lazy,
  type Describe,
} from "superstruct";
import { ConditionNode, Template, TextNode } from "./template.types";

const TextNodeSchema: Describe<TextNode> = object({
  id: string(),
  type: literal("text"),
  value: string(),
});

const ConditionNodeSchema: Describe<ConditionNode> = object({
  id: string(),
  type: literal("condition"),
  nodes: object({
    if: array(lazy(() => union([TextNodeSchema, ConditionNodeSchema]))),
    then: array(lazy(() => union([TextNodeSchema, ConditionNodeSchema]))),
    else: array(lazy(() => union([TextNodeSchema, ConditionNodeSchema]))),
  }),
});

export const TemplateSchema: Describe<Template> = object({
  usedVarNames: array(string()),
  nodes: array(union([TextNodeSchema, ConditionNodeSchema])),
});

export const ArrVarNamesSchema = array(string());
