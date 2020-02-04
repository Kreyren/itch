import React, { useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "renderer/basics/Button";
import { IconButton } from "renderer/basics/IconButton";
import { animations, fontSizes } from "renderer/theme";
import styled from "styled-components";
import { close } from "inspector";

const ModalShroud = styled.div`
  position: fixed;
  padding: 20px;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background: rgba(0, 0, 0, 0.8);

  display: flex;
  align-items: center;
  justify-content: center;

  animation: ${animations.fadeIn} ease-out 0.2s;

  z-index: 10;
`;

export const ModalContents = styled.div`
  background: ${p => p.theme.colors.shellBg};
  border: 1px solid ${p => p.theme.colors.shellBorder};

  min-width: 400px;

  pointer-events: initial;

  p {
    margin: 1.4em 0;
  }
`;

export const ModalTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  font-size: ${fontSizes.large};
  font-weight: bold;

  padding: 15px;
  margin-bottom: 10px;
`;

export const ModalBody = styled.div`
  padding: 15px;

  max-width: 80vw;
  max-height: 70vh;

  overflow: auto;
`;

const Filler = styled.div`
  flex-grow: 1;
`;

interface ModalProps {
  className?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
  easyClose?: boolean;
  onClose?: () => void;
  hideTitleBar?: boolean;
}

export const Modal = React.forwardRef((props: ModalProps, ref: any) => {
  const { title, children, onClose, easyClose, hideTitleBar } = props;

  const hasTitle = (!!props.title || !!props.onClose) && !hideTitleBar;
  const onShroudClick = useCallback(() => {
    if (easyClose) {
      if (props.onClose) {
        props.onClose();
      }
    }
  }, [easyClose]);

  const onShroudKeyDown = useCallback(
    (ev: React.KeyboardEvent<any>) => {
      if (ev.key === "Escape" && easyClose) {
        if (props.onClose) {
          props.onClose;
        }
      }
    },
    [easyClose]
  );

  const onContentClick = useCallback((ev: React.MouseEvent<any>) => {
    ev.stopPropagation();
  }, []);

  return (
    <ModalShroud ref={ref} onClick={onShroudClick} onKeyDown={onShroudKeyDown}>
      <ModalContents className={props.className} onClick={onContentClick}>
        {hasTitle ? (
          <ModalTitle>
            {title}
            <Filler />
            {onClose ? (
              <IconButton icon="cross" onClick={() => onClose()}></IconButton>
            ) : null}
          </ModalTitle>
        ) : null}
        <ModalBody className="modal-body">{children}</ModalBody>
      </ModalContents>
    </ModalShroud>
  );
});

// TODO: dedup with Gate/Form.tsx
export const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-self: stretch;

  button {
    margin-right: 1em;

    &:last-of-type {
      margin-right: 0;
    }
  }
`;

export const ConfirmModal = (props: {
  question: React.ReactNode;
  cancelLabel?: React.ReactNode;
  onCancel: (...args: any[]) => void;

  confirmLabel?: React.ReactNode;
  onConfirm: (...args: any[]) => void;
}) => {
  const { question, cancelLabel, onCancel, confirmLabel, onConfirm } = props;

  return (
    <Modal>
      <p>{question}</p>
      <Buttons>
        <Button
          secondary
          label={
            cancelLabel ? (
              cancelLabel
            ) : (
              <FormattedMessage id="prompt.action.cancel" />
            )
          }
          onClick={onCancel}
        />
        <Button
          label={
            confirmLabel ? (
              confirmLabel
            ) : (
              <FormattedMessage id="prompt.action.ok" />
            )
          }
          onClick={onConfirm}
        />
      </Buttons>
    </Modal>
  );
};
