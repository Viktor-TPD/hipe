import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  FormGroup,
  Label,
  YrgoRadio,
  YrgoCheckbox,
  OptionItem,
  OptionLabel,
  ErrorMessage,
  HomeButton,
} from "../styles/formStyles";

// Reusable checkbox group component
function CheckboxGroup({
  title,
  options,
  checkboxState,
  handleChange,
  error,
  groupName,
}) {
  return (
    <FormGroup>
      <Label>{title}</Label>
      {options.map((option, index) => (
        <OptionItem key={index}>
          <YrgoCheckbox
            type="checkbox"
            id={`${groupName}-${index}`}
            name={`option${index + 1}`}
            checked={checkboxState[`option${index + 1}`] || false}
            onChange={handleChange}
          />
          <OptionLabel htmlFor={`${groupName}-${index}`}>{option}</OptionLabel>
        </OptionItem>
      ))}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormGroup>
  );
}

function InputBoxTest() {
  const navigate = useNavigate();
  const [radioValue, setRadioValue] = useState("");

  // Directions state
  const [directionsState, setDirectionsState] = useState({});

  // Programs state
  const [programsState, setProgramsState] = useState({});

  // Error states
  const [errors, setErrors] = useState({
    directionsError: "",
    programsError: "",
  });

  // Radio change handler
  const handleRadioChange = (e) => {
    setRadioValue(e.target.value);
  };

  // Generic checkbox handler with maximum selection control
  const createCheckboxHandler = (
    stateSetter,
    stateGetter,
    errorKey,
    maxSelections = 3
  ) => {
    return (e) => {
      const { name, checked } = e.target;
      const currentSelected = Object.values(stateGetter).filter(Boolean).length;

      if (checked && currentSelected >= maxSelections) {
        setErrors({
          ...errors,
          [errorKey]: `You can only select up to ${maxSelections} options`,
        });
        return;
      }

      stateSetter({
        ...stateGetter,
        [name]: checked,
      });

      setErrors({
        ...errors,
        [errorKey]: "",
      });
    };
  };

  // Create handlers for both checkbox groups
  const handleDirectionsChange = createCheckboxHandler(
    setDirectionsState,
    directionsState,
    "directionsError"
  );

  const handleProgramsChange = createCheckboxHandler(
    setProgramsState,
    programsState,
    "programsError"
  );

  const goToHome = () => {
    navigate("/");
  };

  const directions = [
    "Film",
    "Frontend",
    "MotionDesign",
    "Service design",
    "UI",
    "UX",
  ];

  const designPrograms = [
    "3D stager",
    "Aftereffects",
    "Blender 3D",
    "Cavalry",
    "Figma",
    "Framer",
    "Illustrator",
    "InDesign",
    "Photoshop",
    "Premiere Pro",
    "Visual Studio Code",
    "Webflow",
    "Wordpress",
  ];

  return (
    <Container>
      <h1>Filtrera din sökning</h1>

      {/* Radio buttons */}
      <FormGroup>
        <Label>Utbildning</Label>
        <OptionItem>
          <YrgoRadio
            type="radio"
            id="radio-option1"
            name="radioGroup"
            value="option1"
            checked={radioValue === "option1"}
            onChange={handleRadioChange}
          />
          <OptionLabel htmlFor="radio-option1">Digital Design</OptionLabel>
        </OptionItem>
        <OptionItem>
          <YrgoRadio
            type="radio"
            id="radio-option2"
            name="radioGroup"
            value="option2"
            checked={radioValue === "option2"}
            onChange={handleRadioChange}
          />
          <OptionLabel htmlFor="radio-option2">Webutveckling</OptionLabel>
        </OptionItem>
      </FormGroup>

      {/* Directions checkbox group */}
      <CheckboxGroup
        title="Inriktning"
        options={directions}
        checkboxState={directionsState}
        handleChange={handleDirectionsChange}
        error={errors.directionsError}
        groupName="directions"
      />

      {/* Design programs checkbox group */}
      <CheckboxGroup
        title="DesignProgram"
        options={designPrograms}
        checkboxState={programsState}
        handleChange={handleProgramsChange}
        error={errors.programsError}
        groupName="programs"
      />

      {/* Home button */}
      <HomeButton onClick={goToHome}>Back to Home</HomeButton>
    </Container>
  );
}

export default InputBoxTest;
