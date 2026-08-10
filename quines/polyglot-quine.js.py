1//(lambda:exec(s:="print('1//(lambda:exec(s:=%r) or 1)()'%s)") or 1)()
lambda:eval("(s=_=>`lambda:exec(s=${s})`)()")

1//1# Pour js utilser console log et JSON stringify