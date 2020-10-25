import { defineComponent, PropType, computed, watch, ref, onMounted } from 'vue'

import {
  CrudUrl,
  CrudSearch,
  ButtonConfig,
  TableColumn,
  Sort,
  AddEditForm,
  TableBaseColumn,
  SearchColumn,
  FormColumn,
  TableShowConfig,
  ButtonShow,
  ButtonConfigItem
} from '../../utils/types/Types'

import '../../style/table.scss'
import { t } from '../../../src/locale'

import SearchRender from './SearchRender'

import ButtonGroupRender from './ButtonGroupRender'

import { TableLoad, convertColumns, OPERATION_SLOT_NAME } from './TableUtils'

/**
 * 插槽前缀
 * @type {{table: string}}
 */
const SLOTS_PREFIX = {
  table: 'table-'
}

/**
 * 按钮尺寸
 * @type {{default: string, middle: string}}
 */
const BUTTON_SIZE = Object.freeze({
  default: 'default',
  middle: 'middle',
  small: 'small'
})

/**
 * 验证权限
 */
const validatePermission = (permission: string | null | undefined, permissions: Array<string> | null | undefined) => {
  if (!permissions || permission === undefined || permission === null || permission === '') {
    return true
  }
  return permissions.indexOf(permission) !== -1
}

/**
 * 按钮是否显示
 * @param buttonConfig
 * @param topShow
 * @param rowShow
 * @param permissions
 */
const isButtonShow = (buttonConfig: ButtonConfigItem, topShow: boolean, rowShow: boolean, permissions: Array<string> | null | undefined) => {
  // 行按钮处理
  let rowDefault = rowShow
  if (buttonConfig !== undefined && buttonConfig.rowShow !== undefined) {
    rowDefault = buttonConfig.rowShow
  }
  const row = [rowDefault, validatePermission(buttonConfig === undefined ? null : buttonConfig.permission, permissions)]
  // 顶部按钮处理
  let topDefault = topShow
  if (buttonConfig !== undefined && buttonConfig.topShow !== undefined) {
    topDefault = buttonConfig.topShow
  }
  const top = [topDefault, validatePermission(buttonConfig === undefined ? null : buttonConfig.permission, permissions)]

  return [top[0] && top[1], row[0] && row[1]]
}

/**
 * s-table-crud 组件
 * @author shizhongming
 * @since 2.0
 * 2020-10-07 11:09
 */
