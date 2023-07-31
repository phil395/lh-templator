import { uuid } from "../utils"

export type TextNode = {
  id: string,
  type: "text",
  value: string
}

export type ConditionNode = {
  id: string,
  type: "condition",
  nodes: {
    if: TemplateNode[]
    then: TemplateNode[]
    else: TemplateNode[]
  }
}

export type TemplateNode = TextNode | ConditionNode

export const getNewTextNode = (value: string = ""): TextNode => ({
  id: uuid(),
  type: "text",
  value
})

export const getDefaultConditionNode = (): ConditionNode => ({
  id: uuid(),
  type: "condition",
  nodes: {
    if: [getNewTextNode()],
    then: [getNewTextNode()],
    else: [getNewTextNode()]
  }
})



