import { TableColumn, TableBaseColumn } from '../../utils/types/Types'

/**
 * 默认合计方法
 * @param columns
 * @param showIndex
 * @param sumText
 * @param dataSource
 * @param keys
 */
const defaultSummaryMethod = (columns: Array<TableBaseColumn>, showIndex: boolean, sumText: string, dataSource: Array<any>, keys: Array<string>): {[index: string]: any} => {
  const summaryData: {[index: string]: any} = {}
  let summaryTextIndex = 0
  for (const [index, column] of columns.entries()) {
    const { dataIndex, summary } = column
    const dataIndex2 = dataIndex!
    // 序号列处理
    if (showIndex && index === 1) {
      summaryTextIndex = 1
      continue
    }
    // 合计文字
    if (index === summaryTextIndex) {
      summaryData[dataIndex2] = sumText
      continue
    }
    const values = dataSource.map(item => item[dataIndex2])
    if (summary) {
      summaryData[dataIndex2] = summary(values, column, dataSource)
      continue
    }
    const numberValues = values.map(item => Number(item))
    if (!numberValues.every(value => isNaN(value))) {
      summaryData[dataIndex2] = numberValues.reduce((prev, curr) => {
        const value = Number(curr)
        if (!isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)
    }
    // 设置该列是summary数据
    summaryData.isSummary = true
    keys.forEach(key => {
      summaryData[key] = new Date().getTime()
    })
    return summaryData
  }
  return summaryData
}

/**
 * 表格合计处理
 * @param showSummary
 * @param summaryMethod 合计方法
 * @param dataSource 数据源
 * @param columns
 * @param sumText
 * @param showIndex
 * @param keys
 */
export default function createTableSummary (showSummary: boolean, summaryMethod: Function | undefined, dataSource: Array<any>, columns: Array<TableBaseColumn>, sumText: string, showIndex: boolean, keys: Array<string>): {[index: string]: any} {
  if (summaryMethod) {
    return summaryMethod(dataSource, columns)
  }
  // 执行默认的合计内容
  return defaultSummaryMethod(columns, showIndex, sumText, dataSource, keys)
}
