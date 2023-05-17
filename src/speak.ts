import axios from "axios";
import openAIkey from './openAIkey.json';
import { useState, useEffect } from 'react';


// with the input of a string of text, this function will return a string of mp3 data
async function dospeak(input: string) {
    const options = {
        method: 'POST',
        url: 'https://api.elevenlabs.io/v1/text-to-speech/' + openAIkey['xi-voice'],
        headers: {
            accept: 'audio/mpeg','content-type': 'application/json','xi-api-key': openAIkey['xi-api-key'],
        },
        data: { text: input }
    };

    //using axios to make the request
    const response = await axios.request(options);
    //returning the mp3 data
    const blob = new Blob([response.data], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    return url;
}

export default dospeak;