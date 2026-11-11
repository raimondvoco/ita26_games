from blend import Blend
import struct, json, sys
b=Blend(sys.argv[1]); B=lambda c:[x for x in b.blocks if x['code']==c][0]
me=B('ME'); o=me['off']
nv,np_,nl=[b.get('Mesh',o,f) for f in ['totvert','totpoly','totloop']]
def arr(field, sname):
    p=b.get('Mesh',o,field); bl=b.byptr[p]; return bl, b.size(sname)
bl,sz=arr('mvert','MVert'); print('mvert sz',sz, bl['nr'])
V=[struct.unpack('<3f',b.d[bl['off']+i*sz:bl['off']+i*sz+12]) for i in range(nv)]
bl,sz=arr('mpoly','MPoly'); P=[struct.unpack('<ii',b.d[bl['off']+i*sz:bl['off']+i*sz+8]) for i in range(np_)]
bl,sz=arr('mloop','MLoop'); L=[struct.unpack('<I',b.d[bl['off']+i*sz:bl['off']+i*sz+4])[0] for i in range(nl)]
F=[[L[s+k] for k in range(n)] for s,n in P]
import collections; print(collections.Counter(len(f) for f in F))
xs=list(zip(*V)); print([ (min(a),max(a)) for a in xs])
# uv: ldata layers
ld=o+b.fields('Mesh')['ldata'][2]; layers=b.get('CustomData',ld,'layers'); tot=b.get('CustomData',ld,'totlayer'); print('ldata layers',tot)
lbl=b.byptr[layers]; lsz=b.size('CustomDataLayer')
UV=None
for i in range(tot):
    lo=lbl['off']+i*lsz; t=b.get('CustomDataLayer',lo,'type'); nm=b.d[lo+b.fields('CustomDataLayer')['name[64]'][2]:][:20].split(b'\0')[0]; dp=b.get('CustomDataLayer',lo,'data'); print(' layer',t,nm, b.sname(b.byptr[dp]) if dp in b.byptr else None)
    if t==16:  # CD_MLOOPUV
        db=b.byptr[dp]; s2=b.size('MLoopUV'); UV=[struct.unpack('<2f',b.d[db['off']+k*s2:db['off']+k*s2+8]) for k in range(nl)]
json.dump({'V':V,'F':F,'UV':UV,'P':P},open('hand.json','w'))
