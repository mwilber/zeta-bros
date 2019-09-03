# ![Zeta Bros. Logo](https://staging.greenzeta.com/zetabros/assets/icons/icon-72x72.png) zeta-bros
## Source code for the presentation: HTML5 game development example using the Phaser framework.

Zeta Bros. is a [Phaser3](http://phaser.io) clone of the original Mario Bros. arcade game. Written in ES6 syntax javascript and using a webpack workflow. 

Built with the [gz-webpack-boilerplate](https://github.com/mwilber/gz-webpack-boilerplate)!

![Zeta Bros. ScreenShot](https://www.greenzeta.com/wp-content/uploads/2019/08/25_revized_level.png)

## Table of contents
- [Setup](#setup)
- [Development](#development)
- [Deployment](#deployment)
- [Webpack](#webpack)

## Setup
From within your project directory:
```sh
$ git clone https://github.com/mwilber/zeta-bros/
```
Install dev dependencies
```sh
$ npm install
```

## Development
Run the local webpack-dev-server with livereload and autocompile on [http://localhost:8699/](http://localhost:8699/)
```sh
$ npm start
```
## Deployment
Build the current application
```sh
$ npm run build
```

## Webpack
If you're not familiar with webpack, the [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) will serve the static files in your build folder and watch your source files for changes.
When changes are made the bundle will be recompiled. This modified bundle is served from memory at the relative path specified in publicPath.
