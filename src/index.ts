import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { argv } from './arguments'
import { parse as csvParse } from 'csv'
import { capitalize } from './helpers'
import { generateExpressionTemplate, generateVocabTemplate } from './templateGenerators'
import analyzeText from './analyzeText'
import { InputFileTypes, partOfSpeechMap } from './constants'

interface VocabRow {
  english: string 
  portuguese: string 
  pronunciation: string 
  notes: string 
  context: string 
  synonym: string 
  plural: string
}

interface ExpressionRow {
  english: string
  portuguese: string
  notes: string
}

async function readInputFile<RT>(headers: string[]): Promise<RT[]> {
  return new Promise((resolve, reject) => {
    const inputFilePath = argv.inputFilePath
    const fileContent = readFileSync(inputFilePath)
  
    csvParse(fileContent, {
      delimiter: ',',
      columns: headers,
      from_line: 2
    }, (error, result: RT[]) => {
      if (error) return reject(error)
      return resolve(result)
    })
  })
}

async function generateVocabMarkdownFiles(rows: VocabRow[]) {
  try {
    for (const row of rows) {
      const { portuguese, english, pronunciation, notes, context, synonym, plural } = row
      const analyzedText = await analyzeText(portuguese)
      const pos = partOfSpeechMap[analyzedText[0].pos]
      const outputDirPath = join(__dirname, '..', 'data', 'output', `${pos}s`)

      if (!existsSync(outputDirPath)) mkdirSync(outputDirPath, { recursive: true})

      const word = capitalize(portuguese)
      const outputFilePath = join(outputDirPath, `${word}.md`)
      const markdownString = generateVocabTemplate({
        word,
        pronunciation,
        notes,
        context,
        synonym,
        plural,
        translation: english,
        partOfSpeech: pos,
      })

      writeFileSync(outputFilePath, markdownString)
    }
  } catch (err) {
    console.error(err)
  } finally {
    console.log('finished writing markdown files')
  }
}

function generateExpressionMarkdownFiles(rows: ExpressionRow[]) {
  try {
    const outputDirPath = join(__dirname, '..', 'data', 'output', InputFileTypes.EXPRESSIONS)
    if (!existsSync(outputDirPath)) mkdirSync(outputDirPath, { recursive: true})

    for (const row of rows) {
      const { english, portuguese, notes } = row
      const expression = capitalize(portuguese)
      const outputFilePath = join(outputDirPath, `${expression}.md`)
      const markdownString = generateExpressionTemplate({
        notes,
        expression,
        translation: english
      })

      writeFileSync(outputFilePath, markdownString)
    }
  } catch (err) {
    console.error(err)
  } finally {
    console.log('finished writing markdown files')
  }
}

async function run() {
  switch (argv.inputFileType) {
    case InputFileTypes.VOCAB: {
      const content = await readInputFile<VocabRow>(['english','portuguese','pronunciation','notes','context','synonym','plural'])
      generateVocabMarkdownFiles(content)
    }
    case InputFileTypes.EXPRESSIONS: {
      const content = await readInputFile<ExpressionRow>(['english', 'portuguese', 'notes'])
      generateExpressionMarkdownFiles(content)
    }
    default: {
      console.log('Please enter a valid input file type')
    }
  }
}

run()