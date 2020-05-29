export default {
  name: 's-form-item',
  props: {
    column: {
      required: true,
      type: Object
    },
    label: String
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
    getLabel () {
      return this.label ? this.label : this.column.label
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
  },
  render (h) {
    const { $slots, column, getDecorator, getPlaceholder, getLabel } = this
    return (
      <a-form-item
        {...{
          props: this.$attrs,
          on: this.$listeners
        }}
        label={getLabel()}>
        {
          (() => {
            if ($slots.default) {
              return $slots.default
            }
            switch (column.type) {
              case 'boolean':
                return <a-switch v-decorator={getDecorator(column)} disabled={column.disabled}/>
              case 'number':
                return <a-input-number v-decorator={getDecorator(column)} disabled={column.disabled}/>
              case 'input':
                return <a-input placeholder={getPlaceholder(column)} v-decorator={getDecorator(column)} disabled={column.disabled}/>
              case 'textarea':
                return <a-textarea placeholder={getPlaceholder(column)} v-decorator={getDecorator(column)} disabled={column.disabled}/>
            }
          })()
        }
      </a-form-item>
    )
  }
}
