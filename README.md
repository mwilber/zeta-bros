# ![Zeta Bros. Logo](https://staging.greenzeta.com/zetabros/assets/icons/icon-72x72.png) zeta-bros
## Source code for the presentation: HTML5 game development example using the Phaser framework.

Zeta Bros. is a [Phaser3](http://phaser.io) clone of the original Mario Bros. arcade game. Written in ES6 syntax javascript and using a webpack workflow. 

Built with the [gz-webpack-boilerplate](https://github.com/mwilber/gz-webpack-boilerplate)!

![Zeta Bros. ScreenShot](https://www.greenzeta.com/wp-content/uploads/2020/05/25_revized_level.png)

## Table of contents
- [The Presentation](#presentation)
- [Setup](#setup)
- [Development](#development)
- [Deployment](#deployment)
- [Webpack](#webpack)

## Presentation

Slides from the presentation are available on [slides.com](https://slides.com/greenzeta/phaser#/). To follow development of the game as presented, look at the sequential numbered branches named beginning with [Step1-boilerplate](https://github.com/mwilber/zeta-bros/tree/Step1-boilerplace). 

![Zeta Bros. ScreenShot](http://greenzeta.com/wp-content/uploads/2020/10/Screen-Shot-2019-09-03-at-7.25.34-PM.png)

## Setup
Clone this repo and enter the project directory:
```sh
$ git clone https://github.com/mwilber/zeta-bros/
$ cd zeta-bros
```
Install dependencies:
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
