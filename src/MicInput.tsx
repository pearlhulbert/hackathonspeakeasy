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