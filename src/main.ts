import 'dotenv/config'
import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const { env: { OPENAI_API_KEY: apiKey } } = process

const Step = z.object({
  explanation: z.string(),
  output: z.string(),
})

const MathResponse = z.object({
  steps: z.array(Step),
  final_answer: z.string(),
})

type MathResponseType = z.infer<typeof MathResponse>

interface CompletionChoice {
  message?: {
    parsed?: MathResponseType
    refusal?: string
  }
}

const client = new OpenAI({ apiKey })

const main = async () => {
  const content = "solve 8x + 3 = 21"

  const completion = await client.beta.chat.completions.parse({
    model: 'gpt-4o-2024-08-06',
    messages: [
      {
        role: "system",
        content: "You are a helpful math tutor. Only use the schema for math responses.",
      },
      { role: "user", content: content },
    ],
    response_format: zodResponseFormat(MathResponse, 'mathResponse'),
  })

  const message = (completion.choices[0] as CompletionChoice)?.message

  if (message?.parsed) {
    console.log('content:', content)
    console.log('total steps:', message.parsed.steps.length)
    console.log(message.parsed.steps)
    console.log(message.parsed.final_answer)
  } else {
    console.log(message?.refusal)
  }
}

main()
