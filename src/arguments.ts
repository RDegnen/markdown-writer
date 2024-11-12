import yargs from "yargs/yargs"
import { InputFileTypes } from "./constants"

export const argv = yargs(process.argv.slice(2)).options({
  inputFilePath: {
    type: 'string',
    alias: 'ifp',
    demandOption: true
  },
  inputFileType: {
    type: 'string',
    alias: 'ift',
    demandOption: true,
    choices: [InputFileTypes.EXPRESSIONS, InputFileTypes.VOCAB]
  }
}).parseSync()