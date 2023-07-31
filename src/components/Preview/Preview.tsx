import { useLayoutEffect, type FC } from "react";
import { Output } from "./Output";
import { VariablesAssigner } from "./VariablesAssigner";
import { ClosePreviewButton } from "./ClosePreviewButton";
import { usePreviewStore } from "../../store/usePreviewStore";
import type { PreviewProps } from "./Preview.types";
import styles from './Preview.module.css'


export const Preview: FC<PreviewProps> = ({ template, arrVarNames }) => {
  const init = usePreviewStore(({ init }) => init)

  useLayoutEffect(() => {
    init({ template, arrVarNames })
  }, [template, arrVarNames, init])

  return (
    <section className={styles.preview}>
      <h2 className={styles.title}>Message Preview</h2>
      <h3>Message</h3>
      <Output />
      <h3 className={styles.title}>Variables</h3>
      <VariablesAssigner arrVarNames={arrVarNames} />
      <div className={styles.footer}>
        <ClosePreviewButton />
      </div>
    </section>
  );

}
