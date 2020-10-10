<template>
  <div class="hello" style="padding: 20px">
    <Test/>
    <s-table/>
    <button @click="handleClick">abc</button>
    <s-form ref="form" v-model:model="model" :layout="layout" :columns="columns">
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
import Test from './Test.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HelloWorld',
  components: {
    Test
  },
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
      console.log(this.$refs.form)
      const form: any = this.$refs.form
      console.log(form.model)
      form.validate()
        .then(() => {
          console.log('success')
        }).catch((error: any) => {
          console.log(error)
        })
      // this.$refs['form'].validate()
      // this.layout = 'vertical'
      // this.columns.push({
      //   prop: 'name',
      //   label: '用户名'
      // })
      // this.columns = Object.assign(this.columns, [])
      // console.log(this.columns)
    }
  },
  data () {
    return {
      layout: 'horizontal',
      model: {
        name2: ''
      },
      columns: [
        {
          prop: 'name2',
          label: '姓名2',
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
