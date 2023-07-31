import type { FC } from "react";
import { Button } from "../../Button";
import { useModal } from "../../../context";


export const ClosePreviewButton: FC = () => {
  const { hide } = useModal()
  return (
    <Button
      icon="close"
      content="Close"
      color="red"
      onClick={hide}
    />
  )
}
