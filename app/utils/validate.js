// 是否为手机号
// isMobile 是一个箭头函数，接受一个参数 mobile，表示要判断的手机号码字符串。
// 函数内部使用正则表达式 /^[1][3,4,5,6,7,8,9][0-9]{9}$/ 来进行手机号码的验证：
// ^ 表示匹配字符串的开头。
// [1] 表示第一个字符必须为数字 1。
// [3,4,5,6,7,8,9] 表示第二个字符必须是数字 3、4、5、6、7、8 或 9 中的一个。
// [0-9]{9} 表示接下来的 9 个字符必须是数字。
// $ 表示匹配字符串的结尾。
// 如果匹配成功，则返回 true，表示是一个合法的手机号码；否则返回 false。
// 函数返回正则表达式的匹配结果，即判断给定的 mobile 是否符合手机号码的格式。
const isMobile = (mobile) => {
  return /^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(mobile)
}
// 密码校验
const isPassword = (password) => {
  return /^(\w){6,20}$/.test(password)
}

// 昵称校验
const isNickname = (nickname) => {
  return /^[\u4E00-\u9FA5\uF900-\uFA2D|\w]{3,10}$/.test(nickname)
}
// 身份证验证
const isIdent = (ident) => {
  return /\d{17}[\d|x]|\d{15}/.test(ident)
}
// 金额校验
const isPrice = (price) => {
  return /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(price)
}

// 数字校验 如 9 或者 '9' => true
// isNumberStr 是一个箭头函数，接受两个参数 num 和 isFloat（默认为 false），用于判断的数字字符串和是否允许浮点数的标志。
// 如果 isFloat 参数为 true，则执行浮点数的判断逻辑，使用正则表达式 /^[0-9]+.?[0-9]*$/ 来判断字符串是否为一个浮点数：
// ^[0-9]+ 匹配以至少一个数字开头。
// .? 匹配零个或一个小数点。
// [0-9]*$ 匹配零个或多个数字，并以数字结尾。
// 如果匹配成功，则返回 true，表示是一个浮点数；否则返回 false。
// 如果 isFloat 参数为 false（默认值），则执行整数的判断逻辑，使用正则表达式 /^[0-9]*$/ 来判断字符串是否为一个整数：
// ^[0-9]*$ 匹配零个或多个数字，并以数字结尾。
// 如果匹配成功，则返回 true，表示是一个整数；否则返回 false。
// 最后，这段代码定义了一个函数 isNumberStr，用于判断一个字符串是否表示一个数字，可以选择判断整数或浮点数。
const isNumberStr = (num, isFloat = false) => {
  if (isFloat) {
    return /^[0-9]+.?[0-9]*$/.test(num)
  }
  return /^[0-9]*$/.test(num)
}

const isUsername = (username) => {
  return /^[A-z][A-z0-9]{3,15}/.test(username)
}
module.exports = {
  isMobile,
  isNickname,
  isPassword,
  isPrice,
  isNumberStr,
  isUsername,
  isIdent,
}
