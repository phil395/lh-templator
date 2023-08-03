import { Template } from "../../models";

export interface TemplateEditorProps {
  arrVarNames: string[];
  template: Template | null;
  callbackSave: (template: Template) => Promise<void>;
}
