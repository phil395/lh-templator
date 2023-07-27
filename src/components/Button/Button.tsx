import { FC } from "react"
import { Icon, IconType } from ".."
import styles from './Button.module.css'

interface Props {
  text: string
  icon?: IconType
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}



export const Button: FC<Props> = ({ text, icon, onClick }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {icon ? <Icon type={icon} size="1.5em" /> : null}
      <span>{text}</span>
    </button>
  )
}
