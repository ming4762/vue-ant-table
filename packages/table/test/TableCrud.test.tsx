import { defineComponent } from 'vue'

import TableCrud from '../src/TableCrud'

import { TableColumn, CrudSearch } from '../../utils/types/Types'

export default defineComponent({
  components: {
    TableCrud
  },
  data () {
    return {
      columns: [
        {
          prop: 'name',
          label: '姓名',
          search: {
            symbol: 'like'
          }
        }
      ] as Array<TableColumn>,
      search: {
        defaultVisible: true
      } as CrudSearch,
      hasOperaColumn: false
    }
  },
  methods: {
    handleTestHasOperaColumn () {
      this.hasOperaColumn = !this.hasOperaColumn
    }
  },
  render () {
    return <div>
      <a-button-group>
        <a-button onClick={this.handleTestHasOperaColumn}>测试hasOperaColumn</a-button>
      </a-button-group>
      <s-table-crud
        hasOperaColumn={this.hasOperaColumn}
        keys={['name']}
        search={this.search}
        columns={this.columns}></s-table-crud>
    </div>
  }
})
