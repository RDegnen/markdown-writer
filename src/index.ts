import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { argv } from './arguments'
import { parse as csvParse } from 'csv'
import { capitalize } from './helpers'
import { generateVocabTemplate } from './templateGenerators'
import analyzeText from './analyzeText'
import { partOfSpeechMap } from './constants'

interface VocabRow {
  english: string 
  portuguese: string 
  pronunciation: string 
  notes: string 
  context: string 
  synonym: string 
  plural: string
}

async function readVocabInputFile(): Promise<VocabRow[]> {
  return new Promise((resolve, reject) => {
    const headers = ['english','portuguese','pronunciation','notes','context','synonym','plural']
    const inputFilePath = argv.inputFilePath
    const fileContent = readFileSync(inputFilePath)
  
    csvParse(fileContent, {
      delimiter: ',',
      columns: headers,
      from_line: 2
    }, (error, result: VocabRow[]) => {
      if (error) return reject(error)
      return resolve(result)
    })
  })
}

async function generateMarkdownFiles(rows: VocabRow[]) {
  try {
    for (const row of rows) {
      const { portuguese, english, pronunciation, notes, context, synonym, plural } = row
      const analyzedText = await analyzeText(portuguese)
      const pos = partOfSpeechMap[analyzedText[0].pos]
      const outputDirPath = join(__dirname, '..', 'data', 'output', `${pos}s`)

      if (!existsSync(outputDirPath)) mkdirSync(outputDirPath, { recursive: true})

      console.log(analyzedText)
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

async function run() {
  const partOfSpeech = argv.partOfSpeech
  const content = await readVocabInputFile()
  generateMarkdownFiles(content)
}

run()