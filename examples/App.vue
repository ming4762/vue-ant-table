<template>
  <MainTest msg="Welcome to Your Vue.js + TypeScript App"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MainTest from './components/MainTest.vue'

export default defineComponent({
  name: 'App',
  components: {
    MainTest
  }
})
</script>

<style>
#app {
}
</style>
