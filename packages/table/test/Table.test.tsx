import { defineComponent } from 'vue'

import Table from '../src/Table'

export default defineComponent({
  components: {
    Table
  },
  data () {
    return {
      columns: [
        {
          prop: 'name',
          label: '姓名',
          width: 400,
          fixed: true
        },
        {
          prop: 'sex',
          label: '性别'
        }
      ],
      num: 1,
      data: [
        {
          name: '张三',
          sex: '男'
        }
      ]
    }
  },
  methods: {
    handleAddColumn () {
      this.columns.push({
        prop: 'name' + this.num,
        label: '姓名' + this.num
      })
      this.num++
    },
    handleDeleteColumn () {
      this.columns.splice(this.columns.length - 2, 1)
    }
  },
  render () {
    return <div>
      <a-button onClick={this.handleAddColumn}>添加列</a-button>
      <a-button onClick={this.handleDeleteColumn}>删除列</a-button>
      <s-table
        keys={['name']}
        scroll={{
          x: 2000
        }}
        dataSource={this.data}
        columns={this.columns}></s-table>
    </div>
  }
})
