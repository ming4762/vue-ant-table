import { t } from '../../../src/locale'
import '../../style/columnConfig.scss'

/**
 * 列配置信息
 * @type {{LEFT: string, RIGHT: string, NONE: string}}
 */
const COLUMN_FIXED = {
  LEFT: 'left',
  RIGHT: 'right',
  NONE: 'none'
}

/**
 * 列显示隐藏组件
 */
export default {
  name: 'TableColumnConfig',
  props: {
    config: {
      required: true
    }
  },
  data () {
    return {
      optionShowConfig: {},
      // 显示配置信息
      showConfig: {},
      // 列冻结配置
      fixedConfig: {}
    }
  },
  beforeMount () {
    this.defaultConfig()
  },
  computed: {
    /**
     * 全部是否选中计算属性
     * @returns {boolean}
     */
    computedAllChecked () {
      return Object.keys(this.showConfig).every(columnKey => {
        return this.showConfig[columnKey]
      })
    },
    /**
     * 是否部分选中计算属性
     * @returns {boolean|boolean}
     */
    computedAllIndeterminate () {
      const indeterminate = Object.keys(this.showConfig).some(columnKey => {
        return this.showConfig[columnKey]
      })
      return !this.computedAllChecked && indeterminate
    },
    /**
     * config配置列表计算属性
     * 根据fixed不同调整顺序
     */
    computendConfigList () {
      const leftList = []
      const centerList = []
      const rightList = []
      Object.keys(this.config).forEach(key => {
        const columnConfig = this.config[key]
        const fixed = this.fixedConfig[key]
        const column = {
          ...columnConfig,
          fixed: fixed
        }
        switch (fixed) {
          case COLUMN_FIXED.LEFT:
            leftList.push(column)
            break
          case COLUMN_FIXED.NONE:
            centerList.push(column)
            break
          default:
            rightList.push(column)
        }
      })
      return { leftList, centerList, rightList }
    }
  },
  methods: {
    /**
     * 列显示触发事件
     */
    handleShowChangeEvent () {
      this.$emit('columnShowChange', this.showConfig)
    },
    defaultConfig () {
      Object.keys(this.config).forEach(key => {
        const { visible, fixed } = this.config[key]
        // 设置列显示信息
        this.$set(this.showConfig, key, visible)
        // 设置列冻结信息
        let fixedValue = fixed || COLUMN_FIXED.NONE
        if (fixedValue === true) {
          fixedValue = COLUMN_FIXED.LEFT
        }
        this.$set(this.fixedConfig, key, fixedValue)
      })
    },
    /**
     * 重置
     */
    handleReset () {
      console.log('开发中')
    },
    /**
     * 固定列
     * @param key
     * @param ident
     */
    handleFixed (key, ident) {
      this.fixedConfig[key] = this.fixedConfig[key] === ident ? COLUMN_FIXED.NONE : ident
      this.$emit('columnFixedChange', this.fixedConfig)
    },
    /**
     * 点击表体的全选/全取消
     */
    handleAllChange (e) {
      const allCheck = e.target.checked
      Object.keys(this.showConfig).forEach(columnKey => {
        this.showConfig[columnKey] = allCheck
      })
      this.handleShowChangeEvent()
    },
    handleMouseLeave (key) {
      this.$set(this.optionShowConfig, key, false)
    },
    handleMouseEnter (key) {
      this.$set(this.optionShowConfig, key, true)
    },
    /**
     * 列显示改变
     */
    handleColumnShowChange (columnKey) {
      this.showConfig[columnKey] = !this.showConfig[columnKey]
      this.handleShowChangeEvent()
    },
    /**
     * 渲染标题
     * @returns {*}
     */
    renderTitle () {
      return (
        <div class="column-config-title">
          <a-checkbox
            indeterminate={this.computedAllIndeterminate}
            checked={this.computedAllChecked}
            onChange={this.handleAllChange}>{t('smart.table.columnConfig.title')}</a-checkbox>
          <a onClick={this.handleReset}>{t('smart.common.reset')}</a>
        </div>
      )
    },
    renderContentItem ({ key, label, fixed }) {
      const { optionShowConfig } = this
      return (
        <div
          onMouseleave={() => this.handleMouseLeave(key)}
          onMouseenter={() => this.handleMouseEnter(key)}>
          <a-checkbox
            onChange={() => this.handleColumnShowChange(key)}
            checked={this.showConfig[key]}>
            {label}
          </a-checkbox>
          <span v-show={optionShowConfig[key] === true} class="option">
            <a-tooltip placement="top" title={t(`smart.table.columnConfig.${fixed === COLUMN_FIXED.LEFT ? 'cancelFiexd' : 'fixedLeft'}`)}>
              <a-icon onClick={() => this.handleFixed(key, COLUMN_FIXED.LEFT)} style="transform: rotate(-90deg)" type={fixed === 'left' ? 'vertical-align-middle' : 'pushpin'}/>
            </a-tooltip>
            <a-tooltip placement="top" title={t(`smart.table.columnConfig.${fixed === COLUMN_FIXED.RIGHT ? 'cancelFiexd' : 'fixedRight'}`)}>
              <a-icon onClick={() => this.handleFixed(key, COLUMN_FIXED.RIGHT)} class="right" type={fixed === 'right' ? 'vertical-align-middle' : 'pushpin'}/>
            </a-tooltip>
          </span>
        </div>
      )
    },
    /**
     * 渲染内容表体
     * @param title
     */
    renderContentTitle (title) {
      return (
        <span class="content-title">{title}</span>
      )
    },
    /**
     * 渲染内容
     * @returns {*}
     */
    renderContent () {
      const { leftList, centerList, rightList } = this.computendConfigList
      return (
        <div class="ant-config-content">
          {
            leftList.length > 0 ? this.renderContentTitle(t('smart.table.columnConfig.fixedInLeft')) : ''
          }
          {
            // 遍历左侧
            leftList.map(column => {
              return this.renderContentItem(column)
            })
          }
          {
            ((leftList.length > 0 || rightList.length > 0) && centerList.length > 0) ? this.renderContentTitle(t('smart.table.columnConfig.noFixed')) : ''
          }
          {
            // 遍历未冻结
            centerList.map(column => {
              return this.renderContentItem(column)
            })
          }
          {
            rightList.length > 0 ? this.renderContentTitle(t('smart.table.columnConfig.fixedInRight')) : ''
          }
          {
            // 遍历右侧
            rightList.map(column => {
              return this.renderContentItem(column)
            })
          }
        </div>
      )
    }
  },
  render (h) {
    return (
      <a-popover
        trigger="click">
        <a-icon style="font-size: 16px;" type="setting"/>
        <template slot="title">
          {
            this.renderTitle()
          }
        </template>
        <template slot="content">
          {
            this.renderContent()
          }
        </template>
      </a-popover>
    )
  }
}
