function handleSearch (query, images, imageContainer, imagesWrapper) {
  if (query.trim() === '') {
    imageContainer.removeAll()
    imageContainer.addAll(images)
  }

  if (query.length > 1) {
    const results = images.filter((image) => {
      return image && image.keywords.match(query)
    })

    if (results.length) {
      imageContainer.removeAll()
      imageContainer.addAll(results)
    } else {
      imagesWrapper.innerHTML = 'Oh noooo, nothing found...'
    }
  }
}

module.exports = handleSearch
