import type { FC } from "react"
import { usePreviewStore } from "../../../store"
import styles from "./Output.module.css"

const EMPTY_OUTPUT = "The template is empty"

export const Output: FC = () => {
  const message = usePreviewStore(({ message }) => message)

  return (
    <output className={styles.output}>
      {message || EMPTY_OUTPUT}
    </output>
  )
}
