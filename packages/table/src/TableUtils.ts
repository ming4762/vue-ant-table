import { ref, Ref, reactive, computed } from 'vue'

import {
  TableLoadMethodParameter,
  TableSort,
  PageData,
  TableColumn,
  TableBaseColumn,
  ColumnsConvertData,
  SearchColumn, FormColumn, TableShowConfig, CommonColumn
} from '../../utils/types/Types'

const OPERATION_SLOT_NAME = 'operation_ming'

/**
 * 获取排序参数
 * @param sortName
 * @param sortOrder
 * @param defaultSortColumn
 */
const getSortParameter = ({ sortName, sortOrder }: TableSort, defaultSortColumn: string | null | undefined) => {
  if (sortName && sortOrder) {
    return { sortName, sortOrder }
  }
  if (defaultSortColumn) {
    return {
      sortName: defaultSortColumn
    }
  }
  return {}
}

/**
 * 创建查询参数
 * @param props
 * @param parameter
 * @param filters
 * @param tableSortData
 * @param pageData
 */
const createQueryParameter = (props: any, parameter: TableLoadMethodParameter, filters: Ref<{[index: string]: string}>, tableSortData: TableSort, pageData: PageData) => {
  let parameters: {[index: string]: any} = {}
  // 设置过滤条件
  if (Object.keys(filters.value).length > 0) {
    parameters.filters = filters.value
  }

  // 处理搜索参数
  const searchModel = parameter.searchModel.value
  if (props.searchWithSymbol) {
    Object.keys(searchModel).forEach(key => {
      const value = searchModel[key]
      const symbol = parameter.searchSymbol.value[key]
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
    ...getSortParameter(tableSortData, props.defaultSortColumn)
  }
  // 添加分页参数
  if (props.pagination !== false) {
    // 添加分页参数
    const { page, pageSize } = pageData
    parameters = {
      ...parameters,
      limit: pageSize,
      offset: (page - 1) * pageSize
    }
  }
  return parameter
}

/**
 * 表格加载方法
 * @constructor
 */
const TableLoad = (props: any, parameter: TableLoadMethodParameter) => {
  // 表格加载状态
  const tableLoading = ref(false)
  // 过滤条件
  const filters = ref({})
  // 排序数据
  const tableSortData = reactive<TableSort>({
    sortName: null,
    sortOrder: null
  })
  // 分页数据
  const pageData = reactive<PageData>({
    page: 1,
    pageSize: 20,
    total: 1
  })

  // 表格数据
  const tableData = ref<Array<any>>([])

  const { t } = parameter

  // 加载函数
  const load = () => {
    const { queryHandler, apiService, url, pagination, tableDataFormatter, queryParameterFormatter } = props
    // 获取参数
    let loadParameter = createQueryParameter(props, parameter, filters, tableSortData, pageData)
    if (queryParameterFormatter) {
      loadParameter = queryParameterFormatter(loadParameter)
    }
    let resultPromise: Promise<any>
    if (queryHandler) {
      resultPromise = queryHandler(url.query, parameter)
    } else {
      if (!apiService) {
        parameter.errorHandler(t('smart.table.noApiService'))
        return false
      }
      resultPromise = apiService.postAjax(url.query, parameter)
    }
    // 启动加载状态
    tableLoading.value = true
    resultPromise.then((data) => {
      let dealData
      if (pagination !== false) {
        const { rows, total } = data
        dealData = rows
        pageData.total = total
      } else {
        dealData = data
      }
      if (tableDataFormatter) {
        // 执行数据格式化函数
        dealData = tableDataFormatter(dealData)
      }
      tableData.value = dealData
    }).catch((error) => {
      parameter.errorHandler(t('smart.table.loadError'), error)
    }).finally(() => {
      tableLoading.value = false
    })
  }

  return {
    tableLoading,
    load,
    tableData
  }
}

/**
 * 转换列信息
 * @param columns
 * @param hasOperaColumn
 * @param operaColumnWidth
 */
const convertColumns = (columns: Array<TableColumn>, hasOperaColumn: boolean, operaColumnWidth: number): ColumnsConvertData => {
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
  })

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

  return {
    searchSymbol,
    tableColumns,
    searchColumns,
    addEditFormColumns,
    columnConfig,
    tableSlots
  }
}

export {
  TableLoad,
  convertColumns,
  OPERATION_SLOT_NAME
}
