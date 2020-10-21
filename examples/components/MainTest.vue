<template>
  <div style="padding: 20px">
    <a-select
      v-model:value="currentComponent"
      style="width: 200px">
      <a-select-option
        v-for="(item, index) in componentList"
        :value="item"
        :key="index">
        {{item}}
      </a-select-option>
    </a-select>
    <div style="padding: 10px">
      <component :is="currentComponent"/>
    </div>
  </div>
</template>

<script>
import TestTable from '../../packages/table/test/Table.test'
import TestTableCrud from '../../packages/table/test/TableCrud.test'
export default {
  name: 'MainTest',
  components: {
    TestTable,
    TestTableCrud
  },
  data () {
    return {
      currentComponent: 'TestTableCrud',
      componentList: [
        'TestTable',
        'TestTableCrud'
      ]
    }
  }
}
</script>

<style scoped>

</style>
