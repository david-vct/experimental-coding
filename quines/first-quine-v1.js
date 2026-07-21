// This program prints itself.
(() => {
    const _ = unescape("%27")
    const $ = [
        '// This program prints itself.',
        '(() => {',
        '    const _ = unescape("%27")',
        '    const $ = [',
        '    ]',
        '    for (let i=0; i<4; i++) console.log($[i])',
        '    for (let i=0; i<9; i++) console.log(`        ${_}${$[i]}${_},`)',
        '    for (let i=4; i<9; i++) console.log($[i])',
        '})()',
    ]
    for (let i=0; i<4; i++) console.log($[i])
    for (let i=0; i<9; i++) console.log(`        ${_}${$[i]}${_},`)
    for (let i=4; i<9; i++) console.log($[i])
})()