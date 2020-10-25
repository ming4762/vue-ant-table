import { CrudSearch, SearchColumn } from '../../utils/types/Types'
import { ref, Slots, Slot, computed, Ref } from 'vue'

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

/**
 * 渲染搜索form
 * @param searchParameter 搜索餐宿
 * @param searchColumns 搜索列
 * @param slots 插槽
 */
export default function searchRender (searchParameter: CrudSearch, searchColumns: Ref<Array<SearchColumn>>, slots: Slots) {
  // 搜索显示
  const searchVisible = ref(searchParameter.defaultVisible)
  // 搜索form
  const searchModel = ref({})
  const computedSearchFormProps = computed(() => {
    const searchFormProps: {[index: string]: any } = Object.assign({}, searchParameter.props)
    // 设置layout search
    if (Object.prototype.hasOwnProperty.call(searchFormProps, 'defaultSpan')) {
      searchFormProps.layout = ''
    } else {
      searchFormProps.layout = 'inline'
    }
    // 设置插槽
    searchFormProps.slots = createSlots(slots)
    searchFormProps.columns = searchColumns.value
    return searchFormProps
  })
  const renderSearch = () => {
    if (computedSearchFormProps.value.columns.length === 0) {
      return ''
    }
    return (
      <div style={{ display: searchVisible.value ? '' : 'none' }}>
        <s-form
          {
            ...computedSearchFormProps.value
          }
          onChange={ (data: any) => {
            searchModel.value = data
          } }
          model={searchModel.value}
          ref="searchForm">
        </s-form>
      </div>
    )
  }

  return {
    renderSearch,
    searchModel
  }
}
