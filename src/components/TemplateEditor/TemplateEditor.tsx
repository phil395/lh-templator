import { useLayoutEffect, type FC } from "react";
import { Variables } from "./Variables";
import { AddConditionButton } from "./AddConditionButton";
import { CloseTemplateEditorButton } from "./CloseTemplateEditorButton";
import { SaveButton } from "./SaveButton";
import { OpenPreviewButton } from "../Preview";
import { useCommandPalette } from "./CommandPalette";
import { Tree } from "./Tree";
import { useTemplateEditorStore } from "../../store";
import type { TemplateEditorProps } from "./TemplateEditor.types";
import styles from "./TemplateEditor.module.css";

export const TemplateEditor: FC<TemplateEditorProps> = ({
  arrVarNames,
  template,
  callbackSave,
}) => {
  const { init, getPreviewProps } = useTemplateEditorStore(
    ({ init, getPreviewProps }) => ({ init, getPreviewProps }),
  );

  useLayoutEffect(() => {
    init({ template, arrVarNames, callbackSave });
  }, [template, arrVarNames, callbackSave, init]);

  useCommandPalette();

  return (
    <main className={styles.main}>
      <section>
        <h2>Variables</h2>
        <Variables arrVarNames={arrVarNames} />
      </section>
      <section>
        <h2>CTA</h2>
        <AddConditionButton />
      </section>
      <section>
        <h2>Message template</h2>
        <Tree />
      </section>
      <section className={styles.footerButtons}>
        <CloseTemplateEditorButton />
        <SaveButton />
        <OpenPreviewButton getPreviewProps={getPreviewProps} />
      </section>
      <div className={styles.infoMsg}>
        Press <kbd>Ctrl</kbd> + <kbd>k</kbd> to open the command palette. <br />
        To navigate through the various fields and buttons, press <kbd>
          Tab
        </kbd>{" "}
        or <kbd>Shift</kbd> + <kbd>Tab</kbd>
      </div>
    </main>
  );
};
