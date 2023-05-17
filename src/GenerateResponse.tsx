import React, { useEffect } from 'react';
import { Configuration, OpenAIApi } from "openai";

class Message {
  role: 'system' | 'user' | 'assistant';
  id: string;
  content: string;

  constructor
}

class Props {
  openai: OpenAIApi; // Replace 'OpenAI' with the actual type of 'this.openai'
  configuration: Configuration;
  messages: Message[];
}

const ResponseGenerator: React.FC<Props> = ({ openai, configuration, messages }) => {
  useEffect(() => {
    const createChatCompletion = async () => {
      const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages,
      });

      // Handle the completion response as needed
      console.log(completion);
    };

    createChatCompletion();
  }, [openai, messages]);

  return <div>Component Content</div>;
};

export default ResponseGenerator;
