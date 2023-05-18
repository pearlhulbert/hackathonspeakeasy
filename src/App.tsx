import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import openAIkey from './openAIkey.json';
import './App.css';
import ResponseGenerator from './GenerateResponse';
import MicInput from './MicInput';
import people from './messages.json';
import dospeak from './speak';
import bgImage from './bgimage.png';

const App: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [responseValue, setResponseValue] = useState('');

    var input: MicInput = new MicInput(openAIkey['apikey']);
    var response: ResponseGenerator = new ResponseGenerator();
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
        clear();
        input.startRecording();
    }

    function handleResponse() {
        const handleSpeak = async (inputstr: string) => {
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
        //clear();
        const rawcompletion = response.getCompletion(people['prompt'], messageHistory, inputValue);
        rawcompletion.then(res => {
            if (res != null) {
                setResponseValue(res.content);
                var newResponse = "**You**: " + res.content + "\n";
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
          backgroundImage: `url(${bgImage})`,
          display: 'flex',
          flexDirection: 'row',
          height: '100vh'
        }}>
          <div style = {{ display: 'flex', flexDirection: 'column'}}>
            <button onClick={handleResponse} style={{backgroundColor: 'green', color: 'white', width: ''}}>Listen</button>
            <button onClick={handleResponse} style={{backgroundColor: 'red', color: 'white'}}>Stop</button>
          </div>
          <div style = {{
            display: 'flex',
            flexDirection: 'column'
          }}>
          <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{ width: '1260px', height: '350px', marginLeft: '280px', backgroundColor: '#F6F1F0', fontSize: '20px'}}
            />
            <textarea
                value={responseValue}
                style = {{ width: '1740px', marginTop: '16px', marginLeft: '110px', height: '165px', backgroundColor: '#F6F1F0', fontSize: '20px'}}
              />
              <div>
              {audioURL && (
                <audio autoPlay>
                  <source src={audioURL} type="audio/mpeg" />
                </audio>
              )}
            </div>
          </div>
            {/* <Button onClick={handleResponse} style={{backgroundColor: 'orange', color: 'white'}}>Respond</Button> */}
        </div>
        
      );
      
      
      
};

export default App;

