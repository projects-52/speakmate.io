import { PromptTemplate } from 'langchain/prompts';

export const summaryPrompt = new PromptTemplate({
  template: `
    Progressively summarize the lines of conversation provided, adding onto the previous summary returning a new summary.
    Catch all the important facts, that can be used in the conversation later.

    EXAMPLE
    Current summary:
    The student asks what the teacher thinks of artificial intelligence. The teacher thinks artificial intelligence is a force for good.
    
    New lines of conversation:
    Student: Why do you think artificial intelligence is a force for good?
    TEacher: Because artificial intelligence will help humans reach their full potential.
    
    New summary:
    The student asks what the AI thinks of artificial intelligence. The teacher thinks artificial intelligence is a force for good because it will help humans reach their full potential.
    END OF EXAMPLE
    
    Current summary:
    {summary}
    
    New lines of conversation:
    {messages}
  `,
  inputVariables: ['summary', 'messages'],
});
