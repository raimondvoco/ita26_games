import numpy as np, json, sys, itertools
from pose import *
d2r=np.pi/180; X=[1,0,0]
A=json.load(open(sys.argv[1]))
H=np.array([.032,.0095,.07])
def sdf(p): d=np.abs(p)-H; return np.linalg.norm(np.maximum(d,0),axis=-1)+np.minimum(d.max(-1),0)
al=A['al']*d2r; c,s=np.cos(al),np.sin(al); Rp=np.array([[s,c,0],[0,0,-1],[-c,s,0]])
mid=np.array(B[BI['middlep']][1]); T0=np.array(A['mid']); Pl=M(Rp,T0-Rp@mid)
R0=float(A.get('r',.0072))
res={}
for f in ['index','middle','ring','pinky']:
    hp=np.array(B[BI[f+'p']][1]); hm=np.array(B[BI[f+'m']][1]); hd=np.array(B[BI[f+'d']][1]); tp=np.array(B[BI[f+'d']][2])
    sp=A['spread'][f]*d2r; tz=None; best=None
    r=R0*(.85 if f=='pinky' else 1)
    for a,b,cc in itertools.product(range(-10,41,5),range(0,111,5),range(0,101,5)):
        Rm=rot([0,0,1],sp)@rot(X,a*d2r); G1=about(hp,Rm); G2=G1@about(hm,rot(X,b*d2r)); G3=G2@about(hd,rot(X,cc*d2r))
        pts=[Pl@G1@np.r_[hp,1],Pl@G1@np.r_[hm,1],Pl@G2@np.r_[hd,1],Pl@G3@np.r_[tp,1]]; pts=np.array([q[:3] for q in pts])
        seg=np.concatenate([pts[i]+(pts[i+1]-pts[i])*np.linspace(0,1,6)[:,None] for i in range(3)])
        sd=sdf(seg); pen=np.maximum(0,r-sd).sum()
        tip=pts[3]; tgt=np.array([A['tipx'], H[1]+r*.9, tip[2]])
        cost=pen*400+np.linalg.norm(tip-tgt)*20+np.abs(sd[:12]-r).mean()*8+ (b+cc)*1e-4
        if best is None or cost<best[0]: best=(cost,a,b,cc,pen,np.round(tip,3))
    res[f]=best; print(f,best)
json.dump({f:[res[f][1],res[f][2],res[f][3]] for f in res},open('fl_opt.json','w'))
