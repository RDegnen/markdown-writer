import yargs from "yargs/yargs"

export const argv = yargs(process.argv.slice(2)).options({
  inputFilePath: { type: 'string', alias: 'ifp', demandOption: true },
  partOfSpeech: { type: 'string', alias: 'pos', demandOption: true }
}).parseSync()