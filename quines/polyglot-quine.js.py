lambda:eval("s=\"console.log('lambda:eval('+JSON.stringify('s='+JSON.stringify(s)+';eval(s)')+')')\";eval(s)")
1//(lambda:exec(s:="print('1//(lambda:exec(s:=%r) or 1)()'%s)") or 1)()