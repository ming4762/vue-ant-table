import { CommonUtil } from 'cloud-js-utils'
import { t } from '../../../src/locale'

import TableColumnConfig from './TableColumnConfig'

import '../../style/table.scss'

/**
 * 验证权限
 */
const validatePermission = (permission, permissions) => {
  if (!permissions || permission === undefined || permission === null || permission === '') {
    return true
  }
  return permissions.indexOf(permission) !== -1
}

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
  ADD_EDIT_DIALOG_SHOW: 'add-edit-dialog-show',
  // 表格change事件
  TABLE_CHANGE: 'change'
}

/**
 * 插槽前缀
 * @type {{table: string}}
 */
const SLOTS_PREFIX = {
  table: 'table-'
}

const EDIT = 'edit'
const ADD = 'add'
const OPERATION_SLOT_NAME = 'operation_ming'

/**
 * 按钮尺寸
 * @type {{default: string, middle: string}}
 */
const BUTTON_SIZE = Object.freeze({
  default: 'default',
  middle: 'middle',
  small: 'small'
})

// 表格尺寸
const TABLE_SIZE = BUTTON_SIZE

/**
 * 默认的分页配置
 * @type {{defaultPageSize: number}}
 */
const defaultPagination = {
  defaultPageSize: 10,
  showSizeChanger: true,
  defaultCurrent: 1
}

// Vue.use(Button)
/**
 * crud 表格
 * @author zhongming
 */
