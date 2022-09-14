import {exit, argv} from 'node:process'
import {basename} from 'node:path'

async function main(argv: string[]): Promise<void> {
	const [command, script, ...args] = argv
	console.log(
		`Hello, ${args[0] ?? 'Typescript'}!
	from ${basename(command ?? 'unknown')}@${basename(script ?? 'unknown')}`,
	)
}

try {
	await main(argv)
} catch (error: unknown) {
	if (error instanceof Error) {
		console.error(error.message)
	} else {
		console.error(error)
	}

	exit(1)
}
