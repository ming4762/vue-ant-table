<template>
  <div>
    <!--  搜索form  -->
    <div v-show="searchDivVisible">
<!--      <s-form-->
<!--        :model="searchModel"-->
<!--        layout="inline"-->
<!--        :columns="columns">-->
<!--        &lt;!&ndash;遍历插槽&ndash;&gt;-->
<!--        <template-->
<!--          v-for="(value, key) in computedSearchSolts"-->
<!--          slot-scope="{column, model}"-->
<!--          :slot="value">-->
<!--          <slot-->
<!--            :column="column"-->
<!--            :model="model"-->
<!--            :name="key"/>-->
<!--        </template>-->
<!--      </s-form>-->
    </div>
    <!--  操作组  -->
    <div class="button-group-container">
      <!--   做侧按钮列   -->
      <div v-if="hasLeftButton" class="button-group-left">
        <a-button-group>
          <a-button @click="handleShowAdd()" type="primary">添加</a-button>
          <a-button @click="handleDelete()" type="danger">删除</a-button>
        </a-button-group>
      </div>
      <!--   右侧按钮列   -->
      <div v-if="hasRightButton" class="button-group-right">
        <a-tooltip title="刷新" placement="top">
          <a-button @click="handleRefresh" class="right-button" shape="circle" icon="reload"/>
        </a-tooltip>
        <a-tooltip title="列显示" placement="top">
          <a-button @click="columnVisibleDialogVisible = true" class="right-button" shape="circle" icon="appstore"/>
        </a-tooltip>
        <a-tooltip title="搜索" placement="top">
          <a-button @click="searchDivVisible = !searchDivVisible" class="right-button" shape="circle" icon="search"/>
        </a-tooltip>
      </div>
    </div>
    <!--  表格  -->
    <a-spin :spinning="tableLoading">
      <s-table
              v-bind="$attrs"
              :rowSelection="computedRowSelection"
              :dataSource="tableData"
              :columns="tableColumns"
              v-on="$listeners">
        <!--   插槽   -->
        <template
                v-for="value in tableScopedSlots"
                slot-scope="text, record, index"
                :slot="value">
          <slot :text="text" :record="record" :$index="index" :name="value"/>
        </template>
        <!--   序号插槽   -->
        <template
                v-slot:table-index-index="text, record, index">
          <span>{{index + 1}}</span>
        </template>
        <!--    操作列插槽    -->
        <template
          v-if="hasOpreaColumn"
          v-slot:operation_ming="text, record, index">
          <a-tooltip placement="top" title="添加">
            <a-button
              :type="rowAddButtonType"
              style="width: 50px; margin-right: 5px"
              @click="handleBeforeAdd(record)"
              icon="plus">{{rowAddButtonText}}</a-button>
          </a-tooltip>

          <a-tooltip placement="top" title="编辑">
            <a-button
              :type="rowEditButtonType"
              style="width: 50px; margin-right: 5px"
              @click="handleBeforeEdit(record)"
              icon="edit">{{rowEditButtonText}}</a-button>
          </a-tooltip>

          <a-tooltip placement="top" title="删除">
            <a-button
              type="danger"
              style="width: 50px;"
              @click="handleDelete(record)"
              icon="delete">{{rowDeleteButtonText}}</a-button>
          </a-tooltip>
          <slot
            :text="text"
            :record="record"
            :index="index"
            name="row-operation"/>
        </template>
      </s-table>
    </a-spin>
    <!--  添加修改弹窗  -->
    <a-modal
      title="保存"
      @cancel="addEditDialog.visible = false"
      :visible="addEditDialog.visible">
      <s-form
        ref="addEditForm"
        :labelCol="{span: 5}"
        :wrapper-col="{ span: 19 }"
        :columns="addEditFormColumns">
        <!--遍历插槽-->
        <template
          v-for="(value, key) in computedAddEditFormSolts"
          slot-scope="{column, model}"
          :slot="value">
          <slot
              :column="column"
              :model="model"
              :name="key"/>
        </template>
      </s-form>
      <template slot="footer">
        <a-button key="back" @click="addEditDialog.visible = false">取消</a-button>
        <a-button
          type="primary"
          @click="handleSaveUpdate()"
          :loading="addEditDialog.loading"
          key="submit">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
