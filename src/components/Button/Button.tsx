import type { FC } from "react";
import clsx from "clsx";
import { Icon, type IconType } from "../Icon";
import styles from "./Button.module.css";

interface Props {
  content?: string | JSX.Element;
  icon?: IconType;
  color?: "red" | "blue" | "green" | "dark";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: FC<Props> = ({
  content,
  icon,
  onClick,
  color,
  className,
}) => {
  return (
    <button
      className={clsx(
        styles.button,
        {
          [styles.red]: color === "red",
          [styles.blue]: color === "blue",
          [styles.green]: color === "green",
          [styles.dark]: color === "dark",
        },
        className,
      )}
      onClick={onClick}
    >
      {icon ? <Icon type={icon} size="1.5em" /> : null}
      {content ? <span>{content}</span> : null}
    </button>
  );
};
