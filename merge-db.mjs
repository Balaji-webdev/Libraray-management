

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const authorData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/api/author.json'), 'utf-8'))
const booklistData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/api/booklist.json'), 'utf-8'))
const userData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/api/user.json'), 'utf-8'))

function normalize(data, fallbackKey) {
  if (Array.isArray(data)) {
    return { [fallbackKey]: data }
  }
  return data
}

const db = {
  ...normalize(authorData, 'author'),
  ...normalize(booklistData, 'booklist'),
  ...normalize(userData, 'user'),
}

fs.writeFileSync(
  path.join(__dirname, 'db.json'),
  JSON.stringify(db, null, 2)
)

console.log('✅ db.json created at project root')
console.log('Routes will be:', Object.keys(db).map(k => `/${k}`).join(', '))