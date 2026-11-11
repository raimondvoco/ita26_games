import json, numpy as np, sys
d=json.load(open('hand.json')); V=np.array(d['V'],float); F=[list(f) for f in d['F']]
V[:,0]*=-1; F=[f[::-1] for f in F]            # mirror to a right hand (fix winding)
# ---------- Catmull-Clark (with boundary)
def cc(V,F):
    nv=len(V); E={}; ef={}
    for fi,f in enumerate(F):
        for i in range(len(f)):
            a,b=f[i],f[(i+1)%len(f)]; k=(min(a,b),max(a,b)); ef.setdefault(k,[]).append(fi)
    FP=np.array([V[f].mean(0) for f in F]); ek=list(ef.keys()); eidx={k:i for i,k in enumerate(ek)}
    EP=np.zeros((len(ek),3)); bnd=set()
    for i,k in enumerate(ek):
        fs=ef[k]
        if len(fs)==2: EP[i]=(V[k[0]]+V[k[1]]+FP[fs[0]]+FP[fs[1]])/4
        else: EP[i]=(V[k[0]]+V[k[1]])/2; bnd.add(k[0]); bnd.add(k[1])
    vf=[[] for _ in range(nv)]; ve=[[] for _ in range(nv)]
    for fi,f in enumerate(F):
        for v in f: vf[v].append(fi)
    for k in ek: ve[k[0]].append(k); ve[k[1]].append(k)
    NV=np.zeros_like(V)
    for v in range(nv):
        if v in bnd:
            be=[k for k in ve[v] if len(ef[k])==1]; NV[v]=.75*V[v]+.125*sum(V[k[0] if k[1]==v else k[1]] for k in be)
        else:
            n=len(vf[v]); Fm=FP[vf[v]].mean(0); Rm=np.mean([(V[k[0]]+V[k[1]])/2 for k in ve[v]],0); NV[v]=(Fm+2*Rm+(n-3)*V[v])/n
    P=np.vstack([NV,EP,FP]); eo=nv; fo=nv+len(ek); NF=[]
    for fi,f in enumerate(F):
        n=len(f)
        for i in range(n):
            a=f[i]; b=f[(i+1)%n]; c=f[(i-1)%n]
            NF.append([a, eo+eidx[(min(a,b),max(a,b))], fo+fi, eo+eidx[(min(a,c),max(a,c))]])
    return P,NF
lv=int(sys.argv[2]) if len(sys.argv)>2 else 1
for _ in range(lv): V,F=cc(V,F)
# ---------- the skeleton (hand space: fingers -y, palm -z, thumb +x, wrist +y)
J={'wrist':[0,.05,-.006]}
FING={'index':([.028,-.018,-.002],[.0285,-.119,.0]), 'middle':([.009,-.02,-.002],[.0095,-.133,.0]), 'ring':([-.012,-.018,-.002],[-.0115,-.124,.0]), 'pinky':([-.031,-.026,-.002],[-.0305,-.091,.0])}
TH=[[.032,.012,-.008],[.047,-.015,-.017],[.058,-.031,-.022],[.067,-.045,-.024]]   # CMC, MCP, IP, tip
bones=[]   # each: name, head, tail, parent
bones.append(('hand',np.array(J['wrist']),np.array(J['wrist'])+np.array([0,-.06,0]),-1))
for nm,(m,t) in FING.items():
    m=np.array(m); t=np.array(t); L=t-m; pr=0
    for seg,(a,b) in zip(['p','m','d'],[(0,.45),(.45,.75),(.75,1.0)]):
        bones.append((nm+seg, m+L*a, m+L*b, pr)); pr=len(bones)-1
pr=0
for seg,(a,b) in zip(['tm','tp','td'],[(0,1),(1,2),(2,3)]):
    bones.append((seg,np.array(TH[a]),np.array(TH[b]),pr)); pr=len(bones)-1
names=[b[0] for b in bones]; BI={n:i for i,n in enumerate(names)}
# ---------- weights: nearest chain (finger or thumb), position along it, blended across joints
chains=[[BI[n+s] for s in 'pmd'] for n in FING]+[[BI['tm'],BI['tp'],BI['td']]]
def segd(p,a,b):
    ab=b-a; t=np.clip(((p-a)@ab)/(ab@ab),0,1); return np.linalg.norm(p-(a+np.outer(t,ab)) if p.ndim>1 else p-(a+t*ab),axis=-1), t
W0=np.zeros(len(V),int); W1=np.zeros(len(V),int); W=np.ones(len(V))
for vi,p in enumerate(V):
    best=None
    for ch in chains:
        for k,bi in enumerate(ch):
            a=bones[bi][1]; b=bones[bi][2]; ab=b-a; t=((p-a)@ab)/(ab@ab); tc=min(max(t,0),1); dd=np.linalg.norm(p-(a+tc*ab))
            # palm side of the first bone of a finger: belongs to the palm
            if k==0 and t<0 and ch[0]!=BI['tm']: dd+= -t*np.linalg.norm(ab)*2
            if ch[0]==BI['tm'] and k==0 and p[0]<.036: dd+=(.036-p[0])*1.2
            if best is None or dd<best[0]: best=(dd,ch,k,t,np.linalg.norm(ab))
    dd,ch,k,t,L=best; bi=ch[k]; r=.0055; s=t*L   # along this bone, metres from its head
    par=bones[bi][3]
    if s< r:   # near the head: blend with the parent
        w=.5+.5*s/r if s>-r else 0.
        W0[vi]=bi; W1[vi]=par if par>=0 else 0; W[vi]=max(0,min(1,w))
    elif s> L-r and k<len(ch)-1:
        w=.5+.5*(L-s)/r; W0[vi]=bi; W1[vi]=ch[k+1]; W[vi]=max(0,min(1,w))
    else: W0[vi]=bi; W1[vi]=bi; W[vi]=1
np.savez('rig.npz',V=V,F=np.array(F),W0=W0,W1=W1,W=W)
json.dump({'bones':[(b[0],b[1].tolist(),b[2].tolist(),b[3]) for b in bones]},open('bones.json','w'))
print(len(V),len(F))
