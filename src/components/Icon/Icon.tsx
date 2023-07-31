import type { FC } from "react"
import type { IconType } from "./Icon.types"

interface Props {
  type: IconType
  size: "1em" | "1.5em" | "2em"
}

export const Icon: FC<Props> = ({ type, size }) => {
  switch (type) {
    case "done":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
          <path fill="currentColor" d="M9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4L9.55 18Z"></path>
        </svg>
      )
    case "close":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
          <path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6L6.4 19Z"></path>
        </svg>
      )
    case "condition":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256">
          <path fill="currentColor" d="M152 96V80h-8a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h8v-16a16 16 0 0 1 16-16h48a16 16 0 0 1 16 16v48a16 16 0 0 1-16 16h-48a16 16 0 0 1-16-16v-16h-8a32 32 0 0 1-32-32v-24H80v8a16 16 0 0 1-16 16H32a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h32a16 16 0 0 1 16 16v8h32V96a32 32 0 0 1 32-32h8V48a16 16 0 0 1 16-16h48a16 16 0 0 1 16 16v48a16 16 0 0 1-16 16h-48a16 16 0 0 1-16-16Z"></path>
        </svg>
      )
    default:
      return null
  }

}
