(this.webpackJsonpweb=this.webpackJsonpweb||[]).push([[0],{14:function(e,n,t){e.exports={webgl:"Environment_webgl__3i5nb"}},16:function(e,n,t){e.exports={wrapper:"Header_wrapper__3dFlQ"}},25:function(e,n,t){},26:function(e,n,t){},30:function(e,n,t){"use strict";t.r(n);var o=t(11),r=t.n(o),a=t(15),i=t.n(a),c=(t(25),t(26),t(16)),s=t.n(c),d=t(8);function l(){return Object(d.jsx)("div",{className:s.a.wrapper,children:Object(d.jsx)("header",{})})}var w,u,p=t(9),b=t.n(p),m=t(10),h=t(1),f=t(17),j=(t(29),t(18)),g=t(19),v=t(20),x=t(14),O=t.n(x),_=new h.hb,y=new h.wb({antialias:!0}),F=(new h.fb,new h.tb,window.innerWidth<760?60:45);function k(){function e(){return(e=Object(m.a)(b.a.mark((function e(){var n,t,o,r,a,i;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=new h.e(1,1,1),t=new h.N({color:8947848}),o=new h.K(n,t),_.add(o),"/models/cartier_room.mtl",r=new g.a,e.next=8,r.loadAsync("/models/cartier_room.mtl");case 8:a=e.sent,console.log("materials",a),(i=new j.a).setMaterials(a),"/work/models/cartier_room.obj",i.load("/work/models/cartier_room.obj",(function(e){e.scale.set(.01,.01,.01),e.position.set(0,-20,0),e.rotation.y=Math.PI/12,console.log("loaded",e.children),_.add(e)}),(function(){console.log("error")}));case 14:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function n(){_.rotation.y+=.001,f.update(),y.render(_,w),requestAnimationFrame(n)}return Object(o.useEffect)((function(){var t=document.querySelector("."+O.a.webgl);console.log(t),t.children.length<=0&&t.appendChild(y.domElement),(w=new h.X(F,window.innerWidth/window.innerHeight,.1,300)).position.set(0,0,10),y.setClearColor(16777215,1),y.setPixelRatio(1.5),y.setSize(window.innerWidth,window.innerHeight),y.shadowMap.enabled=!0,y.shadowMap.type=h.W,(u=new v.a(w,y.domElement)).enableZoom=!0,u.enableDamping=!0,u.dampingFactor=.12,function(){e.apply(this,arguments)}(),function(){var e=new h.a(16777215,.5);_.add(e);var n=new h.k(16777215,.5);n.position.set(3,2,3),_.add(n)}(),n()}),[]),Object(d.jsx)("div",{children:Object(d.jsx)("div",{className:O.a.webgl})})}var C=function(){return Object(d.jsxs)("div",{className:"App",children:[Object(d.jsx)(l,{}),Object(d.jsx)(k,{})]})},E=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,31)).then((function(n){var t=n.getCLS,o=n.getFID,r=n.getFCP,a=n.getLCP,i=n.getTTFB;t(e),o(e),r(e),a(e),i(e)}))};i.a.render(Object(d.jsx)(r.a.StrictMode,{children:Object(d.jsx)(C,{})}),document.getElementById("root")),E()}},[[30,1,2]]]);
//# sourceMappingURL=main.29f32a7c.chunk.js.map