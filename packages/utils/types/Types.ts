export declare interface CommonColumn {
  key: string;
  prop: string;
  label?: string;
  type?: string;
}

/**
 * 基础表格配置
 */
export declare interface FormBaseColumn {
  visible?: boolean;
  span?: number;
  rules: boolean | object | Array<object>;
  placeholder?: string;
  disabled: boolean;
  dict?: Array<object>;
  props?: object;
}

/**
 * form 项
 */
export declare interface FormColumn extends CommonColumn, FormBaseColumn {
}

/**
 * 搜索项配置
 */
export declare interface SearchColumn {
  symbol?: string
}

export declare interface TableBaseColumn extends CommonColumn {
  width?: number;
  title?: string;
  fixed?: boolean | string;
  align?: string;
  slots?: object;
  dataIndex?: string;
  summary?: Function;
  visible?: boolean;
  config?: boolean;
}

/**
 * 表格配置项
 */
export declare interface TableColumn extends CommonColumn {
  table?: {
    visible?: boolean;
    summary?: Function;
    config?: boolean;
  };
  form?: FormBaseColumn;
  search?: SearchColumn
}

export declare interface ButtonConfigItem {
  // 行是否显示
  rowShow?: boolean;
  // 顶部按钮组是否显示
  topShow?: boolean;
  // 按钮所需权限
  permission?: string;
}

/**
 * 按钮配置
 */
export declare interface ButtonConfig {
  // 添加按钮配置
  add?: ButtonConfigItem;
  // 编辑按钮配置
  edit?: ButtonConfigItem;
  // 删除按钮配置
  delete?: ButtonConfigItem;
}

/**
 * CRUD URL
 */
export declare interface CrudUrl {
  save?: string;
  update?: string;
  query?: string;
  delete?: string;
  get?: string;
}

/**
 * crud 搜索项配置
 */
export declare interface CrudSearch {
  defaultVisible: boolean;
  withSymbol: boolean;
  // 搜索按钮是否在右侧
  buttonInRight: boolean;
  // 搜索form props
  props: object
}

/**
 * 排序配置
 */
export declare interface Sort {
  // 默认的排序列
  defaultSortColumn?: String;
  // 默认的排序方向
  defaultSortOrder?: String;
}

export declare interface AddEditForm {
  // 添加修改表单布局
  layout: string;
  span: number;
  props?: Function;
}

/**
 * 表格显示配置
 */
export declare interface TableShowConfig {
  key: string;
  label: string;
  visible: boolean;
  fixed: string | boolean;
}

/**
 * 按钮组渲染参数
 */
export declare interface ButtonGroupRenderParameter {
  hasLeftButton: boolean;
  hasRightButton: boolean;
  leftButtonInGroup: boolean;
  buttonShow: ButtonShow;
  size: string;
  t: Function;
}

export declare interface BaseButtonShow {
  row: boolean;
  top: boolean;
}

export declare interface ButtonShow {
  add: BaseButtonShow;
  edit: BaseButtonShow;
  delete: BaseButtonShow;
}

