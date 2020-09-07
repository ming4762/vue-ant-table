import installComponent from './install'

import vue from 'vue'

const Vue = vue || window.Vue

Vue.use(installComponent)
