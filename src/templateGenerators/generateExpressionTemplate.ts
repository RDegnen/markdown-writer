import { generateTimestamp } from "../helpers"

export interface GenerateExpressionTemplateArgs {
  expression: string
  translation: string
  notes?: string
  examples?: string
}

export default function generateExpressionTemplate({
  expression,
  translation,
  notes,
  examples
}: GenerateExpressionTemplateArgs) {
  return `
---
createdAt: ${generateTimestamp()}
type: expression
tags:
  - expression
---

# ${expression}
**Meaning**:: ${translation}
### Examples
${examples || ''}

### Notes
${notes || ''}
`.trim()
}