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
    <p>Recording: {recording}</p>
    <p>Speaking: {speaking}</p>
    <p>Transcribing: {transcribing}</p>
    <p>Transcribed Text: {transcript.text}</p>
    <button onClick={() => startRecording()}>Start</button>
    <button onClick={() => pauseRecording()}>Pause</button>
    <button onClick={() => stopRecording()}>Stop</button>
  </div>
  );
}

export default MicInput;