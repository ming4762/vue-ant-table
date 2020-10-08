import { defineComponent, PropType, Slot, VNode } from 'vue'

import { FormColumn } from '../../Types'

import FormItem from './FormItem'
import { Row, Col } from 'ant-design-vue'

enum LAYOUT {
  inline,
  vertical,
  horizontal
}

/**
 * form item names
 * @type {string[]}
 */
const FORM_ITEM_NAME = [
  'AFormItem',
  'SFormItem'
]

const defaultFormCols = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
}

/**
 * 转换列信息
 * @param defaultSpan 默认span
 * @param columns 列信息
 * @param layout 布局
 */
const convertColumnOption = (defaultSpan: number, columns: Array<FormColumn>, layout: string) => {
  const showColumns: Array<Array<FormColumn>> = []
  // 行内列
  const inlineColumns: Array<FormColumn> = []
  // 隐藏列
  const hiddenFormColumns: Array<FormColumn> = []
  let index = 0
  columns.forEach((item) => {
    // 设置key
    if (!item.key) {
      item.key = item.prop
    }
    // 设置默认类型
    if (!item.type) {
      item.type = 'input'
    }
    if (item.visible === false) {
      hiddenFormColumns.push(item)
    } else {
      if (layout === LAYOUT[LAYOUT.inline]) {
        inlineColumns.push(item)
      } else {
        // 非行内表单
        // 获取span，默认值24
        const span = item.span ? item.span : defaultSpan
        if (index === 0 || index + span > 24) {
          showColumns.push([])
        }
        item.span = span
        showColumns[showColumns.length - 1].push(item)
        index = index + span
        // 重启一行
        if (index >= 24) {
          index = 0
        }
      }
    }
  })
  return {
    showColumns,
    inlineColumns,
    hiddenFormColumns
  }
}

/**
 * s-form 组件
 * @author shizhongming
 * @since 2.0
 * 2020-10-07 11:09
 */
