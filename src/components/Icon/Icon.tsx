import type { FC } from "react"
import type { IconType } from "./types"

interface Props {
  type: IconType
  size: "1em" | "1.5em" | "2em",
  color?: string
}

const getSvgPath = (type: IconType) => {
  switch (type) {
    case "done":
      return "M9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4L9.55 18Z"
    case "close":
      return "M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6L6.4 19Z"
    default:
      return ""
  }
}

export const Icon: FC<Props> = ({ type, size, color }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
      <path
        fill={color ?? "currentColor"}
        d={getSvgPath(type)}
      ></path>
    </svg>
  )
}
