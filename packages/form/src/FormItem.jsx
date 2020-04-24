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
  },
  render (h) {
    const $this = this
    return (
      <a-form-item
        {...{
          props: this.$attrs,
          on: this.$listeners
        }}
        label={this.column.label}>
        {
          (() => {
            switch ($this.column.type) {
              case 'boolean':
                return <a-switch v-decorator={$this.getDecorator($this.column)} disabled={$this.column.disabled}/>
              case 'number':
                return <a-input-number v-decorator={$this.getDecorator($this.column)} disabled={$this.column.disabled}/>
              case 'input':
                return <a-input placeholder={$this.getPlaceholder($this.column)} v-decorator={$this.getDecorator($this.column)} disabled={$this.column.disabled}/>
              case 'textarea':
                return <a-textarea placeholder={$this.getPlaceholder($this.column)} v-decorator={$this.getDecorator($this.column)} disabled={$this.column.disabled}/>
            }
          })()
        }
      </a-form-item>
    )
  }
}
