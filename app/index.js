const fs = require('fs');
const path = require('path');
const clipboard = require('clipboard');
const ipcRenderer = require('ipc-renderer');
const remote = require('remote');
const search = require('./search.js');
const ImageContainer = require('./image-container.js');

const currentWindow = remote.getCurrentWindow();

const imagesWrapper = document.getElementById('images');
const imageContainer = new ImageContainer(imagesWrapper);
const searchInput = document.getElementById('search');
const images = getImages();
const debounce = require('debounce');

function getImages () {
  const file = path.join(__dirname, '../library.gifwit');
  dotGifwit = JSON.parse(fs.readFileSync(file, 'utf8'));
  return dotGifwit.images;
};

for (var i = 0; i < images.length; i++) {
  var image = images[i];
  imageContainer.addNew(image);
};

document.addEventListener('keydown', (event) => {
  const upArrow = 38;
  const downArrow = 40;
  var currentSelection = imagesWrapper.querySelector('.image-container.is-selected');

  if (currentSelection) {
    event.preventDefault();
    if (event.keyCode === upArrow) {
      var previousContainer = currentSelection.previousSibling;
      if (previousContainer && previousContainer.matches('.image-container')) {
        imageContainer.select(previousContainer);
      }
    } else if (event.keyCode === downArrow) {
      var nextContainer = currentSelection.nextSibling;
      if (nextContainer && nextContainer.matches('.image-container')) {
        imageContainer.select(nextContainer);
      }
    }
  }
}, true);

searchInput.addEventListener('input', debounce((event) => {
  search(event.target.value, images);
}, 300));

ipcRenderer.on('window-blur', function () {
  imageContainer.deselectAll();
});

ipcRenderer.on('GlobalShortcuts', function (event, accelerator) {
  // TODO: Switch to handle different accelerators
  const selectedImageContainer = imagesWrapper.querySelector('.is-selected');
  clipboard.writeText(selectedImageContainer.getElementsByTagName('img')[0].src);
});
