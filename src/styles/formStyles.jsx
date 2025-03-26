import styled from "@emotion/styled";

// Container and layout components
export const Container = styled.div`
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
`;

// Field container components - used by the field components
export const FieldContainer = styled.div`
  margin-bottom: 20px;
`;

export const FieldLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const OptionItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

// Input controls
export const InputControl = styled.input`
  margin-right: 8px;
  cursor: pointer;
`;

// YRGO-style input components
export const YrgoRadio = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ff2222;
  border-radius: 50%;
  margin-right: 10px;
  cursor: pointer;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
  position: relative;

  &:checked {
    &:after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ff5722;
    }
  }
`;

export const YrgoCheckbox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ff5722;
  border-radius: 0;
  margin-right: 10px;
  cursor: pointer;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
  position: relative;

  &:checked {
    background-color: #ff5722;

    &:after {
      content: "";
      position: absolute;
      top: 2px;
      left: 6px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }
`;

export const HomeButton = styled.button`
  background-color: #ff5722;
  color: white;
  border: none;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;

  &:hover {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
  }
`;

export const OptionLabel = styled.label`
  cursor: pointer;
`;

export const ErrorMessage = styled.div`
  color: #ff5722;
  margin-top: 4px;
  font-size: 14px;
`;
