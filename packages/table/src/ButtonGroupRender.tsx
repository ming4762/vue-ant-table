import { ref, VNode } from 'vue'

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
 * 渲染按钮组
 */
export default function buttonGroupRender (parameter: ButtonGroupRenderParameter) {
  // 没有按钮组返回空
  if (!parameter.hasLeftButton&&!parameter.hasRightButton) {
    return {
      renderButtonGroup () {
        return ''
      }
    }
  }
  // 编写渲染函数
  const renderButtonGroup = () => {
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
                      renderLeftButton(parameter)
                    }
                  </a-button-group>
                ) : renderLeftButton(parameter)
              }
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

/**
 * 获取按钮尺寸
 * @param size
 */
function getButtonSize(size: string) {
  return size === BUTTON_SIZE.middle ? BUTTON_SIZE.default : size
}

const renderLeftButton = (parameter: ButtonGroupRenderParameter) => {
  const noInGroupClass = parameter.leftButtonInGroup ? '' : 'smart-button-common-space'
  const vnodes: Array<any> = []
  const buttonShow = parameter.buttonShow;
  const add = buttonShow.add
  const t = parameter.t
  if (add.top) {
    vnodes.push(
      <a-button icon="plus" class={noInGroupClass} size={getButtonSize(parameter.size)}
                type="primary">{t('smart.table.addButtonText')}</a-button>
    )
  }
}

