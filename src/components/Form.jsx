import { useState } from "react";
import NameField from "./fields/NameField";
import EmailField from "./fields/EmailField";
import CheckboxField from "./fields/CheckboxField";

const fieldComponents = {
  name: NameField,
  email: EmailField,
  checkbox: CheckboxField,
};

export default function Form({ fields, onSubmit }) {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => {
        const FieldComponent = fieldComponents[field.type];

        if (!FieldComponent) return null;

        if (field.type === "checkbox") {
          return (
            <FieldComponent
              key={field.name}
              name={field.name}
              label={field.label}
              checked={formData[field.name]}
              onChange={handleChange}
            />
          );
        }

        return (
          <FieldComponent
            key={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            required={field.required}
          />
        );
      })}
      <button type="submit">Submit</button>
    </form>
  );
}
