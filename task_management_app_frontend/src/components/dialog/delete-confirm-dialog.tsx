import { Field, Form, Formik, type FormikHelpers } from "formik";
import { Dialog } from "./dialog";
import { TextButton } from "../button/button";
import type { MdDialog } from "@material/web/dialog/dialog";
import type React from "react";

interface IDeleteConfirmDialogProps {
  ref: React.RefObject<MdDialog | null>;
  title: string;
  message: string;
  initialValues: {
    _id: string;
  };
  handleOnDelete: (values: { _id: string }) => Promise<void>;
  onClose: () => void;
}
export default function DeleteConfirmDialog({
  ref,
  title,
  message,
  initialValues,
  handleOnDelete,
  onClose,
}: IDeleteConfirmDialogProps) {
  const closeDeleteDialog = () => {
    ref.current?.close();
  };

  const handleDelete = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>,
  ) => {
    try {
      setSubmitting(true);
      await handleOnDelete(values);
      closeDeleteDialog();
    } catch (error) {
      console.error("Failed to delete", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog ref={ref}>
        <div slot="headline">{title}</div>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleDelete}
        >
          {({ isSubmitting }) => (
            <>
              <Form slot="content" className="flex flex-col gap-4">
                <p>{message}</p>
                <Field name="_id" type="hidden" />

                <div slot="actions" className="mt-4 flex justify-end gap-2">
                  <TextButton
                    type="button"
                    onClick={() => {
                      onClose();
                    }}
                    value="cancel"
                  >
                    Cancel
                  </TextButton>
                  <TextButton type="submit" value="ok" disabled={isSubmitting}>
                    Delete
                  </TextButton>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </Dialog>
    </>
  );
}

interface IAlertDialogProps {
  ref: React.RefObject<MdDialog | null>;
  title: string;
  message: React.ReactNode | string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}
export function AlertDialog({
  ref,
  title,
  message,
  confirmButtonText = "Ok",
  cancelButtonText = "Cancel",
  onConfirm,
  onCancel,
}: IAlertDialogProps) {
  return (
    <>
      <Dialog ref={ref}>
        <div slot="headline">{title}</div>
        <div slot="content" className="flex flex-col gap-4">
          <p>{message}</p>
          <div slot="actions" className="mt-4 flex justify-end gap-2">
            <TextButton type="button" onClick={onCancel}>
              {cancelButtonText}
            </TextButton>
            <TextButton onClick={onConfirm}>{confirmButtonText}</TextButton>
          </div>
        </div>
      </Dialog>
    </>
  );
}
