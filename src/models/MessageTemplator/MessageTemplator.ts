import type { MessageTemplatorActions } from "./MessageTemplator.types";
import { getDefaultConditionNode, getNewTextNode } from "../template";
import type { TemplateNode } from "../template";
import { produce } from 'immer'


export class MessageTemplator implements MessageTemplatorActions {
  private variableNames: Set<string>

  constructor(
    private nodes: TemplateNode[],
    variableNames: string[]
  ) {
    this.variableNames = new Set(variableNames)
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
    root: TemplateNode[]
  ): [node: TemplateNode, parent: TemplateNode[]] | undefined {
    const dfs = (
      parent: TemplateNode[]
    ): ReturnType<typeof this.findNode> => {
      for (const node of parent) {
        if (node.id === nodeId) {
          return [node, parent]
        }
        if (node.type === 'condition') {
          for (const field of ['if', 'then', 'else'] as const) {
            const result = dfs(node.nodes[field])
            if (result) return result
          }
        }
      }
    }
    return dfs(root)
  }

  /**
   * Represent non-existent variables as plain text, removing curly braces from them,
   * and trims leading or trailing whitespace from existing variables
   * @example
   * // variableNames: ["firstname"]
   * sanitizeText("Hello, {firstname}")    // output: "Hello, {firstname}"
   * sanitizeText("Hello, {  foo}")        // output: "Hello,   foo"
   * sanitizeText("Hello, { firstname  }") // output: "Hello, {firstname}"
   */
  private sanitizeText(text: string): string {
    const regex = /\{(.*?)\}/g
    return text.replace(regex, (_, variableName: string) => {
      const trimmed = variableName.trim()
      if (this.variableNames.has(trimmed)) {
        return `{${trimmed}}`
      }
      return variableName
    })
  }

  public addCondition(
    textNodeId: string,
    textBefore: string,
    textAfter: string
  ): void {
    this.nodes = produce(this.nodes, draft => {
      const result = this.findNode(textNodeId, draft)
      if (!result) return
      const [node, parent] = result
      parent.splice(
        parent.indexOf(node),
        1,
        getNewTextNode(this.sanitizeText(textBefore)),
        getDefaultConditionNode(),
        getNewTextNode(this.sanitizeText(textAfter)),
      )
    })
  }

  /**
   * Update text node with sanitization
   */
  public updateTextNode(
    textNodeId: string,
    newText: string
  ) {
    this.nodes = produce(this.nodes, draft => {
      const result = this.findNode(textNodeId, draft)
      if (!result) return
      const [node] = result
      if (node.type === 'text') {
        node.value = this.sanitizeText(newText)
      }
    })
  }

  public removeCondition(conditionNodeId: string) {
    this.nodes = produce(this.nodes, draft => {
      const result = this.findNode(conditionNodeId, draft)
      if (!result) return
      const [node, parent] = result
      if (node.type !== 'condition') return
      const nodeIndex = parent.indexOf(node)
      const prevNode = parent[nodeIndex - 1]
      const nextNode = parent[nodeIndex + 1]
      if (
        prevNode?.type !== 'text' ||
        nextNode?.type !== 'text'
      ) {
        return
      }
      parent.splice(
        nodeIndex - 1,
        3 /* prevNode(text) + node(condition) + nextNode(text) */,
        getNewTextNode(prevNode.value + nextNode.value)
      )
    })
  }

  public getNodes(): TemplateNode[] {
    return this.nodes
  }
}
