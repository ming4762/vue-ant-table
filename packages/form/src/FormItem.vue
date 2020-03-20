<template>
  <a-form-item :colon="false" :label="column.label">
    <a-switch v-if="column.type === 'boolean'" v-decorator="getDecorator(column)"/>
    <a-input-number v-if="column.type === 'number'" v-decorator="getDecorator(column)" :disabled="column.disabled"/>
    <a-input v-if="column.type === 'input'" :placeholder="getPlaceholder(column)" v-decorator="getDecorator(column)" :disabled="column.disabled"/>
  </a-form-item>
</template>

<script>
export default {
  name: 's-form-item',
  props: {
    column: {
      required: true,
      type: Object
    }
  },
  methods: {
    getDecorator (column) {
      const decorator = [column.key]
      const option = {}
      // 获取校验规则
      const rules = this.getRules(column)
      if (rules) {
        option.rules = rules
      }
      // boolean处理
      if (column.type === 'boolean') {
        option.valuePropName = 'checked'
      }
      decorator.push(option)
      return decorator
    },
    /**
     * 获取提示语
     */
    getPlaceholder (column) {
      if (column.placeholder) {
        return column.placeholder
      } else {
        return '请输入' + column.label
      }
    },
    /**
     * 获取校验规则
     * @param column
     */
    getRules (column) {
      const rules = column.rules
      if (rules) {
        if (rules === true) {
          return [
            {
              required: true,
              message: '请输入' + column.label
            }
          ]
        } else {
          return rules
        }
      }
      return null
    }
  }
}
</script>

<style>

</style>
