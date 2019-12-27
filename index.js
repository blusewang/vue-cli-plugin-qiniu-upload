module.exports = (api, options) => {
    api.registerCommand(
        'upload',
        {
            description: 'upload specified file with glob to qiniu cdn.',
            usage: 'vue-cli-service upload [options]',
            options: {
                '--format [formatter]': 'specify formatter (default: codeframe)',
                '--no-fix': 'do not fix errors or warnings',
                '--no-fix-warnings': 'fix errors, but do not fix warnings',
                '--max-errors [limit]':
                    'specify number of errors to make build failed (default: 0)',
                '--max-warnings [limit]':
                    'specify number of warnings to make build failed (default: Infinity)'
            },
            details:
                'For more options, see https://eslint.org/docs/user-guide/command-line-interface#options'
        },
        args => {
            console.log(args)
        }
    )
}