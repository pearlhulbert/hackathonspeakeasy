import React from 'react';
import { useWhisper } from '@chengsokdara/use-whisper'
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
  })

  return (
  <div className="MicInput">
    <button onClick={() => startRecording()}>Listen</button>
      <input type="text" value={transcript.text} style={{
        width: '1000px',
        height: '10vh',
        fontSize: '16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '300px',
        marginTop: '10px'
        }} />
    {/* <button onClick={() => pauseRecording()}>Pause</button> */}
    <button onClick={() => stopRecording()}>Respond</button>
  </div>
  );
}

export default MicInput;