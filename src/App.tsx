import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import { useWhisper } from '@chengsokdara/use-whisper';
import openAIkey from './openAIkey.json';
import './App.css';
import ResponseGenerator from './GenerateResponse';
import MicInput from './MicInput';
import people from './messages.json';
import dospeak from './speak';
import { green } from '@mui/material/colors';
import keyboardImage from './virtualkeyboard.png';

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [responseValue, setResponseValue] = useState('');

  var input : MicInput = new MicInput(openAIkey['apikey']);
  var response : ResponseGenerator = new ResponseGenerator();
  var messageHistory: Array<string> = people['history'];
  var blob: Blob;
    
  const [audioURL, setAudioURL] = useState<string | null>(null); // Initialize the state with a null value

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
        const handleSpeak = async(inputstr: string) => {
          try {
            blob = await dospeak(inputstr);
            //console.log(data);
            console.log("done speak");
            //const blob = binarytoBlob(data);
            console.log(blob);
            const url = URL.createObjectURL(blob);
            console.log(url);
            setAudioURL(url); // Update the audioURL state with the returned URL
          } catch (error) {
            // Handle any errors that occurred during the dospeak function call
            console.error('Error occurred while speaking:', error);
          }
        }
                
                
        input.stopRecording();
        clear();
          const rawcompletion = response.getCompletion(people['name'], messageHistory, inputValue);
          rawcompletion.then(res => {
            if (res != null) {
              setResponseValue(res.content);
              var newResponse =  "**You**: " + res.content + "\n";
              messageHistory.push(newResponse);
              console.log(newResponse);
              handleSpeak(res.content);
            }
           else {
              setResponseValue(people['default response']);
           }
          });
      }

    
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#62C1C1',
        }}>
          <div>
            <Button onClick={doListen} size="large" style={{backgroundColor: 'green', color: 'white'}}>Listen</Button>
            <Button onClick={input.stopRecording} size="large" style={{backgroundColor: 'red', color: 'white'}}>Stop</Button>
            <TextField
              type= "text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{ width: '1685px', backgroundColor: '#F6F1F0', fontSize: '20px'}}
            />
            <Button onClick={handleResponse} style={{backgroundColor: 'orange', color: 'white'}}>Respond</Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              {audioURL && (
                <audio autoPlay>
                  <source src={audioURL} type="audio/mpeg" />
                </audio>
              )}
            </div>
            <div className="GenerateResponse">
              <textarea
                value={responseValue}
                style = {{ width: '1650px', height: '150px', backgroundColor: '#F6F1F0', fontSize: '20px'}}
              />
            </div>
          </div>
          <div style={{ width: '1700px', backgroundColor: '#CCCFCF'}}>
            <img src={keyboardImage} alt="Virtual Keyboard" style={{ width: '1700px'}} />
          </div>
        </div>
        
      );
      
      
      
};

export default App;

