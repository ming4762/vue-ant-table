import { defineComponent, PropType, toRefs, computed } from 'vue'

import { FormColumn } from '../../Types'

const COLUMN_TYPE: {[index: string]: string} = Object.freeze({
  boolean: 'boolean',
  number: 'number',
  input: 'input',
  textarea: 'textarea',
  timePicker: 'time-picker',
  monthPicker: 'month-picker',
  datePicker: 'date-picker',
  datetimePicker: 'datetime-picker',
  radio: 'radio',
  radioButton: 'radio-button',
  select: 'select',
  // 滑动输入条
  slider: 'slider',
  rate: 'rate'
})

/**
 * s-form-item 组件
 * @author shizhongming
 * @since 2.0
 * 2020-10-07 11:05
 */
export default defineComponent({
  name: 'SFormItem',
  props: {
    column: {
      type: Object as PropType<FormColumn>,
      required: true
    },
    label: {
      type: String as PropType<string>
    },
    value: {}
  },
  setup (props) {
    const { label, column } = toRefs(props)
    // 设置label监控
    const computedLabel = computed(() => label ? label.value : column.value.label)
    // 设置Placeholder监控
    const computedPlaceholder = computed(() => {
      const columnValue = column.value
      if (columnValue.placeholder) {
        return columnValue.placeholder
      }
      return '请输入' + computedLabel.value
    })

    return {
      computedLabel,
      computedPlaceholder
    }
  },
  methods: {
    /**
     * 值改变触发
     * @param column
     * @param value
     */
    handleChange (column: FormColumn, value: any) {
      this.$emit('value-change', value)
      this.$emit('update:value', value)
    }
  },
  render () {
    const props = this.$attrs
    const column = this.column
    const { handleChange } = this
    const $slots = this.$slots
    return (
      <a-form-item
        {...props}
        name={column.key}
        label={this.computedLabel}>
        {
          (() => {
            if ($slots.default) {
              return $slots.default()
            }
            switch (column.type) {
              case COLUMN_TYPE.boolean:
                return <a-switch onInput={(value: any) => handleChange(column, value)} value={this.value} disabled={column.disabled}/>
              case COLUMN_TYPE.input:
                return <a-input onInput={(e: any) => handleChange(column, e.target.value)} placeholder={this.computedPlaceholder} value={this.value} disabled={column.disabled}/>
            }
          })()
        }
      </a-form-item>
    )
  }
})
