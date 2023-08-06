import { useEffect, useRef, useState, type FC } from "react"
import { AddConditionButton } from "../AddConditionButton"
import { Variables } from "../Variables"
import { useModal } from "../../../context"
import { useKeyPress } from "../../../hooks"
import { useTemplateEditorStore } from "../../../store"
import styles from './CommandPalette.module.css'

const CommandPalette: FC = () => {
  const ref = useRef<HTMLInputElement>(null)
  const [searchText, setSearchText] = useState("")
  const { hide } = useModal()
  const arrVarNames = useTemplateEditorStore(({ props }) => props?.arrVarNames)

  /* At the moment of opening, we save the link to the focused element.
   * If the focused element was textarea, then when closing the window,
   * we shift the focus to it, otherwise the focus is lost */
  useEffect(() => {
    const focusedElement = document.activeElement
    /** Focusing the input in the window */
    ref.current?.focus()
    return () => {
      if (focusedElement && focusedElement.nodeName === "TEXTAREA") {
        (focusedElement as HTMLTextAreaElement).focus()
      }
    }
  }, [])

  const hideModalHandler = (e: React.MouseEvent) => {
    if (!(e.target instanceof Element)) return
    /* if a click occurred on a button or on an element nested in the button,
     * then an action was selected and this window can be closed */
    if (
      e.target.nodeName === "BUTTON" ||
      e.target.closest('button')
    ) {
      hide()
    }
  }

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  return (
    <section className={styles.section}>
      <input
        ref={ref}
        value={searchText}
        onChange={onSearch}
        type="text"
        className="text-field"
      />
      <div
        onClick={hideModalHandler}
        className={styles.actions}
      >
        {(searchText === "" || /if|then|else/.test(searchText.toLowerCase())) && (
          <AddConditionButton major={false} colored={false} />
        )}
        <Variables
          arrVarNames={
            (arrVarNames ?? []).filter(name => name.toLowerCase().includes(searchText.toLowerCase()))
          }
        />
      </div>
    </section>
  )
}


export const useCommandPalette = () => {
  const { show } = useModal()
  const handler = () => {
    show(<CommandPalette />)
  }
  /** When the user presses Ctrl + k (or Ctrl + K or Ctrl + л or Ctrl + Л) open the window */
  useKeyPress(["k", "K", "л", "Л"], handler, { ctrlKey: true, preventDefault: true })
}
