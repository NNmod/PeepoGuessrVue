const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',
  pages: {
    'index': {
      entry: './src/pages/Home/main.js',
      template: 'public/index.html',
      title: 'PeepoGuessr',
      chunks: [ 'chunk-vendors', 'chunk-common', 'index' ]
    },
    'close': {
      entry: './src/pages/Close/main.js',
      template: 'public/close.html',
      title: 'PeepoGuessr',
      chunks: [ 'chunk-vendors', 'chunk-common', 'close' ]
    },
    'lobby': {
      entry: './src/pages/Lobby/main.js',
      template: 'public/index.html',
      title: 'PeepoGuessr',
      chunks: [ 'chunk-vendors', 'chunk-common', 'lobby' ]
    },
    'game': {
      entry: './src/pages/Game/main.js',
      template: 'public/game.html',
      title: 'PeepoGuessr',
      chunks: [ 'chunk-vendors', 'chunk-common', 'game' ]
    },
    'test': {
      entry: './src/pages/Test/main.js',
      template: 'public/game.html',
      title: 'PeepoGuessr',
      chunks: [ 'chunk-vendors', 'chunk-common', 'test' ]
    }
  }
})
