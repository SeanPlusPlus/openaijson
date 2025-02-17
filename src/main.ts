import 'dotenv/config'
import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

// Environment Variables
const { env: { OPENAI_API_KEY: apiKey } } = process

// Client Initialization
const client = new OpenAI({ apiKey })

// Zod Schema Definitions
const Step = z.object({
  explanation: z.string(),
  output: z.string(),
})

const MathResponse = z.object({
  steps: z.array(Step),
  final_answer: z.string(),
})

// TypeScript Type Inference and Interface Definitions
type MathResponseType = z.infer<typeof MathResponse>

interface CompletionChoice {
  message?: {
    parsed?: MathResponseType
    refusal?: string
  }
}

// Main Function Definition
const main = async () => {
  const input = "8x + 3 = 27"

  const completion = await client.beta.chat.completions.parse({
    model: 'gpt-4o-2024-08-06',
    messages: [
      {
        role: "system",
        content: "You are a helpful math tutor. Only use the schema for math responses. If the content does not appear to be a math problem, throw an error.",
      },
      { role: "user", content: input },
    ],
    response_format: zodResponseFormat(MathResponse, 'mathResponse'),
  })

  const message = (completion.choices[0] as CompletionChoice)?.message

  if (message?.parsed) {
    console.table({ input, total_steps: message.parsed.steps.length})
    console.log(message.parsed.steps)
    console.log(message.parsed.final_answer)
  } else {
    console.log(message?.refusal)
  }
}

main()
