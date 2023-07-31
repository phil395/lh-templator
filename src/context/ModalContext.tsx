import { createContext, useContext, useMemo, useState, type FC, type PropsWithChildren } from "react";
import { Modal, Transition } from "../components";

interface ModalActions {
  show: (content: JSX.Element) => void
  hide: () => void
}

const ModalContext = createContext<ModalActions | null>(null)

export const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null)

  const actions = useMemo(() => ({
    show: (content: JSX.Element) => {
      setModalContent(content)
    },
    hide: () => {
      setModalContent(null)
    }
  }), [])

  return (
    <ModalContext.Provider value={actions}>
      {children}
      <Transition>
        {modalContent && (
          <Modal hide={actions.hide}>
            {modalContent}
          </Modal>
        )}
      </Transition>
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const data = useContext(ModalContext)
  if (!data) throw new Error('useModal must be used within a ModalProvider')
  return data
}
