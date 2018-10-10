module.exports = {
    appenders: {
        out: {
            // 输出到控制台
            type: 'stdout',
            layout: {
                type: 'messagePassThrough'
            }
        },
        console: {
            type: 'console'
        },
        appLogs: {
            type: 'dateFile',
            filename: '/mydata/log/node-www/appStart.log'
        },
        globalError: {
            type: 'dateFile',
            filename: '/mydata/log/node-www/error.log'
        },
        error: {
            type: 'logLevelFilter',
            appender: 'globalError',
            level: 'error'
        }
    },
    categories: {
        app: {
            appenders: ['console', 'appLogs', 'error'],
            level: 'debug'
        },
        interceptor: {
            appenders: ['console'],
            level: 'debug'
        },
        // 默认输出
        default: {
            appenders: ['out', 'error'],
            level: 'error'
        }
    }
}