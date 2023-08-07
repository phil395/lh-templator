import {
  object,
  array,
  string,
  union,
  literal,
  lazy,
  type Describe,
} from "superstruct";
import { uuid } from "../utils";
import type { ConditionNode, Template, TextNode } from "./template.types";

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
