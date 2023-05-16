import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    console.log('Button clicked!');
    console.log('Input value:', inputValue);
  };

  return (
    <div>
      <div>
      <input type="text" value={inputValue} onChange={handleInputChange} style={{
        width: '1000px',
        height: '30vh',
        fontSize: '16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '450px',
        marginTop: '10px'
        }} />
      </div>
      {/* <div image= style={{
          width: '1000px',
          height: '70vh',
          fontSize: '16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: '450px',
          marginTop: '10px' }}>
          </div> */}
      {/* <button onClick={handleButtonClick}>Button 1</button>
      <button onClick={handleButtonClick}>Button 2</button> */}
      </div>
  );
};

export default App;

