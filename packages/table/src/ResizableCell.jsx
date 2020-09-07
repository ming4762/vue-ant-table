import vue from 'vue'
import VueDraggableResizable from 'vue-draggable-resizable'

const Vue = vue || window.Vue

/**
 * 可伸缩列组件
 * @author shizhongming
 */
export default (columns, handler) => {
  const draggingMap = {}
  columns.forEach(col => {
    draggingMap[col.key] = col.width
  })

  const draggingState = Vue.observable(draggingMap)
  return (h, props, children) => {
    let thDom = null
    const { key, ...restProps } = props
    const col = columns.find(col => {
      const k = col.dataIndex || col.key
      return k === key
    })
    if (!col) {
      return <th {...restProps}>{children}</th>
    }
    if (!col.width) {
      return <th {...restProps}>{children}</th>
    }

    const onDrag = x => {
      draggingState[key] = 0
      handler(col.key, Math.max(x, 1))
    }

    const onDragstop = () => {
      draggingState[key] = thDom.getBoundingClientRect().width
    }
    return (
      <th {...restProps} v-ant-ref={r => (thDom = r)} width={col.width} class="resize-table-th">
        {children}
        <VueDraggableResizable
          key={col.key}
          class="table-draggable-handle"
          w={10}
          x={draggingState[key] || col.width}
          z={1}
          axis="x"
          draggable={true}
          resizable={false}
          onDragging={onDrag}
          onDragstop={onDragstop}
        />
      </th>
    )
  }
}
