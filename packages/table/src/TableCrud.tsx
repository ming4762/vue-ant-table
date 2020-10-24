import { defineComponent, PropType, computed, watch, reactive, ref } from 'vue'

import {
  CrudUrl,
  CrudSearch,
  ButtonConfig,
  TableColumn,
  Sort,
  AddEditForm,
  CommonColumn,
  TableBaseColumn,
  SearchColumn,
  FormColumn,
  TableShowConfig
} from '../../utils/types/Types'

import SearchRender from './SearchRender'

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

/**
 * 列转换数据
 */
interface ColumnsConvertData {
  searchSymbol: {[index: string]: string};
  tableColumns: Array<TableBaseColumn>;
  searchColumns: Array<SearchColumn>;
  addEditFormColumns: Array<FormColumn>;
  columnConfig: {[index: string]: TableShowConfig};
  tableSlots: Array<string>;
}

/**
 * 转换列信息
 * @param columns
 * @param hasOperaColumn
 * @param operaColumnWidth
 */
const convertColumns = (columns: Array<TableColumn>, hasOperaColumn: boolean, operaColumnWidth: number): ColumnsConvertData => {
  console.log('ddddd')

  const scopedSlotsProperty = 'slots'
  const customRenderProperty = 'customRender'
  // 存储搜索符号
  const searchSymbol: {[index: string]: string} = {}
  // 表格配置
  const tableColumns: Array<TableBaseColumn> = []
  // 搜索表单配置
  const searchColumns: Array<SearchColumn> = []
  // 添加修改form columns
  const addEditFormColumns: Array<FormColumn> = []
  // 表格插槽
  const tableSlots: Array<string> = []
  // 列配置信息
  const columnConfig: {[index: string]: TableShowConfig} = {}

  columns.forEach(item => {
    // 设置key
    if (!item.key) {
      item.key = item.prop
    }
    // 通用列
    const commonColumn: CommonColumn = {
      key: item.key,
      label: item.label,
      prop: item.prop,
      type: item.type
    }
    // 处理表格列
    const tableCustom: TableBaseColumn = Object.assign({
      key: item.key,
      prop: item.key,
      dataIndex: item.prop,
      title: item.label,
      visible: true,
      fixed: false
    }, item.table || {})
    tableColumns.push(tableCustom)

    // 处理搜索
    if (item.search) {
      searchColumns.push(Object.assign({}, commonColumn, item.search))
      searchSymbol[item.key] = item.search.symbol || '='
    }
    // 添加修改FORM处理
    addEditFormColumns.push(Object.assign({}, commonColumn, item.form))

    // 处理表格插槽
    if (Object.prototype.hasOwnProperty.call(tableCustom, scopedSlotsProperty) && Object.prototype.hasOwnProperty.call(tableCustom[scopedSlotsProperty], customRenderProperty)) {
      const slots: any = tableCustom[scopedSlotsProperty]
      const value = slots[customRenderProperty]
      if (tableSlots.indexOf(value) === -1) {
        tableSlots.push(slots[customRenderProperty])
      }
    }
    // 处理列显示隐藏配置
    const { config, visible, fixed } = tableCustom
    const { key, label } = item
    if (config !== false) {
      columnConfig[item.key] = {
        key: key,
        label: label!,
        visible: visible!,
        fixed: fixed!
      }
    }
    // 添加操作列
    if (hasOperaColumn) {
      tableColumns.push({
        prop: OPERATION_SLOT_NAME,
        key: OPERATION_SLOT_NAME,
        title: '操作',
        fixed: 'right',
        align: 'center',
        width: operaColumnWidth,
        slots: { customRender: OPERATION_SLOT_NAME }
      })
    }
  })

  return {
    searchSymbol,
    tableColumns,
    searchColumns,
    addEditFormColumns,
    columnConfig,
    tableSlots
  }
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
    opreaColumnWidth: {
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
      default: BUTTON_SIZE.small
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
  setup (props, { slots }) {
    const columnsConvertData = ref<ColumnsConvertData>(convertColumns(props.columns, props.hasOperaColumn, props.opreaColumnWidth))
    // 转换列信息
    const doConvertColumns = () => {
      columnsConvertData.value = convertColumns(props.columns, props.hasOperaColumn, props.opreaColumnWidth)
    }
    const computedOperaColumn = computed(() => props.hasOperaColumn.toString() + props.opreaColumnWidth)
    watch(props.columns, doConvertColumns, {
      deep: true
    })
    watch(computedOperaColumn, doConvertColumns)
    // 获取搜索
    const searchRender = SearchRender(props.search, columnsConvertData.value.searchColumns, slots)
    return {
      ...searchRender,
      columnsConvertData
    }
  },
  methods: {
  },
  render () {
    return (
      <div class="vue-ant-table">
        {
          // 渲染搜索div
          this.renderSearch()
        }
      </div>
    )
  }
})
