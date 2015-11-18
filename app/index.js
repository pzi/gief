const fs = require('fs');
const path = require('path');
const clipboard = require('clipboard');
const ipcRenderer = require('ipc-renderer');
const remote = require('remote');
const Menu = remote.require('menu');
const MenuItem = remote.require('menu-item');

const currentWindow = remote.getCurrentWindow();
const body = document.querySelector('body');
const images = getImages();

function getImages () {
  const file = path.join(__dirname, '../library.gifwit');
  dotGifwit = JSON.parse(fs.readFileSync(file, 'utf8'));
  return dotGifwit.images;
};

function writeImageUrlToClipBoard (event) {
  event.preventDefault();
  const clickedImage = event.target;
  clipboard.writeText(clickedImage.src);
  currentWindow.hide();
}

function openImageContextMenu (event) {
  event.preventDefault();
  selectImage(event);

  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: 'Copy URL',
      accelerator: 'Command+C',
      click: () => {
        writeImageUrlToClipBoard(event);
      }
    })
  );

  setTimeout(() => {
    menu.popup(currentWindow);
  }, 10);
}

function selectImage (target) {
  var imageContainer = '';
  var isEvent = target instanceof Event;

  if (isEvent) {
    var event = target;
    event.preventDefault();
    imageContainer = event.currentTarget.parentElement;
  } else {
    imageContainer = target;
  }

  imageContainer ? deselectAllImageContainers() : false;

  if (!imageContainer.classList.contains('is-selected')) {
    imageContainer.classList.add('is-selected');
    imageContainer.scrollIntoViewIfNeeded();
  }
}

function deselectAllImageContainers () {
  var imageContainers = document.querySelectorAll('.image-container.is-selected');
  for (var i = imageContainers.length - 1; i >= 0; i--) {
    imageContainers[i].classList.remove('is-selected');
  };
}

for (var i = images.length - 1; i >= 0; i--) {
  var image = images[i];

  var imageContainer = document.createElement('div');
  imageContainer.className = 'image-container';

  var link = document.createElement('a');
  link.className = 'image-link';
  link.href = image.url;
  link.addEventListener('click', selectImage);
  link.addEventListener('dblclick', writeImageUrlToClipBoard);
  link.addEventListener('contextmenu', openImageContextMenu);

  var img = document.createElement('img');
  img.src = image.url;
  link.appendChild(img);

  var tags = document.createElement('p');
  tags.className = 'tags';
  var keywordsArr = image.keywords.split(' ');
  for (var y = keywordsArr.length - 1; y >= 0; y--) {
    var tag = document.createElement('span');
    tag.className = 'tag';
    tag.innerHTML = keywordsArr[y];
    if (tag.innerHTML.length > 1) tags.appendChild(tag);
  };

  imageContainer.appendChild(link);
  imageContainer.appendChild(tags);
  body.appendChild(imageContainer);
};

document.addEventListener('keydown', (event) => {
  const upArrow = 38;
  const downArrow = 40;
  var currentSelection = document.querySelector('.image-container.is-selected');

  if (currentSelection) {
    event.preventDefault();
    if (event.keyCode === upArrow) {
      if (currentSelection.previousSibling.matches('.image-container'))
        selectImage(currentSelection.previousSibling);
    } else if (event.keyCode === downArrow) {
      if (currentSelection.nextSibling.matches('.image-container'))
        selectImage(currentSelection.nextSibling);
    }
  }
}, true);

ipcRenderer.on('window-blur', function () {
  deselectAllImageContainers();
});

ipcRenderer.on('GlobalShortcuts', function (event, accelerator) {
  // TODO: Switch to handle different accelerators
  const selectedImageContainer = document.querySelector('.is-selected');
  clipboard.writeText(selectedImageContainer.getElementsByTagName('img')[0].src);
});
