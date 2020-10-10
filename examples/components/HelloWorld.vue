<template>
  <div class="hello" style="padding: 20px">
    <s-table/>
    <button @click="handleClick">abc</button>
    <s-form v-model:model="model" :layout="layout" :columns="columns">
      <template v-slot:adf="{}">
        <a-input></a-input>
<!--        <a-form-item :wrapperCol="{span: 18}" :labelCol="{span: 6}"  label="adf">-->
<!--          <a-input></a-input>-->
<!--        </a-form-item>-->
<!--        <s-form-item :wrapperCol="{span: 18}" :labelCol="{span: 6}" label="abc" :column="column" v-model:value="model.adf">-->
<!--          <a-input value="1231231"></a-input>-->
<!--        </s-form-item>-->
      </template>
    </s-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String
  },
  watch: {
    model () {
      console.log(this.model)
    }
  },
  methods: {
    handleTest (model: any, column: any) {
      console.log(model, column)
    },
    handleClick () {
      this.layout = 'vertical'
      this.columns.push({
        prop: 'name',
        label: '用户名'
      })
      this.columns = Object.assign(this.columns, [])
      console.log(this.columns)
    }
  },
  data () {
    return {
      layout: 'horizontal',
      model: {
        adf: '1231'
      },
      columns: [
        {
          prop: '123',
          label: 'abc',
          rules: true
        },
        {
          prop: 'adf',
          label: 'abc12'
        },
        {
          prop: '123',
          label: 'abc12',
          visible: false
        }
      ]
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
