export const lessons = [
  { id: 'g0', title: 'G0 · 我的第一条便签', path: '/start', outcome: '保存并重新读到一条真实便签', minutes: 15 },
  { id: 'b1', title: 'B1 · 对象、字段与记录', path: '/basics/model', outcome: '分清对象、字段和记录', minutes: 12 },
  { id: 'b2', title: 'B2 · 找到并读懂接口', path: '/basics/api', outcome: '自己找到读取接口并看懂返回', minutes: 15 },
  { id: 'b3', title: 'B3 · 修改和查询记录', path: '/basics/data', outcome: '修改同一条记录并按条件查询', minutes: 20 },
  { id: 'b4', title: 'B4 · 字段类型与填写方式', path: '/basics/fields', outcome: '分清显示名称、保存值和记录编号', minutes: 15 },
  { id: 'b5', title: 'B5 · 用户、角色与权限', path: '/basics/access', outcome: '查明登录后仍然无权的原因', minutes: 12 },
  { id: 'b6', title: 'B6 · 修改字段与应用版本', path: '/basics/version', outcome: '核对安装版本并保留原有记录', minutes: 15 },
  { id: 'b7', title: 'B7 · 看懂错误并继续', path: '/basics/debug', outcome: '从错误返回找到下一步检查', minutes: 15 }
]
export const lessonIds = lessons.map(lesson => lesson.id)
