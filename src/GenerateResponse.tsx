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
        initialprompt: string,
        history: Array<string>,
        latestStatement: string,
    ): string => {
        let prompt = "";
        console.log(history);
        for (let i = 0; i < history.length; i++) {
            const message = history[i];
            console.log(message);
            prompt = `${prompt}${message}`;
        }
        var s = `${initialprompt}` +
            `${prompt}\n\n` +
            `**Them**: ${latestStatement}\n` +
            `**You**:`;
        console.log(s);
        return s;
    };

    private formatPrompts = (
        initialprompt: string,
        history: Array<string>,
        latestStatement: string,
    ): ChatCompletionRequestMessage[] => {
        const prompts: ChatCompletionRequestMessage[] = [
            { content: this.initialPrompt(initialprompt, history, latestStatement), role: "system" },
            { content: latestStatement, role: "assistant" },
        ];
        return prompts;
    };

    getCompletion = async (
        initialprompt: string,
        history: Array<string>,
        latestStatement: string,
    ): Promise<ChatCompletionRequestMessage | undefined | null> => {
        const messages = this.formatPrompts(initialprompt, history, latestStatement);
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

export default ResponseGenerator;