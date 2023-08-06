import { FC, PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import { useTemplateEditorStore } from "../../../../../store";
import { useDebouncedCallback } from "../../../../../hooks";
import styles from "./Highlighter.module.css"

interface Props {
  textareaRef: React.RefObject<HTMLTextAreaElement>
  value: string
}

const REGEX = /({\w+})/g
const DELAY = 75

const buildNodes = (text: string, varNames: Set<string>) => {
  return text.split(REGEX).map((part, i) => {
    if (part[0] === "{" && part[part.length - 1] === "}") {
      const varName = part.slice(1, part.length - 1)
      if (varNames.has(varName)) {
        return <mark key={i}>{part}</mark>
      }
    }
    return <span key={i}>{part}</span>
  })
}

export const Highlighter: FC<PropsWithChildren<Props>> = ({ children, textareaRef, value }) => {
  const backdropRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState<JSX.Element[]>([])
  const arrVarNames = useTemplateEditorStore(({ props }) => props?.arrVarNames)
  const [varNames, setVarNames] = useState<Set<string>>(() => new Set(arrVarNames))
  const updateHandler = useCallback((e: Event) => {
    if (!(e.target instanceof HTMLTextAreaElement)) return
    const nodes = buildNodes(e.target.value, varNames)
    setNodes(nodes)
  }, [varNames])
  const debouncedUpdateHandler = useDebouncedCallback(updateHandler, DELAY)

  useEffect(() => {
    setVarNames(new Set(arrVarNames))
  }, [arrVarNames])

  useEffect(() => {
    setNodes(buildNodes(value, varNames))
  }, [value, varNames])

  useEffect(() => {
    const textareaEl = textareaRef.current
    const backdropEl = backdropRef.current
    if (!textareaEl || !backdropEl) return
    textareaEl.addEventListener("input", debouncedUpdateHandler)
    return () => {
      textareaEl.removeEventListener("input", debouncedUpdateHandler)
    }
  }, [debouncedUpdateHandler, textareaRef])

  return (
    <div className={styles.container}>
      <div ref={backdropRef} className={styles.backdrop}>
        {nodes}
      </div>
      {children}
    </div>
  )
}
