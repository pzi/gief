const fs = require('fs');
const path = require('path');
const clipboard = require('clipboard');
const remote = require('remote');
const Menu = remote.require('menu');
const MenuItem = remote.require('menu-item');

const currentWindow = remote.getCurrentWindow();

function getGifs () {
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
	menu.popup(currentWindow);
}

const body = document.querySelector('body');

const gifs = getGifs();

for (var i = gifs.length - 1; i >= 0; i--) {
  var gif = gifs[i];

  var gifWrapper = document.createElement('div');
  gifWrapper.className = 'gif';

  var img = document.createElement('img');
  img.src = gif.url;
  img.addEventListener('dblclick', writeImageUrlToClipBoard);
  img.addEventListener('contextmenu', openImageContextMenu);

  var tags = document.createElement('p');
  tags.className = 'tags';
  var keywordsArr = gif.keywords.split(' ');
  for (var y = keywordsArr.length - 1; y >= 0; y--) {
    var tag = document.createElement('span');
    tag.className = 'tag';
    tag.innerHTML = keywordsArr[y];
    tags.appendChild(tag);
  };

  gifWrapper.appendChild(img);
  gifWrapper.appendChild(tags);
  body.appendChild(gifWrapper);
};
