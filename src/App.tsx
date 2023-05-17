import React, { useState, useEffect } from 'react';
import { useWhisper } from '@chengsokdara/use-whisper';
import openAIkey from './openAIkey.json';
import './App.css';
import ResponseGenerator from './GenerateResponse';
import MicInput from './MicInput';
import people from './messages.json';
import fs from 'fs';


const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [responseValue, setResponseValue] = useState('');

  var input : MicInput = new MicInput(openAIkey['apikey']);
  var response : ResponseGenerator = new ResponseGenerator();
  var messageHistory: Array<string> = people['history'];

    
      useEffect(() => {
        if (input.transcript && input.transcript.text) {
          setInputValue(input.transcript.text);
          var newMessage: string = "**Them**: " + input.transcript.text + "\n";
          messageHistory.push(newMessage);
          console.log(messageHistory);
        }; 
      }, [input.transcript, messageHistory]);
    
      useEffect(() => {
        setResponseValue("");
      }, []);

      const clear = () => {
        setInputValue('');
      };


      function doListen() {
        input.startRecording();
      }

      function handleResponse() { 
        input.stopRecording();
        clear();
          const rawcompletion = response.getCompletion("April Ludgate from Parks and Rec", "a new coworker", messageHistory, inputValue);
          rawcompletion.then(res => {
            if (res != null) {
              setResponseValue(res.content);
              var newResponse =  "**You**: " + res.content + "\n";
              messageHistory.push(newResponse);
            }
           else {
              setResponseValue("I do know how to respond to that. but I won't");
            }
          });
      }
    
  return (
    <div>
       <div className="MicInput">
      <button onClick={doListen}>Listen</button>
      <button onClick={input.stopRecording}>Stop</button>
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
      <div className="GenerateResponse">
    <input
      type="text"
      value={responseValue}
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
    {/* <button onClick={handleResponse}>Generate</button> */}
    </div>
    {/* </div>
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
      </div> */}
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
      </div>
  );
};

export default App;

