import React, { useState, useEffect } from 'react';
import { useWhisper } from '@chengsokdara/use-whisper';
import openAIkey from './openAIkey.json';

function MicInput() {
  const {
    recording,
    speaking,
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: openAIkey['apikey'], // YOUR_OPEN_AI_TOKEN
  });

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (transcript && transcript.text) {
      setInputValue(transcript.text);
    }
  }, [transcript]);

  function handleResponse() { 
    clear();
    // use mimessage and GPT to generate a response
  }


  const clear = () => {
    setInputValue('');
  };

  return (
    <div className="MicInput">
      <button onClick={startRecording}>Listen</button>
      <button onClick={stopRecording}>Stop</button>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{
          width: '1000px',
          height: '10vh',
          fontSize: '16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: '300px',
          marginTop: '10px',
        }}
      />
      <button onClick={handleResponse}>Respond</button>
    </div>
  );
}

export default MicInput;
