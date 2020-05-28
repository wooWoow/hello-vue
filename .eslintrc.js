module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // 'off'或者0  //关闭规则关闭
    // 'warn'或者1  //在打开的规则作为警告（不影响退出代码）
    // 'error'或者2  //把规则作为一个错误（退出代码触发时为1）
    'quotes': [1, 'single'], //引号类型 `` "" ''
    'semi': [2, 'always'], // 语句强制分号结尾
    'space-before-function-paren': [0, 'always'] //函数定义时括号前面要不要有空格
  }
}
