0.1 === 0.100000000000000005

2**31|0;
0.1*10**23
0.1 + 0.2 === 0.3 // false

const ecartGeant = 10e290;
Number.MAX_VALUE
Number.MAX_VALUE - ecartGeant === Number.MAX_VALUE

n = 1.0e+308
x = 100000000000000 // 10e290
n - x === n // true

n = 9007199254740992 // 2**53
n + 1 === n // true or false ?

function infinityLoopA() {
    j=0
    for (i = 9007199254740992; i === 9007199254740992; i++) {
        console.log(`i = ${i} // ${j++}`)
    }
}

function infinityLoopB() {
    j=0; n = 9007199254740992 // 2**53
    for (i = n; i < n+2; i++) {
        console.log(`i = ${i} // ${j++}`)
    }
}

// infinityLoopA()
// infinityLoopB()