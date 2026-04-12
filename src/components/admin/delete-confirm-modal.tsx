"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";

type DeleteConfirmModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
};

export function DeleteConfirmModal({
  isOpen,
  onOpenChange,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  isLoading = false,
}: DeleteConfirmModalProps) {
  const t = useTranslations("Admin.Common");
  const resolvedConfirm = confirmLabel ?? t("delete");
  const resolvedCancel = cancelLabel ?? t("cancel");

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="font-bold">{title}</ModalHeader>
            <ModalBody>
              <p className="text-default-600">{message}</p>
            </ModalBody>
            <ModalFooter>
              <Button type="button" variant="light" onPress={onClose}>
                {resolvedCancel}
              </Button>
              <Button
                color="danger"
                isLoading={isLoading}
                type="button"
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {resolvedConfirm}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
