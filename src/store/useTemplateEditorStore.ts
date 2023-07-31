import { create } from 'zustand'
import { DEFAULT_TEMPLATE, DEFAULT_VAR_NAMES, MessageTemplator, type TemplateNode, type TextNode } from '../models';
import type { TemplateEditorProps, PreviewProps } from '../components';

interface TemplateEditorActions {
  openEditor: () => void
  closeEditor: () => void
  init: (props: TemplateEditorProps) => void
  save: () => Promise<void>
  addCondition: () => void,
  removeCondition: (id: string) => void
  updateTextNode: (data: LastTextarea) => void
  insertVarName(varName: string): void
  getPreviewProps: () => PreviewProps | undefined
}

interface TemplateEditorState {
  open: boolean;
  props: TemplateEditorProps | null;
  /** nodes === template */
  nodes: TemplateNode[] | null,
  /* lastTextarea - a target for inserting variables or conditions. */
  lastTextarea: LastTextarea | null,
  /* Indicates whether there have been changes since the last save of the template
   * This is necessary to implement a dialog about saving changes when exiting */
  hasChanges: boolean,
}

/** Data from the last textarea that the user interacted with.*/
interface LastTextarea {
  id: string;
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

type TemplateEditorStore = TemplateEditorState & TemplateEditorActions;

const initialState: TemplateEditorState = {
  open: false,
  props: null,
  nodes: null,
  lastTextarea: null,
  hasChanges: false
}

/** Extract data from the first TextNode to set it as LastTextarea
 *  until the user selects another textarea
 */
const getInitialLastTextarea = (templator: MessageTemplator): LastTextarea => {
  const { id, value } = templator.getNodes()[0] as TextNode
  return {
    id,
    value,
    selectionStart: value.length,
    selectionEnd: value.length
  }
}

let templator: MessageTemplator | null = null

/** Split the lastTextarea into two parts: textBefore and textAfter,
 *  variables or conditions are inserted between them
 */
const splitLastTextarea = (lastTextarea: LastTextarea): {
  id: LastTextarea['id'],
  textBefore: string,
  textAfter: string
} => {
  const { id, value, selectionStart, selectionEnd } = lastTextarea
  return {
    id,
    textBefore: value.slice(0, selectionStart),
    textAfter: value.slice(selectionEnd)
  }
}

export const useTemplateEditorStore = create<TemplateEditorStore>()((set, get) => ({
  ...initialState,
  openEditor: () => {
    set({ open: true })
  },
  closeEditor: () => {
    /* Prevent the use of actions after pressing close button
    (for example, when playing the closing animation) */
    templator = null
    set({ open: false })
  },
  init: (props) => {
    const template = props.template || DEFAULT_TEMPLATE
    const arrVarNames = props.arrVarNames || DEFAULT_VAR_NAMES
    templator = new MessageTemplator(template, arrVarNames)
    set({
      props,
      nodes: template,
      lastTextarea: getInitialLastTextarea(templator),
      hasChanges: false
    })
  },
  save: async () => {
    const { props } = get()
    if (!templator || !props) return;
    const template = templator.getNodes()
    await props.callbackSave(template)
    set({ hasChanges: false })
  },
  addCondition: () => {
    const { lastTextarea } = get()
    if (!templator || !lastTextarea) return
    const { id, textBefore, textAfter } = splitLastTextarea(lastTextarea)
    templator.addCondition(id, textBefore, textAfter)
    set({ nodes: templator.getNodes(), hasChanges: true })
  },
  removeCondition: (id) => {
    if (!templator) return;
    templator.removeCondition(id)
    set({ nodes: templator.getNodes(), hasChanges: true })
  },
  updateTextNode: (data) => {
    if (!templator) return;
    templator.updateTextNode(data.id, data.value)
    set({ nodes: templator.getNodes(), lastTextarea: data, hasChanges: true })
  },
  insertVarName: (varName) => {
    const { lastTextarea } = get()
    if (!templator || !lastTextarea) return
    const { id, textBefore, textAfter } = splitLastTextarea(lastTextarea)
    templator.updateTextNode(id, `${textBefore}{${varName}}${textAfter}`)
    set({ nodes: templator.getNodes(), hasChanges: true })
  },
  getPreviewProps: () => {
    const { props } = get()
    if (!templator || !props) return
    return {
      template: templator.getNodes(),
      arrVarNames: props.arrVarNames
    }
  }
}))
