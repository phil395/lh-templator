import type { FC } from "react";
import {
  Transition,
  TemplateEditor,
  OpenTemplateEditorButton,
} from "./components";
import { ModalProvider } from "./context";
import { DEFAULT_VAR_NAMES, Template } from "./models";
import { useTemplateEditorStore } from "./store";
import styles from "./App.module.css";

export const App: FC = () => {
  const open = useTemplateEditorStore(({ open }) => open);

  const arrVarNames = localStorage.arrVarNames
    ? JSON.parse(localStorage.arrVarNames)
    : DEFAULT_VAR_NAMES;

  const template = localStorage.template
    ? JSON.parse(localStorage.template)
    : null;

  const callbackSave = async (template: Template) => {
    localStorage.setItem("template", JSON.stringify(template));
  };

  return (
    <>
      <Transition>
        {open && (
          <ModalProvider>
            <TemplateEditor
              arrVarNames={arrVarNames}
              template={template}
              callbackSave={callbackSave}
            />
          </ModalProvider>
        )}
      </Transition>
      <Transition enter={styles["delayed-transition-opacity"]}>
        {!open && <OpenTemplateEditorButton />}
      </Transition>
    </>
  );
};
