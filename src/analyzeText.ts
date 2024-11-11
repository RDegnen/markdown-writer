import { execFile } from "child_process"
import { join } from "path"

export interface AnalyzedText {
  text: string
  lemma: string
  pos: string
}

export default async function analyzeText(text: string): Promise<AnalyzedText[]> {
  return new Promise((resolve, reject) => {
    execFile(
      'python3',
      [join(__dirname, 'python', 'process_text.py'), text],
      (error, stdout, stderr) => {
        if (error) reject(error)
        if (stderr) reject(stderr)

        try {
          resolve(JSON.parse(stdout))
        } catch (err) {
          reject(`Error parsing json ${err}`)
        }
    })
  })
}