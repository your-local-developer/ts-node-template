import {existsSync, rmSync} from 'node:fs'
import {basename, normalize, resolve} from 'node:path'
import {createInterface} from 'node:readline/promises'
import {exit, argv, stdin, stdout} from 'node:process'

// Get args and script path
const [, scriptPath, ...args] = argv

// Filter out empty path
if (args.length === 0 || args[0] === '' || args[0] === undefined) {
	console.error('🤨  Please provide a path to delete')
	console.error(`🤷  Usage: ${basename(scriptPath!)} <path>`)
	exit(1)
}

// Remove path if it exists
const path = normalize(args[0])
const removeAllowed = await askForCriticalPaths(path)
if (existsSync(path) && removeAllowed) {
	rmSync(path, {recursive: true})
}

/**
 * Asks for critical paths
 * @param {string} path
 */
async function askForCriticalPaths(path: string) {
	switch (path) {
		case normalize('/'):
		case normalize('.'):
		case normalize('./'):
		case normalize('..'):
		case normalize('../'): {
			const questionInterface = createInterface({
				input: stdin,
				output: stdout,
			})
			const answer = await questionInterface.question(`⚠️  Are you sure you want to delete this path? ${resolve(path)} (y/N) `)
			questionInterface.close()
			return answer.toLowerCase().trim() === 'y'
		}

		default: {
			return true
		}
	}
}
