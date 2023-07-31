import { useTemplateEditorStore } from "../../../store"
import { Button } from "../../Button"
import styles from "./OpenTemplateEditorButton.module.css"

export const OpenTemplateEditorButton = () => {
  const openEditor = useTemplateEditorStore(({ openEditor }) => openEditor)

  return (
    <Button
      content="Message Editor"
      color="blue"
      className={styles.button}
      onClick={openEditor}
    />
  )
}
