/**
 * form 项
 */
export declare interface FormColumn {
  key: string;
  prop: string;
  label?: string;
  type: string;
  disabled: boolean;
  rules: boolean | object;
  dict?: Array<object>;
  placeholder?: string;
  visible?: boolean;
  span?: number;
  props?: object;
}
