Library(
 "slides",
 function(){

window.slides = {
 active: Math.max(Number(window.location.hash.substr(1)),0)|0,
 lock: false,
 events: [],
 on: function(n,f){
  if(!this.events[n]){this.events[n]=[];}
  if(!(this.events[n].indexOf(f)+1)){
   this.events[n][this.events[n].length]=f;
  }
 },
 rmon: function(n,f){
  if(!this.events[n]){return;}
  var ñ = this.events[n].indexOf(f);
  if(ñ+1){this.events[n].splice(ñ,1);}
 },
 trig: function(n){
  var obj = {
   _preventDefault:false,
   preventDefault:function(){this._preventDefault=true;}
  };
  if(n=="change"&&arguments[1]){
   obj["target"]=arguments[1];
  }
  if(this.events[n]){
   for(i in this.events[n]){
    try{this.events[n][i](obj);}
    catch(ñ){this.events[n].splice(i,1);}
   }
  }
  if(obj._preventDefault){return true;}
 }
};

slides.construct = function(){
 var arr = document.getElementsByTagName('section');
 var i = -1;
 while(++i<arr.length){
  arr[i].id = ''+i;
 }
};

window.addEventListener("load",function(){
 var style = document.createElement("style");
 style.textContent =
  "html,body,section{\n"+
  " margin:  0;\n"+
  " padding: 0;\n"+
  " width:  100%;\n"+
  " height: 100%;\n"+
  "}\n"+
  "section{\n"+
  " font-size: 2em;\n"+
  " position: absolute;\n"+
  " left: 0;\n"+
  " top:  0;\n"+
  " display: none;\n"+
  " background: white;\n"+
  "}\n"+
  " section:target ~ section{\n"+
  " display: block;\n"+
  " vertical-align: top;\n"+
  "}\n"+
  "section:target{\n"+
  " display: block;\n"+
  " z-index: 1;\n"+
  "}\n";
 document.head.appendChild(style);
 window.location.hash = window.location.hash||"#0";
 
 slides.jump = function(n){
  if(slides.lock){return;}
  slides.active = n;
  if(
   slides.trig(n)||
   slides.trig("change",n)
  ){
   return;
  }
  return window.location.hash = n;
 }
 slides.move = function(n){
  if(slides.lock){return;}
  var ñ = Math.max(
   Number(
    window.location.hash.substr(1)
   )+n,
   0
  )|0;
  slides.active = ñ;
  if(
   slides.trig(ñ)||
   slides.trig("change",ñ)
  ){
   return;
  }
  return window.location.hash = ñ;
 }
 
 window.addEventListener("keydown",function(e){
  switch(e.keyCode){
   case 37:
    slides.move(-1);
    break;
   case 39:
    slides.move(1);
    break;
   case 38:
   case 40:
    break;
   default:
    return;
  }
  e.preventDefault();
 });
});//End window.on(load)

});//End Library
