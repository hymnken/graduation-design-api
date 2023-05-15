// 导入所需的模块和库，包括egg框架的Service类、stream-wormhole模块的sendToWormhole函数
// 、await-stream-ready模块的write函数、path模块和fs模块。
const Service = require('egg').Service
const sendToWormhole = require('stream-wormhole')
const awaitWriteStream = require('await-stream-ready').write
const path = require('path')
const fs = require('fs')
// 定义一个名为FileService的类，继承自Service类。
class FileService extends Service {
  //  在FileService类中定义了一个名为imageUpload的异步方法，用于处理图片上传。
  async imageUpload() {
    // 在imageUpload方法中，首先获取ctx（请求上下文）和app（应用程序）对象。
    const { ctx, app } = this
    // 通过ctx.getFileStream()获取上传文件的流（stream）对象。
    const stream = await ctx.getFileStream()
    // 生成一个唯一的文件名，包括当前时间戳和一个随机数，并拼接上原始文件的扩展名，作为新文件的文件名。
    // 指定新文件的保存路径，使用path.join函数将文件名和路径拼接起来。
    const filename =
      [Date.now(), Math.floor(Math.random() * 100000000)].join('_') + path.extname(stream.filename).toLocaleLowerCase()
    const target = path.join('app/public/images', filename)
    const writeStream = fs.createWriteStream(target)
    try {
      //异步把文件流 写入
      await awaitWriteStream(stream.pipe(writeStream))
    } catch (err) {
      console.log('%c [ err ]-20', 'font-size:13px; background:pink; color:#bf2c9f;', err)
      //如果出现错误，关闭管道
      await sendToWormhole(stream)
      ctx.failed(`上传失败`)
      return
    }
    const remoteUrl = ['http://', ctx.host, '/public/images/', filename].join('')
    return {
      url: ['/public/images/', filename].join(''),
      remote: remoteUrl,
    }
  }
}

module.exports = FileService

// 创建一个可写流（writeStream），用于将文件流写入目标文件。

// 使用awaitWriteStream函数将文件流异步地写入可写流。

// 如果写入过程中发生错误，捕获错误并进行处理：输出错误信息到控制台，关闭文件流（通过sendToWormhole函数），并向客户端返回上传失败的消息。

// 如果文件上传成功，构建远程访问文件的URL，其中包括协议、主机名和文件路径。

// 返回一个包含本地访问URL和远程访问URL的对象。

// 最后，将FileService类导出，使其可在其他地方使用。
