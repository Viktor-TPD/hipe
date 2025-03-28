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

export default function Form({
  fields,
  onSubmit,
  submitLabel = "Submit",
  disabled = false,
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Mark field as touched
    if (!touched[name]) {
      setTouched({
        ...touched,
        [name]: true,
      });
    }

    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    // Mark field as touched on blur
    if (!touched[name]) {
      setTouched({
        ...touched,
        [name]: true,
      });
    }

    // Validate field on blur if it's required
    const field = fields.find((f) => f.name === name);
    if (field?.required && !formData[name]) {
      setErrors({
        ...errors,
        [name]: `${field.label || field.name} is required`,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched on submit
    const allTouched = fields.reduce((acc, field) => {
      acc[field.name] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Comprehensive validation
    const newErrors = {};
    fields.forEach((field) => {
      // Required field validation
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label || field.name} is required`;
      }

      // Email validation
      if (field.type === "email" && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = "Please enter a valid email address";
        }
      }

      // Password strength validation (optional)
      if (
        field.type === "password" &&
        field.name === "password" &&
        formData[field.name]
      ) {
        if (formData[field.name].length < 6) {
          newErrors[field.name] = "Password must be at least 6 characters long";
        }
      }

      // Password confirmation validation
      if (
        field.name === "confirmPassword" &&
        formData.password !== formData.confirmPassword
      ) {
        newErrors[field.name] = "Passwords do not match";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
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

        // Create props WITHOUT the key
        const commonProps = {
          name: field.name,
          label:
            field.label ||
            field.name.charAt(0).toUpperCase() + field.name.slice(1),
          value: formData[field.name] || "",
          onChange: handleChange,
          onBlur: handleBlur,
          required: field.required,
          error: errors[field.name],
          touched: !!touched[field.name],
        };

        switch (field.type) {
          case "text":
          case "email":
          case "password":
          case "tel":
          case "number":
            return (
              <FieldComponent
                key={field.name}
                {...commonProps}
                type={field.type}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
              />
            );
          case "radio":
            return (
              <FieldComponent
                key={field.name}
                {...commonProps}
                options={field.options}
              />
            );
          case "select":
            return (
              <FieldComponent
                key={field.name}
                {...commonProps}
                options={field.options}
                placeholder={field.placeholder}
              />
            );
          case "checkbox":
            return (
              <FieldComponent
                key={field.name}
                {...commonProps}
                checked={formData[field.name] || false}
              />
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

      <button type="submit" className="submit-button" disabled={disabled}>
        {submitLabel}
      </button>
    </form>
  );
}
