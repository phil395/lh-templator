import { getNewTextNode } from "./template";
import { Template } from "./template.types";

export const DEFAULT_VAR_NAMES = [
  "firstname",
  "lastname",
  "company",
  "position",
];
export const DEFAULT_VAR_VALUES = "";

export const DEFAULT_TEMPLATE: Template = {
  usedVarNames: [],
  nodes: [getNewTextNode()]
};
