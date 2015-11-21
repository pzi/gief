function handleSearch (query, images) {
  if (query.trim() === '') {
    imageContainer.removeAll();
    imageContainer.addAll(images);
  }

  if (query.length > 1) {
    var results = images.filter((image) => {
      return (image && image.keywords.match(query));
    });

    if (results.length) {
      imageContainer.removeAll();
      imageContainer.addAll(results);
    } else {
      imagesWrapper.innerHTML = 'Oh noooo, nothing found...';
    }
  }
}

module.exports = handleSearch;
