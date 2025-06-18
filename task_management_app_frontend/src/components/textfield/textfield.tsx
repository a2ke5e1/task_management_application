import React from "react";
import { createComponent } from "@lit/react";
import { useField } from "formik";
import { type FieldAttributes } from "formik";
import { MdOutlinedTextField } from "@material/web/textfield/outlined-text-field";

export const OutlinedTextField = createComponent({
  tagName: "md-outlined-text-field",
  elementClass: MdOutlinedTextField,
  react: React,
});

export const FormikOutlinedTextField = ({
  label,
  ...props
}: { label: string } & FieldAttributes<unknown>) => {
  const [field, meta] = useField(props);
  return (
    <div className="flex flex-col gap-1">
      <OutlinedTextField
        label={label}
        {...field}
        error={meta.touched && meta.error}
        errorText={meta.touched && meta.error ? meta.error : null}
        {...props}
      />
    </div>
  );
};
