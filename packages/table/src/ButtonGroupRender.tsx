import { Slots } from 'vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'

import {
  ButtonGroupRenderParameter
} from '../../utils/types/Types'

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
 * 按钮左侧插槽
 */
const SLOT_BUTTON_LEFT = 'button-left'

/**
 * 获取按钮尺寸
 * @param size
 */
function getButtonSize (size: string) {
  return size === BUTTON_SIZE.middle ? BUTTON_SIZE.default : size
}

/**
 * 渲染左侧按钮
 * @param parameter
 * @param t
 */
const renderLeftButton = (parameter: ButtonGroupRenderParameter, t: Function, slots: Slots) => {
  const noInGroupClass = parameter.leftButtonInGroup ? '' : 'smart-button-common-space'
  const vnodes: Array<any> = []
  const buttonShow = parameter.buttonShow
  const add = buttonShow.value.add
  if (add.top) {
    vnodes.push(
      <a-button
        class={noInGroupClass}
        size={getButtonSize(parameter.size)}
        type="primary">
        <PlusOutlined/>
        {t('smart.table.addButtonText')}
      </a-button>
    )
  }
  // 删除按钮
  if (buttonShow.value.delete.top) {
    vnodes.push(
      <a-button
        className={noInGroupClass}
        size={getButtonSize(parameter.size)}
        type="danger">
        <DeleteOutlined/>
        {t('smart.table.deleteButtonText')}
      </a-button>
    )
  }
  const buttonLeftSlot = slots[SLOT_BUTTON_LEFT]
  if (buttonLeftSlot) {
    vnodes.push(buttonLeftSlot())
  }
  // 处理插槽
  return vnodes
}

/**
 * 渲染按钮组
 */
export default function buttonGroupRender (parameter: ButtonGroupRenderParameter, t: Function, slots: Slots) {
  // 编写渲染函数
  const renderButtonGroup = () => {
    if (!parameter.hasLeftButton && !parameter.hasRightButton) {
      return ''
    }
    return (
      <div class="button-group-container">
        {
          // 渲染左侧按钮组
          parameter.hasLeftButton ? (
            <div class="button-group-left">
              {
                parameter.leftButtonInGroup ? (
                  <a-button-group>
                    {
                      // 渲染左侧按钮
                      renderLeftButton(parameter, t, slots)
                    }
                  </a-button-group>
                ) : renderLeftButton(parameter, t, slots)
              }
            </div>
          ) : ''
        }
        {
          // 渲染右侧按钮
          parameter.hasRightButton ? (
            <div class="button-group-right">
              <div class="item">
                <a-tooltip title={t('smart.table.columnConfig.tooltip')} placement="top">
                  <div>
                    abc
                  </div>
                </a-tooltip>
              </div>
            </div>
          ) : ''
        }
      </div>
    )
  }

  return {
    renderButtonGroup
  }
}
