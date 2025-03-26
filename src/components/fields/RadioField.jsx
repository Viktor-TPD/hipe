// src/components/fields/RadioField.jsx
import {
  FieldContainer,
  FieldLabel,
  OptionsContainer,
  OptionItem,
  InputControl,
} from "../../styles/formStyles";

export default function RadioField({
  name,
  label,
  options = [],
  value,
  onChange,
  required = false,
}) {
  return (
    <FieldContainer>
      <FieldLabel>{label}</FieldLabel>
      <OptionsContainer>
        {options.map((option) => (
          <OptionItem key={option.value}>
            <InputControl
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              required={required && !value}
            />
            <label htmlFor={`${name}-${option.value}`}>{option.label}</label>
          </OptionItem>
        ))}
      </OptionsContainer>
    </FieldContainer>
  );
}
