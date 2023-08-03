import { Template, TemplateNode } from "../template.types";

export class MessageCreator {
  private usedVarNames: Set<string>;

  constructor(
    private template: Template,
    private variables: Record<string, string>,
  ) {
    this.usedVarNames = new Set(template.usedVarNames);
  }

  create(): string {
    const dfs = (parent: TemplateNode[]): string => {
      const textParts = [];
      for (const node of parent) {
        if (node.type === "text") {
          textParts.push(this.substituteVariables(node.value));
          continue;
        }
        if (dfs(node.nodes.if)) {
          textParts.push(dfs(node.nodes.then));
        } else {
          textParts.push(dfs(node.nodes.else));
        }
      }
      return textParts.join("");
    };
    return dfs(this.template.nodes);
  }

  /**
   * Sets variables to a template string.
   * - if the variable is NOT in the "usedVarNames" list, then it is treated as plain text;
   * - if the variable in the list is "usedVarNames":
   *   - and it is NOT in the dictionary "variables", then an empty value will be substituted;
   *   - and it is in the dictionary "variables", then its value will be substituted
   * @example
   * // case 1
   * // usedVarNames: ["firstname"]
   * // variables: {firstname: "Bob", town: "New York"}
   * substituteVariables("Hello {firstname}. Welcome to {town}")  // output: "Hello Bob. Welcome to {town}"
   *
   * // case 2
   * // usedVarNames: ["firstname"]
   * // variables: {town: "New York", age: 20}
   * substituteVariables("Hello {firstname}. Welcome to {town}")  // output: "Hello . Welcome to {town}"
   */
  private substituteVariables(text: string) {
    const regex = /\{(\w+)\}/g;
    return text.replace(regex, (match: string, varName: string) => {
      if (this.usedVarNames.has(varName)) {
        return this.variables[varName] ?? "";
      }
      return match
    });
  }

  updateVariableValue(variableName: string, newValue: string) {
    this.variables[variableName] = newValue;
  }
}
