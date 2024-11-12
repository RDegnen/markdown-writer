import { generateTimestamp } from "../helpers"

export interface GenerateExpressionTemplateArgs {
  expression: string
  translation: string
  notes?: string
}

export default function generateExpressionTemplate({
  expression,
  translation,
  notes
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
### Notes
${notes || ''}
`.trim()
}