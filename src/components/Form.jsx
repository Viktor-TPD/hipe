import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  Children,
  cloneElement,
} from "react";
import Button from './buttons/Button.jsx';

// Create a context for the form
export const FormContext = createContext({
  formData: {},
  errors: {},
  touched: {},
  handleChange: () => {},
  handleBlur: () => {},
});

// Hook to use the form context
export const useFormContext = () => useContext(FormContext);

export default function Form({
  children,
  onSubmit,
  submitLabel = "Submit",
  disabled = false,
  initialValues = {},
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Initialize form data with initialValues when provided
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e) => {
    // Return early if event or target is missing
    if (!e || !e.target) return;

    const { name, value, type, checked } = e.target;

    // For select fields, we need to keep the entire object for react-select
    let processedValue;
    if (type === "select") {
      // For react-select, keep the entire object
      processedValue = value;
    } else {
      // For other field types
      processedValue = value;
    }

    // Update form data with the appropriate value based on input type
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : processedValue,
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
    const isRequired = React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) &&
        child.props &&
        child.props.name === name &&
        child.props.required
    );

    if (isRequired && !formData[name]) {
      setErrors({
        ...errors,
        [name]: `This field is required`,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Collect required field names from children
    const requiredFields = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.props && child.props.required) {
        requiredFields.push(child.props.name);
      }
    });

    // Mark all fields as touched on submit
    const allTouched = requiredFields.reduce(
      (acc, fieldName) => {
        acc[fieldName] = true;
        return acc;
      },
      { ...touched }
    );

    setTouched(allTouched);

    // Validate all required fields
    const newErrors = {};
    requiredFields.forEach((fieldName) => {
      if (!formData[fieldName]) {
        newErrors[fieldName] = `This field is required`;
      }
    });

    // Email validation for both regular and nested email fields
    Object.entries(formData).forEach(([key, value]) => {
      if ((key.includes("email") || key.endsWith(".email")) && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[key] = "Please enter a valid email address";
        }
      }
    });

    // Password validation
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
      }
    }

    // Password confirmation validation
    if (
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  // Provide form state and handlers to all children
  const formContextValue = {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
  };

  return (
    <FormContext.Provider value={formContextValue}>
      <form className="form" onSubmit={handleSubmit}>
        {/* Clone children to inject form props */}
        {Children.map(children, (child) => {
          // Skip null, undefined, or non-React element children
          if (!child || !React.isValidElement(child)) return child;

          // Add form-related props to field components
          return cloneElement(child, {
            value: formData[child.props.name] || "",
            error: errors[child.props.name],
            touched: touched[child.props.name],
          });
        })}

        {Object.keys(errors).length > 0 && (
          <div className="error-summary">
            Please fix the errors above before submitting.
          </div>
        )}

{/* @todo if variant to be a propery, add it, for now this is good */}
        <Button variant="primary" type="submit" >{submitLabel}</Button>

      </form>
    </FormContext.Provider>
  );
}
