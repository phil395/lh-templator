import { useLayoutEffect, type FC } from "react"
import { shallow } from "zustand/shallow"
import { Variables } from "./Variables"
import { AddConditionButton } from "./AddConditionButton"
import { CloseTemplateEditorButton } from "./CloseTemplateEditorButton"
import { SaveButton } from "./SaveButton"
import { OpenPreviewButton } from "../Preview"
import { Tree } from "./Tree"
import { useTemplateEditorStore } from "../../store"
import type { TemplateEditorProps } from "./TemplateEditor.types"
import styles from './TemplateEditor.module.css'


export const TemplateEditor: FC<TemplateEditorProps> = ({ arrVarNames, template, callbackSave }) => {
  const { init, getPreviewProps } = useTemplateEditorStore(({ init, getPreviewProps }) => ({ init, getPreviewProps }), shallow)

  useLayoutEffect(() => {
    init({ template, arrVarNames, callbackSave })
  }, [template, arrVarNames, callbackSave, init])

  return (
    <main className={styles.main}>
      <section>
        <h2>Variables</h2>
        <Variables />
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
    </main>
  )
}
