#!/usr/bin/env node

const Promise = require('bluebird')
const fs = require('fs')
const path = require('path')
const glob = require('glob')

Promise.promisifyAll(fs)

const program = require('commander')

let cmdPageName = ''
let cmdPath = ''

program.usage('<project-name>')
    .arguments('<pageName> [path]', 'page name must need!')
    .action(function(pageName, path) {
        cmdPageName = pageName
        cmdPath = path || '.'
    })

program.parse(process.argv)

if (!cmdPageName) {
    program.help()
    return
}
console.log(cmdPath, cmdPageName)

let projectPath = path.resolve(__dirname + '/../', cmdPath, cmdPageName)

const templteList = glob.sync("template/*", {
    absolute: true
})

fs.mkdirAsync(cmdPageName, '755')
    .then(function() {
        templteList.map(fileName => {
            fs.readFileAsync(fileName, 'utf-8')
                .then(function(content) {
                    let name = path.parse(fileName).base
                    fs.writeFileAsync(path.resolve(projectPath, name), content, {
                        encoding: 'utf8',
                        mode: 0o755,
                        flag: 'w+'
                    }).catch(function(err) {
                        console.log(err)
                    })
                })
        })
    })
