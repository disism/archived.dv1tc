import React, { useState } from 'react';

interface NumericInputProps {
  value: number;
  onChange: (value: number) => void;
}

const NumericInput: React.FC<NumericInputProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    const regex = /^[0-9]*$/;
    if (!regex.test(newValue)) {
      setErrorMessage('Input Number');
    } else {
      setErrorMessage('');
      const parsedValue = parseFloat(newValue);
      onChange(parsedValue);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default NumericInput;