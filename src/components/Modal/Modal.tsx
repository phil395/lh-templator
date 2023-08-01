import { useRef, type FC, type PropsWithChildren } from "react";
import { useBodyClass, useClickOutside, useKeyPress } from "../../hooks";
import { Button } from "../Button";
import styles from "./Modal.module.css";

interface Props {
  hide: () => void;
}

export const Modal: FC<PropsWithChildren<Props>> = ({ hide, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  useKeyPress(ref, hide, "Escape");
  useClickOutside(ref, hide);
  useBodyClass("overflow-hidden");

  return (
    <div className={styles.overlay}>
      <div>
        <div className={styles.container} ref={ref} tabIndex={1}>
          <Button
            icon="close"
            color="red"
            className={styles.close}
            onClick={hide}
          />
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};
