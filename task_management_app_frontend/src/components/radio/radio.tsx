import React from "react";
import { createComponent } from "@lit/react";
import { MdRadio } from "@material/web/radio/radio.js";
import { useFormikContext } from "formik";

export const Radio = createComponent({
  tagName: "md-radio",
  elementClass: MdRadio,
  react: React,
  events: {
    change: "change", // can use "input" as well
  },
});

interface FormikRadioProps {
  name: string;
  value: string;
  label?: string;
  slot?: string;
}

export const FormikRadio: React.FC<FormikRadioProps> = ({
  name,
  value,
  label,
  slot,
}) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const currentValue = values[name] ?? "";
  const isChecked = currentValue === value;

  const handleChange = () => {
    setFieldValue(name, value);
  };

  return (
    <Radio
      name={name}
      value={value}
      checked={isChecked}
      onChange={handleChange}
      slot={slot}
    >
      {label}
    </Radio>
  );
};
