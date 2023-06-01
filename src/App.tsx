import React, { useState, useEffect } from 'react';
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
    const [resVal1, setResVal1] = useState('');
    const [resVal2, setResVal2] = useState('');
    const [resVal3, setResVal3] = useState('');
    const [isListening, setIsListening] = useState(false);

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
        if (!isListening) { 
            input.startRecording();
            setIsListening(true);
        }
        else {
            input.stopRecording();
            setIsListening(false);
        }
    }

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

    function speak() {
        handleSpeak(inputValue);
    }

    function generate() {

        //input.stopRecording();

        for (let i = 0; i < 3; i++) { 
            const rawcompletion = response.getCompletion(people['prompt'], messageHistory, inputValue);
            rawcompletion.then(res => {
            if (res != null && i === 0) {
                setResVal1(res.content);
                var newResponse = "**You**: " + res.content + "\n";
                messageHistory.push(newResponse);
                console.log(newResponse);
                //handleSpeak(res.content);
            }
            else if (res != null && i === 1) { 
                setResVal2(res.content);
                var newResponse = "**You**: " + res.content + "\n";
                messageHistory.push(newResponse);
                console.log(newResponse);
                //handleSpeak(res.content);
            }
            else if (res != null && i === 2) { 
                setResVal3(res.content);
                var newResponse = "**You**: " + res.content + "\n";
                messageHistory.push(newResponse);
                console.log(newResponse);
                //handleSpeak(res.content);
            }
            else {
                setResponseValue(people['default response']);
            }
            });
        }
        
    }

    function chooseResponse(val: string) {
       setInputValue(val);
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
                {/* <button onClick={input.stopRecording} style={{ backgroundColor: 'red', color: 'white', width: '165px', height: '165px', marginLeft: '179px', marginTop: '15px', fontSize: '32px', fontWeight: 'bold', borderRadius: '10px' }}>Stop</button> */}
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onClick={speak}
                    style={{ width: '1200px', height: '290px', marginLeft: '10px', border: '30px solid lightblue', backgroundColor: 'lightblue', fontSize: '25px', borderRadius: '10px', textAlign: 'center' }}
                />
                <div style={{ display: 'flex', flexDirection: 'row'}}>
                    <textarea
                        value={resVal1}
                        onClick={() => chooseResponse(resVal1)}
                        style={{ width: '410px', marginTop: '22px', marginLeft: '0px', height: '120px', border: '20px solid lightblue', backgroundColor: 'lightblue', fontSize: '15px', borderRadius: '10px', textAlign: 'center' }}
                    />
                    <textarea
                        value={resVal2}
                        onClick={() => chooseResponse(resVal2)}
                        style={{ width: '410px', marginTop: '22px', marginLeft: '0px', height: '120px', border: '20px solid lightblue', backgroundColor: 'lightblue', fontSize: '15px', borderRadius: '10px', textAlign: 'center' }}
                    />
                    <textarea
                        value={resVal3}
                        onClick={() => chooseResponse(resVal3)}
                        style={{ width: '410px', marginTop: '22px', marginLeft: '0px', height: '120px', border: '20px solid lightblue', backgroundColor: 'lightblue', fontSize: '15px', borderRadius: '10px', textAlign: 'center' }}
                    />
                </div>
                <div>
                    {audioURL && (
                        <audio autoPlay key={audioURL}>
                            <source src={audioURL} type="audio/mpeg" />
                        </audio>
                    )}
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button onClick={generate} style={{ backgroundColor: 'orange', color: 'white', width: '160px', height: '160px', marginLeft: '5px', marginTop: '8px', fontSize: '32px', fontWeight: 'bold', borderRadius: '10px' }}>Generate</button>
                <div style={{ backgroundColor: 'lightblue', width: '320px', height: '160px', marginTop: '210px', border: 'none' }}>
                </div>
            </div>
        </div>

    );



};

export default App;

