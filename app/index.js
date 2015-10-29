const fs = require('fs');
const path = require('path');
const clipboard = require('clipboard');

function getGifs () {
  const file = path.join(__dirname, '../library.gifwit');
  dotGifwit = JSON.parse(fs.readFileSync(file, 'utf8'));
  return dotGifwit.images;
};

function writeGifUrlToClipBoard (event) {
  event.preventDefault();
  const clickedImage = event.target;
  clipboard.writeText(clickedImage.src);
}

const body = document.querySelector('body');

const gifs = getGifs();

for (var i = gifs.length - 1; i >= 0; i--) {
  var gif = gifs[i];

  var gifWrapper = document.createElement('div');
  gifWrapper.className = 'gif';

  var img = document.createElement('img');
  img.src = gif.url;
  img.addEventListener('dblclick', writeGifUrlToClipBoard, false);

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

