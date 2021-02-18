import 'normalize.css';
import 'cropperjs/dist/cropper.css';
import '@babel/polyfill';
import Vue from 'vue';
import App from './app.vue';
import './components';
import './styles/index.css';
import introJs from 'intro.js/intro.js';
import 'intro.js/introjs.css';

window.introJs = introJs;

new Vue({
  el: '#app',
  render: (createElement) => createElement(App),
});
