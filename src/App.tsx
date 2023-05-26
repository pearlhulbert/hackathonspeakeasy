import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import './App.css';
import ResponseGenerator from './GenerateResponse';
import MicInput from './MicInput';
import people from './messages.json';
import dospeak from './speak';
import bgImage from './bgimage.png';

const App: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [responseValue, setResponseValue] = useState('');

    var input = MicInput();
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
                <button onClick={doListen} style={{ backgroundColor: 'green', color: 'white', width: '160px', height: '160px', marginLeft: '180px', marginTop: '8px', fontSize: '32px', fontWeight: 'bold', borderRadius: '10px' }}>Listen</button>
                <button onClick={input.stopRecording} style={{ backgroundColor: 'red', color: 'white', width: '165px', height: '165px', marginLeft: '179px', marginTop: '15px', fontSize: '32px', fontWeight: 'bold', borderRadius: '10px' }}>Stop</button>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{ width: '1200px', height: '290px', marginLeft: '10px', border: '30px solid lightblue', backgroundColor: 'lightblue', fontSize: '25px', borderRadius: '10px', textAlign: 'center' }}
                />
                <textarea
                    value={responseValue}
                    style={{ width: '1230px', marginTop: '22px', marginLeft: '0px', height: '120px', border: '20px solid lightblue', backgroundColor: 'lightblue', fontSize: '25px', borderRadius: '10px', textAlign: 'center' }}
                />
                <div>
                    {audioURL && (
                        <audio autoPlay key={audioURL}>
                            <source src={audioURL} type="audio/mpeg" />
                        </audio>
                    )}
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button onClick={handleResponse} style={{ backgroundColor: 'orange', color: 'white', width: '160px', height: '160px', marginLeft: '5px', marginTop: '8px', fontSize: '32px', fontWeight: 'bold', borderRadius: '10px' }}>Respond</button>
                <div style={{ backgroundColor: 'lightblue', width: '320px', height: '160px', marginTop: '210px', border: 'none' }}>
                </div>
            </div>
        </div>

    );



};

export default App;

