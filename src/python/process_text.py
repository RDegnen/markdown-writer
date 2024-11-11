import spacy
import sys
import json

nlp = spacy.load("pt_core_news_sm")

def process_text(text):
  doc = nlp(text)
  result = [{"text": token.text, "lemma": token.lemma_, "pos": token.pos_} for token in doc]
  return result

if __name__ == "__main__":
  input_text = sys.argv[1]
  output = process_text(input_text)
  print(json.dumps(output))