import numpy as np, json, base64, sys
from pose import *
d2r=np.pi/180; X=[1,0,0]
A=json.load(open('g4.json'))
r=np.load('rig.npz'); V0=r['V'];F0=r['F'];W0=r['W0'];W1=r['W1'];W=r['W']
def nails(style):
    P=[];Q=[];S=[];NB=[]   # points, quads, (u,v), bone
    for f in ['index','middle','ring','pinky','thumb']:
        bn='td' if f=='thumb' else f+'d'; bi=BI[bn]; h=np.array(B[bi][1]); t=np.array(B[bi][2]); a=t-h; L=np.linalg.norm(a); a/=L
        near=V0[(W0==bi)|(W1==bi)]
        if f=='thumb':
            c=near-near.mean(0); c-=np.outer(c@a,a); _,_,vt=np.linalg.svd(c); n=vt[2]; n=n if n@np.array([.6,0,1])>0 else -n
        else: n=np.array([0,0,1.]); n-=a*(a@n); n/=np.linalg.norm(n)
        l=np.cross(a,n)
        def height(s):
            p=h+a*L*s; rel=near-p; m=np.abs(rel@a)<.0025; m&=np.abs(rel@l)<.003
            return (rel[m]@n).max() if m.any() else .006
        w0={'index':.0074,'middle':.0078,'ring':.0072,'pinky':.006,'thumb':.0088}[f]
        stil=style=='stiletto'; ext=.016 if stil else .0018; s0=.42; hs=[height(s) for s in np.linspace(s0,.82,6)]
        ns=14 if stil else 8; nu=6; base=len(P)
        sEnd=1+ext/L
        for i in range(ns+1):
            s=s0+(sEnd-s0)*i/ns; k=min(s,.82)
            hh=np.interp(k,np.linspace(s0,.82,6),hs)+.0007
            over=max(0,s-.82)*L; hh-= over*(.12 if not stil else .16) + (over**2*25 if stil else 0)   # the free edge follows the fingertip down; a stiletto curves a little
            if stil: wd=w0*(1 if s<.9 else max(0,1-((s-.9)*L)/(ext+.1*L))**1.25)
            else: wd=w0*(1 if s<.97 else .85)
            if s<s0+.06: wd*=.88+.12*(s-s0)/.06
            for j in range(nu+1):
                u=-1+2*j/nu; p=h+a*L*s+l*u*wd/2+n*(hh-(u*u)*.0011*(wd/w0))
                P.append(p); S.append((.52+.46*j/nu, i/ns)); NB.append(bi)
        for i in range(ns):
            for j in range(nu): q=base+i*(nu+1)+j; Q.append([q,q+1,q+nu+2,q+nu+1])
    return np.array(P),np.array(Q),np.array(S),np.array(NB)
out={}
for girl,style in [('hitori','stiletto'),('hikari','normal')]:
    NP,NQ,NS,NB=nails(style)
    V=np.vstack([V0,NP]); Fq=np.vstack([F0,NQ+len(V0)])
    b0=np.r_[W0,NB]; b1=np.r_[W1,NB]; w=np.r_[W,np.ones(len(NP))]
    # pose (fingers baked; thumb in its rest bend) and place on the phone
    P2={}
    for f,(a_,b_,c_) in A['fl'].items(): P2[f+'p']=('R',rot([0,0,1],A['spread'][f]*d2r)@rot(X,a_*d2r)); P2[f+'m']=('R',rot(X,b_*d2r)); P2[f+'d']=('R',rot(X,c_*d2r))
    for k in ['tm','tp','td']: P2[k]=('R',rot(A[k][0],A[k][1]*d2r))
    G=[None]*len(B)
    for i,(nm,hh_,tt,par) in enumerate(B):
        Lm=about(hh_,P2[nm][1]) if nm in P2 else np.eye(4); G[i]=(G[par] if par>=0 else np.eye(4))@Lm
    al=A['al']*d2r; c,s=np.cos(al),np.sin(al); Rp=np.array([[s,c,0],[0,0,-1],[-c,s,0]])
    mid=np.array(B[BI['middlep']][1]); Pl=M(Rp,np.array(A['mid'])-Rp@(G[BI['middlep']]@np.r_[mid,1])[:3]); GG=[Pl@g for g in G]
    Xh=np.c_[V,np.ones(len(V))]; PV=np.array([((w[i]*GG[b0[i]]+(1-w[i])*GG[b1[i]])@Xh[i])[:3] for i in range(len(V))])
    tris=np.array([[q[0],q[1],q[2]] for q in Fq]+[[q[0],q[2],q[3]] for q in Fq])
    N=np.zeros_like(PV); fn=np.cross(PV[tris[:,1]]-PV[tris[:,0]],PV[tris[:,2]]-PV[tris[:,0]])
    for k in range(3): np.add.at(N,tris[:,k],fn)
    N/=np.linalg.norm(N,axis=1,keepdims=True)+1e-12
    # skin uv: flat from the hand's own plane (just to place the texture's grain); nails keep theirs
    UV=np.zeros((len(V),2)); UV[:len(V0),0]=.02+.46*(V0[:,0]-V0[:,0].min())/np.ptp(V0[:,0]); UV[:len(V0),1]=.02+.96*(V0[:,1]-V0[:,1].min())/np.ptp(V0[:,1]); UV[len(V0):]=NS
    # runtime bones: 0 the hand (everything baked), 1 the thumb's first bone, 2 its tip bone
    rb=lambda b: 1 if b==BI['tp'] else 2 if b==BI['td'] else 0
    R0=np.array([rb(x) for x in b0]); R1=np.array([rb(x) for x in b1])
    same=R0==R1; w2=w.copy(); w2[same]=1; R1[same]=R0[same]
    # merge: if both map to 0, weight 1
    arr=np.c_[PV,N,UV,R0,R1,w2].astype(np.float32)
    jp=lambda nm,end: (GG[BI[nm]]@np.r_[B[BI[nm]][2 if end else 1],1])[:3]
    wr=(GG[0]@np.r_[0,.05,-.006,1])[:3]; fa=Pl[:3,:3]@np.array([0,1,0])
    out[girl]={'nv':len(V),'v':base64.b64encode(arr.tobytes()).decode(),'i':{'skin':base64.b64encode(tris[np.all(tris<len(V0),1)].astype(np.uint16).tobytes()).decode(),'nail':base64.b64encode(tris[~np.all(tris<len(V0),1)].astype(np.uint16).tobytes()).decode()},
        'B':jp('tp',0).round(5).tolist(),'K':jp('td',0).round(5).tolist(),'T':jp('td',1).round(5).tolist(),'wr':wr.round(5).tolist(),'fa':fa.round(4).tolist()}
    print(girl,len(V),len(tris),out[girl]['B'],out[girl]['K'],out[girl]['T'],'wrist',out[girl]['wr'],out[girl]['fa'])
    np.save('pv_'+girl+'.npy',PV); np.save('tris_'+girl+'.npy',tris)
open('/mnt/user-data/outputs/synchronicity_v12/js/p2_handmesh.js','w').write('// the hand that holds the phone: from the supplied female hand model (femalehandmediumdetail.blend), mirrored to a\n// right hand, smoothed, rigged and posed round the phone; Hitori with long red stiletto nails, Hikari with natural ones.\n// Vertices are in the phone\'s space: pos, normal, uv, bone a, bone b, weight of a (bones: 0 hand, 1 thumb, 2 thumb tip).\nconst HANDMESH = '+json.dumps(out)+';\n')
