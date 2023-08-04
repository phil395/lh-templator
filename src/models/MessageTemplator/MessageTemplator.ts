import type { MessageTemplatorActions } from "./MessageTemplator.types";
import { getDefaultConditionNode, getNewTextNode } from "../template";
import type { ConditionNode, Template, TemplateNode, TextNode } from "../template.types";
import { produce } from "immer";

export class MessageTemplator implements MessageTemplatorActions {
  private varNames: Set<string>;
  private nodes: TemplateNode[];

  constructor(template: Template, varNames: string[],) {
    this.varNames = new Set(varNames);
    this.nodes = template.nodes
  }

  /**
   * Uses depth-first search to find the target node.
   * Returns the node itself and a reference to the parent array.
   * A reference to the parent array is needed in order to delete
   * a node or insert others before or after it
   * (using Array.prototype.splice)
   */
  private findNode(
    nodeId: string,
    root: TemplateNode[],
  ): [node: TemplateNode, parent: TemplateNode[]] | undefined {
    const dfs = (parent: TemplateNode[]): ReturnType<typeof this.findNode> => {
      for (const node of parent) {
        if (node.id === nodeId) {
          return [node, parent];
        }
        if (node.type === "condition") {
          for (const field of ["if", "then", "else"] as const) {
            const result = dfs(node.nodes[field]);
            if (result) return result;
          }
        }
      }
    };
    return dfs(root);
  }

  /**
   *  It goes through all nodes and parse the contents of the curly braces, if it is in the list of variables,
   *  then mark that variable as used (add it to "usedVarNames")
   */
  private getUsedVarNames(): string[] {
    const regex = /\{(\w+)\}/g;
    const usedVarNames = new Set<string>();
    const dfs = (root: TemplateNode[]) => {
      for (const node of root) {
        if (node.type === "text") {
          const matches = node.value.match(regex)
          if (!matches) continue
          for (const m of matches) {
            const varName = m.slice(1, m.length - 1)
            if (this.varNames.has(varName)) {
              usedVarNames.add(varName)
            }
          }
        } else {
          for (const field of ["if", "then", "else"] as const) {
            dfs(node.nodes[field]);
          }
        }
      }
    }
    dfs(this.nodes)
    return Array.from(usedVarNames)
  }

  public addCondition(
    textNodeId: string,
    textBefore: string,
    textAfter: string,
  ) {
    let textNodeBefore: TextNode | undefined
    let conditionNode: ConditionNode | undefined
    let textNodeAfter: TextNode | undefined
    this.nodes = produce(this.nodes, (draft) => {
      const result = this.findNode(textNodeId, draft);
      if (!result) return;
      const [node, parent] = result;
      textNodeBefore = getNewTextNode(textBefore)
      conditionNode = getDefaultConditionNode()
      textNodeAfter = getNewTextNode(textAfter)
      parent.splice(parent.indexOf(node), 1, textNodeBefore, conditionNode, textNodeAfter);
    });
    if (!textNodeBefore || !conditionNode || !textNodeAfter) return
    return [textNodeBefore, conditionNode, textNodeAfter] as const
  }

  /**
   * Update text node with sanitization
   */
  public updateTextNode(textNodeId: string, newText: string) {
    let textNode: TextNode | undefined
    this.nodes = produce(this.nodes, (draft) => {
      const result = this.findNode(textNodeId, draft);
      if (!result) return;
      const [node] = result;
      if (node.type === "text") {
        node.value = newText;
      }
      textNode = result[0] as TextNode
    });
    return textNode
  }

  public removeCondition(conditionNodeId: string) {
    let mergedTextNode: TextNode | undefined
    this.nodes = produce(this.nodes, (draft) => {
      const result = this.findNode(conditionNodeId, draft);
      if (!result) return;
      const [node, parent] = result;
      if (node.type !== "condition") return;
      const nodeIndex = parent.indexOf(node);
      const prevNode = parent[nodeIndex - 1];
      const nextNode = parent[nodeIndex + 1];
      if (prevNode?.type !== "text" || nextNode?.type !== "text") {
        return;
      }
      mergedTextNode = getNewTextNode(prevNode.value + nextNode.value)
      parent.splice(
        nodeIndex - 1,
        3 /* prevNode(text) + node(condition) + nextNode(text) */,
        mergedTextNode,
      );
    });
    return mergedTextNode
  }

  public getNodes(): TemplateNode[] {
    return this.nodes;
  }

  public getTemplate(): Template {
    return {
      nodes: this.nodes,
      usedVarNames: this.getUsedVarNames(),
    }
  }
}