// import Table from './Table'
// import Form from '../../form/src/Form'

import { CommonUtil } from 'cloud-js-utils'

const EVENTS = {
  // 加载前状态
  BEFORE_LOAD: 'before-load',
  // 选中列变化触发
  SELECTED_CHANGE: 'selected-change',
  // 删除后事件
  AFTER_DELETE: 'after-delete',
  // 添加前事件
  BEFORE_ADD: 'before-add',
  // 编辑前事件
  BEFORE_EDIT: 'before-edit',
  // 添加修改弹窗显示事件
  ADD_EDIT_DIALOG_SHOW: 'add-edit-dialog-show'
}

const EDIT = 'edit'
const ADD = 'add'

export default {
  name: 's-table-crud',
  components: {
    // Table,
    // Form
  },
  props: {
    // 是否显示默认搜索
    defaultSearchVisible: Boolean,
    // 搜索是否添加符号
    searchWithSymbol: {
      type: Boolean,
      default: true
    },
    // 是否显示序号
    showIndex: {
      type: Boolean,
      default: true
    },
    // 查询url
    queryUrl: String,
    // 保存修改url
    saveUpdateUrl: String,
    // 删除url
    deleteUrl: String,
    // 查询URL
    getUrl: String,
    // 表格对应实体类的key
    keys: {
      type: Array,
      required: true
    },
    // 后台请求工具
    apiService: Function,
    // 表格数据
    data: Array,
    // 表格名称
    tableName: String,
    // 操作列宽度
    opreaColumnWidth: {
      type: Number,
      default: 200
    },
    // 是否有操作列
    hasOpreaColumn: {
      type: Boolean,
      default: true
    },
    // 列信息
    columns: {
      type: Array,
      required: true
    },
    // 是否有左侧操作按钮
    hasLeftButton: {
      type: Boolean,
      default: true
    },
    // 是否有右侧按钮
    hasRightButton: {
      type: Boolean,
      default: true
    },
    // 参数格式化函数
    queryParameterFormatter: Function,
    // 查询执行器
    queryHandler: Function,
    // 数据格式化函数
    tableDataFormatter: Function,
    // 错误执行器
    errorHandler: Function,
    // 删除警告语毁掉
    deleteWarningHandler: Function,
    // 删除执行器
    deleteHandler: Function,
    // 添加修改格式化工具
    saveUpdateFormatter: Function,
    // 添加修改执行器
    saveUpdateHandler: Function,
    // 选中列事件
    rowSelection: Object
  },
  data () {
    return {
      // 搜索DIV显示状态
      searchDivVisible: true,
      // 表格加载状态
      tableLoading: false,
      // 搜索model绑定
      searchModel: {},
      // 搜索符号
      searchSymbol: {},
      // 表格列配置
      tableColumns: [],
      // 列显示隐藏按钮状态
      columnVisibleDialogVisible: false,
      // 表格数据
      tableData: [],
      // 表格插槽
      tableScopedSlots: [],
      // 选中列
      selectedRows: [],
      // 添加编辑表单column
      addEditFormColumns: [],
      // 添加修改弹窗配置
      addEditDialog: {
        isAdd: true,
        visible: false,
        loading: false
      },
      // 行添加按钮样式
      rowAddButtonType: this.textRowButton === true ? 'text' : '',
      rowAddButtonText: this.textRowButton === true ? '新增' : '',

      // 行编辑按钮样式
      rowEditButtonType: this.textRowButton === true ? 'text' : 'primary',
      rowEditButtonText: this.textRowButton === true ? '编辑' : '',

      // 行添加按钮样式
      rowDeleteButtonType: this.textRowButton === true ? 'text' : 'danger',
      rowDeleteButtonText: this.textRowButton === true ? '删除' : '',
      // 选中的列
      selectedRow: null,
      // 编辑前对象
      oldAddEditModel: {}
    }
  },
  /**
   * 生命周期钩子创建完毕状态
   */
  created () {
    this.convertColumn()
  },
  /**
   * 生命周期钩子：加载完毕状态
   */
  mounted () {
    if (!this.data) {
      this.load()
    } else {
      this.tableData = this.data
    }
  },
  computed: {
    /**
     * 获取搜索插槽
     * @returns {{}}
     */
    computedSearchSolts: function () {
      const result = {}
      for (const key in this.$scopedSlots) {
        if (key.indexOf('search-') === 0) {
          result[key] = key.substring(7)
        }
      }
      return result
    },
    /**
     * 选中列计算属性
     */
    computedRowSelection () {
      if (this.rowSelection) {
        return Object.assign({
          onChange: this.handleSelectionChange
        }, this.rowSelection)
      }
      return null
    },
    /**
     * 添加修改form插槽
     */
    computedAddEditFormSolts () {
      const result = {}
      for (const key in this.$scopedSlots) {
        if (key.indexOf('form-') === 0) {
          result[key] = key.substring(5)
        }
      }
      return result
    }
  },
  methods: {
    /**
     * 转换配置信息
     */
    convertColumn () {
      const scopedSlotsProperty = 'scopedSlots'
      const customRenderProperty = 'customRender'
      // 表格配置
      const tableColumns = []
      // 处理序号列
      if (this.showIndex) {
        tableColumns.push({
          key: 'index',
          width: 70,
          title: '#',
          scopedSlots: { customRender: 'table-index-index' }
        })
      }
      // 搜索表单配置
      const searchColumns = []
      // 添加修改form columns
      const addEditFormColumns = []
      // 表格插槽
      const tableScopedSlots = []
      this.columns.forEach(item => {
        // 设置key
        if (!item.key) {
          item.key = item.prop
        }
        // 通用列
        const commonColumn = {
          key: item.key,
          label: item.label,
          prop: item.prop,
          type: item.type
        }
        // 处理表格列
        const tableCustom = item.table || {}
        tableColumns.push(Object.assign({
          key: item.key,
          dataIndex: item.prop,
          title: item.label
        }, tableCustom))
        // 处理搜索配置
        if (item.search) {
          searchColumns.push(Object.assign({}, commonColumn, item.search))
          this.searchSymbol[item.key] = item.search.symbol ? item.search.symbol : '='
        }
        // 处理添加修改form
        const addEditFromColumn = Object.assign({}, commonColumn, item.form)
        addEditFormColumns.push(addEditFromColumn)
        // 处理表格插槽
        if (Object.prototype.hasOwnProperty.call(tableCustom, scopedSlotsProperty) && Object.prototype.hasOwnProperty.call(tableCustom[scopedSlotsProperty], customRenderProperty)) {
          const value = tableCustom[scopedSlotsProperty][customRenderProperty]
          if (tableScopedSlots.indexOf(value) === -1) {
            tableScopedSlots.push(tableCustom[scopedSlotsProperty][customRenderProperty])
          }
        }
      })
      // 添加搜索列
      if (this.hasOpreaColumn) {
        tableColumns.push({
          key: 'operation_ming',
          title: '操作',
          fixed: 'right',
          align: 'center',
          width: this.opreaColumnWidth,
          scopedSlots: { customRender: 'operation_ming' }
        })
      }
      this.tableColumns = tableColumns
      this.tableScopedSlots = tableScopedSlots
      this.addEditFormColumns = addEditFormColumns
    },
    /**
     * 点击添加按钮
     */
    handleShowAdd () {
      this.addEditDialog.isAdd = true
      this.handleBeforeAdd()
    },
    /**
     * 点击删除按钮
     * TODO: 待测试
     */
    handleDelete (row) {
      const $this = this
      let rowList = []
      if (row) {
        rowList.push(row)
      } else {
        if (this.selectedRows.length === 0) {
          this.$message.error('请选择要删除的数据')
        } else {
          rowList = this.selectedRows
        }
      }
      let deleteList = CommonUtil.getObjectByKeys(this.keys, rowList)
      if (this.keys.length === 1) {
        const key = this.keys[0]
        deleteList = deleteList.map(item => item[key])
      }
      if (deleteList.length > 0) {
        // 删除警告语
        let warningMessage = `您确定要删除【${rowList.length}】条数据吗？`
        if (this.deleteWarningHandler) {
          warningMessage = this.deleteWarningHandler(rowList)
        }
        this.$confirm({
          title: warningMessage,
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk () {
            // 执行删除操作
            let deletePromise
            if ($this.deleteHandler) {
              deletePromise = $this.deleteHandler($this.deleteUrl, deleteList, rowList)
            } else {
              if (!$this.deleteUrl) {
                $this.$message.error('未设置删除url：deleteUrl，无法执行删除')
                return false
              }
              deletePromise = $this.apiService.postAjax($this.deleteUrl, deleteList)
            }
            return deletePromise.then(data => {
              $this.$emit(EVENTS.AFTER_DELETE, data)
              $this.load()
            }).catch(error => {
              $this.errorMessage('删除发生错误', error)
            })
          }
        })
      }
    },
    /**
     * 刷新操作
     */
    handleRefresh () {
      this.load()
    },
    /**
     * 选中项发生变化触发
     */
    handleSelectionChange (selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows
      this.$emit(EVENTS.SELECTED_CHANGE, selectedRowKeys, selectedRows)
    },
    /**
     * 加载数据
     */
    load () {
      this.tableLoading = true
      // 加载前事件
      this.$emit(EVENTS.BEFORE_LOAD)
      let parameter = this.createQueryParameter()
      if (this.queryParameterFormatter) {
        parameter = this.queryParameterFormatter(parameter)
      }
      let resultPromise
      if (this.queryHandler) {
        resultPromise = this.queryHandler(this.queryUrl, parameter)
      } else {
        resultPromise = this.apiService.postAjax(this.queryUrl, parameter)
      }
      resultPromise.then(data => {
        this.tableLoading = false
        let dealData = data
        if (this.tableDataFormatter) {
          // 执行数据格式化函数
          dealData = this.tableDataFormatter(dealData)
        }
        // todo：待修改
        this.tableData = dealData
      }).catch(error => {
        this.tableLoading = false
        this.errorMessage('加载数据失败', error)
      })
    },
    /**
     * 创建查询条件
     * TODO: 待完善分页信息
     */
    createQueryParameter () {
      let parameters = {}
      // 添加searchModel条件
      if (this.searchWithSymbol) {
        Object.keys(this.searchModel).forEach(key => {
          const value = this.searchModel[key]
          const symbol = this.searchSymbol[key]
          let searchKey = key
          if (symbol) {
            searchKey = `${key}@${symbol}`
          }
          parameters[searchKey] = value
        })
      } else {
        parameters = Object.assign(parameters, this.searchModel)
      }
      return parameters
    },
    /**
     * 错误信息
     */
    errorMessage (message, error) {
      if (this.errorHandler) {
        this.errorHandler(message, error)
      } else {
        /* eslint-disable */
        console.error(message, error)
      }
    },
    /**
     * 添加保存方法
     */
    handleSaveUpdate () {
      const noUrlError = 'noUrl'
      const validateError = 'validateError'
      this.getAddEditFormVue().validate()
      .then(({result, data}) => {
        if (result === true) {
          this.addEditDialog.loading = true
          if (this.addEditDialog.isAdd) {
            // 添加前事件
            this.$emit(EVENTS.BEFORE_ADD, this.addEditModel)
          } else {
            // todo:待完善，编辑前对象
            this.$emit(EVENTS.BEFORE_EDIT, this.addEditModel)
          }
          const model = this.saveUpdateFormatter ? this.saveUpdateFormatter(Object.assign({}, data), this.addEditDialog.isAdd ? 'add' : 'edit') : data
          if (this.saveUpdateHandler) {
            return this.saveUpdateHandler(this.saveUpdateUrl, model, this.addEditDialog.isAdd ? 'add' : 'edit')
          } else {
            if (!this.saveUpdateUrl) {
              this.$message.error('未设置添加保存url：saveUpdateUrl，无法执行保存修改')
              return Promise.reject(noUrlError)
            }
            return this.apiService.postAjax(this.saveUpdateUrl, model)
          }
        } else {
          return Promise.reject(validateError)
        }
      }).then(() => {
        this.addEditDialog.loading = false
        this.addEditDialog.visible = false
        this.$message.success("保存成功")
        this.load()
      }).catch(error => {
        if (error !== noUrlError && error !== 'validateError') {
          this.errorMessage(`保存发生错误`, error)
        }
        this.addEditDialog.loading = false
      })

    },
    /**
     * 获取添加编辑表单vue对象
     * @returns {Vue | Element | Vue[] | Element[]}
     */
    getAddEditFormVue () {
      return this.$refs['addEditForm']
    },
    /**
     * 添加前操作
     * @param row
     */
    handleBeforeAdd (row = null) {
      if (row) this.selectedRow = row
      this.handleAddEditDialogShow(ADD, row)
    },
    /**
     * 添加编辑弹窗显示
     */
    handleAddEditDialogShow (ident, row) {
      // 显示弹窗
      this.addEditDialog.visible = true
      // 回调函数
      const callBack = model => {
        this.oldAddEditModel = Object.assign({}, row)

        if (model) {
          this.getAddEditFormVue().setFieldsValue(model)
        } else {
          this.getOne(ident, row)
        }
      }
      // 重置表单
      if (this.getAddEditFormVue()) {
        this.getAddEditFormVue().reset()
      }
      if (!this.$listeners[EVENTS.ADD_EDIT_DIALOG_SHOW]) {
        callBack(null)
      } else {
        this.$emit(EVENTS.ADD_EDIT_DIALOG_SHOW, ident, this.getAddEditFormVue().getFieldsValue(), callBack, row)
      }
    },
    /**
     * 查询单一对象
     */
    getOne (ident, row) {
      const $this = this
      if (ident === EDIT) {
        // 是否有get url
        const get = !!this.getUrl
        let parameters = {}
        if (get) {
          const keysObj = CommonUtil.getObjectByKeys(this.keys, [row])[0]
          if (this.keys.length === 1) {
            parameters = keysObj[this.keys[0]]
          } else {
            parameters = keysObj
          }
        } else {
          this.keys.forEach(key => {
            parameters[key + '@='] = row[key]
          })
        }
        // 执行查询
        this.apiService.postAjax(get ? this.getUrl : this.queryUrl, parameters)
        .then(result => {
          if (result) {
            $this.getAddEditFormVue().getForm().setFieldsValue(get ? result : (result.length === 1 ? result[0] : {}))
          }
        }).catch(error => {
          $this.errorMessage('查询发生错误', error)
        })
      }
    },
    /**
     * 编辑前操作
     * @param row 编辑的行
     */
    handleBeforeEdit (row = null) {
      if (row) this.selectedRow = row
      let rowList = []
      if (row) {
        rowList.push(row)
      } else {
        rowList = this.selectionList
      }
      let notifyMessage = ''
      if (rowList.length === 0) {
        notifyMessage = '请选择一条要修改的数据'
      } else if (rowList.length >= 1) {
        notifyMessage = '只能选择一条修改的数据'
      }
      if (rowList.length !== 1) {
        this.$message.error(notifyMessage)
      } else {
        this.addEditDialog.isAdd = false
        this.handleAddEditDialogShow(EDIT, rowList[0])
      }
    },
    test (a, b, c) {
      console.log(a, b, c)
    }
  }

}
</script>

<style lang="scss">
  .button-group-container {
    padding-bottom: 5px;
  }
  .button-group-left {
    display: inline-block;
  }
  .button-group-right {
    display: inline-block;
    float: right;
    .right-button {
      margin-left: 5px;
    }
  }
</style>
