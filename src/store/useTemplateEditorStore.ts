import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import {
  DEFAULT_TEMPLATE,
  DEFAULT_VAR_NAMES,
  MessageTemplator,
  type TemplateNode,
  type TextNode,
} from "../models";
import type { TemplateEditorProps, PreviewProps } from "../components";

interface TemplateEditorActions {
  openEditor: () => void;
  closeEditor: () => void;
  init: (props: TemplateEditorProps) => void;
  save: () => Promise<void>;
  addCondition: () => void;
  removeCondition: (id: string) => void;
  updateTextNode: (data: LastTextarea) => void;
  insertVarName(varName: string): void;
  getPreviewProps: () => PreviewProps | undefined;
  getFocusedTextarea: () => FocusedTextarea | null
}

interface TemplateEditorState {
  /** Indicator of whether the TemplateEditor is open or closed */
  open: boolean;
  /** TemplateEditor props.
   *  They are needed in order to share them with nested components and exclude prop drilling */
  props: TemplateEditorProps | null;
  /** template nodes (text nodes and condition nodes) */
  nodes: TemplateNode[] | null;
  /* lastTextarea - a target for inserting variables or conditions.
   * Contains data from the last textarea that the user interacted with */
  lastTextarea: LastTextarea | null;
  /* Indicates whether there have been changes since the last save of the template
   * This is necessary to implement a dialog about saving changes when exiting */
  hasChanges: boolean;
  /** This is the textarea that will be focused the next time it is rendered.
   *  When "insertVarName" is called, the last textarea that the user interacted with (lastTextarea) will be focused.
   *  When calling "addCondition", the first text node located in the IF block will be focused.
   *  When "removeCondition" is called, the text node before the condition to be removed is focused.
   *  Avoid direct subscription to this property, because this may lead to unnecessary re-renderers,
   *  instead get data through the geter function when necessary
   * */
  focusedTextarea: FocusedTextarea | null;
}

interface TextArea {
  id: string,
  selectionStart: number;
  selectionEnd: number;
}

interface LastTextarea extends TextArea {
  value: string;
}

interface FocusedTextarea extends TextArea { }

type TemplateEditorStore = TemplateEditorState & TemplateEditorActions;

const initialState: TemplateEditorState = {
  open: false,
  props: null,
  nodes: null,
  lastTextarea: null,
  hasChanges: false,
  focusedTextarea: null
};

/** Extract data from the first TextNode to set it as LastTextarea
 *  until the user selects another textarea
 */
const getInitialTextarea = (templator: MessageTemplator): LastTextarea => {
  const { id, value } = templator.getNodes()[0] as TextNode;
  return {
    id,
    value,
    selectionStart: value.length,
    selectionEnd: value.length,
  };
};

let templator: MessageTemplator | null = null;

/** Split the lastTextarea into two parts: textBefore and textAfter,
 *  variables or conditions are inserted between them
 */
const splitLastTextarea = (
  lastTextarea: LastTextarea,
): {
  id: LastTextarea["id"];
  textBefore: string;
  textAfter: string;
} => {
  const { id, value, selectionStart, selectionEnd } = lastTextarea;
  return {
    id,
    textBefore: value.slice(0, selectionStart),
    textAfter: value.slice(selectionEnd),
  };
};

const getFocusedTextarea = (id: string, start?: number, end?: number): FocusedTextarea => {
  if (!start && !end) {
    return { id, selectionStart: 0, selectionEnd: 0 }
  }
  if (!end) {
    return { id, selectionStart: start!, selectionEnd: start! }
  }
  return { id, selectionStart: start!, selectionEnd: end }
}

export const useTemplateEditorStore = createWithEqualityFn<TemplateEditorStore>()(
  (set, get) => ({
    ...initialState,
    openEditor: () => {
      set({ open: true });
    },
    closeEditor: () => {
      /* Prevent the use of actions after pressing close button
      (for example, when playing the closing animation) */
      templator = null;
      set({ open: false });
    },
    init: (props) => {
      const template = props.template || DEFAULT_TEMPLATE;
      const arrVarNames = props.arrVarNames || DEFAULT_VAR_NAMES;
      templator = new MessageTemplator(template, arrVarNames);
      const initialTextarea = getInitialTextarea(templator)
      set({
        props,
        nodes: template.nodes,
        lastTextarea: initialTextarea,
        hasChanges: false,
        focusedTextarea: initialTextarea
      });
    },
    save: async () => {
      const { props } = get();
      if (!templator || !props) return;
      const template = templator.getTemplate();
      await props.callbackSave(template);
      set({ hasChanges: false });
    },
    addCondition: () => {
      const { lastTextarea } = get();
      if (!templator || !lastTextarea) return;
      const { id, textBefore, textAfter } = splitLastTextarea(lastTextarea);
      const nodes = templator.addCondition(id, textBefore, textAfter);
      if (!nodes) return
      const textareaIdFromIFBlock = nodes[1].nodes.if[0].id
      set({
        nodes: templator.getNodes(),
        hasChanges: true,
        focusedTextarea: getFocusedTextarea(textareaIdFromIFBlock)
      });
    },
    removeCondition: (id) => {
      if (!templator) return;
      const mergedTextNode = templator.removeCondition(id);
      if (!mergedTextNode) return
      const cursorPosition = mergedTextNode.value.length
      set({
        nodes: templator.getNodes(),
        hasChanges: true,
        focusedTextarea: getFocusedTextarea(mergedTextNode.id, cursorPosition)
      });
    },
    updateTextNode: (data) => {
      if (!templator) return;
      templator.updateTextNode(data.id, data.value);
      set({
        nodes: templator.getNodes(),
        lastTextarea: data,
        hasChanges: true,
        focusedTextarea: null
      });
    },
    insertVarName: (varName) => {
      const { lastTextarea } = get();
      if (!templator || !lastTextarea) return;
      const { id, textBefore, textAfter } = splitLastTextarea(lastTextarea);
      const newValue = `${textBefore}{${varName}}${textAfter}`
      templator.updateTextNode(id, newValue);
      const cursorPosition = textBefore.length + varName.length + 2
      set({
        nodes: templator.getNodes(),
        hasChanges: true,
        focusedTextarea: getFocusedTextarea(id, cursorPosition)
      });
    },
    getPreviewProps: () => {
      if (!templator) return;
      const template = templator.getTemplate()
      return {
        template,
        arrVarNames: template.usedVarNames,
      };
    },
    getFocusedTextarea: () => {
      return get().focusedTextarea
    }
  }),
  shallow
);
