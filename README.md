# 组件s-table-crud

## 一、Attributes

参数 | 说明 | 类型 | 可选值 | 默认值
---|---|---|---|---
url | url参数，推荐使用该prop， save/update/query/delete/get | Object 
queryUrl|查询URL|String||
saveUpdateUrl|添加/修改URL|String||
deleteUrl|删除URL|String||
getUrl|查询URL，如果为设置通过queryUrl查询|String||
keys|对应实体类的key（必须）|Array||
apiService|后台请求服务|Function||
data|表格数据，如果存在，则增删改查无效|Array||
tableName|表格名字|String||
opreaColumnWidth|操作列列宽|Number||200
hasOpreaColumn|是否有操作列|Boolean||true
columns|列信息（必选），详见column|Array || true
hasLeftButton|是否有左侧操作列|Boolean ||true
hasRightButton|是否有左侧操作列|Boolean ||true
leftButtonInGroup|左侧按钮是否在按钮组内|Boolean ||true
defaultSearchVisible|搜索栏是否默认显示|Boolean||false
searchWithSymbol|搜索是否添加符号|Boolean||true
queryParameterFormatter|参数格式化函数，参数：参数|Function|
tableDataFormatter | 表格数据格式化函数，参数：tableData | Function
queryHandler|查询执行器，自定义查询，参数（查询url, 参数）|Function
errorHandler|错误执行，参数（错误信息, 错误对象Error）|Function
deleteWarningHandler | 删除警告语回调函数，参数：删除的列数据 |Function
deleteHandler | 删除执行器，参数(删除URL，删除的key列表，删除的数据列表)，返回promise|Function
saveUpdateFormatter|添加/修改格式化工具，参数(addEditModel，add/edit)|Function
saveUpdateHandler|添加修改执行器，参数（saveUpdateUrl,model,add/edit）| Function
tableIndex|是否显示序号列|Boolean/object | | false
rowSelection| 选中列配置，参考ant配置，不支持onChange，需要onChange请手动监听| Object
defaultButtonConfig | 默认按钮配置，详见defaultButtonConfig| Object
permissions | 用户权限列表| Array
defaultSortColumn|默认的排序列，以逗号分页|String
defaultSortOrder|默认的排序方向，以逗号分页，默认asc|String
textRowButton|是否使用文字按钮| Boolean || false
showSummary|是否显示合计行 | Boolean | false
sumText | 合计行第一列文字 | String | 合计
summaryMethod | 自定义的合计算法，参数(当前表格数据、表格列信息) | Function
addEditFormlayout| 添加修改表单布局 | String | inline，vertical，horizontal | horizontal
addEditModalProps| 添加修改弹窗自定义函数,参数{ isAdd, tableName }，返回值{props: ModalProps, on: {}} |Function
resizable | 是否启用可伸缩列 | Boolean | | false
searchFormProps | 搜索form 自定义props | Object
addEditFormSpan | 添加搜索表单默认的span | number

## 二、Scoped Slot
> 支持antd table组件原生插槽，使用 table-插槽名 

name | 说明 | 参数
---|---|---
row-operation|行操作列插槽|text：当前行内容，record：当前行数据内容，index：当前行序号
button-left|顶部左侧插槽|
form-{key}| 添加搜索表格插槽 | {column: 列信息， model：form数据绑定}
search-{key} | 搜索form插槽| {column: 列信息， model：form数据绑定}

## 三、EVENT

name | 说明 | 参数
---|---|---
before-load | 数据加载前事件|
selected-change | 选中列变化触发 | selectedRowKeys, selectedRows
after-delete | 删除数据后触发 | 删除操作后台返回结果
before-add | 执行添加操作前触发 | 添加表单信息
before-edit | 执行编辑前触发 | 编辑表单信息
add-edit-dialog-show | 添加修改弹窗打开时触发| ident：标识添加/修改，表单项，callBack回调函数（表单model）， row：当前编辑行
change | 表格change事件，参考ant使用说明


## 四、defaultButtonConfig
> 对象的key包括 add、edit、delete

name | 说明 | 默认值
---|---|---
rowShow | 行按钮是否显示 | add: fasle，其他true
topShow | 顶部按钮是否显示| true
permission| 按钮所需权限| 

## 五、column

> crud表格列数据描述对象，是 columns 中的一项，Column 使用相同的 API。


参数 | 说明 | 类型 | 可选值 | 默认值
---|---|---|---|---
key | 表格项的key，如未设置默认为prop的值 | String|
prop | 表格数据列，必须| String
label | 表格列标题 | String
type | 列类型，修改类型会影响添加修改弹窗配置 | String |  boolean，number，input，textarea,timePicker,monthPicker,datePicker,datetimePicker,radio,radioButton,select,slider,rate | input
table | 表格描述列， 参考Table配置 | Object
form | 添加修改弹窗form配置，参考Form | Object
search | 搜索form配置，参考SearchForm | Object

### Table

> crud表格table列描述
> 支持ant-table原有配置

参数 | 说明 | 类型 | 可选值 | 默认值
---|---|---|---|---
visible | 是否显示该列 | Boolean
summary | 自定义合计内容，参数（列内容数组、列信息、表格数据） | Function
config | 是否支持列显示隐藏配置 | boolean | | true

### form
> form配置

参数 | 说明 | 类型 | 可选值 | 默认值
---|---|---|---|---
visible | 是否显示 | Boolean
rules | 表格校验规则，设置true是否默认校验规则 | Boolean | Object
span | 栅格分布列占据的宽度 ，参考Grid组件| Number |  |  24
defaultValue | 默认值 | any


### search
> 搜索form配置
> 支持form配置

参数 | 说明 | 类型 | 可选值 | 默认值
---|---|---|---|---
symbol | 搜索符号，搜索参数传到后台格式为 columnKey@symbol | String|=,like,>,>=,<>,<,<=,in,notLike,likeLeft,likeRight,notIn,groupBy|

## 使用说明

#### 1.合计行使用说明
> 将show-summary设置为true就会在表格尾部展示合计行。默认情况下，对于合计行，第一列不进行数据求合操作，而是显示「合计」二字（可通过sum-text配置），其余列会将本列所有数值进行求合操作，并显示出来，当然，你也可以定义自己的合计逻辑。使用summary-method并传入一个方法。
> 对于合计行数据会带有一个属性
