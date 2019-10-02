const path = require('path')
const { readFileSync } = require('fs')

window.readConfig = () => {
  const file = path.join(__dirname, '../library.gifwit')
  const dotGifwit = JSON.parse(readFileSync(file, 'utf8'))
  return dotGifwit.images
}
