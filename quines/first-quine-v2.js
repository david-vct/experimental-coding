// This program prints itself.
const [l,_]=[console.log,unescape("%27")]
const $$=($=[
  '// This program prints itself.',
  'const [l,_]=[console.log,unescape("%27")]',
  'const $$=($=[',
  ']).slice(0,3)',
  'for (e of $$) l(e)',
  'for (e of $) l("  %s%s%s,",_,e,_)',
  'for (e of $.slice(3)) l(e)',
]).slice(0,3)
for (e of $$) l(e)
for (e of $) l("  %s%s%s,",_,e,_)
for (e of $.slice(3)) l(e)