import FormItem from './FormItem'
import { Row, Col } from 'ant-design-vue'

const LAYOUT = {
  inline: 'inline'
}

/**
 * 默认的form cols
 * @type {{wrapperCol: {span: number}, labelCol: {span: number}}}
 */
const defaultFormCols = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 19
  }
}

/**
 * form组件
 */
export default {
  name: 's-form',
  components: {
    FormItem,
    Row,
    Col
  },
  props: {
    // 表格配置
    columns: {
      type: Array,
      required: true
    },
    /**
     * 表单布局
     */
    layout: {
      type: String,
      default: 'horizontal'
    }

  },
  data () {
    return {
      form: this.$form.createForm(this, this.createFormOptions()),
      // 隐藏列信息
      hiddenFormColumns: [],
      // 行内表单显示列信息
      showFormInlineColumns: [],
      // 表单显示列信息
      showFormColumns: [],
      inlineFormColumns: []
    }
  },
  beforeMount () {
    this.setDefaultValue()
  },
  beforeUpdate () {
    this.setDefaultValue()
  },
  methods: {
    /**
     * 获取表单内容
     */
    getFormModel () {
      return this.form.getFieldsValue()
    },
    // 是否使用插槽
    useSolt: function (item) {
      return this.$scopedSlots[item.key]
    },
    /**
     * 创建表单的options
     */
    createFormOptions () {
      const options = {}
      if (this.model) {
        options.onValuesChange = (props, value) => {
          Object.keys(value).forEach(key => {
            this.model[key] = value[key]
          })
        }
      }
      return options
    },
    /**
     * 转换column
     */
    convertColumnOption (columnOptions) {
      const showColumns = []
      // 行内列
      const inlineColumns = []
      // 隐藏列
      const hiddenFormColumns = []
      // 序号
      let index = 0
      this.columns.forEach(item => {
        // 设置key
        if (!item.key) item.key = item.prop
        // 设置默认类型
        // todo: 表单布局处理
        if (!item.type) item.type = 'input'
        if (item.visible === false) {
          hiddenFormColumns.push(item)
        } else {
          if (this.layout === LAYOUT.inline) {
            inlineColumns.push(item)
          } else {
            // 非行内表单
            // 获取span，默认值24
            const span = item.span ? item.span : 24
            if (index === 0) {
              showColumns.push([])
            }
            showColumns[showColumns.length - 1].push(item)
            index = index + span
            // 重启一行
            if (index >= 24) {
              index = 0
            }
          }
        }
      })
      this.showFormColumns = showColumns
      this.hiddenFormColumns = hiddenFormColumns
      this.inlineFormColumns = inlineColumns
    },
    /**
     * 渲染隐藏列
     */
    renderHiddenColumns (hiddenFormColumns) {
      if (hiddenFormColumns.length > 0) {
        return (
          <div style="display: none">
            {
              this.hiddenFormColumns.map(column => {
                return <FormItem
                  formModel={this.model}
                  column={column} />
              })
            }
          </div>
        )
      }
    },
    /**
     * 渲染列
     * @param columns
     * @returns {*}
     */
    renderInlineColumns (columns) {
      if (this.layout !== LAYOUT.inline) {
        return ''
      }
      const { model } = this
      return columns.map(column => {
        if (this.useSolt(column)) {
          return (
            <a-form-item
              label={column.label}>
              {
                this.$scopedSlots[column.key]({ column, model })
              }
            </a-form-item>
          )
        } else {
          return (
            <FormItem
              column={column}
              formModel={model}/>
          )
        }
      })
    },
    /**
     * 渲染普通列
     * @param columns
     */
    renderColumns (columns) {
      return columns.map((columns, indexRow) => {
        return (
          <Row
            key={indexRow + 'row'}>
            {
              columns.map((column, indexCol) => {
                return (
                  <Col
                    key={indexCol + 'col'}
                    span={column.span}>
                    {
                      this.renderFormItem(column)
                    }
                  </Col>
                )
              })
            }
          </Row>
        )
      })
    },
    /**
     * 渲染表格项
     * @param column
     */
    renderFormItem (column) {
      const { model } = this
      if (this.useSolt(column)) {
        return (
          <a-form-item
            {...{
              props: this.getFormItemProps(column)
            }}
            label={column.label}>
            {
              this.$scopedSlots[column.key]({ column, model })
            }
          </a-form-item>
        )
      } else {
        return (
          <FormItem
            {...{
              attrs: this.getFormItemProps(column)
            }}
            column={column}
            formModel={model}/>
        )
      }
    },
    /**
     * 获取form item pros
     * @param column
     */
    getFormItemProps (column) {
      const { labelCol, wrapperCol } = defaultFormCols
      const props = column.item || {}
      if (!props.labelCol) {
        props.labelCol = labelCol
      }
      if (!props.wrapperCol) {
        props.wrapperCol = wrapperCol
      }
      return props
    },
    /**
     * 设置默认值
     */
    setDefaultValue: function () {
      // TODO:可以进一步优化
      this.columns.forEach(column => {
        const value = this.form.getFieldValue(column.key)
        if (column.defaultValue !== null && column.defaultValue !== undefined && (value === null || value === undefined)) {
          const model = {}
          model[column.key] = column.defaultValue
          this.form.setFieldsValue(model)
        }
      })
    },
    /**
     * 校验标案
     */
    validate () {
      return new Promise((resolve) => {
        this.form.validateFields((error, values) => {
          if (!error) {
            resolve({
              result: true,
              data: values
            })
          } else {
            resolve({
              result: false,
              data: error
            })
          }
        })
      })
    },
    getForm () {
      return this.form
    },
    /**
     * 重置表单
     */
    reset () {
      this.form.resetFields()
    }
  },
  created () {
    // 转换列信息
    this.convertColumnOption(this.columnOptions)
  },
  render (h) {
    return (
      <a-form
        {...{
          props: this.$attrs,
          on: this.$listeners
        }}
        layout={this.layout}
        form={this.form}>
        {
          // 隐藏列
          this.renderHiddenColumns(this.hiddenFormColumns)
        }
        {
          this.renderInlineColumns(this.inlineFormColumns)
        }
        {
          this.renderColumns(this.showFormColumns)
        }
        {
          this.$slots['form-button'] ? this.$slots['form-button'] : ''
        }
      </a-form>
    )
  }
}
