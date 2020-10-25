import { defineComponent, PropType, reactive, computed } from 'vue'
import { CommonUtil } from 'cloud-js-utils'

import { TableBaseColumn } from '../../utils/types/Types'
import { t } from '../../../src/locale'
import createTableSummary from './TableSummary'
// import ResizableCell from './ResizableCell'

/**
 * 序号列配置
 */
const TABLE_INDEX_SLOT_NAME = 'table-index-index'
const DEFAULT_INDEX_CONFIG: TableBaseColumn = {
  key: 'index',
  width: 70,
  prop: 'index',
  title: '#',
  fixed: true,
  align: 'center',
  slots: { customRender: TABLE_INDEX_SLOT_NAME }
}

/**
 * s-table 组件
 * @author shizhongming
 * @since 2.0
 * 2020-10-07 11:09
 */
export default defineComponent({
  name: 'STable',
  props: {
    // 是否显示边框
    bordered: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    // 是否分页
    paging: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    size: {
      type: String as PropType<string>,
      default: 'default'
    },
    // 表格项
    columns: {
      type: Array as PropType<Array<TableBaseColumn>>,
      required: true
    },
    // 是否显示合计行
    showSummary: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    keys: {
      type: Array as PropType<Array<string>>,
      required: true
    },
    /**
     * 合计文字
     */
    sumText: {
      type: String as PropType<string>,
      default: t('smart.table.summary.sumText')
    },
    /**
     * 自定义合计逻辑
     */
    summaryMethod: Function as PropType<Function>,
    // 数据源
    dataSource: {
      type: Array as PropType<Array<any>>,
      default: () => []
    },
    // 表格序号控制
    tableIndex: [Object, Boolean],
    // 是否支持伸缩列
    resizable: Boolean as PropType<boolean>
  },
  setup (props, content) {
    // 列宽度
    const columnsWidth: {[index: string]: number} = reactive({})
    // 是否显示序号列计算属性
    const computedShowIndex = computed((): boolean => {
      return props.tableIndex !== false
    })
    // 序号列计算属性
    const computedTableIndex = computed((): TableBaseColumn | null => {
      const tableIndex = props.tableIndex
      if (!computedShowIndex.value) {
        return null
      }
      const column = tableIndex === true || !tableIndex ? {} : tableIndex
      return Object.assign({}, DEFAULT_INDEX_CONFIG, column)
    })
    // 表格项计算属性
    const computedColumns = computed((): Array<TableBaseColumn> => {
      const columns: Array<TableBaseColumn> = []
      if (computedTableIndex.value) {
        // 添加序号列
        columns.push(computedTableIndex.value)
      }
      props.columns.forEach(item => {
        const column = Object.assign({}, item)
        if (!column.dataIndex) {
          column.dataIndex = column.prop
        }
        if (!column.title) {
          column.title = column.label
        }
        // 设置宽度
        const resizeWidth = columnsWidth[item.key]
        if (resizeWidth) {
          column.width = resizeWidth
        }
        // 显示的列才加入
        if (column.visible !== false) {
          if (!column.align) column.align = 'center'
          if (!column.key) column.key = column.prop
          columns.push(column)
        }
      })
      return columns
    })

    // 数据源计算属性
    const computedDataSource = computed(() => {
      const result: Array<any> = [].concat(...props.dataSource)
      if (props.showSummary) {
        result.push(createTableSummary(props.showSummary, props.summaryMethod, props.dataSource, computedColumns.value, props.sumText, computedShowIndex.value, props.keys))
      }
      return result
    })
    // rowKey计算属性
    const computedRowKey = computed(() => {
      if (content.attrs.rowKey) {
        return content.attrs.rowKey
      }
      if (props.keys.length === 1) {
        return props.keys[0]
      }
      return (record: any) => {
        return JSON.stringify(CommonUtil.getObjectByKeys(props.keys, [record]))
      }
    })
    // 表格props计算属性
    const computedTableProps = computed(() => {
      const otherProps: {[index: string]: object} = {}
      if (props.resizable) {
        otherProps.components = {
          header: {
            // cell: ResizableCell.render(this.render, this.columns, this.test)
          }
        }
      }
      return {
        ...content.attrs,
        ...otherProps,
        dataSource: computedDataSource.value,
        columns: computedColumns.value,
        rowKey: computedRowKey.value,
        bordered: props.bordered,
        size: props.size
      }
    })
    return {
      computedShowIndex,
      computedDataSource,
      computedTableProps
    }
  },
  methods: {
    createTableSlots () {
      const scopeSlots: any = this.$slots
      if (this.computedShowIndex === true) {
        scopeSlots[TABLE_INDEX_SLOT_NAME] = (text: any, record: any, index: number) => {
          return (
            <span>{index + 1}</span>
          )
        }
      }
      console.log(scopeSlots)
      return scopeSlots
    }
  },
  render () {
    return (
      <a-table
        {
          // props
          ...this.computedTableProps
        }
        vSlots={this.createTableSlots()}>
      </a-table>
    )
  }
})
