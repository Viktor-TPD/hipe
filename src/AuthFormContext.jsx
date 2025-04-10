import { createContext, useState, useContext } from "react";

const AuthFormContext = createContext({
  formType: "register",
  setFormType: () => {},
});

export function AuthFormProvider({ children }) {
  const [formType, setFormType] = useState("register");

  return (
    <AuthFormContext.Provider value={{ formType, setFormType }}>
      {children}
    </AuthFormContext.Provider>
  );
}

export function useAuthForm() {
  return useContext(AuthFormContext);
}
