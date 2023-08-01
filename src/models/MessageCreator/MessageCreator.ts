import { TemplateNode } from "../template";

export class MessageCreator {
  constructor(
    private template: TemplateNode[],
    private variables: Record<string, string>,
  ) { }

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
    return dfs(this.template);
  }

  /**
   * Sets variables to a template string.
   * If the variable is not in the list, an empty string will be substituted instead
   * @example
   * // variables: { firstname: "Bob" }
   * substituteVariables("Hello, {firstname}")     // output: "Hello, Bob"
   * substituteVariables("Hello, {name}")          // output: "Hello, "
   * substituteVariables("Hello, { firstname  }")  // output: "Hello, Bob"
   */
  private substituteVariables(text: string) {
    const regex = /\{(.*?)\}/g;
    return text.replace(regex, (_, variableName: string) => {
      return this.variables[variableName.trim()] ?? "";
    });
  }

  updateVariableValue(variableName: string, newValue: string) {
    this.variables[variableName] = newValue;
  }
}
