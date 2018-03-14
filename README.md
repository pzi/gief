# Gief!

> All your favourite gifs in the menu bar!

[![Travis Build Status](https://travis-ci.org/pzi/gief.svg?branch=master)](https://travis-ci.org/pzi/gief)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
[![Greenkeeper badge](https://badges.greenkeeper.io/pzi/gief.svg)](https://greenkeeper.io/)

## General Information

* [Electron](http://electron.atom.io)
* [electron-packager](https://github.com/electron-userland/electron-packager)
* [menubar](https://github.com/maxogden/menubar)

**Note:** The app currently requires a `library.gifwit` file in the project root directory to work. Grab [my library file](http://gifs.pzi.io/library.gifwit) that was generated from [my gif storage](https://github.com/pzi/gifs).

## Development

```
$ yarn install
```

### Run

```
$ yarn start
```

**Optional:** `NODE_ENV=development yarn start` for a big debug window.

### Build

```
$ yarn run build
```

Builds the app for OSX by default.


## License

WTFPL © [Patrik Affentranger](http://patrikaffentranger.me)
