/**
 * vue工具类
 */
export default class VueUtils {
  static vnode = null

  /**
   * 判断是否是vode对象
   * @param vue
   * @param object
   * @returns {boolean}
   */
  static isVnode (vue, object) {
    if (!this.vnode) {
      this.vnode = vue.$createElement('div').constructor
    }
    return object instanceof this.vnode
  }
}
