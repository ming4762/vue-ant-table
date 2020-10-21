import { ref } from 'vue'

import {
  ButtonGroupRenderParameter
} from '../../utils/types/Types'

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

const renderLeftButton = (parameter: ButtonGroupRenderParameter) => {
  const noInGroupClass = parameter.leftButtonInGroup ? '' : 'smart-button-common-space'
  const vnodes = []
}

