const Uploader = require('simple-qiniu-upload')

function camelize(str) {
    return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

function resolveZone(zone) {
    if (zone === 'z0') {
        return Uploader.zone.z0
    } else if (zone === 'z1') {
        return Uploader.zone.z1
    } else if (zone === 'z2') {
        return Uploader.zone.z2
    } else if (zone === 'na0') {
        return Uploader.zone.na0
    }

    return null
}

function resolveArgValue(value) {
    if (value === 'true' || value === 'false') {
        return value === 'true'
    }

    return value
}

const optionNames = {}
Object.keys(Uploader.defaults).forEach(name => {
    optionNames[name] = true
})

module.exports = (api, projectOptions) => {
    api.registerCommand(
        'upload',
        {
            description: 'upload specified file with glob to qiniu cdn.',
            usage: 'vue-cli-service upload [options]',
            options: {
                '--access-key value': 'specify qiniu access key (default: empty string)',
                '--secret-key value': 'specify qiniu secret key (default: empty string)',
                '--env-file [filename]': 'dot env file that contains ak and sk (default: .qiniu)',
                '--overrides': 'enable override when upload the same file'
            },
            details:
                'For more options, see https://github.com/liuyunzhuge/simple-qiniu-upload and camelcase options must be transfered to hyphen case when used in command line'
        },
        args => {
            let commandOptions = {}

            Object.keys(args).forEach(argName => {
                let name = camelize(argName)
                if (name === 'zone') {
                    commandOptions[name] = resolveZone(args[argName])
                } else if (optionNames[name]) {
                    commandOptions[name] = resolveArgValue(args[argName])
                }
            })

            let configOptions = projectOptions.pluginOptions.qiniuUpload || {}

            new Uploader({ ...configOptions, ...commandOptions }).start()
        }
    )

    api.registerCommand(
        'delete',
        {
            description: 'delete qiniu files with specified prefix.',
            usage: 'vue-cli-service delete [options]',
            options: {
                '--access-key value': 'specify qiniu access key (default: empty string)',
                '--secret-key value': 'specify qiniu secret key (default: empty string)',
                '--env-file [filename]': 'dot env file that contains ak and sk (default: .qiniu)',
                '--overrides': 'enable override when upload the same file',
                '--fetch-page-size': 'specify page size when fetch qiniu files to delete(default: 500)',
                '--fetch-prefix': 'specify prefix of files to delete(default: empty string, required)',
                '--fetch-file': 'specify filename for fetch results(default: qiniu-prefix-fetch.json)',
                '--delete-batch-size': 'specify batch size when delete(default: 100)',
                '--delete-file': 'specify filename for delete results(default: qiniu-batch-delete.json)'
            },
            details:
                'For more options, see https://github.com/liuyunzhuge/simple-qiniu-upload and camelcase options must be transfered to hyphen case when used in command line'
        },
        args => {
            let commandOptions = {}

            Object.keys(args).forEach(argName => {
                let name = camelize(argName)
                if (name === 'zone') {
                    commandOptions[name] = resolveZone(args[argName])
                } else if (optionNames[name]) {
                    commandOptions[name] = resolveArgValue(args[argName])
                }
            })

            let configOptions = projectOptions.pluginOptions.qiniuUpload || {}
            let options = { ...configOptions, ...commandOptions }

            new Uploader(options).fetchUploadedFiles({
                pageSize: options.fetchPageSize,
                prefix: options.fetchPrefix,
                storageAs: options.fetchFile
            }).then(uploader => uploader.batchDelFiles({
                batchSize: options.deleteBatchSize,
                fetchFile: options.fetchFile,
                storageAs: options.deleteFile
            }))
        }
    )
}   