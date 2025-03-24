import { useState } from "react";
import TextField from "./fields/TextField";
import RadioField from "./fields/RadioField";
import CheckboxField from "./fields/CheckboxField";
import SelectField from "./fields/SelectField";

const fieldComponents = {
  text: TextField,
  email: TextField,
  password: TextField,
  tel: TextField,
  number: TextField,
  radio: RadioField,
  checkbox: CheckboxField,
  select: SelectField,
};

export default function Form({ fields, onSubmit }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label || field.name} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => {
        let FieldComponent;

        if (
          field.type === "email" ||
          field.type === "password" ||
          field.type === "tel" ||
          field.type === "number"
        ) {
          FieldComponent = fieldComponents.text;
        } else {
          FieldComponent = fieldComponents[field.type];
        }

        if (!FieldComponent) return null;

        const commonProps = {
          key: field.name,
          name: field.name,
          label:
            field.label ||
            field.name.charAt(0).toUpperCase() + field.name.slice(1),
          value: formData[field.name],
          onChange: handleChange,
          required: field.required,
          error: errors[field.name],
        };

        switch (field.type) {
          case "text":
          case "email":
          case "password":
          case "tel":
          case "number":
            return (
              <FieldComponent
                {...commonProps}
                type={field.type}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
              />
            );
          case "radio":
          case "select":
            return (
              <FieldComponent
                {...commonProps}
                options={field.options}
                placeholder={field.placeholder}
              />
            );
          case "checkbox":
            return (
              <FieldComponent {...commonProps} checked={formData[field.name]} />
            );
          default:
            return null;
        }
      })}

      {Object.keys(errors).length > 0 && (
        <div className="error-summary">
          Please fix the errors above before submitting.
        </div>
      )}

      <button type="submit">Submit</button>
    </form>
  );
}
