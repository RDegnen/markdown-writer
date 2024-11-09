import { PartsOfSpeech } from "./constants"
import { capitalize } from './helpers'

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

function generateTimestamp(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function generateTags(word: string, partOfSpeech: string) {
  let template = `
tags:
  - vocabulary
  - ${partOfSpeech}  
`.trim()

  if (partOfSpeech === PartsOfSpeech.VERB) {
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
type: ${partOfSpeech}
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