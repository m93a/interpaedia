if(!window.__lib.enviro){throw;} //Requires enviro.js

win.location.hash = win.location.hash||"#0";
win.slides = {
 active: Math.max(Number(win.location.hash.substr(1)),0)|0,
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
win.on("load",function(){
 slides.jump = function(n){
  if(slides.lock){return;}
  slides.active = n;
  if(
   slides.trig(n)||
   slides.trig("change",n)
  ){
   return;
  }
  return win.location.hash = n;
 }
 slides.move = function(n){
  if(slides.lock){return;}
  ñ = Math.max(
   Number(
    win.location.hash.substr(1)
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
  return win.location.hash = ñ;
 }
});

win.__lib.slides = true;