export default {
  name: 's-table-crud',
  components: {
    TableColumnConfig
  },
  props: {
    // 是否显示默认搜索
    defaultSearchVisible: Boolean,
    // 搜索是否添加符号
    searchWithSymbol: {
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
    // 请求地址
    url: {
      type: Object,
      default: () => ({})
    },
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
    // 默认按钮配置
    defaultButtonConfig: Object,
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
    // 左侧按钮是否在按钮组内
    leftButtonInGroup: {
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
    rowSelection: Object,
    // 用户权限信息
    permissions: Array,
    size: {
      type: String,
      default: BUTTON_SIZE.small
    },
    // 分页配置
    pagination: [Object, Boolean],
    // 默认的排序列
    defaultSortColumn: String,
    // 默认的排序方向
    defaultSortOrder: String,
    // 行按钮是否是text类型
    textRowButton: {
      type: Boolean
    },
    // 搜索按钮是否在右侧
    rightSearchButton: Boolean,
    /**
     * 添加修改表单布局
     */
    addEditFormlayout: {
      type: String,
      default: 'horizontal'
    },
    // 添加搜索表单默认的span
    addEditFormSpan: Number,
    // 添加保存modal配置
    addEditModalProps: Function,
    // 搜索form配置
    searchFormProps: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {
      // 搜索DIV显示状态
      searchDivVisible: !this.defaultSearchVisible,
      // 表格加载状态
      tableLoading: false,
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
      rowAddButtonType: this.textRowButton === true ? 'link' : '',
      rowAddButtonText: this.textRowButton === true ? t('smart.table.addButtonText') : '',

      // 行编辑按钮样式
      rowEditButtonType: this.textRowButton === true ? 'link' : 'primary',
      rowEditButtonText: this.textRowButton === true ? t('smart.table.editButtonText') : '',

      // 行添加按钮样式
      rowDeleteButtonType: this.textRowButton === true ? 'link' : 'danger',
      rowDeleteButtonText: this.textRowButton === true ? t('smart.table.deleteButtonText') : '',
      // 选中的列
      selectedRow: null,
      // 编辑前对象
      oldAddEditModel: {},
      // 搜索列配置
      searchColumns: [],
      pageData: {
        page: 1,
        pageSize: (this.pagination && this.pagination.defaultPageSize) ? this.pagination.defaultPageSize : defaultPagination.defaultPageSize,
        total: 1
      },
      // 表格排序内容
      tableSortData: {
        sortName: null,
        sortOrder: null
      },
      // 过滤信息
      filters: {},
      // 设置的表格尺寸
      setTableSize: null,
      // 列配置信息
      columnConfig: {}
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
      Object.keys(this.$scopedSlots).forEach(key => {
        if (key.indexOf('search-') === 0) {
          result[key] = key.substring(7)
        }
      })
      return result
    },
    /**
     * 分页器样式
     * @returns {string}
     */
    computedPaginationClass: function () {
      let paginationClass = 'ant-table-pagination'
      if (this.size === BUTTON_SIZE.small) {
        paginationClass += ' mini'
      }
      return paginationClass
    },
    /**
     * 选中列计算属性
     */
    computedRowSelection () {
      if (this.rowSelection) {
        return Object.assign({
          fixed: true,
          columnWidth: 50
        }, this.rowSelection, {
          onChange: this.handleSelectionChange
        })
      }
      return null
    },
    /**
     * 添加修改form插槽
     */
    computedAddEditFormSolts () {
      const result = {}
      Object.keys(this.$scopedSlots).forEach(key => {
        if (key.indexOf('form-') === 0) {
          result[key] = key.substring(5)
        }
      })
      return result
    },
    /**
     * 默认按钮显示状态
     */
    computedDefaultButtonShow () {
      const result = {
        add: {
          row: false,
          top: true
        },
        edit: {
          row: true,
          top: true
        },
        delete: {
          row: true,
          top: true
        }
      }
      const defaultButton = this.defaultButtonConfig || {}
      for (const key in result) {
        const showConfig = this.isButtonShow(defaultButton[key], result[key].top, result[key].row)
        result[key].top = showConfig[0]
        result[key].row = showConfig[1]
      }
      return result
    },
    /**
     * rowKey 计算属性
     */
    computedRowKey () {
      if (this.$attrs.rowKey) {
        return this.$attrs.rowKey
      }
      if (this.keys.length === 1) {
        return this.keys[0]
      }
      return (record) => {
        return JSON.stringify(CommonUtil.getObjectByKeys(this.keys, [record]))
      }
    },
    /**
     * 分页计算属性
     */
    computedPagination () {
      return Object.assign(defaultPagination, this.pagination)
    }
  },
  watch: {
    pageData () {
      this.load()
    }
  },
  methods: {
    getQueryUrl () {
      return this.url.query || this.queryUrl
    },
    getDeleteUrl () {
      return this.url.delete || this.deleteUrl
    },
    getSaveUrl () {
      return this.url.save || this.saveUpdateUrl
    },
    getUpdateUrl () {
      return this.url.update || this.saveUpdateUrl
    },
    getOneUrl () {
      return this.url.get
    },
    /**
     * 转换配置信息
     */
    convertColumn () {
      const scopedSlotsProperty = 'scopedSlots'
      const customRenderProperty = 'customRender'
      // 表格配置
      const tableColumns = []
      // 搜索表单配置
      const searchColumns = []
      // 添加修改form columns
      const addEditFormColumns = []
      // 表格插槽
      const tableScopedSlots = []
      // 列配置信息
      const columnConfig = {}
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
        const tableCustom = Object.assign({
          key: item.key,
          dataIndex: item.prop,
          title: item.label,
          visible: true,
          fixed: false
        }, item.table || {})
        tableColumns.push(tableCustom)
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
        // 处理列显示隐藏配置
        const { config, visible, fixed } = tableCustom
        const { key, label } = item
        if (config !== false) {
          columnConfig[item.key] = {
            key: key,
            label: label,
            visible: visible,
            fixed: fixed
          }
        }
      })
      this.columnConfig = columnConfig
      // 添加搜索列
      if (this.hasOpreaColumn) {
        tableColumns.push({
          key: OPERATION_SLOT_NAME,
          title: '操作',
          fixed: 'right',
          align: 'center',
          width: this.opreaColumnWidth,
          scopedSlots: { customRender: OPERATION_SLOT_NAME }
        })
      }
      this.tableColumns = tableColumns
      this.tableScopedSlots = tableScopedSlots
      this.addEditFormColumns = addEditFormColumns
      this.searchColumns = searchColumns
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
     */
    handleDelete (row) {
      const $this = this
      let rowList = []
      if (row) {
        rowList.push(row)
      } else {
        if (this.selectedRows.length === 0) {
          this.$message.error(t('smart.table.deleteAlert'))
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
            const deleteUrl = $this.getDeleteUrl()
            if ($this.deleteHandler) {
              deletePromise = $this.deleteHandler(deleteUrl, deleteList, rowList)
            } else {
              if (!deleteUrl) {
                this.$message.error(t('smart.table.noDeleteUrl'))
                return false
              }
              deletePromise = $this.apiService.postAjax(deleteUrl, deleteList)
            }
            return deletePromise.then(data => {
              $this.$emit(EVENTS.AFTER_DELETE, data)
              $this.selectedRows = []
              $this.load()
            }).catch(error => {
              $this.errorMessage('删除发生错误', error)
            })
          }
        })
      }
    },
    /**
     * 是否进行分页
     * @returns {boolean}
     */
    isPaging () {
      return this.pagination !== false
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
        resultPromise = this.queryHandler(this.getQueryUrl(), parameter)
      } else {
        resultPromise = this.apiService.postAjax(this.getQueryUrl(), parameter)
      }
      resultPromise.then(data => {
        this.tableLoading = false
        let dealData
        if (this.isPaging()) {
          const { rows, total } = data
          dealData = rows
          this.pageData.total = total
        } else {
          dealData = data
        }
        if (this.tableDataFormatter) {
          // 执行数据格式化函数
          dealData = this.tableDataFormatter(dealData)
        }
        this.tableData = dealData
      }).catch(error => {
        this.tableLoading = false
        this.errorMessage(t('smart.table.loadError'), error)
      })
    },
    /**
     * 创建查询条件
     */
    createQueryParameter () {
      const { filters, searchSymbol, searchColumns } = this
      let parameters = {
      }
      if (Object.keys(filters).length > 0) {
        parameters.filters = filters
      }
      // 添加searchModel条件
      // 获取查询model
      let searchModel = {}
      if (searchColumns.length > 0) {
        searchModel = this.getSearchFormVue().getFormModel()
      }
      if (this.searchWithSymbol) {
        Object.keys(searchModel).forEach(key => {
          const value = searchModel[key]
          const symbol = searchSymbol[key]
          let searchKey = key
          if (symbol) {
            searchKey = `${key}@${symbol}`
          }
          parameters[searchKey] = value
        })
      } else {
        parameters = Object.assign(parameters, searchModel)
      }
      parameters = {
        ...parameters,
        ...this.getSort()
      }
      // 添加分页信息
      if (this.isPaging()) {
        // 添加分页参数
        const { page, pageSize } = this.pageData
        parameters = {
          ...parameters,
          limit: pageSize,
          offset: (page - 1) * pageSize
        }
      }
      // 设置排序信息
      return parameters
    },
    /**
     * 获取排序信息
     */
    getSort () {
      const { sortName, sortOrder } = this.tableSortData
      if (sortName && sortOrder) {
        return this.tableSortData
      }
      if (this.defaultSortColumn) {
        return {
          sortName: this.defaultSortColumn
        }
      }
      return {}
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
            const saveUrl = this.getSaveUrl()
            const updateUrl = this.getUpdateUrl()
            if (this.saveUpdateHandler) {
              return this.saveUpdateHandler(this.addEditDialog.isAdd ? saveUrl : updateUrl, model, this.addEditDialog.isAdd ? 'add' : 'edit')
            } else {
              let errorMessage = null
              if (this.addEditDialog.isAdd && !saveUrl) {
                errorMessage = '未设置添加url，无法执行保存'
              }
              if (!this.addEditDialog.isAdd && !updateUrl) {
                errorMessage = '未设置更新url，无法执行更新'
              }

              if (errorMessage !== null) {
                this.$message.error(errorMessage)
                return Promise.reject(noUrlError)
              }
              return this.apiService.postAjax(this.addEditDialog.isAdd ? saveUrl : updateUrl, model)
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
     * 添加修改弹窗form创建完毕事件
     * @param formVue
     */
    handleAddEditFormCreate (formVue) {
      const { row, ident } = this.addEditProperties
      this.addEditDialogShowMethods(ident, row, formVue)
      this.addEditProperties = {}
    },
    addEditDialogShowMethods (ident, row, formVue) {
      const $this = this
      // 回调函数
      const callBack = model => {
        this.oldAddEditModel = Object.assign({}, row)
        if (model) {
          formVue.form.setFieldsValue(model)
        } else {
          $this.getOne(ident, row)
        }
      }
      // 重置表单
      formVue.reset()
      if (!this.$listeners[EVENTS.ADD_EDIT_DIALOG_SHOW]) {
        callBack(null)
      } else {
        this.$emit(EVENTS.ADD_EDIT_DIALOG_SHOW, ident, formVue.getFormModel(), callBack, row)
      }
    },
    /**
     * 添加编辑弹窗显示
     */
    handleAddEditDialogShow (ident, row) {
      // 显示弹窗
      this.addEditDialog.visible = true
      if (!this.getAddEditFormVue()) {
        this.addEditProperties = { row, ident }
      } else {
        this.addEditDialogShowMethods(ident, row, this.getAddEditFormVue())
      }
    },
    /**
     * 查询单一对象
     */
    getOne (ident, row) {
      const $this = this
      if (ident === EDIT) {
        // 是否有get url
        const get = !!this.getOneUrl()
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
        this.apiService.postAjax(get ? this.getOneUrl() : this.getQueryUrl(), parameters)
          .then(result => {
            if (result) {
              $this.getAddEditFormVue().getForm().setFieldsValue(get ? result : (result.length === 1 ? result[0] : {}))
            }
          }).catch(error => {
            // todo:I18N
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
    /**
     * 分页、排序、筛选变化时触发
     */
    handleChange (pagination, filters, sorter, { currentDataSource }) {
      this.filters = filters
      const { order, field } = sorter
      // 设置排序内容
      if (!order) {
        this.tableSortData = {
          sortName: null,
          sortOrder: null
        }
      } else {
        this.tableSortData = {
          sortName: field,
          sortOrder: order === 'descend' ? 'desc' : 'asc'
        }
      }
      this.$emit(EVENTS.TABLE_CHANGE, pagination, filters, sorter, { currentDataSource })
      this.load()
    },
    /**
     * 判断按钮是否显示
     * @param buttonConfig
     * @param topShow
     * @param rowShow
     * @param topShow
     * @param rowShow
     * @returns {boolean[]}
     */
    isButtonShow (buttonConfig, topShow, rowShow) {
      // 行按钮处理
      let rowDefault = rowShow
      if (buttonConfig !== undefined && buttonConfig.rowShow !== undefined) {
        rowDefault = buttonConfig.rowShow
      }
      const row = [rowDefault, validatePermission(buttonConfig === undefined ? null : buttonConfig.permission, this.permissions)]
      // 顶部按钮处理
      let topDefault = topShow
      if (buttonConfig !== undefined && buttonConfig.topShow !== undefined) {
        topDefault = buttonConfig.topShow
      }
      const top = [topDefault, validatePermission(buttonConfig === undefined ? null : buttonConfig.permission, this.permissions)]

      return [top[0] && top[1], row[0] && row[1]]
    },
    /**
     * 搜索
     */
    handleSearch () {
      this.pageData.page = 1
      this.load()
    },
    /**
     * 重置搜索
     */
    handleRestSearch () {
      this.getSearchFormVue().reset()
      this.load()
    },
    /**
     * 改变表格大小
     */
    handleChangeTableSize ({ key }) {
      this.setTableSize = key
      // todo：解决表格冻结列bug
    },
    /**
     * 获取查询formvue对象
     * @returns {Vue | Element | Vue[] | Element[]}
     */
    getSearchFormVue () {
      return this.$refs['searchForm']
    },
    /**
     * 获取按钮尺寸
     * @returns {*}
     */
    getButtonSize () {
      return this.size === BUTTON_SIZE.middle ? BUTTON_SIZE.default : this.size
    },
    /**
     * 渲染搜索div
     */
    renderSearch () {
      const { searchFormProps } = this
      // 搜索列长度为0 不渲染
      if (this.searchColumns.length === 0) {
        return ''
      }
      // 创建from props
      if (searchFormProps.hasOwnProperty('defaultSpan')) {
        searchFormProps.layout = null
      } else {
        searchFormProps.layout = 'inline'
      }
      return (
        <div class="smart-search-container" style={{display: this.searchDivVisible ? 'none' : ''}}>
          <s-form
            {...{
              scopedSlots: this.createSearchFormScopeSlots(),
              props: searchFormProps
            }}
            columns={this.searchColumns}
            ref="searchForm">
            <template slot="form-button">
              {
                this.createSearchFormSlots()
              }
            </template>
          </s-form>
        </div>
      )
    },
    handleT(path, options) {
      return t(path, options)
    },
    /**
     * 列显示隐藏改变
     * @param columnShowConfig
     */
    handleColumnShowChange (columnShowConfig) {
      this.tableColumns.forEach(column => {
        const { key, visible } = column
        const setColumnVisible = columnShowConfig[key]
        if (setColumnVisible !== undefined && setColumnVisible !== null && visible !== setColumnVisible) {
          column.visible = setColumnVisible
        }
      })
    },
    /**
     * 列冻结信息改变
     * @param columnFixedConfig
     */
    handleColumnFixedChange (columnFixedConfig) {
      this.tableColumns.forEach(column => {
        const { key } = column
        const fixed = columnFixedConfig[key]
        if (fixed) {
          column.fixed = (fixed === 'none' ? false : fixed)
        }
      })
    },
    renderLeftButton () {
      const noInGroupClass = this.leftButtonInGroup ? '' : 'smart-button-common-space'
      const vnodes = []
      const { add } = this.computedDefaultButtonShow
      if (add.top === true) {
        vnodes.push(
          <a-button icon="plus" class={noInGroupClass} size={this.getButtonSize()} onClick={this.handleShowAdd}
                    type="primary">{t('smart.table.addButtonText')}</a-button>
        )
      }
      if (this.computedDefaultButtonShow.delete.top === true) {
        vnodes.push(
          <a-button icon="delete" class={noInGroupClass} size={this.getButtonSize()}
                    onClick={() => this.handleDelete()} type="danger">{t('smart.table.deleteButtonText')}</a-button>
        )
      }
      return vnodes.concat(this.$slots['button-left'])
    },
    /**
     * 渲染按钮组
     */
    renderButtonGroup () {
      return this.hasLeftButton || this.hasRightButton ? (
        <div class="button-group-container">
          {
            this.hasLeftButton ? (
              <div class="button-group-left">
                {
                  this.leftButtonInGroup ? (
                    <a-button-group>
                      {
                        this.renderLeftButton()
                      }
                    </a-button-group>
                  ) : this.renderLeftButton()
                }
              </div>
            ) : ''
          }
          {
            this.hasRightButton ? (
              <div class="button-group-right">
                <div class="item">
                  <a-tooltip title={t('smart.table.columnConfig.tooltip')} placement="top">
                    <div>
                      <TableColumnConfig
                        onColumnShowChange={this.handleColumnShowChange}
                        onColumnFixedChange={this.handleColumnFixedChange}
                        config={this.columnConfig}/>
                    </div>
                  </a-tooltip>
                </div>
                <div class="item">
                  <a-dropdown trigger={['click']}>
                    <a-tooltip title={t('smart.table.tableDensity')} placement="top">
                      <a-icon style="font-size: 16px;" type="column-height" />
                    </a-tooltip>
                    <a-menu onClick={this.handleChangeTableSize} slot="overlay">
                      {
                        Object.keys(TABLE_SIZE).map(key => {
                          return (
                            <a-menu-item key={key}>
                              {
                                t(`smart.table.size.${key}`)
                              }
                            </a-menu-item>
                          )
                        })
                      }
                    </a-menu>
                  </a-dropdown>
                </div>
                <div class="item">
                  <a-tooltip title={t('smart.table.refreshTooltip')} placement="top">
                    <a-icon onClick={this.handleRefresh} style="font-size: 16px;" type="reload" />
                    {/*<a-button size={this.getButtonSize()} onClick={this.handleRefresh} class="right-button" shape="circle" icon="reload"/>*/}
                  </a-tooltip>
                </div>
                {/*<a-tooltip title="列显示" placement="top">*/}
                {/*  <a-button size={this.getButtonSize()} onClick={() => { this.columnVisibleDialogVisible = true }} class="right-button" shape="circle" icon="appstore"/>*/}
                {/*</a-tooltip>*/}
                <div class="item">
                  <a-tooltip title={this.handleT('smart.table.searchTooltip')} placement="top">
                    <a-icon
                      style="font-size: 16px;"
                      onClick={() => {
                        this.searchDivVisible = !this.searchDivVisible
                      }}
                      type="search"/>
                  </a-tooltip>
                </div>
              </div>
            ): ''
          }
        </div>
      ) : ''
    },
    /**
     * 渲染表格
     */
    renderTable () {
      return (
        <s-table
          {...{
            attrs: this.$attrs,
            on: {
              ...this.$listeners,
              change: this.handleChange
            },
            scopedSlots: this.createTableScopeSlots()
          }}
          loading={this.tableLoading}
          size={this.setTableSize || this.size}
          pagination={false}
          keys={this.keys}
          dataSource={this.tableData}
          columns={this.tableColumns}
          rowKey={this.computedRowKey}
          rowSelection={this.computedRowSelection}/>
      )
    },
    /**
     * 渲染添加修改弹窗
     */
    renderAddEditModal () {
      const { addEditModalProps, addEditDialog: { isAdd }, tableName } = this
      // 获取自定义的props
      const props = addEditModalProps ? addEditModalProps.call(this, { isAdd, tableName }) : {}
      const modalProps = {
        props: {
          width: 700,
          title: '保存/修改',
          ...props
        },
        on: {
          cancel: () => {
            this.addEditDialog.visible = false
          }
        }
      }

      return (
        <a-modal
          {
            ...modalProps
          }
          visible={this.addEditDialog.visible}>
          <s-form
            {...{
              scopedSlots: this.createAddEditScopeSlots()
            }}
            onBeforeMount={this.handleAddEditFormCreate}
            layout={this.addEditFormlayout}
            defaultSpan={this.addEditFormSpan}
            ref="addEditForm"
            columns={this.addEditFormColumns}>
          </s-form>
          <template slot="footer">
            {
              this.createAddEditSlot()
            }
          </template>
        </a-modal>
      )
    },
    /**
     * 渲染分页器
     */
    renderPagination () {
      if (this.pagination === false) {
        return  ''
      }
      return (
        <a-pagination
          class={this.computedPaginationClass}
          onChange={this.handlePaginationChange}
          showSizeChanger={this.computedPagination.showSizeChanger}
          defaultPageSize={this.pageData.pageSize}
          current={this.pageData.page}
          onShowSizeChange={this.handleShowSizeChange}
          total={this.pageData.total}
        />
      )
    },
    /**
     * 分页改变时触发
     * @param page
     * @param pageSize
     */
    handlePaginationChange (page, pageSize) {
      this.pageData = { ...this.pageData, page, pageSize }
    },
    /**
     * 分页大小改变时触发
     * @param current
     * @param size
     */
    handleShowSizeChange (current, size) {
      this.pageData = { ...this.pageData, page: 1, pageSize: size }
    },
    /**
     *  创建添加修改弹窗插槽
     */
    createAddEditScopeSlots () {
      const scopeSlots = {}
      Object.keys(this.computedAddEditFormSolts).forEach(key => {
        const value = this.computedAddEditFormSolts[key]
        scopeSlots[value] = ({column, model}) => {
          return this.$scopedSlots[key]({ column, model })
        }
      })
      return scopeSlots
    },
    /**
     * 创建添加修改弹窗slot
     */
    createAddEditSlot () {
      return [
        (
          <a-button key="back" onClick={() => {this.addEditDialog.visible = false}}>取消</a-button>
        ),
        (
          <a-button
            type="primary"
            onClick={this.handleSaveUpdate}
            loading={this.addEditDialog.loading}
            key="submit">确定</a-button>
        )
      ]
    },
    /**
     * 创建表格插槽
     */
    createTableScopeSlots () {
      const { tableScopedSlots, hasOpreaColumn, $scopedSlots } = this
      const scopeSlots = {}
      tableScopedSlots.forEach(item => {
        scopeSlots[item] = (text, record, index) => {
          return $scopedSlots[item]({ text, record, index })
        }
      })
      // 添加表格自身插槽
      Object.keys($scopedSlots).forEach(key => {
        if (key.startsWith(SLOTS_PREFIX.table) && !scopeSlots[key]) {
          scopeSlots[key.substring(SLOTS_PREFIX.table.length)] = $scopedSlots[key]
        }
      })
      // 添加操作列插槽
      if (hasOpreaColumn) {
        scopeSlots[OPERATION_SLOT_NAME] = (text, record, index) => {
          // 合计列显示NA
          if (record.isSummary === true) {
            return [
              <span>N/A</span>
            ]
          }
          const vnodes = []
          if (this.computedDefaultButtonShow.add.row === true) {
            vnodes.push(
              <a-tooltip placement="top" title={t('smart.table.addButtonText')}>
                <a-button
                  type={this.rowAddButtonType}
                  size="small"
                  style="width: 50px; margin-right: 5px"
                  onClick={() => { this.handleBeforeAdd(record) }}
                  icon={this.textRowButton ? '' : 'plus'}>{this.rowAddButtonText}</a-button>
              </a-tooltip>
            )
          }
          if (this.computedDefaultButtonShow.edit.row === true) {
            vnodes.push(
              <a-tooltip placement="top" title={t('smart.table.editButtonText')}>
                <a-button
                  type={this.rowEditButtonType}
                  size="small"
                  style="width: 50px; margin-right: 5px"
                  onClick={() => { this.handleBeforeEdit(record) }}
                  icon={this.textRowButton ? '' : 'edit'}>{this.rowEditButtonText}</a-button>
              </a-tooltip>
            )
          }
          if (this.computedDefaultButtonShow.delete.row === true) {
            vnodes.push(
              <a-tooltip placement="top" title={t('smart.table.deleteButtonText')}>
                <a-button
                  type={this.rowDeleteButtonType}
                  size="small"
                  style="width: 50px;"
                  onClick={() => { this.handleDelete(record) }}
                  icon={this.textRowButton ? '' : 'delete'}>{this.rowDeleteButtonText}</a-button>
              </a-tooltip>
            )
          }
          if (this.$scopedSlots['row-operation']) {
            vnodes.push(this.$scopedSlots['row-operation']({ text, record, index }))
          }
          return vnodes
        }
      }
      return scopeSlots;
    },
    /**
     * 创建搜索form ScopeSlots
     */
    createSearchFormScopeSlots () {
      const scopeSlots = {}
      Object.keys(this.computedSearchSolts).forEach(key => {
        const value = this.computedSearchSolts[key]
        scopeSlots[value] = ({ column, model }) => {
          return this.$scopedSlots[key]({ column, model })
        }
      })
      return scopeSlots
    },
    /**
     * 创建搜索form slots
     */
    createSearchFormSlots () {
      return <div style={this.rightSearchButton ? 'float: right' : ''} class="search-button">
        <a-form-item>
          <a-button
            class="smart-button-common-space"
            icon="search"
            size={this.getButtonSize()}
            onClick={this.handleSearch}
            type="primary">
            {t('smart.common.search')}
          </a-button>
          <a-button
            icon="undo"
            size={this.getButtonSize()}
            onClick={this.handleRestSearch}>
            {t('smart.common.reset')}
          </a-button>
        </a-form-item>
      </div>
    },
    renderTableAlert () {
      return this.$slots['table-alert']
    },
  },
  /**
   * 渲染函数
   * @param h
   */
  render (h) {
    return (
      <div class="vue-ant-table">
        {
          // 渲染搜索div
          this.renderSearch()
        }
        {
          // 渲染操作组
          this.renderButtonGroup()
        }
        {
          // 渲染表格alert
          this.renderTableAlert()
        }
        {
          // 渲染表格
          this.renderTable()
        }
        {
          // 渲染分页器
          this.renderPagination()
        }
        {
          // 渲染添加修改弹窗
          this.renderAddEditModal()
        }
      </div>
    )
  }
}