export default defineComponent({
  name: 's-form',
  components: {
    FormItem,
    Row,
    Col
  },
  props: {
    columns: {
      type: Array as PropType<Array<FormColumn>>,
      required: true
    },
    model: {
      type: Object,
      default: () => { return {} }
    },
    /**
     * 表单布局
     */
    layout: {
      type: String,
      default: 'horizontal'
    },
    defaultSpan: {
      type: Number,
      default: 24
    }
  },
  // setup (props) {
  //   // 转换列信息
  //   const { showColumns: showFormColumns, inlineColumns: showFormInlineColumns, hiddenFormColumns } = convertColumnOption(defaultSpan, columns, layout)
  //   return {
  //     hiddenFormColumns,
  //     showFormInlineColumns,
  //     showFormColumns
  //   }
  // },
  data () {
    const hiddenFormColumns: Array<FormColumn> = []
    const showFormInlineColumns: Array<FormColumn> = []
    const showFormColumns: Array<Array<FormColumn>> = []
    return {
      hiddenFormColumns,
      showFormInlineColumns,
      showFormColumns,
      test: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      }
    }
  },
  created () {
    const { defaultSpan, columns, layout } = this
    const { showColumns, inlineColumns, hiddenFormColumns } = convertColumnOption(defaultSpan, columns, layout)
    this.hiddenFormColumns = hiddenFormColumns
    this.showFormInlineColumns = inlineColumns
    this.showFormColumns = showColumns
  },
  methods: {
    /**
     * 是否使用插槽
     * @param column
     */
    useSolt (column: FormColumn): boolean {
      return !!this.$slots[column.key]
    },
    /**
     * model改变触发
     */
    handleModelChange (value: any, column: FormColumn) {
      const data: {[index: string]: any} = {}
      data[column.key] = value
      this.$emit('update:model', Object.assign({}, this.model, data))
    },
    /**
     * 获取item props
     * @param column
     */
    getFormItemProps (column: FormColumn) {
      const { span } = column
      const { labelCol, wrapperCol } = defaultFormCols
      const props: {[index: string]: any} = column.props || {}
      if (!props.labelCol) {
        props.labelCol = labelCol
      }
      if (!props.wrapperCol) {
        props.wrapperCol = wrapperCol
      }
      if (this.layout === LAYOUT[LAYOUT.vertical]) {
        props.labelCol = {
          span: 0
        }
        props.wrapperCol = {
          span: 22
        }
        if (span === 24) {
          props.wrapperCol = {
            span: 23
          }
        }
      }
      return {
        ...props,
        column
      }
    },
    /**
     * 渲染插槽
     */
    renderSlotFormItem (column: FormColumn) {
      const { model, $slots, getFormItemProps } = this
      const slot: Slot | undefined = $slots[column.key]
      if (slot === undefined) {
        return ''
      }
      // 1、获取插槽
      const vnodeListAll: Array<VNode> = slot({ column, model })
      const vnodeList = vnodeListAll.filter(item => typeof item.type === 'object')
      return vnodeList.map(vnode => {
        // 判断是否是 form-item
        // 判断是否是form item
        const type: any = vnode.type
        const name = type.name
        const isFormItem = FORM_ITEM_NAME.includes(name)
        if (isFormItem) {
          return vnode
        } else {
          const props: any = getFormItemProps(column)
          return (
            <FormItem
              {...props}>
              {
                vnode
              }
            </FormItem>
          )
        }
      })
    },
    /**
     * 渲染隐藏列
     * @param hiddenFormColumns
     */
    renderHiddenColumns (hiddenFormColumns: Array<FormColumn>) {
      const { handleModelChange } = this
      if (hiddenFormColumns.length > 0) {
        return (
          <div style="display: none">
            {
              this.hiddenFormColumns.map(column => {
                return <FormItem
                  value={this.model[column.key]}
                  onValue-change={(value: any) => {
                    handleModelChange(value, column)
                  }}
                  column={column} />
              })
            }
          </div>
        )
      }
    },
    /**
     * 渲染行列
     * @param columns
     */
    renderInlineColumns (columns: Array<FormColumn>) {
      const { layout } = this
      if (layout !== LAYOUT[LAYOUT.inline]) {
        return ''
      }
      return columns.map(column => {
        return this.renderFormItem(column)
      })
    },
    /**
     * 渲染普通列
     * @param columns
     */
    renderColumns (columns: Array<Array<FormColumn>>) {
      return columns.map((columnList, indexRow) => {
        return (
          <a-row key={indexRow + 'row'}>
            {
              columnList.map((column, indexCol) => {
                return (
                  <a-col
                    key={indexCol + 'col'}
                    span={column.span}>
                    {
                      this.renderFormItem(column)
                    }
                  </a-col>
                )
              })
            }
          </a-row>
        )
      })
    },
    /**
     * 渲染表格项
     * @param column
     */
    renderFormItem (column: FormColumn) {
      const { useSolt, getFormItemProps, renderSlotFormItem, handleModelChange } = this
      const props = getFormItemProps(column)
      if (useSolt(column)) {
        return renderSlotFormItem(column)
      } else {
        return (
          <form-item
            {...props}
            onValue-change={(value: any) => {
              handleModelChange(value, column)
            }}
            value={this.model[column.key]}/>
        )
      }
    }
  },
  render () {
    const { $attrs, layout, renderHiddenColumns, renderInlineColumns, renderColumns, hiddenFormColumns, showFormInlineColumns, showFormColumns } = this
    return (
      <a-form
        {...{
          attrs: $attrs
        }}
        ref="form"
        layout={layout}>
        {
          // 渲染隐藏列
          renderHiddenColumns(hiddenFormColumns)
        }
        {
          renderInlineColumns(showFormInlineColumns)
        }
        {
          renderColumns(showFormColumns)
        }
      </a-form>
    )
  }
})