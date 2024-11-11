import { partOfSpeechMap } from "../constants"
import { capitalize, generateTimestamp } from '../helpers'

export interface GenerateVocabTemplateArgs {
  partOfSpeech: string
  word: string
  translation: string
  pronunciation?: string
  notes?: string
  context?: string
  synonym?: string
  plural?: string
}

function generateTags(word: string, partOfSpeech: string) {
  let template = `
tags:
  - vocabulary
  - ${partOfSpeech.toLowerCase()}  
`.trim()

  if (partOfSpeech === partOfSpeechMap['VERB']) {
    template = template + `
  - ${word.slice(word.length - 2, word.length)}
  `
  }

  return template.trim()
}

export default function generateVocabTemplate({
  partOfSpeech,
  word,
  translation,
  pronunciation,
  notes,
  context,
  synonym,
  plural
}: GenerateVocabTemplateArgs) {
  return `
---
createdAt: ${generateTimestamp()}
type: ${partOfSpeech.toLowerCase()}
${generateTags(word, partOfSpeech)}
---

# ${word}
**Meaning**:: ${translation}
**Pronunciation**:: ${pronunciation || ''}
**Synonyms**:: ${synonym ? '[[' + capitalize(synonym) + ']]' : ''}
**Plural**:: ${plural || ''}
### Context
${context || ''}

### Notes
${notes || ''}
`.trim()
}