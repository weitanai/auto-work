interface Preferences {
    openAiApiKey: string;
  }
  
  interface gptFormValues {
    prompt: string;
    model: string;
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
  }
  
  interface gptCompletion {
    status: number;
    statusText: string;
    request?: any;
    data: any;
  }
  
  interface modelTokenLimit {
    [model: string]: number;
  }