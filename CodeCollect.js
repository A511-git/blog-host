import fs from 'fs'
import path from 'path'

const ROOT_DIR = process.cwd()
const OUTPUT_FILE = path.join(ROOT_DIR, 'collected-code.txt')

const TARGET_DIRS = ['app', 'data', 'faq', 'layouts', 'public', 'scripts']

const TEXT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.json',
  '.md',
  '.mdx',
  '.css',
  '.scss',
  '.txt',
  '.html',
  '.env',
])

function collectFiles(dirPath, collected) {
  if (!fs.existsSync(dirPath)) return

  const entries = fs.readdirSync(dirPath, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      collectFiles(fullPath, collected)
    } else {
      const ext = path.extname(entry.name)
      if (TEXT_EXTENSIONS.has(ext)) {
        collected.push(fullPath)
      }
    }
  }
}

function run() {
  const allFiles = []

  for (const dir of TARGET_DIRS) {
    const fullDirPath = path.join(ROOT_DIR, dir)
    collectFiles(fullDirPath, allFiles)
  }

  const output = []

  for (const filePath of allFiles) {
    const relativePath = path.relative(ROOT_DIR, filePath)
    const content = fs.readFileSync(filePath, 'utf8')

    output.push(
      '\n' + '='.repeat(80) + `\nFILE: ${relativePath}\n` + '='.repeat(80) + '\n' + content + '\n'
    )
  }

  fs.writeFileSync(OUTPUT_FILE, output.join(''), 'utf8')
  console.log(`✅ Collected ${allFiles.length} files into ${OUTPUT_FILE}`)
}

run()
