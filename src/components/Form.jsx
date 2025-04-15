import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  Children,
  cloneElement,
} from "react";
import Button from "./buttons/Button.jsx";

export const FormContext = createContext({
  formData: {},
  errors: {},
  touched: {},
  handleChange: () => {},
  handleBlur: () => {},
});

export const useFormContext = () => useContext(FormContext);

export default function Form({
  children,
  onSubmit,
  submitLabel = "Submit",
  disabled = false,
  initialValues = {},
  bottomButtons = true,
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e) => {
    if (!e || !e.target) return;

    const { name, value, type, checked } = e.target;

    let processedValue;
    if (type === "select") {
      processedValue = value;
    } else {
      processedValue = value;
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : processedValue,
    });

    if (!touched[name]) {
      setTouched({
        ...touched,
        [name]: true,
      });
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    if (!touched[name]) {
      setTouched({
        ...touched,
        [name]: true,
      });
    }

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
        [name]: `Det här fältet är obligatoriskt.`,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.props && child.props.required) {
        requiredFields.push(child.props.name);
      }
    });

    const allTouched = requiredFields.reduce(
      (acc, fieldName) => {
        acc[fieldName] = true;
        return acc;
      },
      { ...touched }
    );

    setTouched(allTouched);

    const newErrors = {};
    requiredFields.forEach((fieldName) => {
      if (!formData[fieldName]) {
        newErrors[fieldName] = `Det här fältet är obligatoriskt.`;
      }
    });

    Object.entries(formData).forEach(([key, value]) => {
      if ((key.includes("email") || key.endsWith(".email")) && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[key] = "Var vänlig ange en giltig emailadress.";
        }
      }
    });

    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "Lösenord måste vara minst 6 tecken långt.";
      }
    }

    if (
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Angivna lösenord matchar inte.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

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
        {Children.map(children, (child) => {
          if (!child || !React.isValidElement(child)) return child;

          return cloneElement(child, {
            value: formData[child.props.name] || "",
            error: errors[child.props.name],
            touched: touched[child.props.name],
          });
        })}

        {Object.keys(errors).length > 0 && (
          <div className="error-summary">
            Vänligen åtgärda felen ovan innan du skickar in.
          </div>
        )}

        {bottomButtons && (
          <div className="button-container">
            <Button variant="primary" type="submit">
              {submitLabel}
            </Button>
            <Button variant="select">Rensa Formulär X</Button>
          </div>
        )}
      </form>
    </FormContext.Provider>
  );
}
