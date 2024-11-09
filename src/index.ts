import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { argv } from './arguments'
import { parse as csvParse } from 'csv'
import generateVocabTemplate from './generateVocabTemplate'
import { capitalize } from './helpers'

interface VocabRow {
  english: string 
  portuguese: string 
  pronunciation: string 
  notes: string 
  context: string 
  synonym: string 
  plural: string
}

async function readInputFile(): Promise<VocabRow[]> {
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

function generateMarkdownFiles(rows: VocabRow[]) {
  try {
    const partOfSpeech = argv.partOfSpeech
    const outputDirPath = join(__dirname, '..', 'data', 'output', `${partOfSpeech}s`)
    if (!existsSync(outputDirPath)) mkdirSync(outputDirPath, { recursive: true})

    for (const row of rows) {
      const { portuguese, english, pronunciation, notes, context, synonym, plural } = row
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
        partOfSpeech: partOfSpeech,
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
  const content = await readInputFile()
  generateMarkdownFiles(content)
}

run()