<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
html {
  height: 100%;
  width: 100%;
}
body {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: rgba(64, 64, 64, 1);
}
</style>
