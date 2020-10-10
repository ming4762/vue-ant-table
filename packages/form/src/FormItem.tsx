import { defineComponent, PropType } from 'vue'

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
  methods: {
    /**
     * 获取label
     */
    getLabel (): string | undefined {
      return this.label ? this.label : this.column.label
    },
    /**
     * 获取提示信息
     * @param column
     */
    getPlaceholder (column: FormColumn): string {
      const { placeholder, label } = column
      if (placeholder) {
        return placeholder
      }
      return '请输入' + label
    },
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
    const { getLabel, $slots, getPlaceholder, handleChange } = this
    return (
      <a-form-item
        {...props}
        name={column.key}
        label={getLabel()}>
        {
          (() => {
            if ($slots.default) {
              return $slots.default()
            }
            switch (column.type) {
              case COLUMN_TYPE.boolean:
                return <a-switch onInput={(value: any) => handleChange(column, value)} value={this.value} disabled={column.disabled}/>
              case COLUMN_TYPE.input:
                return <a-input onInput={(e: any) => handleChange(column, e.target.value)} placeholder={getPlaceholder(column)} value={this.value} disabled={column.disabled}/>
            }
          })()
        }
      </a-form-item>
    )
  }
})
