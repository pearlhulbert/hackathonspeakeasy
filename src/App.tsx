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
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button onClick={doListen} style={{ backgroundColor: 'green', color: 'white', width: '160px', height: '160px', marginLeft: '180px', marginTop: '8px', fontSize: '20px', borderRadius: '10px', fontWeight: 'bold'}}>Listen</button>
                <button onClick={input.stopRecording} style={{ backgroundColor: 'red', color: 'white', width: '165px', height: '165px', marginLeft: '179px', marginTop: '15px', fontSize: '20px', borderRadius: '10px', fontWeight: 'bold'}}>Stop</button>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{ width: '1260px', height: '350px', marginLeft: '10px', backgroundColor: 'lightblue', fontSize: '20px', borderRadius: '10px' }}
                />
                <textarea
                    value={responseValue}
                    style={{ width: '1270px', marginTop: '20px', marginLeft: '0px', height: '160px', border: 'none', backgroundColor: 'lightblue', fontSize: '20px', borderRadius: '10px' }}
                />
                <div>
                    {audioURL && (
                        <audio autoPlay>
                            <source src={audioURL} type="audio/mpeg" />
                        </audio>
                    )}
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button onClick={handleResponse} style={{ backgroundColor: 'orange', color: 'white', width: '160px', height: '160px', marginLeft: '5px', marginTop: '8px', fontSize: '20px', borderRadius: '10px', fontWeight: 'bold'}}>Respond</button>
                <div style={{ backgroundColor: 'lightblue', width: '320px', height: '160px', marginTop: '210px', border: 'none' }}>
                </div>
            </div>
        </div>

    );



};

export default App;

