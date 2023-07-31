import type { FC } from "react"
import { Button } from "../../Button"
import { Preview } from "../Preview"
import { useModal } from "../../../context"
import type { PreviewProps } from "../Preview.types"

interface Props {
  getPreviewProps: () => PreviewProps | undefined
}

export const OpenPreviewButton: FC<Props> = ({ getPreviewProps }) => {
  const { show } = useModal()

  const openPreview = () => {
    const previewProps = getPreviewProps()
    if (!previewProps) return
    const modalContent = <Preview {...previewProps} />
    show(modalContent)
  }

  return (
    <Button
      color="blue"
      content="Preview"
      onClick={openPreview}
    />
  )
}
