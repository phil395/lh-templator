import { TemplateNode } from "../../models";

export interface TemplateEditorProps {
  arrVarNames: string[],
  template: TemplateNode[] | null,
  callbackSave: (template: TemplateNode[]) => Promise<void>,
}
