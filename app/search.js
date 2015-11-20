function handleSearch (query, images) {
  var results = images.filter((image) => {
    return ((image.keywords.match(query) || image.url == query));
  });
  console.log(results);
}

module.exports = handleSearch;
