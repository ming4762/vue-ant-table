# 组件a-table-crud

## Attributes

参数 | 说明 | 类型 | 可选值 | 默认值
---|---|---|---|---
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
defaultSearchVisible|搜索栏是否默认显示|Boolean||false
searchWithSymbol|搜索是否添加符号|Boolean||true
queryParameterFormatter|参数格式化函数，参数：参数|Function|
queryHandler|查询执行器，自定义查询，参数（查询url, 参数）|Function
errorHandler|错误执行，参数（错误信息, 错误对象Error）|Function
deleteWarningHandler | 删除警告语回调函数，参数：删除的列数据 |Function
deleteHandler | 删除执行器，参数(删除URL，删除的key列表，删除的数据列表)，返回promise|Function
saveUpdateFormatter|添加/修改格式化工具，参数(addEditModel，add/edit)|Function
saveUpdateHandler|添加修改执行器，参数（saveUpdateUrl,model,add/edit）| Function
showIndex|是否显示序号列|Boolean | | true
rowSelection| 选中列配置，参考ant配置，不支持onChange，需要onChange请手动监听| Object
defaultButtonConfig | 默认按钮配置，详见defaultButtonConfig| Object
permissions | 用户权限列表| Array
defaultSortColumn|默认的排序列，以逗号分页|String
defaultSortOrder|默认的排序方向，以逗号分页，默认asc|String
textRowButton|是否使用文字按钮| Boolean || false

## Scoped Slot
name | 说明 | 参数
---|---|---
row-operation|行操作列插槽|text：当前行内容，record：当前行数据内容，index：当前行序号


## defaultButtonConfig
> 对象的key包括 add、edit、delete

name | 说明 | 默认值
---|---|---
row | 行按钮是否显示 | add: fasle，其他true
top | 顶部按钮是否显示| true
permission| 按钮所需权限| 