export default defineComponent({
  name: 'STableCrud',
  props: {
    url: {
      type: Object as PropType<CrudUrl>,
      default: () => ({})
    },
    keys: {
      type: Array as PropType<Array<string>>,
      required: true
    },
    // 后台请求工具
    apiService: {
      type: Function as PropType<Function>
    },
    // 表格数据
    data: {
      type: Array as PropType<Array<any>>
    },
    // 表格名称
    tableName: {
      type: String as PropType<string>,
      default: ''
    },
    // 搜索配置
    search: {
      type: Object as PropType<CrudSearch>,
      default: (): CrudSearch => ({
        defaultVisible: false,
        withSymbol: true,
        buttonInRight: false,
        props: {}
      })
    },
    // 操作列宽度
    operaColumnWidth: {
      type: Number as PropType<number>,
      default: 200
    },
    defaultButtonConfig: {
      type: Object as PropType<ButtonConfig>
    },
    // 是否有操作列
    hasOperaColumn: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    // 列信息
    columns: {
      type: Array as PropType<Array<TableColumn>>,
      required: true
    },
    // 是否有左侧操作按钮
    hasLeftButton: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    // 是否有右侧按钮
    hasRightButton: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    // 左侧按钮是否在按钮组内
    leftButtonInGroup: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    // 行按钮是否是text类型
    textRowButton: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    // 参数格式化函数
    queryParameterFormatter: Function as PropType<Function>,
    // 查询执行器
    queryHandler: Function as PropType<Function>,
    // 数据格式化函数
    tableDataFormatter: Function as PropType<Function>,
    // 错误执行器
    errorHandler: Function as PropType<Function>,
    // 删除警告语毁掉
    deleteWarningHandler: Function as PropType<Function>,
    // 删除执行器
    deleteHandler: Function as PropType<Function>,
    // 添加修改格式化工具
    saveUpdateFormatter: Function as PropType<Function>,
    // 添加修改执行器
    saveUpdateHandler: Function as PropType<Function>,
    rowSelection: Object,
    // 用户权限信息
    permissions: {
      type: Array as PropType<Array<string>>,
      default: () => ([])
    },
    size: {
      type: String as PropType<string>,
      default: BUTTON_SIZE.default
    },
    // 分页配置
    pagination: [Object, Boolean],
    // 排序信息
    sort: {
      type: Object as PropType<Sort>
    },
    // 编辑form配置
    editForm: {
      type: Object as PropType<AddEditForm>,
      default: {
        layout: 'horizontal',
        span: 24
      }
    }
  },
  data () {
    return {
      // 行添加按钮样式
      rowAddButtonType: this.textRowButton === true ? 'link' : '',
      rowAddButtonText: this.textRowButton === true ? t('smart.table.addButtonText') : '',

      // 行编辑按钮样式
      rowEditButtonType: this.textRowButton === true ? 'link' : 'primary',
      rowEditButtonText: this.textRowButton === true ? t('smart.table.editButtonText') : '',

      // 行添加按钮样式
      rowDeleteButtonType: this.textRowButton === true ? 'link' : 'danger',
      rowDeleteButtonText: this.textRowButton === true ? t('smart.table.deleteButtonText') : '',
      selectedRow: null
    }
  },
  setup (props, { slots, emit }) {
    // 错误执行器
    const errorHandler = (message: string, error: any) => {
      console.error(message)
      console.error(error)
    }

    const searchSymbol = ref<{[index: string]: string}>({})
    const tableColumns = ref<Array<TableBaseColumn>>([])
    const searchColumns = ref<Array<SearchColumn>>([])
    const addEditFormColumns = ref<Array<FormColumn>>([])
    const tableSlots = ref<Array<string>>([])
    const columnConfig = ref<{[index: string]: TableShowConfig}>({})

    // 转换列信息
    const doConvertColumns = () => {
      const columnsConvertData = convertColumns(props.columns, props.hasOperaColumn, props.operaColumnWidth)
      searchSymbol.value = columnsConvertData.searchSymbol
      tableColumns.value = columnsConvertData.tableColumns
      searchColumns.value = columnsConvertData.searchColumns
      addEditFormColumns.value = columnsConvertData.addEditFormColumns
      tableSlots.value = columnsConvertData.tableSlots
      columnConfig.value = columnsConvertData.columnConfig
    }
    // 执行第一次转换
    doConvertColumns()
    const computedOperaColumn = computed(() => props.hasOperaColumn.toString() + props.operaColumnWidth)
    // 监控数据变化，再次执行列转换
    watch(props.columns, doConvertColumns)
    watch(computedOperaColumn, doConvertColumns)

    // 获取搜索
    const searchRender = SearchRender(props.search, searchColumns, slots)

    // 默认按钮显示计算属性
    const computedButtonShow = computed<ButtonShow>(() => {
      const result: ButtonShow = {
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
      const defaultButton = props.defaultButtonConfig || {}
      for (const key of Object.keys(result)) {
        const showConfig = isButtonShow(defaultButton[key], result[key].top, result[key].row, props.permissions)
        result[key].top = showConfig[0]
        result[key].row = showConfig[1]
      }
      return result
    })

    // 按钮组
    const buttonGroupRender = ButtonGroupRender({
      hasLeftButton: props.hasLeftButton,
      hasRightButton: props.hasRightButton,
      leftButtonInGroup: props.leftButtonInGroup,
      buttonShow: computedButtonShow,
      size: props.size
    }, t, slots)

    // 搜索函数
    const tableLoad = TableLoad(props, {
      searchModel: searchRender.searchModel,
      searchSymbol,
      errorHandler,
      t
    })
    // 生命周期钩子加载完毕状态
    onMounted(() => {
      if (!props.data) {
        tableLoad.load()
      } else {
        tableLoad.tableData.value = props.data
      }
    })

    return {
      searchSymbol,
      tableColumns,
      addEditFormColumns,
      tableSlots,
      columnConfig,
      computedButtonShow,
      ...searchRender,
      ...buttonGroupRender,
      ...tableLoad
    }
  },
  methods: {
    /**
     * 添加前操作
     * @param row
     */
    handleBeforeAdd (row = null) {
      if (row) this.selectedRow = row
      // this.handleAddEditDialogShow(ADD, row)
    },
    handleBeforeEdit (row = null) {
      // TODO: 开发中
    },
    handleDelete (row = null) {
      // TODO: 开发中
    },
    createTableSlots () {
      const { tableSlots, hasOperaColumn, $slots } = this
      const slots: {[index: string]: any} = {}
      // 添加表格自身插槽
      Object.keys($slots).forEach(key => {
        if (key.startsWith(SLOTS_PREFIX.table) && !slots[key]) {
          slots[key.substring(SLOTS_PREFIX.table.length)] = $slots[key]
        }
      })
      // 添加操作列插槽
      if (hasOperaColumn) {
        slots[OPERATION_SLOT_NAME] = ({ text, record, index }: any) => {
          // 合计列显示NA
          if (record.isSummary === true) {
            return [
              <span>N/A</span>
            ]
          }
          const vnodes = []
          if (this.computedButtonShow.add.row === true) {
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
          if (this.computedButtonShow.edit.row === true) {
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
          if (this.computedButtonShow.delete.row === true) {
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
          // 处理插槽
          const rowOperation = this.$slots['row-operation']
          if (rowOperation) {
            vnodes.push(rowOperation({ text, record, index }))
          }
          return vnodes
        }
      }
      return slots
    },
    /**
     * 渲染表格
     */
    renderTable () {
      // TODO:待完善
      const props = {
        loading: this.tableLoading,
        pagination: false,
        keys: this.keys,
        dataSource: this.tableData,
        columns: this.tableColumns,
        ...this.$attrs
      }
      return (
        <s-table
          { ...props }
          vSlots={this.createTableSlots()}/>
      )
    }
  },
  watch: {
  },
  render () {
    return (
      <div class="vue-ant-table">
        {
          // 渲染搜索div
          this.renderSearch()
        }
        {
          // 渲染按钮组
          this.renderButtonGroup()
        }
        {
          // 渲染表格
          this.renderTable()
        }
      </div>
    )
  }
})
