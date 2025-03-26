import {
  FieldContainer,
  FieldLabel,
  OptionItem,
  InputControl,
} from "../../styles/formStyles";

export default function CheckboxField({ name, label, checked, onChange }) {
  return (
    <FieldContainer>
      <OptionItem>
        <InputControl
          type="checkbox"
          id={name}
          name={name}
          checked={checked || false}
          onChange={onChange}
        />
        <FieldLabel htmlFor={name}>{label}</FieldLabel>
      </OptionItem>
    </FieldContainer>
  );
}
