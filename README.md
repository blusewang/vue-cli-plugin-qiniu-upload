# vue-cli-plugin-qiniu-upload
可在vue-cli中使用的simple-qiniu-upload；会通过vue-cli-service注册upload命令。

这是基于[simple-qiniu-upload](https://github.com/liuyunzhuge/simple-qiniu-upload)的vue-cli插件，它会注入一个`upload`命令，可通过`vue-cli-service upload`来完成上传。

`simple-qiniu-upload`的参数，全部都能用`upload`命令行参数来传递，但是不建议这么搞，比较费事，还是在`vue.config.js`里面配置比较方便。

## 用法
* 安装

    ```
    npm install vue-cli-plugin-qiniu-upload --save-dev
    ```
    这个插件只要安装即可。不需要使用`vue add`或`vue invoke`命令。

* 配置

    在项目目录新建一个`.qiniu`文件存放AK和SK。

    在`vue.config.js`的`pluginOptions`里面，添加`qiniuUpload`配置节，来进行`simple-qiniu-upload`的配置：
    ```js
    module.exports = {
        pluginOptions: {
            qiniuUpload: {
                base: 'dist',
                glob: 'dist/**',
                globIgnore: [
                    'dist/!(static)/**'
                ],
                bucket: 'static',
                parallelCount: 2
            }
        }
    }   
    ```
    各个option的作用，可阅读[simple-qiniu-upload](https://github.com/liuyunzhuge/simple-qiniu-upload)

* 定义`npm script`
    ```
    "scripts": {
        "upload": "vue-cli-service upload"
    },
    ```

* 运行
    
    运行`npm upload`即可上传文件到七牛。建议在生产环境构建之后再执行此命令。

## vue项目的配置
附项目中使用的`vue.config.js`配置：
```js
const path = require('path')
const pkg = require('./package.json')

module.exports = {
    productionSourceMap: true,
    chainWebpack: (config) => {
        config.plugins.delete('prefetch')

        config.output.crossOriginLoading('anonymous')
    },
    assetsDir: `static/app-name/${pkg.version}`,
    publicPath: process.env.NODE_ENV === 'production' ? `//your-qiniu-cdn.domain.com/` : '/',
    integrity: process.env.NODE_ENV === 'production',
    crossorigin: process.env.NODE_ENV === 'production' ? 'anonymous' : undefined,
    pluginOptions: {
        qiniuUpload: {
            base: 'dist',
            glob: 'dist/**',
            globIgnore: [
                'dist/!(static)/**'
            ],
            bucket: 'static',
            overrides: true,
            parallelCount: 2
        }
    }
}
```
说明：
* assetsDir

    增加`assetsDir`的配置，可以让静态资源按照`package.json`中的`version`进行管理，这样上传到七牛之后，文件路径也包含了版本号，将来进行管理、查询和删除旧版本的文件，就很方便。

* publicPath

    需在生产环境的时候配置为cdn域名。

* integrity

    这个是开启cdn资源的SRI验证。[SRI](https://developer.mozilla.org/zh-CN/docs/Web/Security/%E5%AD%90%E8%B5%84%E6%BA%90%E5%AE%8C%E6%95%B4%E6%80%A7)

* crossorigin

    给script添加`crossorigin`属性。还有一行`webpack`的配置也是：
    ```
    config.output.crossOriginLoading('anonymous')
    ```
    因为crossorigin只会给注入`index.html`的脚本添加`crossorigin`属性，但是那些动态加载的`chunk`文件不会添加，所以需手动配置`webpack`。

