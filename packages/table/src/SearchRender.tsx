import { CrudSearch, SearchColumn } from '../../utils/types/Types'
import { ref, Slots, Slot } from 'vue'

/**
 * 创建插槽
 * @param slots 全部插槽
 */
const createSlots = (slots: Slots) => {
  const result: {[index: string]: Slot} = {}
  Object.keys(slots).forEach(key => {
    if (key.indexOf('search-') === 0) {
      result[key.substring(7)] = ({ column, model }) => {
        return slots[key]!({ column, model })
      }
    }
  })
  return result
}

export default function searchRender (searchParameter: CrudSearch, searchColumns: Array<SearchColumn>, slots: Slots) {
  // 搜索显示
  const searchVisible = ref(searchParameter.defaultVisible)
  if (searchColumns.length === 0) {
    return {
      renderSearch () {
        return ''
      },
      searchVisible
    }
  }
  // 设置搜索props
  const searchFormProps: {[index: string]: any} = Object.assign({}, searchParameter.props)
  // 设置layoutsearchFormProps.hasOwnProperty('defaultSpan')
  if (Object.prototype.hasOwnProperty.call(searchFormProps, 'defaultSpan')) {
    searchFormProps.layout = null
  } else {
    searchFormProps.layout = 'inline'
  }
  // 设置插槽
  searchFormProps.slots = createSlots(slots)
  searchFormProps.columns = [
    {
      prop: 'name',
      label: '姓名'
    }
  ]

  const renderSearch = () => {
    return (
      <div style={{ display: searchVisible.value ? '' : 'none' }}>
        <s-form
          {
            ...searchFormProps
          }
          ref="searchForm">
        </s-form>
      </div>
    )
  }
  return {
    searchVisible,
    renderSearch
  }
}
