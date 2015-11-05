const fs = require('fs');
const path = require('path');
const clipboard = require('clipboard');
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
  deselectAllImageContainers();
}

function openImageContextMenu (event) {
  event.preventDefault();
  deselectAllImageContainers();
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

function selectImage (event) {
  event.preventDefault();
  deselectAllImageContainers();

  var imageContainer = event.currentTarget.parentElement;
  if (!imageContainer.classList.contains('is-selected')) {
    imageContainer.classList.add('is-selected');
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
    tags.appendChild(tag);
  };

  imageContainer.appendChild(link);
  imageContainer.appendChild(tags);
  body.appendChild(imageContainer);
};
