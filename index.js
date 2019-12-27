import Uploader from 'simple-qiniu-upload'

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
            let uploaderOptions = {}

            Object.keys(args).forEach(argName => {
                let name = camelize(argName)
                if (name === 'zone') {
                    uploaderOptions[name] = resolveZone(args[argName])
                } else if (optionNames[name]) {
                    uploaderOptions = resolveArgValue(args[argName])
                }
            })

            console.log(uploaderOptions)
        }
    )
}   