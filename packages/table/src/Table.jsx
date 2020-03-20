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
    // 表格项
    columns: {
      type: Array,
      required: true
    }
  },
  computed: {
    /**
     * 表格项计算属性
     */
    computedColumns () {
      const columns = []
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
    }
  },
  render (h) {
    return (
      <a-table
        {...{
          props: this.$attrs,
          on: this.$listeners,
          scopedSlots: this.$scopedSlots
        }}
        columns={this.computedColumns}
        bordered={this.bordered}
        size={this.size}></a-table>
    )
  }
}
