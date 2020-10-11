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
