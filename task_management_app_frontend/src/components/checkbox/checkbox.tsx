import React from "react";
import { createComponent } from "@lit/react";
import { MdCheckbox } from "@material/web/checkbox/checkbox.js";
import { useFormikContext } from "formik";

export const Checkbox = createComponent({
  tagName: "md-checkbox",
  elementClass: MdCheckbox,
  react: React,
  events: {
    change: "change",
    input: "input",
  },
});

export const FormikCheckbox = ({
  name,
  value,
  label,
  slot,
}: {
  name: string;
  value: string;
  label?: string;
  slot?: string;
}) => {
  const { values, setFieldValue } =
    useFormikContext<Record<string, string[]>>();
  const currentValue: string[] = values[name] || [];

  const isChecked = currentValue.includes(value);

  const handleChange = () => {
    if (!Array.isArray(currentValue)) {
      console.error(`${name} is not an array. Got:`, currentValue);
      return;
    }

    const newValue = isChecked
      ? currentValue.filter((v) => v !== value)
      : [...currentValue, value];
    setFieldValue(name, newValue);
  };

  return (
    <Checkbox
      slot={slot}
      checked={isChecked}
      onChange={handleChange}
      name={name}
    >
      {label}
    </Checkbox>
  );
};
