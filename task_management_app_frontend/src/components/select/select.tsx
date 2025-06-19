import { useFormikContext } from "formik";
import React, { useRef } from "react";
// import Select from "react-select";
// import type { OptionsType, ValueType } from "react-select/lib/types";
import { useField } from "formik";
import { createComponent } from "@lit/react";
import { MdOutlinedSelect } from "@material/web/select/outlined-select";
import { MdSelectOption } from "@material/web/select/select-option";

export const OutlinedSelect = createComponent({
  tagName: "md-outlined-select",
  elementClass: MdOutlinedSelect,
  react: React,
  events: {
    input: "input",
    change: "change",
  },
});

export const SelectOption = createComponent({
  tagName: "md-select-option",
  elementClass: MdSelectOption,
  react: React,
});

interface FormikSingleSelectProps {
  name: string;
  label?: string;
  options: Option[];
  supportingText?: string;
}

export const FormikSingleSelect: React.FC<FormikSingleSelectProps> = ({
  name,
  label,
  options,
  supportingText,
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const selectRef = useRef<MdOutlinedSelect>(null);

  const handleChange = (e: React.FormEvent<MdOutlinedSelect>) => {
    const target = e.currentTarget as MdOutlinedSelect;
    const selectedValue = target.value;
    setFieldValue(name, selectedValue);
  };

  return (
    <OutlinedSelect
      ref={selectRef}
      value={field.value}
      onInput={handleChange}
      label={label}
      supportingText={supportingText}
      error={meta.touched && Boolean(meta.error)}
      errorText={meta.touched && meta.error ? meta.error : undefined}
    >
      {options.map((option) => (
        <SelectOption key={option.value} value={option.value}>
          {option.label}
        </SelectOption>
      ))}
    </OutlinedSelect>
  );
};

interface Option {
  label: string;
  value: string;
}

// interface CustomSelectProps extends FieldProps {
//   options: OptionsType<Option>;
//   isMulti?: boolean;
//   className?: string;
//   placeholder?: string;
// }

// export const CustomSelect = ({
//   className,
//   placeholder,
//   field,
//   form,
//   options,
//   isMulti = false,
// }: CustomSelectProps) => {
//   const onChange = (option: ValueType<Option | Option[]>) => {
//     form.setFieldValue(
//       field.name,
//       isMulti
//         ? (option as Option[]).map((item: Option) => item.value)
//         : (option as Option).value,
//     );
//   };

//   const getValue = () => {
//     if (options) {
//       return isMulti
//         ? options.filter((option) => field.value.indexOf(option.value) >= 0)
//         : options.find((option) => option.value === field.value);
//     } else {
//       return isMulti ? [] : ("" as any);
//     }
//   };

//   return (
//     <Select
//       className={className}
//       name={field.name}
//       value={getValue()}
//       onChange={onChange}
//       placeholder={placeholder}
//       options={options}
//       isMulti={isMulti}
//     />
//   );
// };

// export default CustomSelect;
