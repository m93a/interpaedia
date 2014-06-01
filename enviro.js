Library(
 "enviro",
 function(){

//Underscore function
/* * * *
 * How to use:
 * * * *
 * _(obj).count //Get the number of enumerable properties
 * 
 * _(obj,propertyName).getter = function(){} //Define getter...
 * _(obj,propertyName).setter = function(){} //...and setter
 *
 * _(obj,property1).link(property2) //Link two properties of obj
 * _(obj1,prop1).link(obj2,prop2) //Link obj1.prop1 and obj2.prop2
 *
 * //Note that two linked properties always have the same value
 * //Remember which one is the source and which is a link
 * //In this case source is obj1.prop1
 * 
 * _(obj2,prop2).unlink() //Does nothing
 * _(obj1,prop1).unlink() //Destroys the link
 * 
 */
window._ = function(){
 if(
  arguments.length == 2 &&
  typeof arguments[0] == "object" &&
  typeof arguments[1] == "string"
 ){
  return _(arguments[0]).prop(arguments[1]);
 }else if(
  arguments.length == 1 &&
  typeof arguments[0] == "object"
 ){
  var obj = new (function(origin){
   //_().origin
   Object.defineProperty(this,"origin",{
    "enumerable":true,
    "value":origin
   });
   
   //_().count
   Object.defineProperty(this,"count",{
    "enumerable":true,
    "get":function(){
      var i = 0;
      for(x in this.origin){
       i++;
      }
      return i;
    }
   });
   
   //_().link
   Object.defineProperty(this,"link",{
    "enumerable":true,
    "value":function(){
      var i = 0;
      while(++i<arguments.length){
       _(this.origin,arguments[i]).link(arguments[0]);
      }
    }
   });
   
   //_().unlink
   Object.defineProperty(this,"unlink",{
    "enumerable":true,
    "value":function(name){
      return _(this,name).unlink();
    }
   });
   
   //_().const
   Object.defineProperty(this,"const",{
    "enumerable":true,
    "value":function(name,value){
      return _(this,name).const(value);
    }
   });
   
   
   //_().prop
   Object.defineProperty(this,"prop",{
    "enumerable":true,
    "value":function(str){
      if(typeof str == "undefined"){return false;}
      var obj = {};
      
      //_().prop().origin
      Object.defineProperty(obj,"origin",{
       "enumerable":true,
       "value":this.origin
      });
      
      //_().prop().property
      Object.defineProperty(obj,"property",{
       "enumerable":true,
       "value":str
      });
      
      //_().prop().getter
      Object.defineProperty(obj,"getter",{
       "enumerable":true,
       "get":function(){
         var desc = Object.getOwnPropertyDescriptor(
          this.origin,
          this.property
         )||{};
         return desc.get;
       },
       "set":function(f){
         var desc = Object.getOwnPropertyDescriptor(
          this.origin,
          this.property
         )||{};
         desc = {
          configurable: true,
          enumerable: desc.enumerable,
          set: desc.set
         };
         desc.get = f;
         Object.defineProperty(this.origin,this.property,desc);
         return f;
       }
      });
      
      //_().prop().setter
      Object.defineProperty(obj,"setter",{
       "enumerable":true,
       "get":function(){
         var desc = Object.getOwnPropertyDescriptor(
          this.origin,
          this.property
         )||{};
         return desc.set;
       },
       "set":function(f){
         var desc = Object.getOwnPropertyDescriptor(
          this.origin,
          this.property
         )||{};
         desc = {
          configurable: true,
          enumerable: true,
          get: desc.get
         };
         desc.set = f;
         Object.defineProperty(this.origin,this.property,desc);
         return f;
       }
      });
      
      //_().prop().link
      Object.defineProperty(obj,"link",{
       "enumerable":true,
       "value":function(obj,key){
         if(typeof obj=="string" && !key){
          key = obj;
          obj = this.origin;
         }
         var desc = Object.getOwnPropertyDescriptor(obj,key)
                    ||{"enumerable":true};
         Object.defineProperty(this.origin,this.property,{
          "configurable":true,
          "enumerable":desc.enumerable,
          "get":function(){
            return obj[key];
          },
          "set": function(value){
            obj[key]=value;
          }
         });
         return obj[key];
       }
      });
      
      //_().prop().unlink
      Object.defineProperty(obj,"unlink",{
       "enumerable":true,
       "value":function(){
         var desc = Object.getOwnPropertyDescriptor(this.origin,this.property)
                    ||_.defaultDesc;
         Object.defineProperty(this.origin,this.property,{
          "configurable":true,
          "enumerable":desc.enumerable,
          "writeable":desc.writeable,
          "value": this.origin[this.property]
         });
         return this.origin[this.property];
       }
      });
      
      //_().prop().const
      Object.defineProperty(obj,"const",{
       "enumerable":true,
       "value":function(value){
         Object.defineProperty(this.origin,this.property,{
          "enumerable":true,
          "value":value
         });
         return value;
       }
      });
      return obj;
    }
   });
   
   //_().property
   Object.defineProperty(
    this,
    "property",
    Object.getOwnPropertyDescriptor(this,"prop")
   );
  })(arguments[0]);
  return obj;
 }
};
_.defaultDesc = {
 "configurable":true,
 "enumerable":true,
 "writable":true
};

//Shortands for global variables
_(window,"win").const(window);
_(window,"doc").const(win.document);
window.on   = win.addEventListener;
window.rmon = win.removeEventListener;


//Array extensions
/* * * *
 * How to use:
 * * * *
 * arr.last //Get the arr's last element
 * arr.last = "foo"; //Push "foo" to arr
 * 
 * arr.last = arr.last; //Duplicate the last element
 * 
 */
Object.defineProperty(Array.prototype,"last",{
 "get":function(){return this[this.length-1];},
 "set":function(){return this[this.length]=v;}
});


//CreateElement shortand
/* * * *
 * How to use:
 * * * *
 * doc.mkNode("span"); //New span element
 * doc.mkNode("svg","http://www.w3.org/2000/svg");
 *      //New namespaced svg element
 *
 * doc.mkNode("span",{ //New span element
 *  class:"small",     //with class attribute set to "small"
 *  _txt:"Foo Bar"     //and "Foo Bar" in text content
 * });
 */
doc.mkNode = function(n1,n2,n3){
 var node, attrs;
 if(typeof n2 == "string"){
  node = document.createElementNS(n1,n2);
  if(typeof n3 == "object"){
   attrs=n3;
  }
 }else{
  node = document.createElement(n1);
  if(typeof n2 == "object"){
   attrs=n2;
  }
 }
 if(attrs){
  for(attr in attrs){
   if(attr == "_txt"){
    node.txt = attrs[attr];
   }else{
    node.setAttribute(attr,attrs[attr]);
   }
  }
 }
 return node;
}

//Document shortands
doc.on   = doc.addEventListener;
doc.rmon = doc.removeEventListener;

doc.query = doc.querySelector;
doc.query.all = function(){return doc.querySelectorAll.apply(doc,arguments);};

doc.exe = function(path){
 return doc.body.mkChild("script",{"src":path});
};

//Modify the DOM elements
Element.prototype.rm       = Element.prototype.remove;
Element.prototype.clear    = function(){this.textContent="";};

Element.prototype.setAttr  = Element.prototype.setAttribute;
Element.prototype.getAttr  = Element.prototype.getAttribute;
Element.prototype.hasAttr  = Element.prototype.hasAttribute;
Element.prototype.addAttr  = function(n){this.setAttr(n,"");};
Element.prototype.rmAttr   = Element.prototype.removeAttribute;

Element.prototype.on       = Element.prototype.addEventListener;
Element.prototype.rmon     = Element.prototype.removeEventListener;

Element.prototype.addChild = Element.prototype.appendChild;
Element.prototype.rmChild  = Element.prototype.removeChild;
Element.prototype.mkChild  = function(ns,tag,attrs){
 //Combination of doc.mkNode and node.appendChild
 var n = doc.mkNode(ns,tag,attrs);
 this.addChild(n);
 return n;
};

Element.prototype.putBefore = function(newelem){
 return this.parent.insertBefore(newelem,this);
};
Element.prototype.putAfter  = function(newelem){
 return this.parent.insertBefore(newelem,this.nextSibling);
};


//TODO make this work with _().link
_(Element.prototype,"parent").getter = function(){return this.parentNode;   };
_(Element.prototype,"parent").setter = function(v){return this.parentNode=v;};

_(Element.prototype,"txt").getter = function(){return this.textContent;};
_(Element.prototype,"txt").setter = function(value){
 value = value+""; //String
 if(value.substr(0,this.txt.length) == this.txt){
  this.addTxt(value.substr(this.txt.length));
 }else{
  this.textContent = value;
 }
};

Element.prototype.addTxt = function(str){
 //this.textContent += str without loosing child elements
 if(!this.lastChild){
  this.textContent = str;
 }else if(this.lastChild instanceof Text){
  this.lastChild.textContent += str;
 }else{
  this.addChild(doc.createTextNode(str));
 }
 return this.textContent;
}


Element.prototype.hasClass = function(str){
 var attr = this.getAttr('class');
 try{
  attr = attr.split(' ');
  if(attr.indexOf(str)+1){
   return true;
  }
 }catch(e){}
 return false;
};
Element.prototype.addClass = function(str){
 var attr = this.getAttr('class');
 try{
  attr = attr.split(' ');
  if(attr.indexOf(str)+1){
   return str;
  }else{
   attr[attr.length] = str;
   attr = attr.join(' ');
   this.setAttr('class',attr);
   return str;
  }
 }catch(e){
  this.setAttr('class',str);
  return str;
 }
};
Element.prototype.rmClass = function(str){
 var attr = this.getAttr('class');
 try{
  var i;
  attr = attr.split(' ');
  if((i=attr.indexOf(str))+1){
   attr.splice(i,1);
   attr = attr.join(' ');
   this.setAttr('class',attr);
  }
 }catch(e){}
 return str;
};
Element.prototype.setClass = function(str){
 try{
  str = str.join(' ');
 }catch(e){}
 this.setAttr('class',str);
};
Element.prototype.getClass = function(){
 var attr = this.getAttr('class');
 try{
  return attr.split(' ');
 }catch(e){
  return [];
 }
};
Element.prototype.spliceClass = function(){
 var attr = this.getClass();
 var result = attr.splice.apply(attr,arguments);
 this.setClass(attr);
 return result;
}


//Query
win.$ = {};
$.id = function(str){return doc.getElementById(str);};
$.class = function(str){return doc.getElementsByClassName(str);};
$.tag = function(str){return doc.getElementsByTagName(str);};

_($,"head").link(doc,"head");
_($,"body").link(doc,"body");

//Timing
win.wait = function(t,f,o){return {"timeout":win.setTimeout(f,t*1000,o)};};
win.interval = function(t,f,o){return {"interval":win.setInterval(f,t*1000,o)};};
win.stopTime = function(o){
 if(o.timeout){
  return win.clearTimeout(o.timeout);
 }
 if(o.interval){
  return win.clearInterval(o.interval);
 }
 return false;
};
win.async = function(f,o){win.setTimeout(f,0,o); return o;}

//Constants
_(win,  "inf").const(Infinity);
_(win,  "u"  ).const({});
_(win.u,"sec").const(1);
_(win.u,"min").const(60);
_(win.u,"px" ).const(1);

});
