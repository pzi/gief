const { readFileSync } = require('fs')
const path = require('path')
const debounce = require('debounce')
const { clipboard, ipcRenderer } = require('electron')
const search = require('./search.js')
const ImageContainer = require('./image-container.js')

const imagesWrapper = document.getElementById('images')
const imageContainer = new ImageContainer(imagesWrapper)
const searchInput = document.getElementById('search')

const images = getImages()

function getImages() {
  const file = path.join(__dirname, '../library.gifwit')
  const dotGifwit = JSON.parse(readFileSync(file, 'utf8'))
  return dotGifwit.images
}

imageContainer.addAll(images)

document.addEventListener(
  'keydown',
  (event) => {
    const upArrow = 38
    const downArrow = 40
    const currentSelection = imagesWrapper.querySelector('.image-container.is-selected')
    const targetIsSearchInput = event.target === searchInput

    if (currentSelection && !targetIsSearchInput) {
      event.preventDefault()
      if (event.keyCode === upArrow) {
        const previousContainer = currentSelection.previousSibling
        if (previousContainer && previousContainer.matches('.image-container')) {
          imageContainer.select(previousContainer)
        }
      } else if (event.keyCode === downArrow) {
        const nextContainer = currentSelection.nextSibling
        if (nextContainer && nextContainer.matches('.image-container')) {
          imageContainer.select(nextContainer)
        }
      }
    }
  },
  true
)

searchInput.addEventListener(
  'input',
  debounce((event) => {
    search(event.target.value, images, imageContainer, imagesWrapper)
  }, 300)
)

ipcRenderer.on('window-blur', () => {
  imageContainer.deselectAll()
  imageContainer.removeAll()
  imageContainer.addAll(images)
})

ipcRenderer.on('GlobalShortcuts', (event, shortcut) => {
  switch (shortcut) {
    case 'CmdOrCtrl+C':
      clipboard.writeText(
        imagesWrapper.querySelector('.is-selected').getElementsByTagName('img')[0].src
      )
      break
    case 'CmdOrCtrl+F':
      searchInput.focus()
  }
})
