import { useWhisper } from '@chengsokdara/use-whisper'

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
    apiKey: "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", // YOUR_OPEN_AI_TOKEN
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