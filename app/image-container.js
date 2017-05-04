const remote = require('electron').remote
const {Menu, MenuItem, clipboard} = remote
const currentWindow = remote.getCurrentWindow()

// Constructor
class ImageContainer {
  constructor (wrapper) {
    // always initialize all instance properties
    this.wrapper = wrapper
  }

  addAll (images) {
    for (var i = 0; i < images.length; i++) {
      var image = images[i]
      this.addNew(image)
    }
  }

  removeAll () {
    while (this.wrapper.firstChild) {
      this.wrapper.removeChild(this.wrapper.firstChild)
    }
  }

  addNew (image) {
    // create the container
    const imageContainer = document.createElement('div')
    imageContainer.className = 'image-container'

    // create the image link...
    const link = document.createElement('a')
    link.className = 'image-link'
    link.href = image.url

    // ... bind event handlers to image-link...
    link.addEventListener('click', this.select.bind(this))
    link.addEventListener('dblclick', this.copyImgUrlToClipboard.bind(this))
    link.addEventListener('contextmenu', this.openImageContextMenu.bind(this))

    // ...and add it to the container
    imageContainer.appendChild(link)

    // create the actual img and add it inside the link
    const img = document.createElement('img')
    img.src = image.url
    link.appendChild(img)

    // create all tags and add it to the container
    const keywords = image.keywords.split(' ')
    const tags = document.createElement('p')
    tags.className = 'tags'

    keywords.forEach((keyword) => {
      // only use keywords that are longer than 1 character
      if (keyword.length > 1) {
        var tag = document.createElement('span')
        tag.className = 'tag'
        tag.innerHTML = keyword
        tags.appendChild(tag)
      }
    })
    imageContainer.appendChild(tags)

    // append the finished container to target wrapper
    this.wrapper.appendChild(imageContainer)
  }

  select (target) {
    let imageContainer = ''
    // select is called from mouseclick or when keyboard up/down arrows are pressed
    const isEvent = target.currentTarget || false

    if (isEvent) {
      const event = target
      event.preventDefault()
      imageContainer = event.currentTarget.parentElement
    } else {
      imageContainer = target
    }

    if (imageContainer) {
      this.deselectAll()
    }

    if (imageContainer.classList.contains('is-selected') !== true) {
      imageContainer.classList.add('is-selected')
      imageContainer.scrollIntoViewIfNeeded()
    }
  }

  deselectAll (image) {
    const imageContainers = this.wrapper.querySelectorAll('.image-container.is-selected')

    for (let i = imageContainers.length - 1; i >= 0; i--) {
      imageContainers[i].classList.remove('is-selected')
    }
  }

  copyImgUrlToClipboard (event) {
    event.preventDefault()
    clipboard.writeText(event.target.src)
    currentWindow.hide()
  }

  openImageContextMenu (event) {
    event.preventDefault()
    this.select(event)
    const self = this
    const menu = new Menu()

    menu.append(
      new MenuItem({
        label: 'Copy URL',
        accelerator: 'CmdOrCtrl+C',
        click: () => {
          self.copyImgUrlToClipboard(event)
        }
      })
    )

    setTimeout(() => {
      menu.popup(currentWindow)
    }, 10)
  }
}

module.exports = ImageContainer
