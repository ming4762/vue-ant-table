import { defineComponent } from 'vue'

import TableCrud from '../src/TableCrud'

import { TableColumn, CrudSearch } from '../../utils/types/Types'
import ApiService from '../../../examples/utils/ApiService'

export default defineComponent({
  components: {
    TableCrud
  },
  data () {
    return {
      apiService: ApiService,
      columns: [
        {
          label: '用户ID',
          prop: 'userId',
          table: {
            visible: false,
            config: false
          },
          form: {
            visible: false
          }
        },
        {
          label: '用户名',
          prop: 'username',
          table: {
            width: 120,
            fixed: true
          }
        },
        {
          label: '姓名',
          prop: 'realname',
          table: {
            width: 120,
            fixed: true
          }
        },
        {
          label: '邮箱',
          prop: 'email',
          table: {
            width: 220
          }
        },
        {
          label: '手机',
          prop: 'mobile',
          table: {
            width: 120
          }
        },
        {
          label: '电话',
          prop: 'telephone',
          table: {
            width: 120
          }
        }
      ] as Array<TableColumn>,
      search: {
        defaultVisible: true
      } as CrudSearch,
      hasOperaColumn: true,
      defaultButtonConfig: {
        add: {
          topShow: true
        }
      }
    }
  },
  methods: {
    handleTestHasOperaColumn () {
      this.hasOperaColumn = !this.hasOperaColumn
    },
    handleAddSearch () {
      this.columns[0].search = {
        symbol: 'like'
      }
    },
    handleDeleteSearch () {
      delete this.columns[0].search
    },
    handleTestButtonShow () {
      this.defaultButtonConfig.add.topShow = !this.defaultButtonConfig.add.topShow
    }
  },
  render () {
    const slots = {
      'button-left': () => {
        return (
          <a-button type="primary">ceshi</a-button>
        )
      }
    }
    return <div>
      <a-button-group>
        <a-button onClick={this.handleTestHasOperaColumn}>测试hasOperaColumn</a-button>
        <a-button onClick={this.handleAddSearch}>测试动态添加搜索</a-button>
        <a-button onClick={this.handleDeleteSearch}>测试动态删除搜索</a-button>
        <a-button onClick={this.handleTestButtonShow}>测试按钮显示</a-button>
      </a-button-group>
      <s-table-crud
        vSlots={slots}
        url={
          {
            query: 'sys/user/list'
          }
        }
        scroll={{
          x: 800
        }}
        apiService={this.apiService}
        hasOperaColumn={this.hasOperaColumn}
        defaultButtonConfig={this.defaultButtonConfig}
        keys={['name']}
        search={this.search}
        columns={this.columns}>
      </s-table-crud>
    </div>
  }
})
