import { t } from '../../../src/locale'

const TABLE_INDEX_SLOT_NAME = 'table-index-index'

export default {
  name: 's-table',
  props: {
    bordered: {
      type: Boolean,
      default: true
    },
    // 是否分页
    paging: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'default'
    },
    // 是否显示序号
    showIndex: {
      type: Boolean,
      default: true
    },
    // 表格项
    columns: {
      type: Array,
      required: true
    },
    /**
     * 是否显示合计行
     */
    showSummary: Boolean,
    keys: {
      type: Array,
      required: true
    },
    /**
     * 合计文字
     */
    sumText: {
      type: String,
      default: t('smart.table.summary.sumText')
    },
    /**
     * 自定义合计逻辑
     */
    summaryMethod: Function,
    // 数据源
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    /**
     * 表格项计算属性
     */
    computedColumns () {
      const columns = []
      // 处理序号列
      if (this.showIndex) {
        columns.push({
          key: 'index',
          width: 70,
          title: '#',
          fixed: true,
          align: 'center',
          scopedSlots: { customRender: TABLE_INDEX_SLOT_NAME }
        })
      }
      this.columns.forEach(item => {
        const column = Object.assign({}, item)
        // 显示的列才加入
        if (column.visible !== false) {
          if (!column.align) column.align = 'center'
          if (!column.key) column.key = column.prop
          columns.push(column)
        }
      })
      return columns
    },
    /**
     * 数据源计算属性
     */
    computedDataSource () {
      const result = [].concat(this.dataSource)
      if (this.showSummary) {
        result.push(this.getSummaryData())
      }
      return result
    }
  },
  methods: {
    /**
     * 获取合计数据
     * @returns {{}|*}
     */
    getSummaryData () {
      const { showSummary, summaryMethod, dataSource, computedColumns } = this
      if (showSummary) {
        if (summaryMethod) {
          return summaryMethod(dataSource, computedColumns)
        } else {
          return this.defaultSummaryMethods()
        }
      }
    },
    /**
     * 默认的合计算法
     * @returns {{}}
     */
    defaultSummaryMethods () {
      const { computedColumns: columns, dataSource, sumText, showIndex } = this
      const summaryData = {}
      let summaryTextIndex = 0
      for (const [index, column] of columns.entries()) {
        const { dataIndex, summary } = column
        if (showIndex === true && index === 0) {
          summaryTextIndex = 1
          continue
        }
        if (index === summaryTextIndex) {
          summaryData[dataIndex] = sumText
          continue
        }
        const values = dataSource.map(item => item[dataIndex])
        if (summary) {
          summaryData[dataIndex] = summary(values, column, dataSource)
          continue
        }
        const numberValues = values.map(item => Number(item))
        if (!numberValues.every(value => isNaN(value))) {
          summaryData[dataIndex] = numberValues.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        }
      }
      // 设置该列是summary数据
      summaryData.isSummary = true
      this.keys.forEach(key => {
        summaryData[key] = new Date().getTime()
      })
      return summaryData
    },
    createTableScopeSlots () {
      const scopeSlots = this.$scopedSlots
      if (this.showIndex === true) {
        scopeSlots[TABLE_INDEX_SLOT_NAME] = (text, record, index) => {
          return (
            <span>{index + 1}</span>
          )
        }
      }
      return scopeSlots
    }
  },
  render (h) {
    return (
      <a-table
        {...{
          props: this.$attrs,
          on: this.$listeners,
          scopedSlots: this.createTableScopeSlots()
        }}
        dataSource={this.computedDataSource}
        columns={this.computedColumns}
        bordered={this.bordered}
        size={this.size}/>
    )
  }
}
