/*
 * @Author: Lutz Reiter - http://lu-re.de 
 * @Date: 2019-03-29 19:20:49 
 * @Last Modified by:   Lutz Reiter - http://lu-re.de 
 * @Last Modified time: 2019-03-29 19:20:49 
 */

const _ = require('lodash')
const util = require('util')
const { exec } = require('child_process')

function addslashes(str) {
    str = str.replace(/\\/g, '\\\\');
    str = str.replace(/\'/g, '\\\'');
    str = str.replace(/\"/g, '\\"');
    str = str.replace(/\0/g, '\\0');
    return str;
}

function stripslashes(str) {
    str = str.replace(/\\'/g, '\'');
    str = str.replace(/\\"/g, '"');
    str = str.replace(/\\0/g, '\0');
    str = str.replace(/\\\\/g, '\\');
    return str;
}

async function translate(text, language) {
    let asyncExec = util.promisify(exec);
    text = addslashes(text)
    language = addslashes(language)
    let result = await asyncExec(`interop-translate --from "${language}" "${text}"`)
    let output = JSON.parse(result.stdout)
    if (_.has(output,'errors')) {
        throw output.errors
    }
    return output.translations
}

module.exports = { addslashes, stripslashes, translate}