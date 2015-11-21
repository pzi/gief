const Menu = remote.require('menu');
const MenuItem = remote.require('menu-item');

// Constructor
function ImageContainer(wrapper) {
  // always initialize all instance properties
  this.wrapper = wrapper;
}

ImageContainer.prototype.addAll = function (images) {
  const self = this;
  for (var i = 0; i < images.length; i++) {
    var image = images[i];
    self.addNew(image);
  };
};

ImageContainer.prototype.removeAll = function () {
  while (this.wrapper.firstChild) {
    this.wrapper.removeChild(this.wrapper.firstChild);
  }
};

ImageContainer.prototype.addNew = function (image) {
  // create the container
  const imageContainer = document.createElement('div');
  imageContainer.className = 'image-container';

  // create the image link and add it to the container
  const link = document.createElement('a');
  link.className = 'image-link';
  link.href = image.url;
  link.addEventListener('click', this.select.bind(this));
  link.addEventListener('dblclick', this.copyImgUrlToClipboard.bind(this));
  link.addEventListener('contextmenu', this.openImageContextMenu.bind(this));
  imageContainer.appendChild(link);

  // create the actual img and add it inside the link
  const img = document.createElement('img');
  img.src = image.url;
  link.appendChild(img);

  // create all tags and add it to the container
  const keywords = image.keywords.split(' ');
  const tags = document.createElement('p');
  tags.className = 'tags';
  for (var i = 0; i < keywords.length; i++) {
    // only use keywords that are longer than 1 character
    if ((keyword = keywords[i]).length > 1) {
      var tag = document.createElement('span');
      tag.className = 'tag';
      tag.innerHTML = keyword;
      tags.appendChild(tag);
    }
  };
  imageContainer.appendChild(tags);

  // append the finished container to target wrapper
  this.wrapper.appendChild(imageContainer);
};

ImageContainer.prototype.select = function (target) {
  var imageContainer = '';
  const isEvent = target instanceof Event;

  if (isEvent) {
    const event = target;
    event.preventDefault();
    imageContainer = event.currentTarget.parentElement;
  } else {
    imageContainer = target;
  }

  imageContainer ? this.deselectAll() : false;

  if (!imageContainer.classList.contains('is-selected')) {
    imageContainer.classList.add('is-selected');
    imageContainer.scrollIntoViewIfNeeded();
  }
};

ImageContainer.prototype.deselectAll = function (image) {
  const imageContainers = this.wrapper.querySelectorAll('.image-container.is-selected');
  for (var i = imageContainers.length - 1; i >= 0; i--) {
    imageContainers[i].classList.remove('is-selected');
  };
};

ImageContainer.prototype.getImgUrl = function (image) {
  const isEvent = image instanceof Event;
  if (isEvent) {
    return event.target.src;
  } else {
    return image.src;
  }
};

ImageContainer.prototype.copyImgUrlToClipboard = function (event) {
  event.preventDefault();
  clipboard.writeText(event.target.src);
  currentWindow.hide();
};

ImageContainer.prototype.openImageContextMenu = function (event) {
  const self = this;
  event.preventDefault();
  this.select(event);

  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: 'Copy URL',
      accelerator: 'Command+C',
      click: () => {
        self.copyImgUrlToClipboard(event);
      }
    })
  );

  setTimeout(() => {
    menu.popup(currentWindow);
  }, 10);
};

module.exports = ImageContainer;
