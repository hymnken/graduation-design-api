// 定义了两个函数，pad 和 format，用于日期时间格式化的辅助函数和时间戳格式化函数。具体解释如下：
// pad 是一个用于字符串填充的辅助函数，接受三个参数 str、len（默认为 2）和 flag（默认为 '0'）：
// str.toString() 将输入的参数 str 转换为字符串类型。
// .padStart(len, flag) 使用 len 指定的长度，在字符串的开头填充字符 flag，直到达到指定的长度。如果字符串长度已经达到或超过指定长度，则不进行填充。
// 函数返回填充后的字符串。
// exports.format 是一个时间戳格式化函数，接受一个参数 timestamp 表示时间戳：
// timestamp.toString().padEnd(13, 0) 将时间戳转换为字符串，并使用 0 在字符串的结尾填充到长度为 13 位。
// Number() 将填充后的字符串转换为数值类型。
// timestamp ? ... : false 判断 timestamp 是否存在，如果存在则执行后面的代码，否则返回 false。
// new Date(timestamp) 创建一个新的 Date 对象，传入时间戳作为参数。
// 通过 Date 对象获取年、月、日、时、分、秒的信息，并进行相应的填充，使用 pad 函数保证它们的长度为两位数。
// 使用字符串模板拼接年月日时分秒，返回格式化后的日期时间字符串。

const pad = (str, len = 2, flag = '0') => {
  return str.toString().padStart(len, flag)
}
exports.format = (timestamp) => {
  timestamp = timestamp ? Number(timestamp.toString().padEnd(13, 0)) : false
  let date = timestamp ? new Date(timestamp) : new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let h = date.getHours()
  let m = date.getMinutes()
  let s = date.getSeconds()
  //   YYYY-MM-DD HH:mm:ss
  return `${year}-${pad(month)}-${pad(day)} ${pad(h)}:${pad(m)}:${pad(s)}`
}
//2023-03-15 12:30:45
