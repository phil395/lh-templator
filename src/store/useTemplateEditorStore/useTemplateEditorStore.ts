import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import {
  DEFAULT_TEMPLATE,
  DEFAULT_VAR_NAMES,
  MessageTemplator,
  TemplateSchema,
  type TemplateNode,
  ArrVarNamesSchema,
} from "../../models";
import {
  buildFocusedTextarea,
  getInitialTextarea,
  splitLastTextarea,
} from "./useTemplateEditorStore.utils";
import type { TemplateEditorProps, PreviewProps } from "../../components";
import { validate } from "superstruct";

interface TemplateEditorActions {
  openEditor: () => void;
  closeEditor: () => void;
  init: (props: TemplateEditorProps) => void;
  save: () => Promise<void>;
  addCondition: () => void;
  removeCondition: (id: string) => void;
  setLastTextarea: (data: LastTextarea) => void;
  updateTextNode: (id: string, newValue: string) => void;
  insertVarName(varName: string): void;
  getPreviewProps: () => PreviewProps | undefined;
  getFocusedTextarea: () => FocusedTextarea | null;
}

interface TemplateEditorState {
  /** Indicator of whether the TemplateEditor is open or closed */
  open: boolean;
  /** TemplateEditor props.
   *  They are needed in order to share them with nested components and exclude prop drilling,
   *  or to save a `callbackSave`, for example, or to provide props for `Preview` */
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
  id: string;
  selectionStart: number;
  selectionEnd: number;
}

export interface LastTextarea extends TextArea {
  value: string;
}

export interface FocusedTextarea extends TextArea {}

type TemplateEditorStore = TemplateEditorState & TemplateEditorActions;

const initialState: TemplateEditorState = {
  open: false,
  props: null,
  nodes: null,
  lastTextarea: null,
  hasChanges: false,
  focusedTextarea: null,
};

let templator: MessageTemplator | null = null;

export const useTemplateEditorStore =
  createWithEqualityFn<TemplateEditorStore>()(
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
        let [, template] = validate(props.template, TemplateSchema);
        if (!template) {
          template = DEFAULT_TEMPLATE;
        }
        let [, arrVarNames] = validate(props.arrVarNames, ArrVarNamesSchema);
        if (!arrVarNames) {
          arrVarNames = DEFAULT_VAR_NAMES;
        }
        templator = new MessageTemplator(template, arrVarNames);
        const initialTextarea = getInitialTextarea(templator);
        set({
          props,
          nodes: template.nodes,
          lastTextarea: initialTextarea,
          hasChanges: false,
          focusedTextarea: initialTextarea,
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
        if (!nodes) return;
        const textareaIdFromIFBlock = nodes[1].nodes.if[0].id;
        set({
          nodes: templator.getNodes(),
          hasChanges: true,
          focusedTextarea: buildFocusedTextarea(textareaIdFromIFBlock),
        });
      },
      removeCondition: (id) => {
        if (!templator) return;
        const mergedTextNode = templator.removeCondition(id);
        if (!mergedTextNode) return;
        const cursorPosition = mergedTextNode.value.length;
        set({
          nodes: templator.getNodes(),
          hasChanges: true,
          focusedTextarea: buildFocusedTextarea(
            mergedTextNode.id,
            cursorPosition,
          ),
        });
      },
      setLastTextarea: (data) => {
        set({
          lastTextarea: data,
          focusedTextarea: null,
        });
      },
      updateTextNode: (id, newValue) => {
        if (!templator) return;
        templator.updateTextNode(id, newValue);
        set({
          nodes: templator.getNodes(),
          hasChanges: true,
        });
      },
      insertVarName: (varName) => {
        const { lastTextarea } = get();
        if (!templator || !lastTextarea) return;
        const { id, textBefore, textAfter } = splitLastTextarea(lastTextarea);
        const newValue = `${textBefore}{${varName}}${textAfter}`;
        templator.updateTextNode(id, newValue);
        const cursorPosition = textBefore.length + varName.length + 2;
        set({
          nodes: templator.getNodes(),
          hasChanges: true,
          focusedTextarea: buildFocusedTextarea(id, cursorPosition),
        });
      },
      getPreviewProps: () => {
        if (!templator) return;
        const template = templator.getTemplate();
        return {
          template,
          arrVarNames: template.usedVarNames,
        };
      },
      getFocusedTextarea: () => {
        return get().focusedTextarea;
      },
    }),
    shallow,
  );
