import numpy as np, json, sys
from pose import *
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
from matplotlib.collections import PolyCollection
A=json.load(open(sys.argv[1])) if len(sys.argv)>1 else {}
d2r=np.pi/180; X=[1,0,0]
fl=A.get('fl',{'index':[10,85,45],'middle':[5,90,45],'ring':[8,90,45],'pinky':[18,90,45]})
spread=A.get('spread',{'index':-4,'middle':0,'ring':4,'pinky':9})
P={}
for f,(a,b,c) in fl.items():
    # flex about the lateral axis; a little sideways spread at the knuckle (about the palm normal)
    R=rot([0,0,1],spread[f]*d2r)@rot(X,a*d2r)
    P[f+'p']=(None,None); P[f+'m']=(X,b*d2r); P[f+'d']=(X,c*d2r)
    B_=B[BI[f+'p']]; 
P2={}
for f,(a,b,c) in fl.items():
    P2[f+'p']=('R',rot([0,0,1],spread[f]*d2r)@rot(X,a*d2r)); P2[f+'m']=('R',rot(X,b*d2r)); P2[f+'d']=('R',rot(X,c*d2r))
tm=A.get('tm',[[0,1,.3],-40]); tp=A.get('tp',[[1,0,0],15]); td=A.get('td',[[1,0,0],15])
P2['tm']=('R',rot(tm[0],tm[1]*d2r)); P2['tp']=('R',rot(tp[0],tp[1]*d2r)); P2['td']=('R',rot(td[0],td[1]*d2r))
def poseR(P):
    G=[None]*len(B)
    for i,(nm,h,t,par) in enumerate(B):
        L=about(h,P[nm][1]) if nm in P else np.eye(4)
        G[i]=(G[par] if par>=0 else np.eye(4))@L
    return G
G=poseR(P2)
al=A.get('al',25)*d2r; c,s=np.cos(al),np.sin(al)
Rp=np.array([[s,c,0],[0,0,-1],[-c,s,0]])   # columns: hand x, y, z in phone space
mid=np.array(B[BI['middlep']][1]); T0=np.array(A.get('mid',[.002,-.0215,.012]))
Pl=M(Rp,T0-Rp@ (G[BI['middlep']]@np.r_[mid,1])[:3])
GG=[Pl@g for g in G]
X2=skin(GG)
np.save('posed.npy',X2); json.dump({'G':[g.tolist() for g in GG]},open('posedG.json','w'))
# render: front (from +Y), back (from -Y), side (from -X)
ph=[(-.032,-.0095,-.07),(.032,.0095,.07)]
fig,axs=plt.subplots(1,3,figsize=(18,8))
for ax,(i,j,dep,sg,nm,fi,fj) in zip(axs,[(0,2,1,1,'front (screen)',1,-1),(0,2,1,-1,'back',-1,-1),(1,2,0,-1,'left side',1,-1)]):
    polys=[(X2[f][:,dep].mean()*sg, X2[f][:,[i,j]]*[fi,fj], '#e6d2c8') for f in F]
    # phone as box faces
    x0,y0,z0=ph[0]; x1,y1,z1=ph[1]
    box=[([x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]),([x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]),([x0,y0,z0],[x0,y1,z0],[x0,y1,z1],[x0,y0,z1]),([x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1])]
    for q,colr in zip(box,['#203040','#333','#555','#555']):
        q=np.array(q); polys.append((q[:,dep].mean()*sg, q[:,[i,j]]*[fi,fj], colr))
    polys.sort(key=lambda p:p[0])
    ax.add_collection(PolyCollection([p[1] for p in polys],facecolor=[p[2] for p in polys],edgecolor=[('#0003' if p[2].startswith('#e') else '#000') for p in polys],linewidths=.3))
    ax.set_xlim(-.12,.14) if i==0 else ax.set_xlim(-.06,.06); ax.set_ylim(-.12,.14); ax.set_aspect('equal'); ax.set_title(nm); ax.grid(True,lw=.3)
plt.savefig('grip.png',dpi=60)
inside=((np.abs(X2[:,0])<.032)&(np.abs(X2[:,1])<.0095)&(np.abs(X2[:,2])<.07)).sum()
print('verts inside phone:',inside)
for f in ['index','middle','ring','pinky','t']:
    nm={'t':'td'}.get(f,f+'d'); g=GG[BI[nm]]; tip=(g@np.r_[B[BI[nm]][2],1])[:3]; head=(g@np.r_[B[BI[nm]][1],1])[:3]; print(f,'dist head',np.round(head,3),'tip',np.round(tip,3))
w=(GG[0]@np.r_[0,.05,-.006,1])[:3]; print('wrist',np.round(w,3))
