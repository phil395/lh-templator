import { shallow } from "zustand/shallow"
import { useModal } from "../../../context"
import { useTemplateEditorStore } from "../../../store"
import { Button } from "../../Button"
import styles from './SaveDialog.module.css'

export const SaveDialog = () => {
  const { hide } = useModal()
  const { save, closeEditor } = useTemplateEditorStore(({ save, closeEditor }) => ({ save, closeEditor }), shallow)

  return (
    <section className={styles.dialog}>
      <h3>Unsaved changes</h3>
      <p>
        You have made changes <br />
        Do you want to save or discard them?
      </p>
      <div className={styles.buttons}>
        <Button
          content="Cancel"
          onClick={hide}
        />
        <Button
          icon="close"
          color="red"
          content="Discard"
          onClick={closeEditor}
        />
        <Button
          icon="done"
          color="green"
          content="Save"
          onClick={async () => {
            await save()
            closeEditor()
          }}
        />
      </div>
    </section>
  )
}
