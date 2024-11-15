export const partOfSpeechMap: { [key: string]: string } = {
  ADJ: "Adjective",
  ADP: "Adposition",
  ADV: "Adverb",
  AUX: "Auxiliary Verb",
  CCONJ: "Coordinating Conjunction",
  DET: "Determiner",
  INTJ: "Interjection",
  NOUN: "Noun",
  NUM: "Numeral",
  PART: "Particle",
  PRON: "Pronoun",
  PROPN: "Proper Noun",
  PUNCT: "Punctuation",
  SCONJ: "Subordinating Conjunction",
  SYM: "Symbol",
  VERB: "Verb",
  X: "Other / Unknown",
  SPACE: "Space"
};

export enum InputFileTypes {
  EXPRESSIONS = 'expressions',
  VOCAB = 'vocab'
}
