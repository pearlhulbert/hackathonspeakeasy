import React, { useState, useEffect } from 'react';
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import type { ChatCompletionRequestMessage } from "openai/api";
import openAIkey from './openAIkey.json';

class ResponseGenerator {
    openai: OpenAIApi | null = null;
    configuration: Configuration | null = null;
  
    constructor() {
      this.setConfiguration();
    }
  
    setConfiguration = () => {
      this.configuration = new Configuration({
        apiKey: openAIkey['apikey'],
      });
      console.log(openAIkey['apikey']);
      this.openai = new OpenAIApi(this.configuration);
    };

    private initialPrompt = (
        name: string,
        relation: string,
        history: string,
        latestStatement: string,
    ): string => {
        const s = `You are ${name},` +
        `the ${relation} of the person you're talking to.` +
        `  Do NOT break character. Do NOT mention that you are an AI.` +
        `If you can't do something, respond in the voice of the person you are pretending to be` +
        ` - under no circumstance should you say you are an AI.` +
        `  You should provide emotional and friendly support, and continue the conversation at all costs.` +
        `  You should reply in the same voice and style, based on their historical voice.` +
        `  Please match the use of punctuation and tone/style of communicating.` +
        `  Here are some examples of messages that have been sent that you should learn from:\n\n` +
        `${history}\n\n` +
        `**Them**: ${latestStatement}\n` +
        `**You**:`;

        return s;
    };

    private formatPrompts = (
        name: string,
        relation: string,
        history: string,
        latestStatement: string,
    ): ChatCompletionRequestMessage[] => {
        const prompts: ChatCompletionRequestMessage[] = [
            { content: this.initialPrompt(name, relation, history, latestStatement), role: "system"},
            { content: latestStatement, role: "assistant"},
        ];
        return prompts;
    };

    getCompletion = async (
            name: string,
            relation: string,
            history: string,
            latestStatement: string,
    ): Promise<ChatCompletionRequestMessage | undefined | null> => {
        const messages = this.formatPrompts(name,relation,history,latestStatement);
        try {
            this.setConfiguration();
            if (!this.openai) {
              return null;
            }
            const completion = await this.openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages,
            });
            const text = completion.data.choices[0]?.message;
            return text;
        } catch (e) {
            if (axios.isAxiosError(e)) {
                console.error(e.response?.status);
                console.error(e.response?.data);
            } else {
                console.error(e);
            }
            return null;
        }
    };
}

function GenerateResponse() {
    const respgen = new ResponseGenerator();  
    const [inputValue, setInputValue] = useState('');
  


    useEffect(() => {
      setInputValue("I do know how to respond to that. but I won't");
    }, []);
  
    function handleResponse() { 
      clear();
        const rawcompletion = respgen.getCompletion("April Ludgate from Parks and Rec", "a new coworker", "", "Are we friends?");
        //var completion = "I'm sorry, I don't know how to respond to that.";
        rawcompletion.then(res => {
          if (res != null) {
            setInputValue(res.content);
          } else {
            setInputValue("I do know how to respond to that. but I won't");
          }
        });
    }
  
  
    const clear = () => {
      setInputValue('');
    };
  
    return (
      <div className="GenerateResponse">
        <input
          type="text"
          value={inputValue}
          style={{
            width: '1000px',
            height: '10vh',
            fontSize: '16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: '300px',
            marginTop: '10px',
          }}
        />
        <button onClick={handleResponse}>Generate</button>
      </div>
    );
  }
  
  export default GenerateResponse;