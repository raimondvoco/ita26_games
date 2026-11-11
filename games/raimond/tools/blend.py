import struct, sys
class Blend:
    def __init__(s, path):
        d = s.d = open(path,'rb').read(); assert d[:7]==b'BLENDER'
        s.ps = 8 if d[7:8]==b'-' else 4; s.le = d[8:9]==b'v'; e = '<' if s.le else '>'; s.e=e
        o = 12; s.blocks = []
        while o < len(d):
            code = d[o:o+4]; ln, = struct.unpack(e+'i', d[o+4:o+8]); ptr = struct.unpack(e+('Q' if s.ps==8 else 'I'), d[o+8:o+8+s.ps])[0]
            sd, nr = struct.unpack(e+'ii', d[o+8+s.ps:o+16+s.ps]); h = 16+s.ps
            s.blocks.append(dict(code=code.rstrip(b'\0').decode('latin1'), len=ln, ptr=ptr, sdna=sd, nr=nr, off=o+h)); o += h+ln
            if code==b'ENDB': break
        s.byptr = {b['ptr']: b for b in s.blocks}
        dna = [b for b in s.blocks if b['code']=='DNA1'][0]; s.parse_dna(d[dna['off']:dna['off']+dna['len']])
    def parse_dna(s, d):
        e=s.e; o=8; n,=struct.unpack(e+'i',d[o:o+4]); o+=4; names=[]
        for _ in range(n): j=d.index(b'\0',o); names.append(d[o:j].decode()); o=j+1
        o=(o+3)&~3; o+=4; n,=struct.unpack(e+'i',d[o:o+4]); o+=4; types=[]
        for _ in range(n): j=d.index(b'\0',o); types.append(d[o:j].decode()); o=j+1
        o=(o+3)&~3; o+=4; tl=struct.unpack(e+'%dh'%n,d[o:o+2*n]); o+=2*n
        o=(o+3)&~3; o+=4; n,=struct.unpack(e+'i',d[o:o+4]); o+=4; s.structs=[]; s.sidx={}
        for i in range(n):
            t,nf=struct.unpack(e+'hh',d[o:o+4]); o+=4; fs=[]; off=0
            for _ in range(nf):
                ft,fn=struct.unpack(e+'hh',d[o:o+4]); o+=4; nm=names[fn]
                if nm.startswith('*') or nm.startswith('(*'): sz=s.ps
                else: sz=tl[ft]
                mult=1
                import re
                for m in re.findall(r'\[(\d+)\]',nm): mult*=int(m)
                fs.append((types[ft],nm,off,sz*mult)); off+=sz*mult
            s.structs.append((types[t],fs,tl[t])); s.sidx[types[t]]=i
        s.types=types; s.tl=tl
    def fields(s, sname): return {f[1]:f for f in s.structs[s.sidx[sname]][1]}
    def get(s, sname, base, field, fmt=None):
        f = None
        for ff in s.structs[s.sidx[sname]][1]:
            nm=ff[1].split('[')[0]
            if nm==field or nm=='*'+field: f=ff; break
        if f is None: raise KeyError(field)
        o=base+f[2]
        if f[1].startswith('*'): return struct.unpack(s.e+('Q' if s.ps==8 else 'I'), s.d[o:o+s.ps])[0]
        if fmt: return struct.unpack(s.e+fmt, s.d[o:o+struct.calcsize(fmt)])
        t=f[0]; cnt=f[3]//{'float':4,'int':4,'short':2,'char':1,'double':8,'uchar':1}.get(t,1)
        c={'float':'f','int':'i','short':'h','char':'b','double':'d','uchar':'B'}.get(t)
        if c: v=struct.unpack(s.e+c*cnt, s.d[o:o+f[3]]); return v if cnt>1 else v[0]
        return o
    def sname(s,b): return s.structs[b['sdna']][0]
    def size(s,sname): return s.structs[s.sidx[sname]][2]
