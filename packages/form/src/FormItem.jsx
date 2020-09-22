/**
 * 字段类型
 * @type {Readonly<{number: string, input: string, boolean: string, textarea: string, "time-picker": string, "datetime-picker": string, "date-picker": string, "month-picker": string}>}
 */
const COLUMN_TYPE = Object.freeze({
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
  select: 'select'
})

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
              case COLUMN_TYPE.boolean:
                return <a-switch v-decorator={getDecorator(column)} disabled={column.disabled}/>
              case COLUMN_TYPE.number:
                return <a-input-number v-decorator={getDecorator(column)} disabled={column.disabled}/>
              case COLUMN_TYPE.input:
                return <a-input placeholder={getPlaceholder(column)} v-decorator={getDecorator(column)} disabled={column.disabled}/>
              case COLUMN_TYPE.textarea:
                return <a-textarea placeholder={getPlaceholder(column)} v-decorator={getDecorator(column)} disabled={column.disabled}/>
              case COLUMN_TYPE.timePicker:
                return <a-time-picker placeholder={getPlaceholder(column)} v-decorator={getDecorator(column)} disabled={column.disabled}/>
              case COLUMN_TYPE.monthPicker:
                return <a-month-picker placeholder={getPlaceholder(column)} v-decorator={getDecorator(column)} disabled={column.disabled}/>
            }
            if (column.type === COLUMN_TYPE.datePicker || column.type === COLUMN_TYPE.datetimePicker) {
              return <a-date-picker placeholder={getPlaceholder(column)} v-decorator={getDecorator(column)} disabled={column.disabled} show-time={column.type === 'datetime-picker'}/>
            }
            // 遍历按钮组
            if (column.type === COLUMN_TYPE.radio || column.type === COLUMN_TYPE.radioButton) {
              const dict = column.dict || []
              return <a-radio-group v-decorator={getDecorator(column)} disabled={column.disabled}>
                {
                  dict.map(({ key, value, disabled }) => {
                    if (column.type === COLUMN_TYPE.radio) {
                      return <a-radio key={key} disabled={disabled === true} value={key}>{value}</a-radio>
                    } else {
                      return <a-radio-button key={key} disabled={disabled === true} value={key}>{value}</a-radio-button>
                    }
                  })
                }
              </a-radio-group>
            }
            // select 类型
            if (column.type === COLUMN_TYPE.select) {
              const dict = column.dict || []
              return <a-select allowClear={true} placeholder={getPlaceholder(column)} v-decorator={getDecorator(column)} disabled={column.disabled}>
                {
                  dict.map(({ key, value, disabled }) => {
                    return <a-select-option value={key}>
                      {value}
                    </a-select-option>
                  })
                }
              </a-select>
            }
          })()
        }
      </a-form-item>
    )
  }
}
