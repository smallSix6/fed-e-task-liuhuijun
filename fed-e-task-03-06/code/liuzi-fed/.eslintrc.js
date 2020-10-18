module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "@vue/standard",
    "@vue/typescript/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-var-requires": "off",
    quotes: [1, "double"], // 引号类型 `` "" ''
    semi: [2, "always"], // 语句强制分号结尾
    "space-before-function-paren": [0, "always"]
  }
};
