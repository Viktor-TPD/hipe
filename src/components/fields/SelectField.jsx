import React from 'react';
import Select from 'react-select';
import {
  FieldContainer,
  FieldLabel,
  OptionItem,
  InputControl,
} from "../../styles/formStyles";

export default function DropdownField({ 
  name, 
  label, 
  options, 
  value, 
  onChange 
}) {
  const handleChange = (selectedOption) => {
    onChange(selectedOption); // Skicka hela objektet vidare
  };
  // Custom styles to match your existing form styling
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '30px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 6px',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '30px',
    }),
  };

  return (
    <FieldContainer>
      <OptionItem>
        <Select
          name={name}
          options={options}
          value={options.find(option => option.value === value)}
          onChange={onChange}
          styles={customStyles}
          placeholder={`Select ${label}...`}
        />
        <FieldLabel>{label}</FieldLabel>
      </OptionItem>
    </FieldContainer>
  );
}
