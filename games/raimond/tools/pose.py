import json, numpy as np, sys
r=np.load('rig.npz'); V=r['V'];F=r['F'];W0=r['W0'];W1=r['W1'];W=r['W']
B=json.load(open('bones.json'))['bones']; BI={b[0]:i for i,b in enumerate(B)}
def rot(axis,ang):
    a=np.array(axis,float); a/=np.linalg.norm(a); c,s=np.cos(ang),np.sin(ang); x,y,z=a
    return np.array([[c+x*x*(1-c),x*y*(1-c)-z*s,x*z*(1-c)+y*s],[y*x*(1-c)+z*s,c+y*y*(1-c),y*z*(1-c)-x*s],[z*x*(1-c)-y*s,z*y*(1-c)+x*s,c+z*z*(1-c)]])
def M(R=np.eye(3),t=np.zeros(3)): m=np.eye(4); m[:3,:3]=R; m[:3,3]=t; return m
def about(p,R): p=np.array(p); return M(R,p-R@p)
def pose(P):
    # P: dict bone -> (axis, angle) local rotation in rest space about the bone's head
    G=[None]*len(B)
    for i,(nm,h,t,par) in enumerate(B):
        L=about(h,rot(*P[nm])) if nm in P else np.eye(4)
        G[i]=(G[par] if par>=0 else np.eye(4))@L
    return G
def skin(G,X=V):
    Xh=np.c_[X,np.ones(len(X))]; out=np.zeros_like(X)
    for i in range(len(X)):
        m=W[i]*G[W0[i]]+(1-W[i])*G[W1[i]]; out[i]=(m@Xh[i])[:3]
    return out
