/**
 * talqsInteraction v1.0.0
 * (c) 2018 JinJun He
 * @license MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.TalqsInteraction = factory());
}(this, (function () { 'use strict';

/**
 * TalqsTemplate v1.0.0
 * (c) 2018 JinJun He
 * @license MIT
 */
var template=function(e,n){return"string"==typeof n?compile(n,{filename:e}):renderFile(e,n)};template.version="3.0.0",template.config=function(e,n){defaults[e]=n;};var defaults=template.defaults={openTag:"<%",closeTag:"%>",escape:!0,cache:!0,compress:!1,parser:null}; var cacheStore=template.cache={};template.render=function(e,n){return compile(e)(n)};var renderFile=template.renderFile=function(e,n){var t=template.get(e)||showDebugInfo({filename:e,name:"Render Error",message:"Template not found"});return n?t(n):t};template.get=function(e){var n;if(cacheStore[e]){ n=cacheStore[e]; }else if("object"==typeof document){var t=document.getElementById(e);if(t){var a=(t.value||t.innerHTML).replace(/^\s*|\s*$/g,"");n=compile(a,{filename:e});}}return n};var toString=function(e,n){return"string"!=typeof e&&("number"===(n=typeof e)?e+="":e="function"===n?toString(e.call(e)):""),e}; var escapeMap={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"}; var escapeFn=function(e){return escapeMap[e]}; var escapeHTML=function(e){return toString(e).replace(/&(?![\w#]+;)|[<>"']/g,escapeFn)}; var isArray=Array.isArray||function(e){return"[object Array]"==={}.toString.call(e)}; var each=function(e,n){var t,a;if(isArray(e)){ for(t=0,a=e.length;t<a;t++){ n.call(e,e[t],t,e); } }else { for(t in e){ n.call(e,e[t],t); } }}; var utils=template.utils={$helpers:{},$include:renderFile,$string:toString,$escape:escapeHTML,$each:each};template.helper=function(e,n){helpers[e]=n;};var helpers=template.helpers=utils.$helpers;template.onerror=function(e){var n="Template Error\n\n";for(var t in e){ n+="<"+t+">\n"+e[t]+"\n\n"; }"object"==typeof console&&console.error(n);};var showDebugInfo=function(e){return template.onerror(e),function(){return"{Template Error}"}}; var compile=template.compile=function(t,a){for(var e in a=a||{},defaults){ void 0===a[e]&&(a[e]=defaults[e]); }var i=a.filename;try{var l=compiler(t,a);}catch(e){return e.filename=i||"anonymous",e.name="Syntax Error",showDebugInfo(e)}function n(n){try{return new l(n,i)+""}catch(e){return a.debug?showDebugInfo(e)():(a.debug=!0,compile(t,a)(n))}}return n.prototype=l.prototype,n.toString=function(){return l.toString()},i&&a.cache&&(cacheStore[i]=n),n}; var forEach=utils.$each; var KEYWORDS="break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined"; var REMOVE_RE=/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g; var SPLIT_RE=/[^\w$]+/g; var KEYWORDS_RE=new RegExp(["\\b"+KEYWORDS.replace(/,/g,"\\b|\\b")+"\\b"].join("|"),"g"); var NUMBER_RE=/^\d[^,]*|,\d[^,]*/g; var BOUNDARY_RE=/^,+|,+$/g; var SPLIT2_RE=/^$|,+/;function getVariable(e){return e.replace(REMOVE_RE,"").replace(SPLIT_RE,",").replace(KEYWORDS_RE,"").replace(NUMBER_RE,"").replace(BOUNDARY_RE,"").split(SPLIT2_RE)}function stringify(e){return"'"+e.replace(/('|\\)/g,"\\$1").replace(/\r/g,"\\r").replace(/\n/g,"\\n")+"'"}function compiler(e,i){var l=i.debug,n=i.openTag,a=i.closeTag,o=i.parser,t=i.compress,s=i.escape,r=1,c={$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1},p="".trim,u=p?["$out='';","$out+=",";","$out"]:["$out=[];","$out.push(",");","$out.join('')"],d=p?"$out+=text;return $out;":"$out.push(text);",m="function(){var text=''.concat.apply('',arguments);"+d+"}",f="function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);"+d+"}",y="'use strict';var $utils=this,$helpers=$utils.$helpers,"+(l?"$line=0,":""),g=u[0],h="return new String("+u[3]+");";forEach(e.split(n),function(e){var n=(e=e.split(a))[0],t=e[1];1===e.length?g+=w(n):(g+=function(e){var n=r;o?e=o(e,i):l&&(e=e.replace(/\n/g,function(){return"$line="+ ++r+";"}));if(0===e.indexOf("=")){var t=s&&!/^=[=#]/.test(e);if(e=e.replace(/^=[=#]?|[\s;]*$/g,""),t){var a=e.replace(/\s*\([^\)]+\)/,"");utils[a]||/^(include|print)$/.test(a)||(e="$escape("+e+")");}else { e="$string("+e+")"; }e=u[1]+e+u[2];}l&&(e="$line="+n+";"+e);return forEach(getVariable(e),function(e){var n;e&&!c[e]&&(n="print"===e?m:"include"===e?f:utils[e]?"$utils."+e:helpers[e]?"$helpers."+e:"$data."+e,y+=e+"="+n+",",c[e]=!0);}),e+"\n"}(n),t&&(g+=w(t)));});var v=y+g+h;l&&(v="try{"+v+"}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:"+stringify(e)+".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}");try{var b=new Function("$data","$filename",v);return b.prototype=utils,b}catch(e){throw e.temp="function anonymous($data,$filename) {"+v+"}",e}function w(e){return r+=e.split(/\n/).length-1,t&&(e=e.replace(/\s+/g," ").replace(/<!--[\w\W]*?-->/g,"")),e&&(e=u[1]+stringify(e)+u[2]+"\n"),e}}defaults.openTag="{{",defaults.closeTag="}}";var filtered=function(e,n){var t=n.split(":"),a=t.shift(),i=t.join(":")||"";return i&&(i=", "+i),"$helpers."+a+"("+e+i+")"};defaults.parser=function(e,n){var t=(e=e.replace(/^\s/,"")).split(" "),a=t.shift(),i=t.join(" ");switch(a){case"if":e="if("+i+"){";break;case"else":e="}else"+(t="if"===t.shift()?" if("+t.join(" ")+")":"")+"{";break;case"/if":e="}";break;case"each":var l=t[0]||"$data";"as"!==(t[1]||"as")&&(l="[]"),e="$each("+l+",function("+((t[2]||"$value")+","+(t[3]||"$index"))+"){";break;case"/each":e="});";break;case"echo":e="print("+i+");";break;case"print":case"include":e=a+"("+t.join(",")+");";break;default:if(/^\s*\|\s*[\w\$]/.test(i)){var o=!0;0===e.indexOf("#")&&(e=e.substr(1),o=!1);for(var s=0,r=e.split("|"),c=r.length,p=r[s++];s<c;s++){ p=filtered(p,r[s]); }e=(o?"=":"=#")+p;}else { e=template.helpers[a]?"=#"+a+"("+t.join(",")+");":"="+e; }}return e};var components={Question:"question",StemsWrapper:"stemsWrapper",ChildQSAnalyze:"childQSAnalyzeWrapper",AnalyzeWrapper:"analyzeWrapper",Index:"questionIndex",Source:"questionSource",Difficulty:"questionDifficulty",Content:"questionContent",Options:"questionOptions",ChildList:"questionChildList",Answer:"questionAnswer",AnswerItem:"questionAnswerItem",Analyze:"questionAnalyze",AnalyzeItem:"questionAnalyzeItem",KnowledgePoint:"questionKnowledgePoint",KnowledgePointItem:"questionKnowledgePointItem",QueID:"questionID"}; var templateConfig={};templateConfig[components.Question]=[components.StemsWrapper,components.AnalyzeWrapper],templateConfig[components.StemsWrapper]=[components.Index,components.Source,components.Difficulty,components.Content,components.Options,components.ChildList,components.ChildQSAnalyze],templateConfig[components.AnalyzeWrapper]=[components.Answer,components.Analyze,components.KnowledgePoint,components.QueID];var obj; var labelConfig={answer:"答案",analyze:"解析",queId:"ID",knowledgePoint:"知识点",label:"标签"}; var main="talqs"; var options=main+"_options"; var style={main:main,options:options,stems:main+"_main",subqs:main+"_subqs",content:main+"_content",difficulty:main+"_difficulty",index:main+"_index",source:main+"_source",knowledgePoint:main+"_knowledge_point",id:main+"_id",analyzeItem:main+"_analyze_item",analyzeItemIndex:main+"_analyze_item_index",panelItem:main+"_panel_item",panelItemContent:main+"_panel_item_content",panelItemIndex:main+"_panel_item_index",answer:main+"_answer",analyze:main+"_analyze",analyzeGroup:main+"_analyze_group",analyzeLayer:main+"_analyze_layer",analyzeSingle:main+"_analyze_single",optionsList:options+"_list",optionsRows:options+"_rows",optionsColumns:options+"_columns",optionsItem:options+"_columns_item",optionsIndex:options+"_index",optionsLabel:options+"_label",optionsContent:options+"_content",layoutComplete:main+"_layout_complete",label:main+"_label",panel:main+"_panel",tree:main+"_tree",clear:"clearfix"}; var talqsTemplateConfig={analyzeVersion:0,hideSource:!(templateConfig[components.ChildQSAnalyze]=[components.Answer,components.Analyze,components.KnowledgePoint,components.QueID]),hideDifficulty:!1,templates:templateConfig,labels:labelConfig,queIndex:0,entryTemplate:components.Question,autoLayoutHook:'[data-auto-layout="1"]',layoutClassName:style.optionsList,layoutCompleteClassName:style.layoutComplete,components:components,showMultiAnswer:!0,separator:{0:[" ; "," 或 "]}}; var helper={json:function(e){return JSON.stringify(e)},formatDifficulty:function(e,n){e=parseInt(e,10)||0;for(var t="",a=0;a<e;a++){ t+=n; }return t},formatAnswer:function(e,n){var t="";if(Array.isArray(e)){var a=e.length,i=parseInt(n.type,10)||0,l=parseInt(n.subjectId,10)||0,o=n.separator[l],s=n.showMulti,r=o[0],c=o[1];switch(i){case 4:case 8:e.forEach(function(e,n){Array.isArray(e)?t+=1<e.length&&s?e.join(c):e[0]:t+=e,n<a-1&&(t+=r);});break;case 10:for(var p=0;p<a;p++){ p%5==0&&0<p&&(t+=" "),t+=e[p]; }break;default:t=e.join("");}}return t}}; var question='<div class="'+style.main+'" data-talqs-root="{{data.queId}}">\n  {{ each config.templates[\''+components.Question+"'] }}\n    {{include $value}}\n  {{/each}}\n</div>\n"; var stemsWrapper='\n<div class="'+style.stems+" "+style.clear+'" data-que-id="{{data.queId}}">\n {{each config.templates[\''+components.StemsWrapper+"']}}\n    {{include $value}}\n {{/each}}\n</div>\n"; var analyzeWrapper='\n  {{if config.analyzeVersion === 2}}\n     <div class="'+style.analyzeGroup+'">\n      <div class="'+style.analyzeLayer+"\">\n        {{ each config.templates['"+components.AnalyzeWrapper+"'] }}\n          {{include $value}}\n        {{/each}}\n      </div>\n    </div>\n  {{/if}}\n"; var questionIndex='\n{{if index && index > 0}}\n  <span class="'+style.index+'">{{index}}</span>\n{{/if}}\n'; var questionSource='\n{{if !isSub && !config.hideSource}}\n  <div class="'+style.source+'">\n    {{data.queSource}}\n  </div>\n{{/if}}\n'; var questionContent='\n{{if data.content && !data.hideContent}}\n  <div class="'+style.content+" "+style.clear+'">\n    {{if data.queDesc}}\n      <div>{{data.queDesc}}</div>\n    {{/if}}\n    {{#data.content}}\n  </div>\n{{/if}}\n'; var questionOptions='\n{{ if data.answerOptionList && data.answerOptionList.length }}\n  <div class="'+style.options+" "+style.clear+" {{data.isCloze ? 'talqs_main_fill' : ''}}\">\n    <ul class=\""+style.optionsList+'" data-auto-layout="{{data.answerOptionList[0].length}}">\n      {{each data.answerOptionList}}\n        <li class="'+style.optionsRows+" "+style.clear+'">\n          {{if data.isCloze}}\n            <span class="'+style.optionsIndex+'">{{$index+1}}. </span>\n          {{/if}}\n          <ul class="'+style.optionsColumns+"_{{$value.length}} "+style.clear+'"\n            data-auto-layout="{{ data.isCloze ? 1 : 0 }}"\n          >\n            {{each $value}}\n              <li class="'+style.optionsItem+" "+style.clear+'">\n                <span class="'+style.optionsLabel+'">{{$value.aoVal}}. </span>\n                <div class="'+style.optionsContent+'">{{#$value.content}}</div>\n              </li>\n            {{/each}}\n          </ul>\n        </li>\n      {{/each}}\n    </ul>\n  </div>\n{{/if}}\n'; var star="<span>&#9733;</span>"; var questionDifficulty='\n{{if !isSub && !config.hideDifficulty}}\n  <div class="'+style.difficulty+"\">\n    {{#data.difficulty | formatDifficulty:'"+star+"'}}\n  </div>\n{{/if}}\n"; var childData="{data:$value,config:config,index:$index+1,isSub:true}"; var questionChildList='\n{{ if data.childList }}\n  <div class="'+style.subqs+"\">\n    {{each data.childList}}\n      {{include '"+components.StemsWrapper+"' "+childData+" ''}}\n    {{/each}}\n  </div>\n{{/if}}\n"; var childQSAnalyzeWrapper='\n{{if isSub && config.analyzeVersion === 1 && !data.childList }}\n   <div class="'+style.analyzeSingle+"\">\n    {{ each config.templates['"+components.ChildQSAnalyze+"'] }}\n      {{include $value}}\n    {{/each}}\n  </div>\n{{/if}}\n"; var questionAnswer='\n<div class="'+style.answer+"  "+style.clear+'">\n  <label class="'+style.label+'">\n    {{config.labels.answer}}\n  </label>\n  <div class="'+style.panel+"\">\n    {{include '"+components.AnswerItem+"'}}\n  </div>\n</div>\n"; var questionAnswerItem='\n{{if data.childList}}\n  {{each data.childList}}\n    <div class="'+style.analyzeItem+'">\n      <div class="'+style.analyzeItemIndex+"\">{{$index+1}}</div>\n      {{include '"+components.AnswerItem+"' {data:$value,config:config} ''}}\n    </div>\n  {{/each}}\n{{else}}\n  <div class=\""+style.panelItem+'">\n    <div class="'+style.panelItemContent+'">\n        {{#data.answer | formatAnswer:{type:data.logicQuesTypeId,subject:data.subjectId,separator:config.separator,showMulti:config.showMultiAnswer} }}\n    </div>\n  </div>\n{{/if}}\n'; var questionAnalyze='\n<div class="'+style.analyze+"  "+style.clear+'">\n  <label class="'+style.label+'">\n    {{config.labels.analyze}}\n  </label>\n  <div class="'+style.panel+"\">\n    {{include '"+components.AnalyzeItem+"'}}\n  </div>\n</div>\n"; var questionAnalyzeItem='\n{{if data.childList}}\n  {{each data.childList}}\n    <div class="'+style.analyzeItem+'">\n      <div class="'+style.analyzeItemIndex+"\">{{$index+1}}</div>\n      {{include '"+components.AnalyzeItem+"' {data:$value} ''}}\n    </div>\n  {{/each}}\n{{else}}\n  <div class=\""+style.panelItem+'">\n    {{each data.analysis }}\n      {{if data.analysis.length > 1}}\n        <span class="'+style.panelItemIndex+'">{{$index+1}}.</span>\n      {{/if}}\n      <div class="'+style.panelItemContent+'">\n        {{#$value}}\n      </div>\n    {{/each}}\n  </div>\n{{/if}}\n'; var questionKnowledgePoint='\n <div class="'+style.knowledgePoint+"  "+style.clear+'">\n  <label class="'+style.label+'">\n    {{config.labels.knowledgePoint}}\n  </label>\n  <div class="'+style.tree+"\">\n    <ul>\n      {{each data.examOptionList}}\n        {{include '"+components.KnowledgePointItem+"' {data:$value} ''}}\n      {{/each}}\n    </ul>\n  </div>\n</div>\n"; var questionKnowledgePointItem="\n<li>\n  {{data.name}}\n  {{if data.childList}}\n    <ul>\n      {{each data.childList}}\n        {{include '"+components.KnowledgePointItem+"' {data:$value} ''}}\n      {{/each}}\n    </ul>\n  {{/if}}\n</li>\n"; var questionID='\n<div class="'+style.id+"  "+style.clear+'">\n  <label class="'+style.label+'">\n    {{config.labels.queId}}\n  </label>\n  <div class="'+style.panel+'">\n    {{data.queId}}  \n  </div>\n</div>\n'; var cacheStore$1=((obj={})[components.Question]=question,obj[components.StemsWrapper]=stemsWrapper,obj[components.AnalyzeWrapper]=analyzeWrapper,obj[components.ChildQSAnalyze]=childQSAnalyzeWrapper,obj[components.Index]=questionIndex,obj[components.Source]=questionSource,obj[components.Content]=questionContent,obj[components.Options]=questionOptions,obj[components.Difficulty]=questionDifficulty,obj[components.ChildList]=questionChildList,obj[components.Answer]=questionAnswer,obj[components.AnswerItem]=questionAnswerItem,obj[components.Analyze]=questionAnalyze,obj[components.AnalyzeItem]=questionAnalyzeItem,obj[components.KnowledgePoint]=questionKnowledgePoint,obj[components.KnowledgePointItem]=questionKnowledgePointItem,obj[components.QueID]=questionID,obj); var fail=function(e){throw new Error(e)}; var TALQS_ERROR={InvalidQS:"Expect an object"}; var TalqsTemplate$1={version:"1.0.0",config:talqsTemplateConfig,get components(){return this.config.components}}; var assign=Object.assign||function(e,n){var t=arguments;if(null==e){ throw new TypeError("Cannot convert undefined or null to object"); }for(var a=Object(e),i=1;i<arguments.length;i++){var l=t[i];if(null!=l){ for(var o in l){ Object.prototype.hasOwnProperty.call(l,o)&&(a[o]=l[o]); } }}return a}; var isObject=function(e){return e&&"object"==typeof e};TalqsTemplate$1.render=function(e,n){if(!e||!isObject(e)){ return fail(TALQS_ERROR.InvalidQS); }for(var t in n=n||{},talqsTemplateConfig){var a=talqsTemplateConfig[t];if(void 0===n[t]){ n[t]=a; }else{var i=n[t];isObject(i)&&(n[t]=assign({},a,i));}}return TalqsTemplate$1.config=n,(0,template.cache[n.entryTemplate])({config:n,data:e,index:n.queIndex})},TalqsTemplate$1.renderPartialComponent=function(e,n){if(!n||!isObject(n)){ return fail(TALQS_ERROR.InvalidQS); }var t=TalqsTemplate$1.config,a=template.cache[e];return a&&a({config:t,data:n})};var registerHelper=function(e,n){template.helper(e,n);};for(var key in TalqsTemplate$1.registerHelper=registerHelper,helper){ registerHelper(key,helper[key]); }var registerComponent=function(e){for(var n in e){var t=e[n].replace(/^\s*|\s*$/g,""),a=template.compile(t,{filename:n});template.cache[n]=a;}};registerComponent(cacheStore$1);var updateTemplateList=function(o){var s=TalqsTemplate$1.config.templates,e=function(e){var n=o[e],t=s[e]||[];n.exclude&&n.exclude.length&&t.length&&(t=t.filter(function(e){return-1===n.exclude.indexOf(e)}));var a={};if(n.template&&(a[e]=n.template),n.components&&n.components.length){var i=void 0,l=void 0;n.components.forEach(function(e){if(i=e.name,(l=t.indexOf(i))<0){var n=isNaN(e.index)?t.length:e.index;t.splice(n,0,i);}else { isNaN(e.index)||(t.splice(l,1),t.splice(e.index,0,i)); }a[i]=e.template;});}Object.keys(a).length&&registerComponent(a),TalqsTemplate$1.config.templates[e]=t.filter(function(e){return"string"==typeof e});};for(var n in o){ e(n); }};TalqsTemplate$1.updateTemplateList=updateTemplateList,TalqsTemplate$1.autoLayout=function(s){var e=TalqsTemplate$1.config.autoLayoutHook,n=document.querySelectorAll(e);if(n&&n.length){var r=TalqsTemplate$1.config.layoutCompleteClassName;(n=Array.prototype.slice.apply(n)).forEach(function(e){var n=s||Math.floor(e.offsetWidth);e.style.display="inline-block";var t=e.children.length,a=Math.ceil(e.offsetWidth+10),i=1;a&&(i=t<=Math.floor(n/a)?t:n/2<=a?1:n/4<=a?2:4);var l=TalqsTemplate$1.config.layoutClassName+"_",o=new RegExp(l+"\\d","g");e.className=e.className.replace(o,""),e.classList.add(l+i),e.classList.add(r),e.style.display="";});}},TalqsTemplate$1.resetComponent=function(){var e=Array.prototype.slice.call(arguments),t={};e.length?e.forEach(function(e){var n=cacheStore$1[e];n&&(t[e]=n);}):t=cacheStore$1,registerComponent(t);};
window.TalqsTemplate = TalqsTemplate$1;

var control=function(t){function e(r){if(n[r]){ return n[r].exports; }var i=n[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r});},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=276)}([function(t,e,n){function r(t){return function e(n,r){switch(arguments.length){case 0:return e;case 1:return o(n)?e:i(function(e){return t(n,e)});default:return o(n)&&o(r)?e:o(n)?i(function(e){return t(e,r)}):o(r)?i(function(e){return t(n,e)}):t(n,r)}}}var i=n(1),o=n(63);t.exports=r;},function(t,e,n){function r(t){return function e(n){return 0===arguments.length||i(n)?e:t.apply(this,arguments)}}var i=n(63);t.exports=r;},function(t,e,n){function r(t){return function e(n,r,a){switch(arguments.length){case 0:return e;case 1:return u(n)?e:o(function(e,r){return t(n,e,r)});case 2:return u(n)&&u(r)?e:u(n)?o(function(e,n){return t(e,r,n)}):u(r)?o(function(e,r){return t(n,e,r)}):i(function(e){return t(n,r,e)});default:return u(n)&&u(r)&&u(a)?e:u(n)&&u(r)?o(function(e,n){return t(e,n,a)}):u(n)&&u(a)?o(function(e,n){return t(e,r,n)}):u(r)&&u(a)?o(function(e,r){return t(n,e,r)}):u(n)?i(function(e){return t(e,r,a)}):u(r)?i(function(e){return t(n,e,a)}):u(a)?i(function(e){return t(n,r,e)}):t(n,r,a)}}}var i=n(1),o=n(0),u=n(63);t.exports=r;},function(t,e,n){function r(t,e,n){return function(){if(0===arguments.length){ return n(); }var r=Array.prototype.slice.call(arguments,0),u=r.pop();if(!i(u)){for(var a=0;a<t.length;){if("function"==typeof u[t[a]]){ return u[t[a]].apply(u,r); }a+=1;}if(o(u)){return e.apply(null,r)(u)}}return n.apply(this,arguments)}}var i=n(27),o=n(105);t.exports=r;},function(t,e){t.exports={init:function(){return this.xf["@@transducer/init"]()},result:function(t){return this.xf["@@transducer/result"](t)}};},function(t,e,n){var r=n(18),i=n(1),o=n(0),u=n(60),a=o(function(t,e){return 1===t?i(e):r(t,u(t,[],e))});t.exports=a;},function(t,e){var n=t.exports={version:"2.5.4"};"number"==typeof __e&&(__e=n);},function(t,e){function n(t,e){return Object.prototype.hasOwnProperty.call(e,t)}t.exports=n;},function(t,e,n){var r=n(0),i=n(3),o=n(64),u=n(11),a=n(428),s=n(5),c=n(19),f=r(i(["fantasy-land/map","map"],a,function(t,e){switch(Object.prototype.toString.call(e)){case"[object Function]":return s(e.length,function(){return t.call(this,e.apply(this,arguments))});case"[object Object]":return u(function(n,r){return n[r]=t(e[r]),n},{},c(e));default:return o(t,e)}}));t.exports=f;},function(t,e,n){var r=n(86)("wks"),i=n(54),o=n(17).Symbol,u="function"==typeof o;(t.exports=function(t){return r[t]||(r[t]=u&&o[t]||(u?o:i)("Symbol."+t))}).store=r;},function(t,e,n){var r=n(0),i=n(403),o=r(function(t,e){return i(t,e,[],[])});t.exports=o;},function(t,e,n){function r(t,e,n){for(var r=0,i=n.length;r<i;){if((e=t["@@transducer/step"](e,n[r]))&&e["@@transducer/reduced"]){e=e["@@transducer/value"];break}r+=1;}return t["@@transducer/result"](e)}function i(t,e,n){for(var r=n.next();!r.done;){if((e=t["@@transducer/step"](e,r.value))&&e["@@transducer/reduced"]){e=e["@@transducer/value"];break}r=n.next();}return t["@@transducer/result"](e)}function o(t,e,n,r){return t["@@transducer/result"](n[r](c(t["@@transducer/step"],t),e))}function u(t,e,n){if("function"==typeof t&&(t=s(t)),a(n)){ return r(t,e,n); }if("function"==typeof n["fantasy-land/reduce"]){ return o(t,e,n,"fantasy-land/reduce"); }if(null!=n[f]){ return i(t,e,n[f]()); }if("function"==typeof n.next){ return i(t,e,n); }if("function"==typeof n.reduce){ return o(t,e,n,"reduce"); }throw new TypeError("reduce: list must be array or iterable")}var a=n(61),s=n(165),c=n(143),f="undefined"!=typeof Symbol?Symbol.iterator:"@@iterator";t.exports=u;},function(t,e,n){var r=n(17),i=n(6),o=n(29),u=n(26),a=n(30),s=function(t,e,n){var c,f,l,p=t&s.F,h=t&s.G,d=t&s.S,v=t&s.P,g=t&s.B,y=t&s.W,m=h?i:i[e]||(i[e]={}),x=m.prototype,w=h?r:d?r[e]:(r[e]||{}).prototype;h&&(n=e);for(c in n){ (f=!p&&w&&void 0!==w[c])&&a(m,c)||(l=f?w[c]:n[c],m[c]=h&&"function"!=typeof w[c]?n[c]:g&&f?o(l,r):y&&w[c]==l?function(t){var e=function(e,n,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,r)}return t.apply(this,arguments)};return e.prototype=t.prototype,e}(l):v&&"function"==typeof l?o(Function.call,l):l,v&&((m.virtual||(m.virtual={}))[c]=l,t&s.R&&x&&!x[c]&&u(x,c,l))); }};s.F=1,s.G=2,s.S=4,s.P=8,s.B=16,s.W=32,s.U=64,s.R=128,t.exports=s;},function(t,e,n){var r=n(25),i=n(123),o=n(88),u=Object.defineProperty;e.f=n(16)?Object.defineProperty:function(t,e,n){if(r(t),e=o(e,!0),r(n),i){ try{return u(t,e,n)}catch(t){} }if("get"in n||"set"in n){ throw TypeError("Accessors not supported!"); }return"value"in n&&(t[e]=n.value),t};},function(t,e){function n(t,e){t=t||[],e=e||[];var n,r=t.length,i=e.length,o=[];for(n=0;n<r;){ o[o.length]=t[n],n+=1; }for(n=0;n<i;){ o[o.length]=e[n],n+=1; }return o}t.exports=n;},function(t,e,n){var r=n(40),i=n(2),o=i(r("slice",function(t,e,n){return Array.prototype.slice.call(n,t,e)}));t.exports=o;},function(t,e,n){t.exports=!n(31)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a});},function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n);},function(t,e){function n(t,e){switch(t){case 0:return function(){return e.apply(this,arguments)};case 1:return function(t){return e.apply(this,arguments)};case 2:return function(t,n){return e.apply(this,arguments)};case 3:return function(t,n,r){return e.apply(this,arguments)};case 4:return function(t,n,r,i){return e.apply(this,arguments)};case 5:return function(t,n,r,i,o){return e.apply(this,arguments)};case 6:return function(t,n,r,i,o,u){return e.apply(this,arguments)};case 7:return function(t,n,r,i,o,u,a){return e.apply(this,arguments)};case 8:return function(t,n,r,i,o,u,a,s){return e.apply(this,arguments)};case 9:return function(t,n,r,i,o,u,a,s,c){return e.apply(this,arguments)};case 10:return function(t,n,r,i,o,u,a,s,c,f){return e.apply(this,arguments)};default:throw new Error("First argument to _arity must be a non-negative integer no greater than ten")}}t.exports=n;},function(t,e,n){var r=n(1),i=n(7),o=n(160),u=!{toString:null}.propertyIsEnumerable("toString"),a=["constructor","valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"],s=function(){"use strict";return arguments.propertyIsEnumerable("length")}(),c=function(t,e){for(var n=0;n<t.length;){if(t[n]===e){ return!0; }n+=1;}return!1},f="function"!=typeof Object.keys||s?function(t){if(Object(t)!==t){ return[]; }var e,n,r=[],f=s&&o(t);for(e in t){ !i(e,t)||f&&"length"===e||(r[r.length]=e); }if(u){ for(n=a.length-1;n>=0;){ e=a[n],i(e,t)&&!c(r,e)&&(r[r.length]=e),n-=1; } }return r}:function(t){return Object(t)!==t?[]:Object.keys(t)},l=r(f);t.exports=l;},function(t,e,n){var r=n(2),i=n(11),o=r(i);t.exports=o;},function(t,e,n){"use strict";e.__esModule=!0,e.default=function(t,e){if(!(t instanceof e)){ throw new TypeError("Cannot call a class as a function") }};},function(t,e,n){"use strict";e.__esModule=!0;var r=n(286),i=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,i.default)(t,r.key,r);}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}();},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t};},function(t,e,n){t.exports={default:n(291),__esModule:!0};},function(t,e,n){var r=n(23);t.exports=function(t){if(!r(t)){ throw TypeError(t+" is not an object!"); }return t};},function(t,e,n){var r=n(13),i=n(39);t.exports=n(16)?function(t,e,n){return r.f(t,e,i(1,n))}:function(t,e,n){return t[e]=n,t};},function(t,e){t.exports=Array.isArray||function(t){return null!=t&&t.length>=0&&"[object Array]"===Object.prototype.toString.call(t)};},function(t,e){function n(t){return t&&t["@@transducer/reduced"]?t:{"@@transducer/value":t,"@@transducer/reduced":!0}}t.exports=n;},function(t,e,n){var r=n(119);t.exports=function(t,e,n){if(r(t),void 0===e){ return t; }switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,r){return t.call(e,n,r)};case 3:return function(n,r,i){return t.call(e,n,r,i)}}return function(){return t.apply(e,arguments)}};},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)};},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}};},function(t,e,n){var r=n(124),i=n(78);t.exports=function(t){return r(i(t))};},function(t,e,n){var r=n(1),i=r(function(t){return function(){return t}});t.exports=i;},function(t,e,n){function r(t,e){return i(e,t,0)>=0}var i=n(159);t.exports=r;},function(t,e,n){var r=n(0),i=r(function(t,e){return e>t?e:t});t.exports=i;},function(t,e,n){var r=n(0),i=r(function(t,e){for(var n=e,r=0;r<t.length;){if(null==n){ return; }n=n[t[r]],r+=1;}return n});t.exports=i;},function(t,e,n){"use strict";e.__esModule=!0;var r=n(285),i=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=function(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++){ n[e]=t[e]; }return n}return(0,i.default)(t)};},function(t,e){t.exports={};},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}};},function(t,e,n){function r(t,e){return function(){var n=arguments.length;if(0===n){ return e(); }var r=arguments[n-1];return i(r)||"function"!=typeof r[t]?e.apply(this,arguments):r[t].apply(r,Array.prototype.slice.call(arguments,0,n-1))}}var i=n(27);t.exports=r;},function(t,e){function n(t){return"[object String]"===Object.prototype.toString.call(t)}t.exports=n;},function(t,e,n){var r=n(0),i=n(62),o=n(5),u=n(45),a=r(function(t,e){return o(t+1,function(){var n=arguments[t];if(null!=n&&i(n[e])){ return n[e].apply(n,Array.prototype.slice.call(arguments,0,t)); }throw new TypeError(u(n)+' does not have a method named "'+e+'"')})});t.exports=a;},function(t,e,n){var r=n(0),i=n(41),o=r(function(t,e){var n=t<0?e.length+t:t;return i(e)?e.charAt(n):e[n]});t.exports=o;},function(t,e,n){var r=n(0),i=n(8),o=n(107),u=r(function(t,e){return i(o(t),e)});t.exports=u;},function(t,e,n){var r=n(1),i=n(415),o=r(function(t){return i(t,[])});t.exports=o;},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0}),e.newJudgeAnswerComposite=e.judgeAnswerComposite=e.judgeAnswer=e.formatAnswer=void 0;var i=n(115),o=r(i),u=n(73),a=r(u),s=n(72),c=function(t){if(t&&t.__esModule){ return t; }var e={};if(null!=t){ for(var n in t){ Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]); } }return e.default=t,e}(s),f=new a.default,l=e.formatAnswer=function(t){if(t){var e=f.toDBC(t),n=f.replaceBlank(e);return f.replaceChinaCode(n)}};e.judgeAnswer=function(t){var e=t.stuAnswer,n=t.rigAnswer,r=t.type,i=t.queId,u=parseInt(t.subjectId,10),a=(parseInt(t.gradeGroupId,10),[{queId:i,judge:[]}]);if(2==r){if(0==e.length){ return[{queId:i,judge:[-2]}]; }var s=e.toString(),c=n.toString();return s.length==c.length?(n.forEach(function(t){s.indexOf(t)>-1?a[0].judge.push(1):a[0].judge.push(0);}),a[0].judge=a[0].judge.indexOf(0)>-1?[0]:[1]):a=[{queId:i,judge:[0]}],a}if(13==r){var p=e.join("");e=[p];}return n.forEach(function(t,n){if(e[n]){e[n]=l(e[n]);var i=!0;if(t instanceof Array){ for(var s=0;s<t.length;s++){if(t[s]=l(t[s]),e[n]==t[s]){a[0].judge.push(1),i=!1;break}if(3==u&&4==r){var c=t[s].slice(1);if(e[n]==c){a[0].judge.push(1),i=!1;break}}else if([2,4,5,6].indexOf(u)>-1){if(t[s]=f.littleMath(t[s]),e[n]=f.littleMath(e[n]),t[s]===e[n]){a[0].judge.push(1),i=!1;break}try{var p=o.default.parse(t[s]).expr,h=o.default.parse(e[n]).expr;if(p&&h&&p.print&&h.print&&p.print()===h.print()){a[0].judge.push(1),i=!1;break}}catch(t){}if(t[s]=f.lastReplace(t[s]),e[n]=f.lastReplace(e[n]),t[s]===e[n]){a[0].judge.push(1),i=!1;break}}} }else { e[n]==t&&(a[0].judge.push(1),i=!1); }i&&a[0].judge.push(0);}else { a[0].judge.push(-2); }}),a},e.judgeAnswerComposite=function(t){var e=t;"string"==typeof e&&(e=JSON.parse(e));var n=[];return e.forEach(function(t){8!=t[2]?n.push(c.chooseJudgeVersion(t)):n.push(-1);}),n},e.newJudgeAnswerComposite=function(t){var e=t;"string"==typeof e&&(e=JSON.parse(e));var n=[];return e.forEach(function(t){8!=t[2]?n.push(c.chooseJudgeVersion(t)[0]):n.push(-1);}),n};},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(24),o=r(i),u=n(76),a=r(u),s=n(118),c=r(s),f=n(37),l=r(f),p=n(21),h=r(p),d=n(22),v=r(d),g=function(){function t(){(0,h.default)(this,t);}return(0,v.default)(t,[{key:"removeDuplicatedItem",value:function(t){if(!this.isArray(t)){ return t; }if(this.isArray(t[0])){for(var e={},n=[],r=0,i=t.length;r<i;r+=1){ e[t[r]]||(n.push(t[r]),e[t[r]]=!0); }return n}return[].concat((0,l.default)(new c.default(t)))}},{key:"isEmptyObject",value:function(t){var e=void 0;for(e in t){ if(Object.prototype.hasOwnProperty.call(t,e)){ return!1; } }return!0}},{key:"ChineseToNumber",value:function(t){for(var e={"零":0,"一":1,"二":2,"三":3,"四":4,"五":5,"六":6,"七":7,"八":8,"九":9},n={"十":{value:10,secUnit:!1},"百":{value:100,secUnit:!1},"千":{value:1e3,secUnit:!1},"万":{value:1e4,secUnit:!0},"亿":{value:1e8,secUnit:!0}},r=0,i=0,o=0,u=!1,a=t.split(""),s=0;s<a.length;s+=1){var c=e[a[s]];if(void 0!==c){ o=c,s===a.length-1&&(i+=o); }else{var f=n[a[s]].value;u=n[a[s]].secUnit,u?(i=(i+o)*f,r+=i,i=0):(0===o&&(o=1),i+=o*f),o=0;}}return r+i}},{key:"SectionToChinese",value:function(t){for(var e=["零","一","二","三","四","五","六","七","八","九"],n=["","十","百","千"],r="",i="",o=0,u=!0,a=t;a>0;){var s=a%10;0===s?u||(u=!0,i=e[s]+i):(u=!1,r=e[s],r+=n[o],i=r+i),o+=1,a=Math.floor(a/10);}return i}},{key:"NumberToChinese",value:function(t){
var this$1 = this;
var e=["零","一","二","三","四","五","六","七","八","九"],n=["","万","亿","万亿","亿亿"],r=0,i="",o="",u=!1,a=t;if(0===a){ return e[0]; }for(;a>0;){var s=a%1e4;u&&(o=e[0]+o),i=this$1.SectionToChinese(s),i+=0!==s?n[r]:n[0],o=i+o,u=s<1e3&&s>0,a=Math.floor(a/1e4),r+=1;}return o.replace(/一十/g,"十")}},{key:"deepCompare",value:function(){
var arguments$1 = arguments;
function t(e,n){var o=void 0;if(isNaN(e)&&isNaN(n)&&"number"==typeof e&&"number"==typeof n){ return!0; }if(e===n){ return!0; }if("function"==typeof e&&"function"==typeof n||e instanceof Date&&n instanceof Date||e instanceof RegExp&&n instanceof RegExp||e instanceof String&&n instanceof String||e instanceof Number&&n instanceof Number){ return e.toString()===n.toString(); }if(!(e instanceof Object&&n instanceof Object)){ return!1; }if(e.isPrototypeOf(n)||n.isPrototypeOf(e)){ return!1; }if(e.constructor!==n.constructor){ return!1; }if(e.prototype!==n.prototype){ return!1; }if(r.indexOf(e)>-1||i.indexOf(n)>-1){ return!1; }for(o in n){if(n.hasOwnProperty(o)!==e.hasOwnProperty(o)){ return!1; }if((0,a.default)(n[o])!==(0,a.default)(e[o])){ return!1 }}for(o in e){if(n.hasOwnProperty(o)!==e.hasOwnProperty(o)){ return!1; }if((0,a.default)(n[o])!==(0,a.default)(e[o])){ return!1; }switch((0,a.default)(e[o])){case"object":case"function":if(r.push(e),i.push(n),!t(e[o],n[o])){ return!1; }r.pop(),i.pop();break;default:if(e[o]!==n[o]){ return!1 }}}return!0}var e=void 0,n=void 0,r=void 0,i=void 0;if(arguments.length<1){ return!0; }for(e=1,n=arguments.length;e<n;e+=1){ if(r=[],i=[],!t(arguments$1[0],arguments$1[e])){ return!1; } }return!0}},{key:"fullSort",value:function(t){var e=[];if(1===t.length){ return e.push(t),e; }for(var n=0;n<t.length;n+=1){var r=[];r.push(t[n]);var i=t.slice(0);i.splice(n,1);for(var o=this.fullSort(i).concat(),u=0;u<o.length;u+=1){ o[u].unshift(r[0]),e.push(o[u]); }}return e}},{key:"isArray",value:function(t){return t&&Array.isArray(t)&&t.length>0}},{key:"findArrayElementIsMAX",value:function(t,e){
var this$1 = this;
var n=[];if(this.isArray(t)){var r=!0,i=!1,u=void 0;try{for(var a,s=(0,o.default)(t);!(r=(a=s.next()).done);r=!0){var c=a.value;n.push(this$1.findArrayElementCount(c[0].judge,e));}}catch(t){i=!0,u=t;}finally{try{!r&&s.return&&s.return();}finally{if(i){ throw u }}}}var f=Math.max.apply(null,n),l=0;if(this.isArray(n)){ for(var p=0;p<n.length;p+=1){ if(f===n[p]){l=p;break} } }return t[l]}},{key:"findArrayElementCount",value:function(t,e){if(this.isArray(t)){var n=0;return t.map(function(t){parseInt(t,10)===parseInt(e,10)&&(n+=1);}),n}return 0}}]),t}();e.default=g;},function(t,e,n){t.exports={default:n(295),__esModule:!0};},function(t,e,n){var r=n(29),i=n(127),o=n(125),u=n(25),a=n(52),s=n(91),c={},f={},e=t.exports=function(t,e,n,l,p){var h,d,v,g,y=p?function(){return t}:s(t),m=r(n,l,e?2:1),x=0;if("function"!=typeof y){ throw TypeError(t+" is not iterable!"); }if(o(y)){for(h=a(t.length);h>x;x++){ if((g=e?m(u(d=t[x])[0],d[1]):m(t[x]))===c||g===f){ return g } }}else { for(v=y.call(t);!(d=v.next()).done;){ if((g=i(v,m,d.value,e))===c||g===f){ return g } } }};e.BREAK=c,e.RETURN=f;},function(t,e,n){var r=n(25),i=n(314),o=n(79),u=n(85)("IE_PROTO"),a=function(){},s=function(){var t,e=n(122)("iframe"),r=o.length;for(e.style.display="none",n(311).appendChild(e),e.src="javascript:",t=e.contentWindow.document,t.open(),t.write("<script>document.F=Object<\/script>"),t.close(),s=t.F;r--;){ delete s.prototype[o[r]]; }return s()};t.exports=Object.create||function(t,e){var n;return null!==t?(a.prototype=r(t),n=new a,a.prototype=null,n[u]=t):n=s(),void 0===e?n:i(n,e)};},function(t,e,n){var r=n(13).f,i=n(30),o=n(9)("toStringTag");t.exports=function(t,e,n){t&&!i(t=n?t:t.prototype,o)&&r(t,o,{configurable:!0,value:e});};},function(t,e,n){var r=n(87),i=Math.min;t.exports=function(t){return t>0?i(r(t),9007199254740991):0};},function(t,e,n){var r=n(78);t.exports=function(t){return Object(r(t))};},function(t,e){var n=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+r).toString(36))};},function(t,e,n){"use strict";var r=n(321)(!0);n(80)(String,"String",function(t){this._t=String(t),this._i=0;},function(){var t,e=this._t,n=this._i;return n>=e.length?{value:void 0,done:!0}:(t=r(e,n),this._i+=t.length,{value:t,done:!1})});},function(t,e,n){var r=n(0),i=r(function(t,e){return Number(t)+Number(e)});t.exports=i;},function(t,e,n){var r=n(2),i=r(function(t,e,n){var r={};for(var i in n){ r[i]=n[i]; }return r[t]=e,r});t.exports=i;},function(t,e,n){var r=n(1),i=n(5),o=r(function(t){return i(t.length,function(e,n){var r=Array.prototype.slice.call(arguments,0);return r[0]=n,r[1]=e,t.apply(this,r)})});t.exports=o;},function(t,e){function n(t,e,n){for(var r=0,i=n.length;r<i;){if(t(e,n[r])){ return!0; }r+=1;}return!1}t.exports=n;},function(t,e,n){function r(t,e,n){return function(){
var arguments$1 = arguments;
for(var u=[],a=0,s=t,c=0;c<e.length||a<arguments.length;){var f;c<e.length&&(!o(e[c])||a>=arguments$1.length)?f=e[c]:(f=arguments$1[a],a+=1),u[c]=f,o(f)||(s-=1),c+=1;}return s<=0?n.apply(this,u):i(s,r(t,u,n))}}var i=n(18),o=n(63);t.exports=r;},function(t,e,n){var r=n(1),i=n(27),o=n(41),u=r(function(t){return!!i(t)||!!t&&("object"==typeof t&&(!o(t)&&(1===t.nodeType?!!t.length:0===t.length||t.length>0&&(t.hasOwnProperty(0)&&t.hasOwnProperty(t.length-1)))))});t.exports=u;},function(t,e){function n(t){return"[object Function]"===Object.prototype.toString.call(t)}t.exports=n;},function(t,e){function n(t){return null!=t&&"object"==typeof t&&!0===t["@@functional/placeholder"]}t.exports=n;},function(t,e){function n(t,e){for(var n=0,r=e.length,i=Array(r);n<r;){ i[n]=t(e[n]),n+=1; }return i}t.exports=n;},function(t,e,n){var r=n(0),i=n(8),o=r(function(t,e){return function(n){return function(r){return i(function(t){return e(t,r)},n(t(r)))}}});t.exports=o;},function(t,e,n){var r=n(1),i=n(171),o=r(function(t){return i(t.length,t)});t.exports=o;},function(t,e,n){var r=n(2),i=n(104),o=n(106),u=r(function t(e,n,r){return o(function(n,r,o){return i(r)&&i(o)?t(e,r,o):e(n,r,o)},n,r)});t.exports=u;},function(t,e,n){var r=n(0),i=r(function(t,e){switch(t){case 0:return function(){return e.call(this)};case 1:return function(t){return e.call(this,t)};case 2:return function(t,n){return e.call(this,t,n)};case 3:return function(t,n,r){return e.call(this,t,n,r)};case 4:return function(t,n,r,i){return e.call(this,t,n,r,i)};case 5:return function(t,n,r,i,o){return e.call(this,t,n,r,i,o)};case 6:return function(t,n,r,i,o,u){return e.call(this,t,n,r,i,o,u)};case 7:return function(t,n,r,i,o,u,a){return e.call(this,t,n,r,i,o,u,a)};case 8:return function(t,n,r,i,o,u,a,s){return e.call(this,t,n,r,i,o,u,a,s)};case 9:return function(t,n,r,i,o,u,a,s,c){return e.call(this,t,n,r,i,o,u,a,s,c)};case 10:return function(t,n,r,i,o,u,a,s,c,f){return e.call(this,t,n,r,i,o,u,a,s,c,f)};default:throw new Error("First argument to nAry must be a non-negative integer no greater than ten")}});t.exports=i;},function(t,e,n){var r=n(60),i=n(3),o=n(7),u=n(11),a=n(429),s=r(4,[],i([],a,function(t,e,n,r){return u(function(r,i){var u=n(i);return r[u]=t(o(u,r)?r[u]:e,i),r},{},r)}));t.exports=s;},function(t,e,n){var r=n(157),i=n(0),o=n(98),u=i(function(t,e){return o(r(t),e)});t.exports=u;},function(t,e,n){var r=n(1),i=n(41),o=r(function(t){return i(t)?t.split("").reverse().join(""):Array.prototype.slice.call(t,0).reverse()});t.exports=o;},function(t,e,n){"use strict";function r(t){if(t&&t.__esModule){ return t; }var e={};if(null!=t){ for(var n in t){ Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]); } }return e.default=t,e}function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0}),e.getAnswerNeedFunc=e.handleFunc=e.handleAnswer=e.separateSourceData=e.chooseJudgeVersion=void 0;var o=n(37),u=i(o),a=n(24),s=i(a),c=n(116),f=i(c),l=n(213),p=r(l),h=n(279),d=i(h),v=n(278),g=i(v),y=n(47),m=i(y),x=n(46),w=r(x),b=n(275),_=i(b),S=new _.default,A=new d.default.NewJudge,M=new d.default.Convert,E=new d.default.Compute,O=new d.default.SpecialConvert,k=new g.default,j=new m.default,C={convert:M,compute:E,specialConvert:O},R=(e.chooseJudgeVersion=function(t){var e=t;"string"==typeof e&&(e=JSON.parse(e)),e=JSON.parse((0,f.default)(e));try{if(!j.isEmptyObject(e.blankAnswer)&&4===parseInt(e.type,10)){return R(e)}return w.judgeAnswer(e)}catch(t){return 0}},e.separateSourceData=function(t){var e=S.sourceDataDispense(t);if(3===parseInt(t.subjectId,10)&&j.isArray(e)){var n=[],r=!0,i=!1,o=void 0;try{for(var u,a=(0,s.default)(e);!(r=(u=a.next()).done);r=!0){var c=u.value;n.push(C.convert.separateRightAnswer(c));}}catch(t){i=!0,o=t;}finally{try{!r&&a.return&&a.return();}finally{if(i){ throw o }}}e=n;}var l=[{queId:e[0][0].queId,judge:[]}],p=[],h=!0,d=!1,v=void 0;try{for(var g,y=(0,s.default)(e);!(h=(g=y.next()).done);h=!0){var m=g.value,x=!0,b=!1,_=void 0;try{for(var A,M=(0,s.default)(m);!(x=(A=M.next()).done);x=!0){var E=A.value;if(E.answerTypeId){ try{var O=I(JSON.parse((0,f.default)(E)));0===O&&-1===[4,5].indexOf(E.typeId)&&3!==parseInt(t.subjectId,10)?(E.rigAnswer=[E.rigAnswer],l[0].judge.push(w.judgeAnswer(E)[0].judge[0])):l[0].judge.push(O);}catch(t){l[0].judge.push(0);} }else { E.rigAnswer=[E.rigAnswer],l[0].judge.push(w.judgeAnswer(E)[0].judge[0]); }}}catch(t){b=!0,_=t;}finally{try{!x&&M.return&&M.return();}finally{if(b){ throw _ }}}if(l[0].judge.every(function(t){return 1===parseInt(t,10)})){ return l; }p.push(JSON.parse((0,f.default)(l))),l[0].judge=[];}}catch(t){d=!0,v=t;}finally{try{!h&&y.return&&y.return();}finally{if(d){ throw v }}}return j.findArrayElementIsMAX(p,1)}),I=e.handleAnswer=function(t){var e=t,n=0,r=parseInt(e.subjectId,10);if(!e.answerTypeId){ return 0; }if(!e.stuAnswer[0]){ return-2; }var i=k.getType(e.answerTypeId);if([2,4,5,6].indexOf(r)>-1&&!0===e.isExactMatch&&2===e.typeId){var o=[["convert","toDBC"],["convert","replaceBlank"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"]],u=!0,a=!1,c=void 0;try{for(var f,l=(0,s.default)(o);!(u=(f=l.next()).done);u=!0){var p=f.value;if(4===e.typeId||"4"===e.typeId){ break; }var h=[p[0],p[1],p[2]],d=h[0],v=h[1],g=h[2];if(e.stuAnswer=P(e.stuAnswer,d,v,g),e.rigAnswer=P(e.rigAnswer,d,v,g),e.stuAnswer=j.removeDuplicatedItem(e.stuAnswer),e.rigAnswer=j.removeDuplicatedItem(e.rigAnswer),!j.isArray(e.stuAnswer)||!j.isArray(e.rigAnswer)){ return 0; }e.stuAnswer=e.stuAnswer.filter(function(t){return!(!t||""===t)}),e.rigAnswer=e.rigAnswer.filter(function(t){return!(!t||""===t)});}}catch(t){a=!0,c=t;}finally{try{!u&&l.return&&l.return();}finally{if(a){ throw c }}}}if(n=A.judgeAnswer(e.stuAnswer,e.rigAnswer,i,e.isExactMatch,r),!0===e.isExactMatch){ return n; }var y=T(e);if(j.isArray(y)){var m=!0,x=!1,w=void 0;try{for(var b,_=(0,s.default)(y);!(m=(b=_.next()).done);m=!0){var S=b.value,M=[S[0],S[1],S[2]],d=M[0],v=M[1],g=M[2];if(e.stuAnswer=P(e.stuAnswer,d,v,g),e.rigAnswer=P(e.rigAnswer,d,v,g),e.stuAnswer=j.removeDuplicatedItem(e.stuAnswer),e.rigAnswer=j.removeDuplicatedItem(e.rigAnswer),!j.isArray(e.stuAnswer)||!j.isArray(e.rigAnswer)){ return 0; }if(e.stuAnswer=e.stuAnswer.filter(function(t){return!(!t||""===t)}),e.rigAnswer=e.rigAnswer.filter(function(t){return!(!t||""===t)}),1===(n=A.judgeAnswer(e.stuAnswer,e.rigAnswer,i,e.isExactMatch,r))){ break }}}catch(t){x=!0,w=t;}finally{try{!m&&_.return&&_.return();}finally{if(x){ throw w }}}}return n},P=e.handleFunc=function(t,e,n,r){if(!(C&&C[e]&&C[e][n])){ return t; }var i=[],o=!0,a=!1,c=void 0;try{for(var f,l=(0,s.default)(t);!(o=(f=l.next()).done);o=!0){var p=f.value,h="";if(p){ if(p.toString().indexOf(";zk;")>-1){var d=p.split(";zk;"),v=[],g=!0,y=!1,m=void 0;try{for(var x,w=(0,s.default)(d);!(g=(x=w.next()).done);g=!0){var b=x.value;try{h=C[e][n](b,r),v.push(h);}catch(t){h=p,v.push(h);}}}catch(t){y=!0,m=t;}finally{try{!g&&w.return&&w.return();}finally{if(y){ throw m }}}h=v.join(";zk;");}else { try{h=C[e][n](p,r);}catch(t){h=p;} } }j.isArray(h)?i.push.apply(i,(0,u.default)(h)):i.push(h);}}catch(t){a=!0,c=t;}finally{try{!o&&l.return&&l.return();}finally{if(a){ throw c }}}return i},T=e.getAnswerNeedFunc=function(t){var e=[],n=k.getType(t.answerTypeId),r=k.getTypeParent(n),i=[];if(j.isArray(r)&&r.forEach(function(t){0!==t&&i.push(k.getType(t));}),e.push.apply(e,(0,u.default)(p[n].func)),i.length>0){var o=!0,a=!1,c=void 0;try{for(var f,l=(0,s.default)(i);!(o=(f=l.next()).done);o=!0){var h=f.value;e.push.apply(e,(0,u.default)(p[h].func));}}catch(t){a=!0,c=t;}finally{try{!o&&l.return&&l.return();}finally{if(a){ throw c }}}}return e};},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(37),o=r(i),u=n(24),a=r(u),s=n(21),c=r(s),f=n(22),l=r(f),p=n(113),h=r(p),d=n(273),v=r(d),g=n(47),y=r(g),m=n(283),x=r(m),w=new y.default,b={englishRegex:v.default},_=function(){function t(){(0,c.default)(this,t);}return(0,l.default)(t,[{key:"regexReplace",value:function(t,e){if(!e){ return!1; }var n=h.default[t];if(!(n&&n.length>0)){ return!1; }var r=e,i=!0,o=!1,u=void 0;try{for(var s,c=(0,a.default)(n);!(i=(s=c.next()).done);i=!0){var f=s.value;r=r.replace(f[0],f[1]);}}catch(t){o=!0,u=t;}finally{try{!i&&c.return&&c.return();}finally{if(o){ throw u }}}return r}},{key:"littleMath",value:function(t){return this.regexReplace("littleMath",t)}},{key:"unitsStandard",value:function(t){return this.regexReplace("unitsStandard",t)}},{key:"specificSymbolStandard",value:function(t){return this.regexReplace("specificSymbolStandard",t)}},{key:"greekLetterStandard",value:function(t){return this.regexReplace("greekLetterStandard",t)}},{key:"codeStandard",value:function(t){return this.regexReplace("codeStandard",t)}},{key:"standardAnswerCode",value:function(t){return this.regexReplace("standardAnswerCode",t)}},{key:"lastReplace",value:function(t){return this.regexReplace("lastReplace",t)}},{key:"removerSurplusStyle",value:function(t){return this.regexReplace("removerSurplusStyle",t)}},{key:"replaceChinaCode",value:function(t){return this.regexReplace("replaceChinaCode",t)}},{key:"toDBC",value:function(t){if(t){var e="";t=t.toString();for(var n=0;n<t.length;n++){var r=t.charCodeAt(n);if(r>=65281&&r<=65373){var i=t.charCodeAt(n)-65248;e+=String.fromCharCode(i);}else if(12288==r){var o=t.charCodeAt(n)-12288+32;e+=String.fromCharCode(o);}else { e+=12304==r?String.fromCharCode(91):12305==r?String.fromCharCode(93):t.charAt(n); }}return e}return""}},{key:"trim",value:function(t){return t.replace(/(^\s*)|(\s*$)/g,"")}},{key:"replaceBlank",value:function(t){var e="";return null!=t&&(e=t.replace(/\s+/g,"")),e}},{key:"toLowerCase",value:function(t){return t}},{key:"chineseToNumber",value:function(t){for(var e=/[零一二三四五六七八九十百千万亿]+/g,n=t,r=void 0;null!==(r=e.exec(n));){r.index===e.lastIndex&&(e.lastIndex+=1);var i=n.split("");i.splice(r.index,r[0].length,"&&&&"+w.ChineseToNumber(r[0])+"&&&&"),n=i.join("");}return n=n.replace(/&&&&/g,"")}},{key:"logogramReplace",value:function(t,e){var n=[t],r=void 0,i=!0,o=!1,u=void 0;try{for(var s,c=(0,a.default)(b[e[0]][e[1]]);!(i=(s=c.next()).done);i=!0){var f=s.value,l=[],p=f[0],h=!0,d=!1,v=void 0;try{for(var g,y=(0,a.default)(n);!(h=(g=y.next()).done);h=!0){ for(var m=g.value;null!==(r=p.exec(m));){r.index===p.lastIndex&&(p.lastIndex+=1);var x=r[0].length,w=r.index,_=f[1].split("/"),S=!0,A=!1,M=void 0;try{for(var E,O=(0,a.default)(_);!(S=(E=O.next()).done);S=!0){var k=E.value,j=m,C=j.split("");C.splice(w,x,k),l.push(C.join(""));}}catch(t){A=!0,M=t;}finally{try{!S&&O.return&&O.return();}finally{if(A){ throw M }}}} }}catch(t){d=!0,v=t;}finally{try{!h&&y.return&&y.return();}finally{if(d){ throw v }}}l.length>0&&(n=l);}}catch(t){o=!0,u=t;}finally{try{!i&&c.return&&c.return();}finally{if(o){ throw u }}}return n}},{key:"splitDataExchange",value:function(t){var e=[this.chineseToNumber(t)],n=["或",",","，","、","和","或者"],r=!0,i=!1,u=void 0;try{for(var s,c=(0,a.default)(n);!(r=(s=c.next()).done);r=!0){var f=s.value,l=[],p=!0,h=!1,d=void 0;try{for(var v,g=(0,a.default)(e);!(p=(v=g.next()).done);p=!0){var y=v.value,m=y.split(f);w.isArray(m)&&l.push.apply(l,(0,o.default)(m));}}catch(t){h=!0,d=t;}finally{try{!p&&g.return&&g.return();}finally{if(h){ throw d }}}w.isArray(l)&&(e=l);}}catch(t){i=!0,u=t;}finally{try{!r&&c.return&&c.return();}finally{if(i){ throw u }}}return e=e.filter(function(t){return!(!t||""===t)}),e=e.join(";zk;")}},{key:"unitsConvert",value:function(t){return x.default.unitsConvert(t)}},{key:"separateRightAnswer",value:function(t){var e=!0,n=!1,r=void 0;try{for(var i,u=(0,a.default)(t);!(e=(i=u.next()).done);e=!0){var s=i.value;if(-1===[4,5].indexOf(s.typeId)){var c=[],f=!0,l=!1,p=void 0;try{for(var h,d=(0,a.default)(s.rigAnswer);!(f=(h=d.next()).done);f=!0){var v=h.value;c.push.apply(c,(0,o.default)(v.split("/")));}}catch(t){l=!0,p=t;}finally{try{!f&&d.return&&d.return();}finally{if(l){ throw p }}}s.rigAnswer=c;}}}catch(t){n=!0,r=t;}finally{try{!e&&u.return&&u.return();}finally{if(n){ throw r }}}var g=!0,y=!1,m=void 0;try{for(var x,w=(0,a.default)(t);!(g=(x=w.next()).done);g=!0){var b=x.value,_=[],S=!0,A=!1,M=void 0;try{for(var E,O=(0,a.default)(b.rigAnswer);!(S=(E=O.next()).done);S=!0){var k=E.value;if(k.indexOf("(")>-1&&k.indexOf(")")>-1&&-1===[4,5].indexOf(b.typeId)){var j=k.replace(/\([^)]+\)/,""),C=k.replace(/\([^)]+\)/,/\(([^()]+)\)/g.exec(k)[1]),R=[j,C];_.push.apply(_,R);}else { _.push(k); }}}catch(t){A=!0,M=t;}finally{try{!S&&O.return&&O.return();}finally{if(A){ throw M }}}b.rigAnswer=_;}}catch(t){y=!0,m=t;}finally{try{!g&&w.return&&w.return();}finally{if(y){ throw m }}}return t}},{key:"lowerCaseToASCII",value:function(t){return t&&t.charCodeAt(0)>96&&t.charCodeAt(0)<123?t.charCodeAt(0)-96:t}}]),t}();e.default=_;},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var i=n(287),o=r(i),u=n(117),a=r(u),s=n(76),c=r(s);e.default=function(t,e){if("function"!=typeof e&&null!==e){ throw new TypeError("Super expression must either be null or a function, not "+(void 0===e?"undefined":(0,c.default)(e))); }t.prototype=(0,a.default)(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(o.default?(0,o.default)(t,e):t.__proto__=e);};},function(t,e,n){"use strict";e.__esModule=!0;var r=n(76),i=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=function(t,e){if(!t){ throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); }return!e||"object"!==(void 0===e?"undefined":(0,i.default)(e))&&"function"!=typeof e?t:e};},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var i=n(289),o=r(i),u=n(288),a=r(u),s="function"==typeof a.default&&"symbol"==typeof o.default?function(t){return typeof t}:function(t){return t&&"function"==typeof a.default&&t.constructor===a.default&&t!==a.default.prototype?"symbol":typeof t};e.default="function"==typeof a.default&&"symbol"===s(o.default)?function(t){return void 0===t?"undefined":s(t)}:function(t){return t&&"function"==typeof a.default&&t.constructor===a.default&&t!==a.default.prototype?"symbol":void 0===t?"undefined":s(t)};},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)};},function(t,e){t.exports=function(t){if(void 0==t){ throw TypeError("Can't call method on  "+t); }return t};},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");},function(t,e,n){"use strict";var r=n(81),i=n(12),o=n(135),u=n(26),a=n(38),s=n(312),c=n(51),f=n(132),l=n(9)("iterator"),p=!([].keys&&"next"in[].keys()),h=function(){return this};t.exports=function(t,e,n,d,v,g,y){s(n,e,d);var m,x,w,b=function(t){if(!p&&t in M){ return M[t]; }switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},_=e+" Iterator",S="values"==v,A=!1,M=t.prototype,E=M[l]||M["@@iterator"]||v&&M[v],O=E||b(v),k=v?S?b("entries"):O:void 0,j="Array"==e?M.entries||E:E;if(j&&(w=f(j.call(new t)))!==Object.prototype&&w.next&&(c(w,_,!0),r||"function"==typeof w[l]||u(w,l,h)),S&&E&&"values"!==E.name&&(A=!0,O=function(){return E.call(this)}),r&&!y||!p&&!A&&M[l]||u(M,l,O),a[e]=O,a[_]=h,v){ if(m={values:S?O:b("values"),keys:g?O:b("keys"),entries:k},y){ for(x in m){ x in M||o(M,x,m[x]); } }else { i(i.P+i.F*(p||A),e,m); } }return m};},function(t,e){t.exports=!0;},function(t,e,n){var r=n(54)("meta"),i=n(23),o=n(30),u=n(13).f,a=0,s=Object.isExtensible||function(){return!0},c=!n(31)(function(){return s(Object.preventExtensions({}))}),f=function(t){u(t,r,{value:{i:"O"+ ++a,w:{}}});},l=function(t,e){if(!i(t)){ return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t; }if(!o(t,r)){if(!s(t)){ return"F"; }if(!e){ return"E"; }f(t);}return t[r].i},p=function(t,e){if(!o(t,r)){if(!s(t)){ return!0; }if(!e){ return!1; }f(t);}return t[r].w},h=function(t){return c&&d.NEED&&s(t)&&!o(t,r)&&f(t),t},d=t.exports={KEY:r,NEED:!1,fastKey:l,getWeak:p,onFreeze:h};},function(t,e,n){var r=n(133),i=n(79);t.exports=Object.keys||function(t){return r(t,i)};},function(t,e){e.f={}.propertyIsEnumerable;},function(t,e,n){var r=n(86)("keys"),i=n(54);t.exports=function(t){return r[t]||(r[t]=i(t))};},function(t,e,n){var r=n(17),i=r["__core-js_shared__"]||(r["__core-js_shared__"]={});t.exports=function(t){return i[t]||(i[t]={})};},function(t,e){var n=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:n)(t)};},function(t,e,n){var r=n(23);t.exports=function(t,e){if(!r(t)){ return t; }var n,i;if(e&&"function"==typeof(n=t.toString)&&!r(i=n.call(t))){ return i; }if("function"==typeof(n=t.valueOf)&&!r(i=n.call(t))){ return i; }if(!e&&"function"==typeof(n=t.toString)&&!r(i=n.call(t))){ return i; }throw TypeError("Can't convert object to primitive value")};},function(t,e,n){var r=n(17),i=n(6),o=n(81),u=n(90),a=n(13).f;t.exports=function(t){var e=i.Symbol||(i.Symbol=o?{}:r.Symbol||{});"_"==t.charAt(0)||t in e||a(e,t,{value:u.f(t)});};},function(t,e,n){e.f=n(9);},function(t,e,n){var r=n(121),i=n(9)("iterator"),o=n(38);t.exports=n(6).getIteratorMethod=function(t){if(void 0!=t){ return t[i]||t["@@iterator"]||o[r(t)] }};},function(t,e,n){n(325);for(var r=n(17),i=n(26),o=n(38),u=n(9)("toStringTag"),a="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),s=0;s<a.length;s++){var c=a[s],f=r[c],l=f&&f.prototype;l&&!l[u]&&i(l,u,c),o[c]=o.Array;}},function(t,e,n){var r=n(14),i=n(0),o=n(11),u=n(8),a=i(function(t,e){return"function"==typeof e["fantasy-land/ap"]?e["fantasy-land/ap"](t):"function"==typeof t.ap?t.ap(e):"function"==typeof t?function(n){return t(n)(e(n))}:o(function(t,n){return r(t,u(n,e))},[],t)});t.exports=a;},function(t,e,n){var r=n(0),i=n(3),o=n(162),u=n(418),a=n(8),s=r(i(["fantasy-land/chain","chain"],u,function(t,e){return"function"==typeof e?function(n){return t(e(n))(n)}:o(!1)(a(t,e))}));t.exports=s;},function(t,e,n){function r(){if(0===arguments.length){ throw new Error("compose requires at least one argument"); }return i.apply(this,o(arguments))}var i=n(180),o=n(71);t.exports=r;},function(t,e,n){var r=n(0),i=n(27),o=n(62),u=n(41),a=n(45),s=r(function(t,e){if(i(t)){if(i(e)){ return t.concat(e); }throw new TypeError(a(e)+" is not an array")}if(u(t)){if(u(e)){ return t+e; }throw new TypeError(a(e)+" is not a string")}if(null!=t&&o(t["fantasy-land/concat"])){ return t["fantasy-land/concat"](e); }if(null!=t&&o(t.concat)){ return t.concat(e); }throw new TypeError(a(t)+' does not have a method named "concat" or "fantasy-land/concat"')});t.exports=s;},function(t,e,n){var r=n(1),i=n(5),o=r(function(t){return i(t.length,t)});t.exports=o;},function(t,e,n){var r=n(0),i=n(3),o=n(101),u=n(104),a=n(11),s=n(423),c=n(19),f=r(i(["filter"],s,function(t,e){return u(e)?a(function(n,r){return t(e[r])&&(n[r]=e[r]),n},{},c(e)):o(t,e)}));t.exports=f;},function(t,e,n){var r=n(1),i=n(102),o=r(i);t.exports=o;},function(t,e,n){var r=n(408);t.exports="function"==typeof Object.assign?Object.assign:r;},function(t,e){function n(t,e){for(var n=0,r=e.length,i=[];n<r;){ t(e[n])&&(i[i.length]=e[n]),n+=1; }return i}t.exports=n;},function(t,e){function n(t){return t}t.exports=n;},function(t,e){t.exports=Number.isInteger||function(t){return t<<0===t};},function(t,e){function n(t){return"[object Object]"===Object.prototype.toString.call(t)}t.exports=n;},function(t,e){function n(t){return"function"==typeof t["@@transducer/step"]}t.exports=n;},function(t,e,n){var r=n(2),i=n(7),o=r(function(t,e,n){var r,o={};for(r in e){ i(r,e)&&(o[r]=i(r,n)?t(r,e[r],n[r]):e[r]); }for(r in n){ i(r,n)&&!i(r,o)&&(o[r]=n[r]); }return o});t.exports=o;},function(t,e,n){var r=n(0),i=n(36),o=r(function(t,e){return i([t],e)});t.exports=o;},function(t,e,n){var r=n(40),i=n(1),o=n(15),u=i(r("tail",o(1,1/0)));t.exports=u;},function(t,e,n){var r=n(0),i=n(3),o=n(430),u=n(15),a=r(i(["take"],o,function(t,e){return u(0,t<0?1/0:t,e)}));t.exports=a;},function(t,e,n){var r=n(1),i=r(function(t){return null===t?"Null":void 0===t?"Undefined":Object.prototype.toString.call(t).slice(8,-1)});t.exports=i;},function(t,e,n){var r=n(99),i=n(189),o=i(r);t.exports=o;},function(t,e,n){var r=n(2),i=n(138),o=n(33),u=r(function(t,e,n){return i(o(e),t,n)});t.exports=u;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={specialRegex:{coordinate:/\(([\(\)\[\] 0-9a-zA-Z+\-\{\}\\_^.]+)[，,]([\(\)\[\] 0-9a-zA-Z+\-\{\}\\_^.]+)\)/g,getDecimal:/^\d+(?:\.\d{0,5})?/,computeSqrt:/\\SQRT(\[[0-9a-zA-Z+\-\\\{\}\[\]^_]+\])?\{([0-9a-zA-Z+\-\\\{\}\[\]^_]+)\}/g,computeFrac:/\\FRAC(\{(?:[0-9a-zA-Z+\-\\\{\}\[\]^_]+)\}|\w)(\{(?:[0-9a-zA-Z+\-\\\{\}\[\]^_]+)\}|\w)/g,computePower:/([0-9\{\}]+|\{?[a-zA-Z]\}?|\{?\([0-9a-zA-Z+\-\{\}\\]+\)\}?)\^\{?([0-9a-zA-Z+\-]+|([0-9a-zA-Z+\-])|\\FRAC\{[0-9a-zA-Z+\-]+\}\{[0-9a-zA-Z+\-]+\})\}?/g},littleMath:[[/\$|\ |\\text|\\rm|\\left|\\right|\{\}|~/g,""],[/\\dfrac/g,"\\frac"],[/\^\{\\circ\}|\^\\circ|°|度/g,"\\degree"],[/\\ge(qslant)?|≥/g,"\\ge"],[/\\le(qslant)?|≤/g,"\\le"],[/([^\\]|^)(%|％)/g,"$1\\%"],[/：|:/g,":"],[/\(|（/g,"("],[/\)|）/g,")"],[/,|，/g,","],[/×/g,"\\times"],[/÷/g,"\\div"],[/π/g,"\\pi"],[/≠/g,"\\ne"],[/\-|－/g,"-"],[/=|＝/g,"="],[/<|＜/g,"<"],[/>|＞/g,">"],[/．/g,"."],[/(\d+)(\\frac{\d+}{\d+})/g,"($1+$2)"]],replaceChinaCode:[["大于",">"],["小于","<"],["等于","="],["°","度"],["（","("],["）",")"],["，",","],["-","-"],["’","'"]],removerSurplusStyle:[[/$/g,""],[/\\text/g,""],[/\\rm/g,""],[/\\left/g,""],[/\\right/g,""],[/\\:/g,""],[/\\>/g,""],[/\\;/g,""],[/\\ /g,""],[/\\!/g,""],[/~/g,""],[/\\mathbb/g,""],[/\\mathbf/g,""],[/\\mathbin/g,""],[/\\mathcal/g,""],[/\\mathrm/g,""],[/\\operatorname/g,""],["/\\(/g",""],["/\\)/g",""],[/\\/,""]],standardAnswerCode:[[/\\dfrac/g,"\\frac"],[/\\le(qslant)?|≤/g,"\\leqslant"],[/\\ge(qslant)?|≥/g,"\\geqslant"],[/([^\\]|^)(%|％)/g,"$1\\%"],[/：|:/g,":"],[/\(|（/g,"("],[/\)|）/g,")"],[/,|，/g,","],[/×/g,"\\times"],[/÷/g,"\\div"],[/π/g,"\\pi"],[/≠/g,"\\ne"],[/\+|＋/g,"+"],[/\-|－/g,"-"],[/=|＝/g,"="],[/<|＜/g,"<"],[/>|＞/g,">"],[/．/g,"."]],lastReplace:[[/{|}/g,""]],daishushiUnitsToUpperCase:[[/\\frac/g,"\\FRAC"],[/\\sqrt/g,"\\SQRT"]],unitsStandard:[[/FRAC/g,"#分式#"],[/SQRT/g,"#根式#"],[/\$|\ |\\text|\\rm|\\left|\\right|\{\}|~/g,""],[/\{?\^\{?\\circ\}?\}?|度|\\degree/g,"度"],[/\{?\^\\prime\\prime\}?|\{?\^\{?\\prime\\prime\}?\}?|′′|’’|‘‘|‘'|″/g,'"'],[/\{?\^\{?\\prime\}?\}?|‘|’|′|′/g,"'"],[/\{?c\}?\{?m\}?|\{?c\}?米/g,"厘米"],[/\{?d\}?\{?m\}?|\{?d\}?米/g,"分米"],[/\{?m\}?\{?m\}?|\{?m\}?米/g,"毫米"],[/\{?k\}?\{?m\}?|\{?k\}?米/g,"千米"],[/\{?n\}?\{?m\}?|\{?n\}?米/g,"纳米"],[/\{?μ\}?\{?m\}?|\{?μ\}?米/g,"微米"],[/\{?\{?\{?c\}?\{?m\}?\}?\^\{?2\}?\}?|厘米\^\{?2\}?/g,"平方厘米"],[/\{?\{?\{?d\}?\{?m\}?\}?\^\{?2\}?\}?|分米\^\{?2\}?/g,"平方分米"],[/\{?\{?\{?m\}?\{?m\}?\}?\^\{?2\}?\}?|毫米\^\{?2\}?/g,"平方毫米"],[/\{?\{?\{?k\}?\{?m\}?\}?\^\{?2\}?\}?|千米\^\{?2\}?/g,"平方千米"],[/\{?\{?(?:m|米)\}?\^\{?2\}?\}?/g,"平方米"],[/\{?\{?\{?c\}?\{?m\}?\}?\^\{?3\}?\}?|厘米\^\{?3\}?/g,"立方厘米"],[/\{?\{?\{?d\}?\{?m\}?\}?\^\{?3\}?\}?|分米\^\{?3\}?/g,"立方分米"],[/\{?\{?\{?m\}?\{?m\}?\}?\^\{?3\}?\}?|毫米\^\{?3\}?/g,"立方毫米"],[/\{?\{?\{?k\}?\{?m\}?\}?\^\{?3\}?\}?|千米\^\{?3\}?/g,"立方千米"],[/\{?\{?(?:m|米)\}?\^\{?3\}?\}?/g,"立方米"],[/\{?k\}?\{?g\}?|\{?k\}?克/g,"千克"],[/\{?g\}?/g,"克"],[/°C|摄氏度/g,"℃"],[/\{?\{?P\}?\^\{?a\}?\}?|帕斯卡/g,"帕"],[/\{?mol\}?|摩尔/g,"摩"],[/\{?m\}?\{?L\}?|\{?m\}?升/g,"毫升"],[/\{?m\}?\{?A\}?|\{?m\}?安/g,"毫安"],[/\{?μ\}?\{?A\}?|\{?μ\}?安/g,"微安"],[/\{?k\}?\{?A\}?|\{?k\}?安/g,"千安"],[/\{?k\}?\{?Ω\}?|\{?k\}?欧/g,"千欧"],[/\{?m\}?\{?Ω\}?|\{?m\}?欧/g,"毫欧"],[/\{?k\}?\{?V\}?|\{?k\}?伏/g,"千伏"],[/\{?m\}?\{?V\}?|\{?m\}?伏/g,"毫伏"],[/\{?μ\}?\{?V\}?|\{?μ\}?V/g,"微伏"],[/\{?H\}?\{?z\}?|赫兹/g,"赫"],[/\{?W\}?\{?b\}?|韦伯/g,"韦"],[/\{?L\}?/g,"升"],[/\{?N\}?|牛顿/g,"牛"],[/\{?A\}?|安培/g,"安"],[/{?V\}?|伏特/g,"伏"],[/{?Ω\}?|欧姆/g,"欧"],[/{?J\}?|焦耳/g,"焦"],[/\{?e\}?\{?V\}?|\{?e\}?伏/g,"电子伏"],[/\{?\{?s\}?\^\{-1\}\}?|每秒/g,"/秒"],[/#分式#/g,"FRAC"],[/#根式#/g,"SQRT"]],specificSymbolStandard:[[/\\bigcirc/g,"◯"],[/\\(?:big)?odot/g,"⨀"],[/⊕|\\(?:big)?oplus/g,"⨁"],[/⊗|\\(?:big)?otimes/g,"⨂"],[/⋆|\\(?:big)star/g,"★"],[/\\(?:D|d)iamond/g,"◊"],[/\\ominus/g,"⊖"],[/\\oint/g,"∮"],[/\\diamond/g,"◊"]],greekLetterStandard:[[/\\alpha/g,"α"],[/\\beta/g,"β"],[/Γ|\\(?:var)?(?:g|G)amma/g,"γ"],[/Δ|\\(?:var)?(?:d|D)elta/g,"δ"],[/\\(?:var)?epsilon/g,"ε"],[/\\zeta/g,"ζ"],[/\\eta/g,"η"],[/Θ|\\(?:var)?(?:t|T)heta/g,"θ"],[/\\iota/g,"ι"],[/\\(?:var)?kappa/g,"κ"],[/Λ|\\(?:var)?(?:l|L)ambda/g,"λ"],[/\\mu/g,"μ"],[/\\nu/g,"ν"],[/Ξ|\\(?:var)?(?:x|X)i/g,"ξ"],[/\\omicron/g,"ο"],[/Π|\\(?:var)?(?:p|P)i/g,"π"],[/\\(?:var)?rho/g,"ρ"],[/∑|\\(?:var)?(?:s|S)igma/g,"σ"],[/\\tau/g,"τ"],[/Υ|\\(?:var)?(?:u|U)psilon/g,"υ"],[/Φ|\\(?:var)?(?:p|P)hi/g,"φ"],[/\\chi/g,"χ"],[/Ψ|\\(?:var)?(?:p|P)si/g,"ψ"],[/\\(?:var)?omega/g,"ω"],[/\\(?:var)?Omega/g,"Ω"]],codeStandard:[[/\$/g,""],[/\\text\{([\s\S]+?)\}/g,"$1"],[/\\(?:math)?rm/g,""],[/\\[!,:;>]/g,""],[/\\ |~/g," "],[/(?:\\)?%/g,"/100"],[/\\#/g,"#"],[/\\&/g,"&"],[/＋/g,"+"],[/－/g,"-"],[/×|\\ast|\\times/g,"*"],[/÷|\\div/g,"/"],[/\\angle|角/g,"∠"],[/\\bot|垂直/g,"⊥"],[/\\approx|约等于/g,"≈"],[/\\rightleftharpoons/g,"⇌"],[/\\iff|\\Leftrightarrow|\\Longleftrightarrow/g,"⟺"],[/\\implies|\\rightarrow|\\Longrightarrow/g,"⟹"],[/\\impliedby|\\Leftarrow|\\Longleftarrow/g,"⟸"],[/\\to|\\rightarrow/g,"→"],[/\\leftarrow|\\gets/g,"←"],[/\\left|\\right/g,""],[/\\(?:d|c|t)?frac/g,"\\FRAC"],[/＝|\\equals|等于/g,"="],[/＞|\\gt|大于/g,">"],[/＜|\\gt|小于/g,"<"],[/\\ne(?:q)?|不(?:等于|=)/g,"≠"],[/\\ge(?:q)?(?:slant)?|(?:大于|>)(?:等于|=)/g,"≥"],[/\\le(?:q)?(?:slant)?|(?:小于|<)(?:等于|=)/g,"≤"],[/：|\\colon/g,":"],[/，/g,","],[/Π|\\(?:var)?(?:p|P)i|π/g,"(3.1415926)"],[/（/g,"("],[/）/g,")"],[/【/g,"["],[/】/g,"]"],[/\\triangle/g,"△"],[/⋅|∙|•|\\c(?:enter)?dot(?!s)|\\bullet/g,"*"],[/\\complement/g,"∁"],[/\\cong|≅|≌/g,"≌"],[/。|．/g,"."],[/(?:\\)?sin/g,"正弦"],[/(?:\\)?cos/g,"余弦"],[/(?:\\)?tan/g,"正切"],[/~|\\backsim/g,"∽"],[/\\(?:bar|overline)/g,"\\BAR"],[/\\because|因为/g,"∵"],[/\\therefore|所以/g,"∴"],[/\\(?:big)?cap/g,"⋂"],[/\\(?:big)?cup/g,"⋃"],[/⋁|\\bigvee/g,"∨"],[/⋀|\\binom/g,"∧"],[/\\boldsymbol/g,""],[/\\cal/g,""],[/…{1,2}|(?:\\(?:c|l)?dots){1,2}/g,"⋯"],[/\\cot/g,"余切"],[/\\(?:cr|newline|\\)/g,"\\\\"],[/\\sec/g,"正割"],[/\\csc/g,"余割"],[/\\equiv/g,"≡"],[/∃|\\exists/g,"∃"],[/\\(?:boxed|fbox)/g,"\\BOXED"],[/∀|\\forall/g,"∀"],[/\\frak/g,""],[/\\(?:h|H)uge/g,""],[/\\int(?:op)?/g,"∫"],[/\\iint/g,"∬"],[/\\iiint/g,"∭"],[/\\in(?!t)|属于/g,"∈"],[/\\infty/g,"∞"],[/\\bf/g,""],[/\\Bbb/g,""],[/(?:\\)?lg/g,"\\LG"],[/(?:\\)?log/g,"\\LOG"],[/(?:\\)?ln/g,"\\LN"],[/\\(?:math)?scr/g,""],[/\\(?:math)?sf/g,""],[/\\(?:math)?tt/g,""],[/(?:\\)?max/g,"\\MAX"],[/(?:\\)?min/g,"\\MIN"],[/\\mid/g,"|"],[/(?:\\)?mod/g,"\\MOD"],[/\\mp/g,"∓"],[/\\notin|不(?:属于|∈)/g,"∉"],[/⊂|\\subset(?:neqq)?(?!e)/g,"⫋"],[/\\subseteq/g,"⊆"],[/\\sum|\\Sigma/g,"∑"],[/\\uparrow/g,"↑"],[/\\downarrow/g,"↓"],[/\\emptyset|\\varnothing/g,"∅"],[/\\sqrt/g,"\\SQRT"],[/\\overset\\frown|\\overarc/g,"弧"],[/(?:\\)?arccos/g,"反余弦"],[/(?:\\)?arcsin/g,"反正弦"],[/(?:\\)?arctan/g,"反正切"],[/(?:\\)?array/g,""],[/(?:\\)?cases/g,""],[/\\displaylines/g,""],[/\\displaystyle/g,""],[/\\eqalign(no)?/g,""],[/\\gg|远>/g,"≫"],[/\\ll|远</g,"≪"],[/\\mathbin/g,""],[/\\mathcal/g,""],[/\\mathchoice/g,""],[/\\mathclose/g,""],[/\\mathfrak/g,""],[/\\mathinner/g,""],[/\\mathit/g,""],[/\\mathop/g,""],[/\\mathopen/g,""],[/\\mathord/g,""],[/\\mathpunct/g,""],[/\\mathrel/g,""],[/\\mathstrut/g,""],[/(?:\\)?matrix/g,""],[/\\begin/g,""],[/(?:\\){1,3}end/g,""],[/\{(?:\{(?:\{[\S ]?\})?\})?\}/g,""],[/\\\\/g,","],[/(?:\^)?\\underline\{\\underline\{(.+)\}\}/g,"=$1"],[/\{([\w\(\)\.\+\-\[\]])\}/g,"$1"],[/\{([\w\(\)\.\+\-\[\]])\}/g,"$1"],[/\{([\w\(\)\.\+\-\[\]])\}/g,"$1"],[/\{([\w\(\)\.\+\-\[\]])\}/g,"$1"],[/\^=/g,"="],[/\^=/g,"="],[/\^=/g,"="],[/\^=/g,"="],[/(\^|_)$/g,""],[/(\^|_)$/g,""],[/(\^|_)$/g,""],[/(\^|_)$/g,""],[/(^|[,，或和^])(\\pm|±)([^,，或和]+)?/g,"$1$3或$1-$3"],[/(?![,，或和^])([^,，或和]+)?(\\pm|±)([^,，或和]+)?/g,"$1+$3或$1-$3"],[/([0-9]+)(\\FRAC(?:\{[0-9]+\}|[0-9])(?:\{[0-9]+\}|[0-9]))/g,"($1+$2)"]]};e.default=r;},function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(exports,"__esModule",{value:!0});var _getPrototypeOf=__webpack_require__(48),_getPrototypeOf2=_interopRequireDefault(_getPrototypeOf),_classCallCheck2=__webpack_require__(21),_classCallCheck3=_interopRequireDefault(_classCallCheck2),_createClass2=__webpack_require__(22),_createClass3=_interopRequireDefault(_createClass2),_possibleConstructorReturn2=__webpack_require__(75),_possibleConstructorReturn3=_interopRequireDefault(_possibleConstructorReturn2),_inherits2=__webpack_require__(74),_inherits3=_interopRequireDefault(_inherits2),_computeBase2=__webpack_require__(277),_computeBase3=_interopRequireDefault(_computeBase2),_commonRegex=__webpack_require__(113),_commonRegex2=_interopRequireDefault(_commonRegex),Compute=function(_computeBase){function Compute(){return(0,_classCallCheck3.default)(this,Compute),(0,_possibleConstructorReturn3.default)(this,(Compute.__proto__||(0,_getPrototypeOf2.default)(Compute)).call(this))}return(0,_inherits3.default)(Compute,_computeBase),(0,_createClass3.default)(Compute,[{key:"getDecimal",value:function(t){return t.toString().match(_commonRegex2.default.specialRegex.getDecimal)}},{key:"computeSqrt",value:function computeSqrt(r){
var this$1 = this;
var regex=/\\SQRT(?:\[([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})\])?([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)\*]+)\})/g,str=r;str=str.replace(/([a-z\)]|[0-9\.]+|(?:(?:\{?[0-9a-zA-Z\.]+\}?)|\((?:[\w\+\-\^\.]+)\))\^([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})|(?:\\SQRT(?:\[([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})\])?([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\}))|(?:\\FRAC([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})))(?=[^0-9%,:+\-*\\\\^\_}\s\)\.]|\\SQRT|\\FRAC|\()/g,"$1*"),str=str.replace(/(\\FRAC[0-9])\*(\{)/g,"$1$2");for(var m=void 0;null!==(m=regex.exec(str));){m.index===regex.lastIndex&&(regex.lastIndex+=1);var S=str.split("");m[1]&&(/((?:[0-9a-zA-Z\.]+)|\((?:[\w\+\-\^\.*]+)\))\^([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)*]+)\})/g.test(m[1])&&(m[1]=this$1.computePower(m[1])),/\\FRAC([0-9a-zA-Z\.*]|\{(?:[\w\+\-\^\.\(\)*]+)\})([0-9a-zA-Z\.*]|\{(?:[\w\+\-\^\.\(\)*]+)\})/g.test(m[1])&&(m[1]=this$1.computeFrac(m[1])),m[1]=eval(this$1.cutOffString(this$1.standardAEK_AFH(m[1])))),m[2]&&(/((?:[0-9a-zA-Z\.]+)|\((?:[\w\+\-\^\.*]+)\))\^([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)*]+)\})/g.test(m[2])&&(m[2]=this$1.computePower(m[2])),/\\FRAC([0-9a-zA-Z\.*]|\{(?:[\w\+\-\^\.\(\)*]+)\})([0-9a-zA-Z\.*]|\{(?:[\w\+\-\^\.\(\)*]+)\})/g.test(m[2])&&(m[2]=this$1.computeFrac(m[2])),m[2]=eval(this$1.cutOffString(this$1.standardAEK_AFH(m[2])))),S.splice(m.index,m[0].length,"&&&&"+this$1.sqrt(m[1],m[2])+"&&&&"),str=S.join("");}return str=str.replace(/&&&&/g,"")}},{key:"sqrt",value:function(t,e){return t&&e?Math.pow(e,1/t):Math.sqrt(Number(e))}},{key:"computeFrac",value:function computeFrac(r){
var this$1 = this;
var regex=/\\FRAC([0-9a-zA-Z\.*]|\{(?:[\w\+\-\^\.\(\)*]+)\})([0-9a-zA-Z\.*]|\{(?:[\w\+\-\^\.\(\)*]+)\})/g,str=r;str=str.replace(/([a-z\)]|[0-9\.]+|(?:(?:\{?[0-9a-zA-Z\.]+\}?)|\((?:[\w\+\-\^\.]+)\))\^([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})|(?:\\SQRT(?:\[([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})\])?([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\}))|(?:\\FRAC([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})))(?=[^0-9%,:+\-*\\\\^\_}\s\)\.]|\\SQRT|\\FRAC|\()/g,"$1*"),str=str.replace(/(\\FRAC[0-9])\*(\{)/g,"$1$2");for(var m=void 0,m1=void 0,m2=void 0;null!==(m=regex.exec(str));){m.index===regex.lastIndex&&(regex.lastIndex+=1);var S=str.split("");m[1]&&(/\\SQRT(?:\[([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})\])?([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)\*]+)\})/g.test(m[1])&&(m[1]=this$1.computeSqrt(m[1])),/((?:[0-9a-zA-Z\.]+)|\((?:[\w\+\-\^\.*]+)\))\^([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)*]+)\})/g.test(m[1])&&(m[1]=this$1.computePower(m[1])),m[1]=eval(this$1.cutOffString(this$1.standardAEK_AFH(m[1])))),m[2]&&(/\\SQRT(?:\[([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})\])?([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)\*]+)\})/g.test(m[2])&&(m[2]=this$1.computeSqrt(m[2])),/((?:[0-9a-zA-Z\.]+)|\((?:[\w\+\-\^\.*]+)\))\^([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)*]+)\})/g.test(m[2])&&(m[2]=this$1.computePower(m[2])),m[2]=eval(this$1.cutOffString(this$1.standardAEK_AFH(m[2])))),S.splice(m.index,m[0].length,"&&&&&&&&"+this$1.frac(m[1],m[2])+"&&&&&&&&"),str=S.join("");}return str=str.replace(/&&&&&&&&/g,"")}},{key:"frac",value:function(t,e){return Number(t)/Number(e)}},{key:"computePower",value:function computePower(r){
var this$1 = this;
var regex=/((?:[0-9a-zA-Z\.]+)|\((?:[\w\+\-\^\.*]+)\))\^([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)*]+)\})/g,str=r;str=str.replace(/([a-z\)]|[0-9\.]+|(?:(?:\{?[0-9a-zA-Z\.]+\}?)|\((?:[\w\+\-\^\.]+)\))\^([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})|(?:\\SQRT(?:\[([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})\])?([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\}))|(?:\\FRAC([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})))(?=[^0-9%,:+\-*\\\\^\_}\s\)\.]|\\SQRT|\\FRAC|\()/g,"$1*"),str=str.replace(/(\\FRAC[0-9])\*(\{)/g,"$1$2");for(var m=void 0,m1=void 0,m2=void 0;null!==(m=regex.exec(str));){m.index===regex.lastIndex&&(regex.lastIndex+=1);var S=str.split("");m[1]&&(/\\SQRT(?:\[([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})\])?([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)\*]+)\})/g.test(m[1])&&(m[1]=this$1.computeSqrt(m[1])),/\\FRAC([0-9a-zA-Z\.*]|\{(?:[\w\+\-\^\.\(\)*]+)\})([0-9a-zA-Z\.*]|\{(?:[\w\+\-\^\.\(\)*]+)\})/g.test(m[1])&&(m[1]=this$1.computeFrac(m[1])),m[1]=eval(this$1.cutOffString(this$1.standardAEK_AFH(m[1])))),m[2]&&(/\\SQRT(?:\[([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})\])?([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)\*]+)\})/g.test(m[2])&&(m[2]=this$1.computeSqrt(m[2])),/\\FRAC([0-9a-zA-Z\.*]|\{(?:[\w\+\-\^\.\(\)*]+)\})([0-9a-zA-Z\.*]|\{(?:[\w\+\-\^\.\(\)*]+)\})/g.test(m[2])&&(m[2]=this$1.computeFrac(m[2])),m[2]=eval(this$1.cutOffString(this$1.standardAEK_AFH(m[2])))),S.splice(m.index,m[0].length,"&&&&"+this$1.power(m[1],m[2])+"&&&&"),str=S.join("");}return str=str.replace(/&&&&/g,"")}},{key:"power",value:function(t,e){return Math.pow(t,e)}},{key:"compositeCompute",value:function compositeCompute(answer){
var this$1 = this;
for(var str=answer,i=0;i<5;i+=1){ str=str.replace(/\{([\w\(\)\.\+\-\[\]])\}/g,"$1"); }var m="",units="",regex=/([一-龢]+)/g;if(/([一-龢]+)/g.test(str)){ for(;null!==(m=regex.exec(str));){ m.index===regex.lastIndex&&(regex.lastIndex+=1),units+=m[1]; } }str=str.replace(/([一-龢]+)/g,"");for(var _i=0;_i<5;_i+=1){ str=str.replace(/([a-z\)]|[0-9\.]+|(?:(?:\{?[0-9a-zA-Z\.]+\}?)|\((?:[\w\+\-\^\.]+)\))\^([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})|(?:\\SQRT(?:\[([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})\])?([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\}))|(?:\\FRAC([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})))(?=[^0-9%,:+\-*\\\\^\_}\s\)\.]|\\SQRT|\\FRAC|\()/g,"$1*"),str=str.replace(/(\\FRAC[0-9])\*(\{)/g,"$1$2"); }for(var status=!0,sqrtStatus=!1,fracStatus=!1,powerStatus=!1;status;){ sqrtStatus=!1,fracStatus=!1,powerStatus=!1,/\\SQRT(?:\[([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)]+)\})\])?([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)\*]+)\})/g.test(str)&&(sqrtStatus=!0,str=this$1.computeSqrt(str)),/((?:[0-9a-zA-Z\.]+)|\((?:[\w\+\-\^\.*]+)\))\^([0-9a-zA-Z\.]|\{(?:[\w\+\-\^\.\(\)*]+)\})/g.test(str)&&(powerStatus=!0,str=this$1.computePower(str)),/\\FRAC([0-9a-zA-Z\.*]|\{(?:[\w\+\-\^\.\(\)*]+)\})([0-9a-zA-Z\.*]|\{(?:[\w\+\-\^\.\(\)*]+)\})/g.test(str)&&(fracStatus=!0,str=this$1.computeFrac(str)),status=sqrtStatus||powerStatus||fracStatus; }return str=this.addProduct(str),str=this.standardAEK_AFH(str),str=this.cutOffString(str),(str=eval(str))+units}}]),Compute}(_computeBase3.default);exports.default=Compute;},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(48),o=r(i),u=n(117),a=r(u),s=n(537),c=r(s),f={};!function(t){var e=function(){function t(){this.yy={};}var e=function(t,e,n,r){for(n=n||{},r=t.length;r--;n[t[r]]=e){  }return n},n=[1,7],r=[1,17],i=[1,13],u=[1,14],s=[1,15],c=[1,32],f=[1,22],l=[1,23],p=[1,24],h=[1,25],d=[1,26],v=[1,33],g=[1,27],y=[1,28],m=[1,29],x=[1,30],w=[1,20],b=[1,36],_=[1,37],S=[5,6,8,10,33,35,41,43,45],A=[1,39],M=[1,40],E=[5,6,8,10,12,14,16,19,21,22,28,29,30,31,32,33,34,35,37,39,41,42,43,44,45,46],O=[10,16,19,21,22,28,29,30,31,32,34,37,39,42,43,44,46],k=[5,6,8,10,12,14,16,18,19,21,22,28,29,30,31,32,33,34,35,37,39,41,42,43,44,45,46],j={trace:function(){},yy:{},symbols_:{error:2,equation:3,expression:4,SIGN:5,EOF:6,additive:7,"+":8,multiplicative:9,"-":10,triglog:11,"*":12,negative:13,"/":14,trig:15,TRIG:16,trigfunc:17,"^":18,TRIGINV:19,logbase:20,ln:21,log:22,_:23,subscriptable:24,power:25,primitive:26,variable:27,VAR:28,CONST:29,INT:30,FLOAT:31,"{":32,"}":33,"(":34,")":35,function:36,FUNC:37,invocation:38,sqrt:39,"[":40,"]":41,abs:42,"|":43,"LEFT|":44,"RIGHT|":45,FRAC:46,$accept:0,$end:1},terminals_:{2:"error",5:"SIGN",6:"EOF",8:"+",10:"-",12:"*",14:"/",16:"TRIG",18:"^",19:"TRIGINV",21:"ln",22:"log",23:"_",28:"VAR",29:"CONST",30:"INT",31:"FLOAT",32:"{",33:"}",34:"(",35:")",37:"FUNC",39:"sqrt",40:"[",41:"]",42:"abs",43:"|",44:"LEFT|",45:"RIGHT|",46:"FRAC"},productions_:[0,[3,4],[3,2],[3,1],[4,1],[7,3],[7,3],[7,1],[9,2],[9,3],[9,3],[9,1],[13,2],[13,1],[15,1],[17,1],[17,3],[17,1],[20,1],[20,1],[20,3],[11,2],[11,2],[11,1],[25,3],[25,1],[27,1],[24,3],[24,1],[24,1],[24,1],[24,1],[24,3],[24,3],[36,1],[38,4],[38,4],[38,7],[38,4],[38,3],[38,3],[38,4],[26,1],[26,1],[26,7]],performAction:function(t,e,n,r,i,o,u){var a=o.length-1;switch(i){case 1:return new r.Eq(o[a-3],o[a-2],o[a-1]);case 2:return o[a-1];case 3:return new r.Add([]);case 4:case 7:case 11:case 13:case 15:case 20:case 23:case 25:case 42:case 43:this.$=o[a];break;case 5:this.$=r.Add.createOrAppend(o[a-2],o[a]);break;case 6:this.$=r.Add.createOrAppend(o[a-2],r.Mul.handleNegative(o[a],"subtract"));break;case 8:this.$=r.Mul.fold(r.Mul.createOrAppend(o[a-1],o[a]));break;case 9:this.$=r.Mul.fold(r.Mul.createOrAppend(o[a-2],o[a]));break;case 10:this.$=r.Mul.fold(r.Mul.handleDivide(o[a-2],o[a]));break;case 12:this.$=r.Mul.handleNegative(o[a]);break;case 14:case 17:this.$=[t];break;case 16:this.$=o[a-2].concat(o[a]);break;case 18:this.$=r.Log.natural();break;case 19:this.$=r.Log.common();break;case 21:this.$=r.Trig.create(o[a-1],o[a]);break;case 22:this.$=r.Log.create(o[a-1],o[a]);break;case 24:this.$=new r.Pow(o[a-2],o[a],!1);break;case 26:case 34:this.$=t;break;case 27:this.$=new r.Var(o[a-2],o[a]);break;case 28:this.$=new r.Var(o[a]);break;case 29:this.$=new r.Const(t.toLowerCase());break;case 30:this.$=r.Int.create(Number(t));break;case 31:this.$=r.Float.create(Number(t));break;case 32:this.$=o[a-1].completeParse();break;case 33:this.$=o[a-1].completeParse().addHint("parens");break;case 35:case 36:this.$=r.Pow.sqrt(o[a-1],!0);break;case 37:this.$=new r.Pow.nthroot(o[a-1],o[a-4],!0);break;case 38:case 39:case 40:this.$=new r.Abs(o[a-1]);break;case 41:this.$=new r.Func(o[a-3],o[a-1]);break;case 44:this.$=r.Mul.handleDivide(o[a-4],o[a-1]);}},table:[{3:1,4:2,6:[1,3],7:4,9:5,10:n,11:8,13:6,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},{1:[3]},{5:[1,34],6:[1,35]},{1:[2,3]},e([5,6],[2,4],{8:b,10:_}),e(S,[2,7],{17:9,20:10,25:11,15:12,26:16,24:18,38:19,27:21,36:31,11:38,12:A,14:M,16:r,19:i,21:u,22:s,28:c,29:f,30:l,31:p,32:h,34:d,37:v,39:g,42:y,44:x,46:w}),e(E,[2,11]),{10:n,11:8,13:41,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},e(E,[2,13]),{10:n,11:8,13:42,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},{10:n,11:8,13:43,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},e(E,[2,23]),e(O,[2,15],{18:[1,44]}),e(O,[2,17]),e(O,[2,18]),e(O,[2,19],{23:[1,45]}),e(E,[2,25],{18:[1,46]}),e([10,16,18,19,21,22,28,29,30,31,32,34,37,39,42,43,44,46],[2,14]),e(k,[2,42]),e(k,[2,43]),{32:[1,47]},e(k,[2,28],{23:[1,48]}),e(k,[2,29]),e(k,[2,30]),e(k,[2,31]),{7:49,9:5,10:n,11:8,13:6,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},{7:50,9:5,10:n,11:8,13:6,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},{32:[1,52],34:[1,51],40:[1,53]},{34:[1,54]},{7:55,9:5,10:n,11:8,13:6,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},{7:56,9:5,10:n,11:8,13:6,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},{34:[1,57]},e([5,6,8,10,12,14,16,18,19,21,22,23,28,29,30,31,32,33,34,35,37,39,41,42,43,44,45,46],[2,26]),{34:[2,34]},{4:58,7:4,9:5,10:n,11:8,13:6,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},{1:[2,2]},{9:59,10:n,11:8,13:6,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},{9:60,10:n,11:8,13:6,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},e(E,[2,8]),{10:n,11:8,13:61,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},{10:n,11:8,13:62,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},e(E,[2,12]),e(E,[2,21]),e(E,[2,22]),{10:n,11:8,13:63,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},{24:64,27:21,28:c,29:f,30:l,31:p,32:h,34:d},{10:n,11:8,13:65,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},{7:66,9:5,10:n,11:8,13:6,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},{24:67,27:21,28:c,29:f,30:l,31:p,32:h,34:d},{8:b,10:_,33:[1,68]},{8:b,10:_,35:[1,69]},{7:70,9:5,10:n,11:8,13:6,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},{7:71,9:5,10:n,11:8,13:6,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},{7:72,9:5,10:n,11:8,13:6,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},{7:73,9:5,10:n,11:8,13:6,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},{8:b,10:_,43:[1,74]},{8:b,10:_,45:[1,75]},{7:76,9:5,10:n,11:8,13:6,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},{6:[1,77]},e(S,[2,5],{17:9,20:10,25:11,15:12,26:16,24:18,38:19,27:21,36:31,11:38,12:A,14:M,16:r,19:i,21:u,22:s,28:c,29:f,30:l,31:p,32:h,34:d,37:v,39:g,42:y,44:x,46:w}),e(S,[2,6],{17:9,20:10,25:11,15:12,26:16,24:18,38:19,27:21,36:31,11:38,12:A,14:M,16:r,19:i,21:u,22:s,28:c,29:f,30:l,31:p,32:h,34:d,37:v,39:g,42:y,44:x,46:w}),e(E,[2,9]),e(E,[2,10]),e(O,[2,16]),e(O,[2,20]),e(E,[2,24]),{8:b,10:_,33:[1,78]},e(k,[2,27]),e(k,[2,32]),e(k,[2,33]),{8:b,10:_,35:[1,79]},{8:b,10:_,33:[1,80]},{8:b,10:_,41:[1,81]},{8:b,10:_,35:[1,82]},e(k,[2,39]),e(k,[2,40]),{8:b,10:_,35:[1,83]},{1:[2,1]},{32:[1,84]},e(k,[2,35]),e(k,[2,36]),{32:[1,85]},e(k,[2,38]),e(k,[2,41]),{7:86,9:5,10:n,11:8,13:6,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},{7:87,9:5,10:n,11:8,13:6,15:12,16:r,17:9,19:i,20:10,21:u,22:s,24:18,25:11,26:16,27:21,28:c,29:f,30:l,31:p,32:h,34:d,36:31,37:v,38:19,39:g,42:y,43:m,44:x,46:w},{8:b,10:_,33:[1,88]},{8:b,10:_,33:[1,89]},e(k,[2,44]),e(k,[2,37])],defaultActions:{3:[2,3],33:[2,34],35:[2,2],77:[2,1]},parseError:function(t,e){if(!e.recoverable){var n=function(t,e){this.message=t,this.hash=e;};throw n.prototype=Error,new n(t,e)}this.trace(t);},parse:function(t){
var this$1 = this;
var e=this,n=[0],r=[null],i=[],u=this.table,s="",c=0,f=0,l=0,p=i.slice.call(arguments,1),h=(0,a.default)(this.lexer),d={yy:{}};for(var v in this$1.yy){ Object.prototype.hasOwnProperty.call(this$1.yy,v)&&(d.yy[v]=this$1.yy[v]); }h.setInput(t,d.yy),d.yy.lexer=h,d.yy.parser=this,void 0===h.yylloc&&(h.yylloc={});var g=h.yylloc;i.push(g);var y=h.options&&h.options.ranges;"function"==typeof d.yy.parseError?this.parseError=d.yy.parseError:this.parseError=(0,o.default)(this).parseError;for(var m=void 0,x=void 0,w=void 0,b=void 0,_=void 0,S={},A=void 0,M=void 0,E=void 0,O=void 0;;){if(w=n[n.length-1],this$1.defaultActions[w]?b=this$1.defaultActions[w]:(null!==m&&void 0!==m||(m=function(){var t=void 0;return t=h.lex()||1,"number"!=typeof t&&(t=e.symbols_[t]||t),t}()),b=u[w]&&u[w][m]),void 0===b||!b.length||!b[0]){var k="";O=[];for(A in u[w]){ this$1.terminals_[A]&&A>2&&O.push("'"+this$1.terminals_[A]+"'"); }k=h.showPosition?"Parse error on line "+(c+1)+":\n"+h.showPosition()+"\nExpecting "+O.join(", ")+", got '"+(this$1.terminals_[m]||m)+"'":"Parse error on line "+(c+1)+": Unexpected "+(1==m?"end of input":"'"+(this$1.terminals_[m]||m)+"'"),this$1.parseError(k,{text:h.match,token:this$1.terminals_[m]||m,line:h.yylineno,loc:g,expected:O});}if(b[0]instanceof Array&&b.length>1){ throw new Error("Parse Error: multiple actions possible at state: "+w+", token: "+m); }switch(b[0]){case 1:n.push(m),r.push(h.yytext),i.push(h.yylloc),n.push(b[1]),m=null,x?(m=x,x=null):(f=h.yyleng,s=h.yytext,c=h.yylineno,g=h.yylloc,l>0&&l--);break;case 2:if(M=this$1.productions_[b[1]][1],S.$=r[r.length-M],S._$={first_line:i[i.length-(M||1)].first_line,last_line:i[i.length-1].last_line,first_column:i[i.length-(M||1)].first_column,last_column:i[i.length-1].last_column},y&&(S._$.range=[i[i.length-(M||1)].range[0],i[i.length-1].range[1]]),void 0!==(_=this$1.performAction.apply(S,[s,f,c,d.yy,b[1],r,i].concat(p)))){ return _; }M&&(n=n.slice(0,-1*M*2),r=r.slice(0,-1*M),i=i.slice(0,-1*M)),n.push(this$1.productions_[b[1]][0]),r.push(S.$),i.push(S._$),E=u[n[n.length-2]][n[n.length-1]],n.push(E);break;case 3:return!0}}return!0}},C=function(){return{EOF:1,parseError:function(t,e){if(!this.yy.parser){ throw new Error(t); }this.yy.parser.parseError(t,e);},setInput:function(t,e){return this.yy=e||this.yy||{},this._input=t,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var t=this._input[0];return this.yytext+=t,this.yyleng++,this.offset++,this.match+=t,this.matched+=t,t.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),t},unput:function(t){var e=t.length,n=t.split(/(?:\r\n?|\n)/g);this._input=t+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-e),this.offset-=e;var r=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),n.length-1&&(this.yylineno-=n.length-1);var i=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:n?(n.length===r.length?this.yylloc.first_column:0)+r[r.length-n.length].length-n[0].length:this.yylloc.first_column-e},this.options.ranges&&(this.yylloc.range=[i[0],i[0]+this.yyleng-e]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){return this.options.backtrack_lexer?(this._backtrack=!0,this):this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},less:function(t){this.unput(this.match.slice(t));},pastInput:function(){var t=this.matched.substr(0,this.matched.length-this.match.length);return(t.length>20?"...":"")+t.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var t=this.match;return t.length<20&&(t+=this._input.substr(0,20-t.length)),(t.substr(0,20)+(t.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var t=this.pastInput(),e=new Array(t.length+1).join("-");return t+this.upcomingInput()+"\n"+e+"^"},test_match:function(t,e){
var this$1 = this;
var n=void 0,r=void 0,i=void 0;if(this.options.backtrack_lexer&&(i={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(i.yylloc.range=this.yylloc.range.slice(0))),r=t[0].match(/(?:\r\n?|\n).*/g),r&&(this.yylineno+=r.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:r?r[r.length-1].length-r[r.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+t[0].length},this.yytext+=t[0],this.match+=t[0],this.matches=t,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(t[0].length),this.matched+=t[0],n=this.performAction.call(this,this.yy,this,e,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),n){ return n; }if(this._backtrack){for(var o in i){ this$1[o]=i[o]; }return!1}return!1},next:function(){
var this$1 = this;
if(this.done){ return this.EOF; }this._input||(this.done=!0);var t=void 0,e=void 0,n=void 0,r=void 0;this._more||(this.yytext="",this.match="");for(var i=this._currentRules(),o=0;o<i.length;o++){ if((n=this$1._input.match(this$1.rules[i[o]]))&&(!e||n[0].length>e[0].length)){if(e=n,r=o,this$1.options.backtrack_lexer){if(!1!==(t=this$1.test_match(n,i[o]))){ return t; }if(this$1._backtrack){e=!1;continue}return!1}if(!this$1.options.flex){ break }} }return e?!1!==(t=this.test_match(e,i[r]))&&t:""===this._input?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var t=this.next();return t||this.lex()},begin:function(t){this.conditionStack.push(t);},popState:function(){return this.conditionStack.length-1>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(t){return t=this.conditionStack.length-1-Math.abs(t||0),t>=0?this.conditionStack[t]:"INITIAL"},pushState:function(t){this.begin(t);},stateStackSize:function(){return this.conditionStack.length},options:{flex:!0},performAction:function(t,e,n,r){switch(n){case 0:case 1:case 2:break;case 3:return"INT";case 4:return"FLOAT";case 5:return"^";case 6:case 7:case 8:case 9:return"*";case 10:case 11:return"/";case 12:case 13:return"-";case 14:return"+";case 15:return"^";case 16:return"(";case 17:return")";case 18:return"(";case 19:return")";case 20:return"[";case 21:return"]";case 22:return"{";case 23:return"}";case 24:return"{";case 25:return"}";case 26:return"_";case 27:return"|";case 28:return"LEFT|";case 29:return"RIGHT|";case 30:return"!";case 31:return"SIGN";case 32:return e.yytext="<=","SIGN";case 33:return e.yytext=">=","SIGN";case 34:return e.yytext="<=","SIGN";case 35:return e.yytext=">=","SIGN";case 36:case 37:case 38:case 39:return e.yytext="<>","SIGN";case 40:return e.yytext="<=","SIGN";case 41:return e.yytext=">=","SIGN";case 42:case 43:return"FRAC";case 44:return"sqrt";case 45:return"abs";case 46:return"ln";case 47:return"log";case 48:case 49:case 50:case 51:return"TRIG";case 52:return e.yytext="sin","TRIG";case 53:return e.yytext="cos","TRIG";case 54:return e.yytext="tan","TRIG";case 55:return e.yytext="csc","TRIG";case 56:return e.yytext="sec","TRIG";case 57:return e.yytext="cot","TRIG";case 58:return e.yytext="arcsin","TRIG";case 59:return e.yytext="arccos","TRIG";case 60:return e.yytext="arctan","TRIG";case 61:return e.yytext="arccsc","TRIG";case 62:return e.yytext="arcsec","TRIG";case 63:return e.yytext="arccot","TRIG";case 64:case 65:return"TRIGINV";case 66:return e.yytext="sinh","TRIG";case 67:return e.yytext="cosh","TRIG";case 68:return e.yytext="tanh","TRIG";case 69:return e.yytext="csch","TRIG";case 70:return e.yytext="sech","TRIG";case 71:return e.yytext="tanh","TRIG";case 72:return"CONST";case 73:case 74:return e.yytext="pi","CONST";case 75:return"VAR";case 76:case 77:return e.yytext="theta","VAR";case 78:return"VAR";case 79:case 80:return e.yytext="phi","VAR";case 81:return t.symbolLexer(e.yytext);case 82:return"EOF";case 83:return"INVALID"}},rules:[/^(?:\s+)/,/^(?:\\space)/,/^(?:\\ )/,/^(?:[0-9]+\.?)/,/^(?:([0-9]+)?\.[0-9]+)/,/^(?:\*\*)/,/^(?:\*)/,/^(?:\\cdot|·)/,/^(?:\\times|×)/,/^(?:\\ast)/,/^(?:\/)/,/^(?:\\div|÷)/,/^(?:-)/,/^(?:−)/,/^(?:\+)/,/^(?:\^)/,/^(?:\()/,/^(?:\))/,/^(?:\\left\()/,/^(?:\\right\))/,/^(?:\[)/,/^(?:\])/,/^(?:\{)/,/^(?:\})/,/^(?:\\left\{)/,/^(?:\\right\})/,/^(?:_)/,/^(?:\|)/,/^(?:\\left\|)/,/^(?:\\right\|)/,/^(?:\!)/,/^(?:<=|>=|<>|<|>|=)/,/^(?:\\le)/,/^(?:\\ge)/,/^(?:\\leq)/,/^(?:\\geq)/,/^(?:=\/=)/,/^(?:\\ne)/,/^(?:\\neq)/,/^(?:≠)/,/^(?:≤)/,/^(?:≥)/,/^(?:\\frac)/,/^(?:\\dfrac)/,/^(?:sqrt|\\sqrt)/,/^(?:abs|\\abs)/,/^(?:ln|\\ln)/,/^(?:log|\\log)/,/^(?:sin|cos|tan)/,/^(?:csc|sec|cot)/,/^(?:sinh|cosh|tanh)/,/^(?:csch|sech|coth)/,/^(?:\\sin)/,/^(?:\\cos)/,/^(?:\\tan)/,/^(?:\\csc)/,/^(?:\\sec)/,/^(?:\\cot)/,/^(?:\\arcsin)/,/^(?:\\arccos)/,/^(?:\\arctan)/,/^(?:\\arccsc)/,/^(?:\\arcsec)/,/^(?:\\arccot)/,/^(?:arcsin|arccos|arctan)/,/^(?:arccsc|arcsec|arccot)/,/^(?:\\sinh)/,/^(?:\\cosh)/,/^(?:\\tanh)/,/^(?:\\csch)/,/^(?:\\sech)/,/^(?:\\coth)/,/^(?:pi)/,/^(?:π)/,/^(?:\\pi)/,/^(?:theta)/,/^(?:θ)/,/^(?:\\theta)/,/^(?:phi)/,/^(?:φ)/,/^(?:\\phi)/,/^(?:[a-zA-Z])/,/^(?:$)/,/^(?:.)/,/^(?:.)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84],inclusive:!0}}}}();return j.lexer=C,t.prototype=j,j.Parser=t,new t}();t.parser=e;}(f),function(t){function e(){}function n(){}function r(){1===arguments.length?this.terms=arguments[0]:this.terms=c.default.toArray(arguments);}function i(){1===arguments.length?this.terms=arguments[0]:this.terms=c.default.toArray(arguments);}function o(t,e,n){this.base=t,this.exp=e,this.isRadical=n;}function u(t,e){this.base=t,this.power=e;}function a(t,e){this.type=t,this.arg=e;}function s(t){this.arg=t;}function f(t,e,n){this.left=t,this.type=e,this.right=n;}function l(){}function p(t,e){this.symbol=t,this.arg=e;}function h(t,e){this.symbol=t,this.subscript=e;}function d(t){this.symbol=t;}function v(){}function g(t,e){var n=t,r=e;r<0&&(n=-n,r=-r),this.n=n,this.d=r;}function y(t){this.n=t;}function m(t){this.n=t;}function x(t){this.symbol=t;}var w=function(){throw new Error("Abstract method - must override for expr: "+this.print())},b=function(t){throw new Error(t)},_=function(t){return t!==t},S=function(t,e){var n=e-t;return Math.random()*n+t};c.default.extend(e.prototype,{func:w,args:w,construct:function(t){var e=new this.func;return this.func.apply(e,t),e},recurse:function(t){var e=Array.prototype.slice.call(arguments,1),n=c.default.map(this.args(),function(n){return c.default.isString(n)||"boolean"==typeof n?n:n[t].apply(n,e)});return this.construct(n)},eval:w,codegen:w,compile:function(){var t=this.codegen();try{return new Function("vars","return "+t+";")}catch(e){throw new Error("Function did not compile: "+t)}},print:w,tex:w,asTex:function(t){t=t||{},c.default.defaults(t,{display:!0,dynamic:!0,times:!1});var e=this.tex();return t.display&&(e="\\displaystyle "+e),t.dynamic&&(e=e.replace(/\(/g,"\\left("),e=e.replace(/\)/g,"\\right)")),t.times&&(e=e.replace(/\\cdot/g,"\\times")),e},name:function(){return this.func.name?this.func.name:this.func.toString().match(/^function\s*([^\s(]+)/)[1]},repr:function(){return this.name()+"("+c.default.map(this.args(),function(t){return c.default.isString(t)?t:t.repr()}).join(",")+")"},strip:function(){return this.recurse("strip")},normalize:function(){return this.recurse("normalize")},expand:function(){return this.recurse("expand")},factor:function(t){return this.recurse("factor",t)},collect:function(t){return this.recurse("collect",t)},equals:function(t){return this.normalize().print()===t.normalize().print()},simplify:function(t){t=c.default.extend({once:!1},t);var e=this.factor(t),n=e.collect(t);e.equals(n)&&(n=this.collect(t));var r=n.expand(t),i=r.collect(t);r.equals(i)&&(i=n.collect(t));var o=i;return t.once||this.equals(o)?o:o.simplify(t)},isSimplified:function(){return this.equals(this.simplify())},exprArgs:function(){return c.default.filter(this.args(),function(t){return t instanceof e})},getVars:function(t){return c.default.uniq(c.default.flatten(c.default.invoke(this.exprArgs(),"getVars",t))).sort()},getConsts:function(){return c.default.uniq(c.default.flatten(c.default.invoke(this.exprArgs(),"getConsts"))).sort()},getUnits:function(){return c.default.flatten(c.default.invoke(this.exprArgs(),"getUnits"))},is:function(t){return this instanceof t},has:function(t){return this instanceof t||c.default.any(this.exprArgs(),function(e){return e.has(t)})},raiseToThe:function(t){return new o(this,t)},isSubtract:function(){return!1},isDivide:function(){return!1},isRoot:function(){return!1},needsExplicitMul:function(){return this.args()[0].needsExplicitMul()},sameVars:function(t){var e=this.getVars(),n=t.getVars(),r=function(t,e){return!c.default.difference(t,e).length},i=function(t){return c.default.uniq(c.default.invoke(t,"toLowerCase")).sort()};return{equal:r(e,n),equalIgnoringCase:r(i(e),i(n))}},compare:function(t){if(t instanceof f){ return!1; }var e=c.default.union(this.getVars(!0),t.getVars(!0)),n=function(t,e){return Math.abs(t)<1||Math.abs(e)<1?Math.abs(t-e):Math.abs(1-t/e)},r=function(t,e){var r=n(t,e);return t===e||_(t)&&_(e)||r<Math.pow(10,-9)};if(!e.length&&!this.has(x)&&!t.has(x)){ return r(this.eval(),t.eval()); }var i=this.collect(),o=t.collect(),u=this.getUnits(),a=t.getUnits();if(!c.default.isEqual(u,a)){ return!1; }for(var s=0;s<12;s++){var l={},h=Math.pow(10,1+Math.floor(3*s/12)),d=s%2==0;c.default.each(e,function(t){l[t]=d?S(-h,h):c.default.random(-h,h);});var v;if(i.has(p)||o.has(p)||i.has(x)||o.has(x)){var g=i.partialEval(l),y=o.partialEval(l);v=g.simplify().equals(y.simplify());}else{var g=i.eval(l),y=o.eval(l);v=r(g,y);}if(!v){ return!1 }}return!0},partialEval:function(t){return this instanceof x?this:this.has(p)?this instanceof p?new p(this.symbol,this.arg.partialEval(t)):this.recurse("partialEval",t):new m(this.eval(t).toFixed(9)).collect()},sameForm:function(t){return this.strip().equals(t.strip())},findGCD:function(t){return this.equals(t)?t:v.One},getDenominator:function(){return v.One},asMul:function(){return new i(v.One,this)},isPositive:w,isNegative:function(){return!1},asPositiveFactor:function(){return this.isPositive()?this:v.One},addHint:function(t){if(!t){ return this; }var e=this.construct(this.args());return e.hints=c.default.clone(this.hints),e.hints[t]=!0,e},hints:{parens:!1},asExpr:function(){return this},completeParse:function(){return this.recurse("completeParse")},abs:w,negate:function(){return new i(v.Neg,this)}}),n.prototype=new e,c.default.extend(n.prototype,{args:function(){return this.terms},normalize:function(){var t=c.default.sortBy(c.default.invoke(this.terms,"normalize"),function(t){return t.print()});return new this.func(t)},expand:function(){return this.recurse("expand").flatten()},partition:function(){var t=c.default.groupBy(this.terms,function(t){return t instanceof v}),e=t.true||[],n=t.false||[];return[new this.func(e),new this.func(n)]},flatten:function(){var t=this,e=c.default.reject(this.terms,function(e){return e.equals(t.identity)});if(0===e.length){ return t.identity; }if(1===e.length){ return e[0]; }var n=c.default.groupBy(e,function(e){return e instanceof t.func}),r=n.true||[],i=n.false||[],o=i.concat(c.default.flatten(c.default.pluck(r,"terms"),!0));return new t.func(o)},identity:void 0,reduce:w,isPositive:function(){var t=c.default.invoke(this.terms,"collect");return c.default.all(c.default.invoke(t,"isPositive"))},replace:function(t,n){var r;r=t instanceof e?c.default.indexOf(this.terms,t):t;var i=[];c.default.isArray(n)?i=n:n&&(i=[n]);var o=this.terms.slice(0,r).concat(i).concat(this.terms.slice(r+1));return new this.func(o)},remove:function(t){return this.replace(t)},getDenominator:function(){return new i(c.default.invoke(this.terms,"getDenominator")).flatten()}}),r.prototype=new n,c.default.extend(r.prototype,{func:r,eval:function(t,e){return c.default.reduce(this.terms,function(n,r){return n+r.eval(t,e)},0)},codegen:function(){return c.default.map(this.terms,function(t){return"("+t.codegen()+")"}).join(" + ")||"0"},print:function(){return c.default.invoke(this.terms,"print").join("+")},tex:function(){var t="";return c.default.each(this.terms,function(e){!t||e.isSubtract()?t+=e.tex():t+="+"+e.tex();}),t},collect:function(t){var e=c.default.invoke(this.terms,"collect",t),n=[];c.default.each(e,function(e){if(e instanceof i){var r=e.partition();n.push([r[1].flatten(),r[0].reduce(t)]);}else { e instanceof v?n.push([v.One,e]):n.push([e,v.One]); }});var o=c.default.groupBy(n,function(t){return t[0].normalize().print()});return new r(c.default.compact(c.default.map(o,function(e){var n=e[0][0];return new i(new r(c.default.zip.apply(c.default,e)[1]).reduce(t),n).collect(t)}))).flatten()},factor:function(t){t=c.default.extend({keepNegative:!1},t);var e,n=c.default.invoke(this.terms,"collect");e=n[0]instanceof i?n[0].terms:[n[0]],c.default.each(c.default.rest(this.terms),function(t){e=c.default.map(e,function(e){return t.findGCD(e)});}),!t.keepNegative&&this.isNegative()&&e.push(v.Neg),e=new i(e).flatten().collect();var o=c.default.map(n,function(t){return i.handleDivide(t,e).simplify()});return o=new r(o).flatten(),i.createOrAppend(e,o).flatten()},reduce:function(t){return c.default.reduce(this.terms,function(e,n){return e.add(n,t)},this.identity)},needsExplicitMul:function(){return!1},isNegative:function(){var t=c.default.invoke(this.terms,"collect");return c.default.all(c.default.invoke(t,"isNegative"))},negate:function(){return new r(c.default.invoke(this.terms,"negate"))}}),i.prototype=new n,c.default.extend(i.prototype,{func:i,eval:function(t,e){return c.default.reduce(this.terms,function(n,r){return n*r.eval(t,e)},1)},codegen:function(){return c.default.map(this.terms,function(t){return"("+t.codegen()+")"}).join(" * ")||"0"},print:function(){return c.default.map(this.terms,function(t){return t instanceof r?"("+t.print()+")":t.print()}).join("*")},getUnits:function(){var t=(0,c.default)(this.terms).chain().map(function(t){return t.getUnits()}).flatten().value();return t.sort(function(t,e){return t.unit<e.unit}),t},tex:function(){for(var t,e=" \\cdot ",n=c.default.groupBy(this.terms,function(t){return t.isDivide()?"inverse":t instanceof v?"number":"other"}),u=n.inverse||[],a=n.number||[],s=n.other||[],f="",l=0;l<a.length;l++){if(a[l]instanceof g&&!(a[l]instanceof y)&&s.length>0&&u.length>0){var p=a.slice();p.splice(l,1);var h=p.concat(u).concat(s);return a[l].tex()+new i(h).tex()}}if(a=c.default.compact(c.default.map(a,function(t){var e=t instanceof g&&!(t instanceof y),n=!t.hints.fraction||u.length>0;if(e&&n){u.push(new o(new y(t.d),v.Div));var r=new y(t.n);return r.hints=t.hints,c.default.any(t.hints)?r:null}return t})),0===a.length&&1===s.length){ t=s[0].tex(); }else{var d="";c.default.each(a,function(t){t.hints.subtract&&t.hints.entered?(f+="-",d+=(d?e:"")+t.abs().tex()):t instanceof y&&-1===t.n&&(t.hints.negate||t.hints.subtract)?f+="-":d+=(d?e:"")+t.tex();}),c.default.each(s,function(t){t.needsExplicitMul()?d+=(d?e:"")+t.tex():d+=t instanceof r?"("+t.tex()+")":t.tex();}),t=d||"1";}if(!u.length){ return f+t; }var m=new i(c.default.invoke(u,"asDivide")).flatten().tex();return f+"\\frac{"+t+"}{"+m+"}"},strip:function(){return new i(c.default.map(this.terms,function(t){return t instanceof v?t.abs():t.strip()})).flatten()},expand:function(){var t=function(t){return t instanceof r},e=function(t){return t instanceof o&&t.exp.isNegative()},n=function(n){return e(n)&&t(n.base)},u=this.recurse("expand").flatten(),a=c.default.any(u.terms,t),s=c.default.any(u.terms,n);if(!a&&!s){ return u; }var f=c.default.groupBy(u.terms,e),l=f.false||[],p=f.true||[];if(a){var h=c.default.groupBy(l,t),d=h.true||[],g=h.false||[],y=c.default.reduce(d,function(t,e){return c.default.reduce(t,function(t,n){return t.concat(c.default.map(e.terms,function(t){return n.concat(t)}))},[])},[[]]);l=[new r(c.default.map(y,function(t){return new i(g.concat(t)).flatten()}))];}if(s){p=[new o(new i(c.default.invoke(p,"getDenominator")).flatten().expand(),v.Div)];}return new i(l.concat(p)).flatten()},factor:function(t){var e=this.recurse("factor",t).flatten();if(!(e instanceof i)){ return e; }var n=c.default.groupBy(e.terms,function(t){return t instanceof g}),r=c.default.reduce(n.true,function(t,e){return{n:t.n*e.n,d:t.d*e.d}},{n:1,d:1});return r=1===r.d?new y(r.n):new g(r.n,r.d),new i((n.false||[]).concat(r)).flatten()},collect:function(t){var e=this.recurse("collect",t).partition(),n=e[0].reduce(t);if(0===n.eval()){ return v.Zero; }var s=e[1].flatten();if(!(s instanceof i)){ return new i(n,s).flatten(); }s=s.terms;var f=[];c.default.each(s,function(t){t instanceof o?f.push([t.base,t.exp]):f.push([t,v.One]);});var l=c.default.groupBy(f,function(t){return t[0].normalize().print()}),p=c.default.compact(c.default.map(l,function(e){var n=e[0][0],i=new r(c.default.zip.apply(c.default,e)[1]),o=i.collect(t);return o instanceof v&&0===o.eval()?null:[n,o]})),f=c.default.groupBy(p,function(t){return t[0]instanceof a&&t[0].isBasic()?"trig":t[0]instanceof u?"log":"expr"}),h=f.trig||[],d=f.log||[],g=f.expr||[];if(h.length>1){var y=c.default.groupBy(h,function(t){return t[0].arg.normalize().print()});h=[],c.default.each(y,function(e){var n=e[0][0].arg,r={sin:v.Zero,cos:v.Zero};c.default.each(e,function(t){r[t[0].type]=t[1];}),i.handleNegative(r.sin).collect(t).equals(r.cos)&&(r=r.cos.isNegative()?{tan:r.sin}:{cot:r.cos}),c.default.each(r,function(t,e){h.push([new a(e,n),t]);});});}if(d.length>1){var m=c.default.groupBy(d,function(t){return t[0].base.normalize().print()});d=[],c.default.each(m,function(e){2===e.length&&i.handleNegative(e[0][1]).collect(t).equals(e[1][1])?e[0][1].isNegative()?d.push([new u(e[0][0].power,e[1][0].power),e[1][1]]):d.push([new u(e[1][0].power,e[0][0].power),e[0][1]]):d=d.concat(e);});}return f=h.concat(d).concat(g),new i([n].concat(c.default.map(f,function(e){return new o(e[0],e[1]).collect(t)}))).flatten()},isSubtract:function(){return c.default.any(this.terms,function(t){return t instanceof v&&t.hints.subtract})},factorIn:function(t){var e=this.partition(),n=e[0].terms;if(n.length&&c.default.all(n,function(t){return t.n>0})){var r=n[0].negate();return r.hints=n[0].hints,this.replace(n[0],r.addHint(t))}return new i([v.negativeOne(t)].concat(this.terms))},factorOut:function(){var t=!1,e=c.default.compact(c.default.map(this.terms,function(e,n,r){return!t&&e instanceof v&&e.hints.divide?(t=!0,-1!==e.n?e.negate():null):e}));return 1===e.length?e[0]:new i(e)},reduce:function(t){return c.default.reduce(this.terms,function(e,n){return e.mul(n,t)},this.identity)},findGCD:function(t){return new i(c.default.invoke(this.terms,"findGCD",t)).flatten()},asMul:function(){return this},asPositiveFactor:function(){return this.isPositive()?this:new i(c.default.invoke(this.collect().terms,"asPositiveFactor")).flatten()},isNegative:function(){return c.default.any(c.default.invoke(this.collect().terms,"isNegative"))},fold:function(){return i.fold(this)},negate:function(){var t=function(t){return t instanceof v};if(c.default.any(this.terms,t)){var e=c.default.find(this.terms,t);return this.replace(e,e.negate())}return new i([v.Neg].concat(this.terms))}}),c.default.each([r,i],function(t){c.default.extend(t,{createOrAppend:function(e,n){return e instanceof t?new t(e.terms.concat(n)):new t(e,n)}});}),c.default.extend(i,{handleNegative:function(t,e){if(t instanceof v&&t.n>0){var n=t.negate();return n.hints=t.hints,n.addHint(e)}return t instanceof i?t.factorIn(e):new i(v.negativeOne(e),t)},handleDivide:function(t,e){if(e instanceof i){var n=i.handleDivide(t,e.terms[0]),r=new i(c.default.rest(e.terms)).flatten();return i.handleDivide(n,r)}var u=function(t){return t instanceof y},s=function(t){return t instanceof g};if(u(e)&&t instanceof i&&c.default.any(t.terms,u)){var f=t.terms.slice().reverse(),l=c.default.find(f,s);if(!u(l)){ return new i(t.terms.concat([new g(1,e.n).addHint("fraction")])); }var p=new g(l.n,e.n);p.hints=l.hints,l===f[0]&&(p=p.addHint("fraction"));return l.n<0&&e.n<0?(p.d=-p.d,t.replace(l,[v.Neg,p])):t.replace(l,p)}var h=function(t,e){if(e instanceof y){if(t instanceof y){ return t.n<0&&e.n<0?[v.Neg,new g(t.n,-e.n).addHint("fraction")]:[new g(t.n,e.n).addHint("fraction")]; }var n=new g(1,e.eval());return e.eval()<0?[t,n.addHint("negate")]:[t,n]}var r;if(e instanceof a&&e.exp){var u=e.exp;e.exp=void 0,e=new o(e,u);}return r=e instanceof o?new o(e.base,i.handleNegative(e.exp,"divide")):new o(e,v.Div),t instanceof y&&1===t.n?[r]:[t,r]};if(t instanceof i){var d=h(c.default.last(t.terms),e);return new i(c.default.initial(t.terms).concat(d))}var d=h(t,e);return new i(d).flatten()},fold:function(t){if(t instanceof i){var e=c.default.find(c.default.initial(t.terms),function(t){return(t instanceof a||t instanceof u)&&t.hints.open}),n=c.default.indexOf(t.terms,e);if(e){var r=c.default.last(t.terms);if(!(e.hints.parens||r.hints.parens||r.has(a)||r.has(u))){var o;return o=e instanceof a?a.create([e.type,e.exp],i.createOrAppend(e.arg,r).fold()):u.create(e.base,i.createOrAppend(e.power,r).fold()),0===n?o:new i(t.terms.slice(0,n).concat(o)).fold()}e.hints.open=!1;}var s=t.partition(),f=s[0].terms,l=function(t){return t.n>0},p=function(t){return-1===t.n&&t.hints.negate},h=function(t){return l(t)||p(t)};if(f.length>1&&c.default.some(f,p)&&c.default.some(f,l)&&c.default.every(f,h)){var d=c.default.indexOf(t.terms,c.default.find(t.terms,p)),v=c.default.indexOf(t.terms,c.default.find(t.terms,l));if(d<v){ return t.replace(v,t.terms[v].negate()).remove(d) }}}return t}}),o.prototype=new e,c.default.extend(o.prototype,{func:o,args:function(){return[this.base,this.exp,this.isRadical]},eval:function(t,e){var n=this.base.eval(t,e),r=this.exp.eval(t,e);if(n<0){var i=this.exp.simplify();if(i instanceof m){var o=i.n,u=(o-o.toFixed()).toString().length-2,a=Math.pow(10,u);i=new g(o*a,a).simplify();}if(i instanceof g){if(Math.abs(i.d)%2==1){return(Math.abs(i.n)%2==1?-1:1)*Math.pow(-1*n,r)}}}return Math.pow(n,r)},getUnits:function(){var t=this;return this.base.getUnits().map(function(e){return{unit:e.unit,pow:e.pow*t.exp.n}})},codegen:function(){return"Math.pow("+this.base.codegen()+", "+this.exp.codegen()+")"},print:function(){var t=this.base.print();return(this.base instanceof n||this.base instanceof o)&&(t="("+t+")"),this.isRadical?"(R) "+t+"^("+this.exp.print()+")":t+"^("+this.exp.print()+")"},tex:function(){if(this.isDivide()){ return"\\frac{1}{"+this.asDivide().tex()+"}"; }if(this.isRoot()){ return 1!==this.exp.n&&b("Node marked with hint 'root' does not have exponent of form 1/x."),2===this.exp.d?"\\sqrt{"+this.base.tex()+"}":"\\sqrt["+this.exp.d+"]{"+this.base.tex()+"}"; }if(this.base instanceof a&&!this.base.isInverse()&&this.exp instanceof v&&this.exp.isSimple()&&this.exp.eval()>=0){var t=this.base.tex({split:!0});return t[0]+"^{"+this.exp.tex()+"}"+t[1]}var e=this.base.tex();return this.base instanceof n||this.base instanceof o||this.base instanceof v&&!this.base.isSimple()?e="("+e+")":(this.base instanceof a||this.base instanceof u)&&(e="["+e+"]"),e+"^{"+this.exp.tex()+"}"},needsExplicitMul:function(){return!this.isRoot()&&this.base.needsExplicitMul()},expand:function(){var t=this.recurse("expand");if(t.base instanceof i){var e=c.default.map(t.base.terms,function(e){return new o(e,t.exp)});return new i(e).expand()}if(t.base instanceof r&&t.exp instanceof y&&t.exp.abs().eval()>1){for(var n=t.exp.eval()>0,u=t.exp.abs().eval(),a=function(t){return n?t:new o(t,v.Div)},s={1:t.base},f=2;f<=u;f*=2){var l=new i(s[f/2],s[f/2]);s[f]=l.expand().collect();}if(c.default.has(s,u)){ return a(s[u]); }var p=c.default.map(u.toString(2).split(""),function(t,e,n){return Number(t)*Math.pow(2,n.length-e-1)});p=c.default.without(p,0);var l=new i(c.default.pick(s,p)).expand().collect();return a(l)}if(t.exp instanceof r){var e=c.default.map(t.exp.terms,function(e){return new o(t.base,e).expand()});return new i(e).expand()}return t},factor:function(){var t=this.recurse("factor");if(t.base instanceof i){return new i(c.default.map(t.base.terms,function(e){return e instanceof y&&t.exp.equals(v.Div)?new g(1,e.n):new o(e,t.exp)}))}return t},collect:function(t){if(this.base instanceof o){var e=this.base.base,n=i.createOrAppend(this.base.exp,this.exp);return new o(e,n).collect(t)}var r=this.recurse("collect",t),a=function(t){return t instanceof u&&t.base.equals(r.base)};if(r.exp instanceof v&&0===r.exp.eval()){ return v.One; }if(r.exp instanceof v&&1===r.exp.eval()){ return r.base; }if(a(r.exp)){ return r.exp.power; }if(r.exp instanceof i&&c.default.any(r.exp.terms,a)){var s=c.default.find(r.exp.terms,a),e=s.power,n=r.exp.remove(s).flatten();return new o(e,n).collect(t)}if(r.base instanceof v&&r.exp instanceof v){if(t&&t.preciseFloats){var n=r.exp.asRational(),f=r.base.getDecimalPlaces();if(new o(r.base,new g(1,n.d)).collect().getDecimalPlaces()>f){return new o(new o(r.base,new y(n.n)).collect(),new g(1,n.d))}}return r.base.raiseToThe(r.exp,t)}return r},isDivide:function(){var t=function(t){return t instanceof v&&t.hints.divide};return t(this.exp)||this.exp instanceof i&&c.default.any(this.exp.terms,t)},asDivide:function(){if(this.exp instanceof v){if(-1===this.exp.eval()){ return this.base; }var t=this.exp.negate();return t.hints=c.default.clone(this.exp.hints),t.hints.divide=!1,new o(this.base,t)}if(this.exp instanceof i){ return new o(this.base,this.exp.factorOut()); }b("called asDivide() on an Expr that wasn't a Num or Mul");},isRoot:function(){return this.exp instanceof g&&this.exp.hints.root},isSquaredTrig:function(){return this.base instanceof a&&!this.base.isInverse()&&this.exp instanceof v&&2===this.exp.eval()},getDenominator:function(){if(this.exp instanceof v&&-1===this.exp.eval()){ return i.createOrAppend(this.base,this.base.getDenominator()).flatten(); }if(this.exp.isNegative()){var t=new o(this.base,i.handleNegative(this.exp).collect());return i.createOrAppend(t,t.collect().getDenominator()).flatten()}return this.base instanceof v?new o(this.base.getDenominator(),this.exp).collect():v.One},findGCD:function(t){var e,n;if(t instanceof o?(e=t.base,n=t.exp):(e=t,n=v.One),this.base.equals(e)){if(this.exp.equals(n)){ return this; }if(this.exp instanceof v&&n instanceof v){ return new o(this.base,v.min(this.exp,n)).collect(); }if(this.exp instanceof v||n instanceof v){ return v.One; }var r=this.exp.asMul().partition(),u=n.asMul().partition();if(r[1].equals(u[1])){return new o(e,new i(v.min(r[0].reduce(),u[0].reduce()),r[1].flatten()).flatten()).collect()}}return v.One},isPositive:function(){if(this.base.isPositive()){ return!0; }var t=this.exp.simplify();return t instanceof y&&t.eval()%2==0},asPositiveFactor:function(){if(this.isPositive()){ return this; }var t=this.exp.simplify();if(t instanceof y){var e=t.eval();if(e>2){ return new o(this.base,new y(e-1)); }if(e<-2){ return new o(this.base,new y(e+1)) }}return v.One}}),c.default.extend(o,{sqrt:function(t){return new o(t,v.Sqrt)},nthroot:function(t,e,n){return new o(t,i.fold(i.handleDivide(new y(1),e)).addHint("root"),n)}}),u.prototype=new e,c.default.extend(u.prototype,{func:u,args:function(){return[this.base,this.power]},eval:function(t,e){return Math.log(this.power.eval(t,e))/Math.log(this.base.eval(t,e))},codegen:function(){return"(Math.log("+this.power.codegen()+") / Math.log("+this.base.codegen()+"))"},print:function(){var t="("+this.power.print()+")";return this.isNatural()?"ln"+t:"log_("+this.base.print()+") "+t},tex:function(){var t="("+this.power.tex()+")";return this.isNatural()?"\\ln"+t:"\\log_{"+this.base.tex()+"}"+t},collect:function(t){var e=this.recurse("collect",t);return e.power instanceof v&&1===e.power.eval()?v.Zero:e.base.equals(e.power)?v.One:e.power instanceof o&&e.power.base.equals(e.base)?e.power.exp:e},expand:function(){var t=this.recurse("expand");if(t.power instanceof i){return new r(c.default.map(t.power.terms,function(e){return new u(t.base,e).expand()}))}return t.power instanceof o?new i(t.power.exp,new u(t.base,t.power.base).expand()).flatten():t.isNatural()?t:i.handleDivide(new u(d.e,t.power),new u(d.e,t.base))},hints:c.default.extend(u.prototype.hints,{open:!1}),isPositive:function(){var t=this.collect();return t.base instanceof v&&t.power instanceof v&&this.eval()>0},needsExplicitMul:function(){return!1},isNatural:function(){return this.base.equals(d.e)}}),c.default.extend(u,{natural:function(){return d.e},common:function(){return v.Ten},create:function(t,e){var n=new u(t,e);return e.hints.parens||(n=n.addHint("open")),n}}),a.prototype=new e,c.default.extend(a.prototype,{func:a,args:function(){return[this.type,this.arg]},functions:{sin:{eval:Math.sin,codegen:"Math.sin((",tex:"\\sin",expand:function(){return this}},cos:{eval:Math.cos,codegen:"Math.cos((",tex:"\\cos",expand:function(){return this}},tan:{eval:Math.tan,codegen:"Math.tan((",tex:"\\tan",expand:function(){return i.handleDivide(a.sin(this.arg),a.cos(this.arg))}},csc:{eval:function(t){return 1/Math.sin(t)},codegen:"(1/Math.sin(",tex:"\\csc",expand:function(){return i.handleDivide(v.One,a.sin(this.arg))}},sec:{eval:function(t){return 1/Math.cos(t)},codegen:"(1/Math.cos(",tex:"\\sec",expand:function(){return i.handleDivide(v.One,a.cos(this.arg))}},cot:{eval:function(t){return 1/Math.tan(t)},codegen:"(1/Math.tan(",tex:"\\cot",expand:function(){return i.handleDivide(a.cos(this.arg),a.sin(this.arg))}},arcsin:{eval:Math.asin,codegen:"Math.asin((",tex:"\\arcsin"},arccos:{eval:Math.acos,codegen:"Math.acos((",tex:"\\arccos"},arctan:{eval:Math.atan,codegen:"Math.atan((",tex:"\\arctan"},arccsc:{eval:function(t){return Math.asin(1/t)},codegen:"Math.asin(1/(",tex:"\\operatorname{arccsc}"},arcsec:{eval:function(t){return Math.acos(1/t)},codegen:"Math.acos(1/(",tex:"\\operatorname{arcsec}"},arccot:{eval:function(t){return Math.atan(1/t)},codegen:"Math.atan(1/(",tex:"\\operatorname{arccot}"},sinh:{eval:function(t){return(Math.exp(t)-Math.exp(-t))/2},codegen:function(t){return"((Math.exp("+t+") - Math.exp(-("+t+"))) / 2)"},tex:"\\sinh",expand:function(){return this}},cosh:{eval:function(t){return(Math.exp(t)+Math.exp(-t))/2},codegen:function(t){return"((Math.exp("+t+") + Math.exp(-("+t+"))) / 2)"},tex:"\\cosh",expand:function(){return this}},tanh:{eval:function(t){return(Math.exp(t)-Math.exp(-t))/(Math.exp(t)+Math.exp(-t))},codegen:function(t){return"((Math.exp("+t+") - Math.exp(-("+t+"))) / (Math.exp("+t+") + Math.exp(-("+t+"))))"},tex:"\\tanh",expand:function(){return i.handleDivide(a.sinh(this.arg),a.cosh(this.arg))}},csch:{eval:function(t){return 2/(Math.exp(t)-Math.exp(-t))},codegen:function(t){return"(2 / (Math.exp("+t+") - Math.exp(-("+t+"))))"},tex:"\\csch",expand:function(){return i.handleDivide(v.One,a.sinh(this.arg))}},sech:{eval:function(t){return 2/(Math.exp(t)+Math.exp(-t))},codegen:function(t){return"(2 / (Math.exp("+t+") + Math.exp(-("+t+"))))"},tex:"\\sech",expand:function(){return i.handleDivide(v.One,a.cosh(this.arg))}},coth:{eval:function(t){return(Math.exp(t)+Math.exp(-t))/(Math.exp(t)-Math.exp(-t))},codegen:function(t){return"((Math.exp("+t+") + Math.exp(-("+t+"))) / (Math.exp("+t+") - Math.exp(-("+t+"))))"},tex:"\\coth",expand:function(){return i.handleDivide(a.cosh(this.arg),a.sinh(this.arg))}}},isEven:function(){return c.default.contains(["cos","sec"],this.type)},isInverse:function(){return 0===this.type.indexOf("arc")},isBasic:function(){return c.default.contains(["sin","cos"],this.type)},eval:function(t,e){return(0,this.functions[this.type].eval)(this.arg.eval(t,e))},codegen:function(){var t=this.functions[this.type].codegen;if("function"==typeof t){ return t(this.arg.codegen()); }if("string"==typeof t){ return t+this.arg.codegen()+"))"; }throw new Error("codegen not implemented for "+this.type)},print:function(){return this.type+"("+this.arg.print()+")"},tex:function(t){var e=this.functions[this.type].tex,n="("+this.arg.tex()+")";return t&&t.split?[e,n]:e+n},hints:c.default.extend(a.prototype.hints,{open:!1}),isPositive:function(){return this.collect().arg instanceof v&&this.eval()>0},completeParse:function(){if(this.exp){var t=new o(this,this.exp);return this.exp=void 0,t}return this},needsExplicitMul:function(){return!1},expand:function(){var t=this.recurse("expand");if(!t.isInverse()){var e=t.functions[t.type].expand;return c.default.bind(e,t)()}return t},collect:function(t){var e=this.recurse("collect",t);if(!e.isInverse()&&e.arg.isNegative()){var n;return n=e.arg instanceof v?e.arg.abs():i.handleDivide(e.arg,v.Neg).collect(t),e.isEven()?new a(e.type,n):new i(v.Neg,new a(e.type,n))}return e}}),c.default.extend(a,{create:function(t,e){var n=t[0],r=t[1];r&&r.equals(v.Neg)&&(n="arc"+n,r=void 0);var i=new a(n,e);return e.hints.parens||(i=i.addHint("open")),r&&(i.exp=r),i},sin:function(t){return new a("sin",t)},cos:function(t){return new a("cos",t)},sinh:function(t){return new a("sinh",t)},cosh:function(t){return new a("cosh",t)}}),s.prototype=new e,c.default.extend(s.prototype,{func:s,args:function(){return[this.arg]},eval:function(t,e){return Math.abs(this.arg.eval(t,e))},codegen:function(){return"Math.abs("+this.arg.codegen()+")"},print:function(){return"abs("+this.arg.print()+")"},tex:function(){return"\\left|"+this.arg.tex()+"\\right|"},collect:function(t){var e=this.recurse("collect",t);if(e.arg.isPositive()){ return e.arg; }if(e.arg instanceof v){ return e.arg.abs(); }if(e.arg instanceof i){var n=c.default.groupBy(e.arg.terms,function(t){return t.isPositive()?"positive":t instanceof v?"number":"other"}),r=n.positive.concat(c.default.invoke(n.number,"abs"));return n.other.length&&r.push(new s(new i(n.other).flatten())),new i(r).flatten()}return e},expand:function(){var t=this.recurse("expand");if(t.arg instanceof i){return new i(c.default.map(t.arg.terms,function(t){return new s(t)}))}return t},isPositive:function(){return!0}}),f.prototype=new e,c.default.extend(f.prototype,{func:f,args:function(){return[this.left,this.type,this.right]},needsExplicitMul:function(){return!1},print:function(){return this.left.print()+this.type+this.right.print()},signs:{"=":" = ","<":" < ",">":" > ","<>":" \\ne ","<=":" \\le ",">=":" \\ge "},tex:function(){return this.left.tex()+this.signs[this.type]+this.right.tex()},normalize:function(){var t=this.recurse("normalize");return c.default.contains([">",">="],t.type)?new f(t.right,t.type.replace(">","<"),t.left):t},asExpr:function(t){var e=function(t){return t instanceof v&&t.isSimple()&&0===t.eval()},n=[];this.left instanceof r?n=c.default.clone(this.left.terms):e(this.left)||(n=[this.left]),this.right instanceof r?n=n.concat(this.right.negate().terms):e(this.right)||n.push(this.right.negate());var o=!this.isEquality();n=c.default.invoke(n,"collect",{preciseFloats:!0});for(var u=0;u<n.length;u++){var a=n[u].getDenominator();o&&!a.isPositive()&&(a=a.asPositiveFactor()),a.equals(v.One)||(n=c.default.map(n,function(t){return i.createOrAppend(t,a).simplify({once:!0,preciseFloats:!0})}));}var s=new r(n).flatten();return t?s:this.divideThrough(s)},divideThrough:function(t){var e=!this.isEquality(),n=t.simplify({once:!0}),u=n.factor({keepNegative:e});if(!(u instanceof i)){ return t; }var a=u.terms,s=function(t){return t instanceof r},f=function(t){return!!t.getVars().length},l=function(t){return t.equals(v.One)},p=c.default.groupBy(a,s),h=p.true||[],d=p.false||[];if(h.length&&this.isEquality()){ return new i(h).flatten(); }var g=d;h.length||(g=c.default.reject(g,f)),e&&(g=c.default.invoke(g,"asPositiveFactor")),g=c.default.reject(g,l),g=c.default.map(g,function(t){return new o(t,v.Div)});var y=new i(a.concat(g)).collect();return y.equals(u)?n:y},isEquality:function(){return c.default.contains(["=","<>"],this.type)},compare:function(t){if(!(t instanceof f)){ return!1; }var e=this.normalize(),n=t.normalize();if(e.type!==n.type){ return!1; }var r=e.divideThrough(e.asExpr(!0).collect()),o=n.divideThrough(n.asExpr(!0).collect());return e.isEquality()?r.compare(o)||r.compare(i.handleNegative(o)):r.compare(o)},sameForm:function(t){var e=this.normalize(),n=t.normalize(),r=e.left.sameForm(n.left)&&e.right.sameForm(n.right);return e.isEquality()?r||e.left.sameForm(n.right)&&e.right.sameForm(n.left):r},isSimplified:function(){var t=this.asExpr(!0),e=this.divideThrough(t).simplify();return t.equals(e)&&this.left.isSimplified()&&this.right.isSimplified()}}),c.default.extend(f.prototype,{solveLinearEquationForVariable:function(t){var e=this.asExpr();if(!e.is(r)||2!==e.terms.length){ throw new Error("Can only handle linear equations of the form a + bx (= 0)"); }var n,o;return function(e){return e.has(h)&&c.default.contains(e.getVars(),t.symbol)}(e.terms[0])?(n=i.handleNegative(e.terms[1]),o=i.handleDivide(e.terms[0],t)):(n=i.handleNegative(e.terms[0]),o=i.handleDivide(e.terms[1],t)),i.handleDivide(n,o).simplify()}}),l.prototype=new e,c.default.extend(l.prototype,{needsExplicitMul:function(){return!1},findGCD:function(t){return t instanceof l||t instanceof v?this.equals(t)?this:v.One:t.findGCD(this)}}),p.prototype=new l,c.default.extend(p.prototype,{func:p,args:function(){return[this.symbol,this.arg]},print:function(){return this.symbol+"("+this.arg.print()+")"},tex:function(){return this.symbol+"("+this.arg.tex()+")"},eval:function(e,n){var r=this.arg,i=e[this.symbol],o=c.default.extend(c.default.clone(e),{x:r.eval(e,n)}),u=t.parse(i,n);return u.parsed?u.expr.eval(o,n):u},codegen:function(){return'vars["'+this.symbol+'"]('+this.arg.codegen()+")"},getUnits:function(){return this.arg.getUnits()},getVars:function(t){return t?this.arg.getVars():c.default.union(this.arg.getVars(),[this.symbol]).sort()},getConsts:function(){return this.arg.getConsts()}}),h.prototype=new l,c.default.extend(h.prototype,{func:h,args:function(){return[this.symbol,this.subscript]},exprArgs:function(){return[]},recurse:function(){return this},print:function(){var t="";return this.subscript&&(t="_("+this.subscript.print()+")"),this.symbol+t},prettyPrint:function(){var t=this.subscript;return t&&(t instanceof v||t instanceof l)?this.symbol+"_"+t.print():this.print()},tex:function(){var t="";return this.subscript&&(t="_{"+this.subscript.tex()+"}"),(this.symbol.length>1?"\\":"")+this.symbol+t},repr:function(){return"Var("+this.print()+")"},eval:function(t,e){return t[this.prettyPrint()]},codegen:function(){return'vars["'+this.prettyPrint()+'"]'},getVars:function(){return[this.prettyPrint()]},isPositive:function(){return!1}}),d.prototype=new l,c.default.extend(d.prototype,{func:d,args:function(){return[this.symbol]},recurse:function(){return this},eval:function(t,e){return"pi"===this.symbol?Math.PI:"e"===this.symbol?Math.E:void 0},codegen:function(){return"pi"===this.symbol?"Math.PI":"e"===this.symbol?"Math.E":void 0},print:function(){return this.symbol},tex:function(){return"pi"===this.symbol?"\\pi ":"e"===this.symbol?"e":void 0},isPositive:function(){return this.eval()>0},abs:function(){return this.eval()>0?this:i.handleNegative(this)},getConsts:function(){return[this.print()]}}),d.e=new d("e"),d.pi=new d("pi"),v.prototype=new e,c.default.extend(v.prototype,{repr:function(){return this.print()},strip:function(){return this.abs()},recurse:function(){return this},codegen:function(){return this.print()},add:w,mul:w,negate:w,isSubtract:function(){return this.hints.subtract},abs:w,needsExplicitMul:function(){return!0},findGCD:w,isPositive:function(){return this.eval()>0},isNegative:function(){return this.eval()<0},asPositiveFactor:function(){return this.isPositive()?this:this.abs()},hints:c.default.extend(v.prototype.hints,{negate:!1,subtract:!1,divide:!1,root:!1,fraction:!1,entered:!1}),isSimple:w,getDecimalPlaces:function(){var t=(""+this.n).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);return t?Math.max(0,(t[1]?t[1].length:0)-(t[2]?+t[2]:0)):0},asRational:w}),g.prototype=new v,c.default.extend(g.prototype,{func:g,args:function(){return[this.n,this.d]},eval:function(){return this.n/this.d},print:function(){return this.n.toString()+"/"+this.d.toString()},tex:function(){var t="\\frac{"+Math.abs(this.n).toString()+"}{"+this.d.toString()+"}";return this.n<0?"-"+t:t},add:function(t,e){return t instanceof g?new g(this.n*t.d+this.d*t.n,this.d*t.d).collect():t.add(this,e)},mul:function(t,e){return t instanceof g?new g(this.n*t.n,this.d*t.d).collect():t.mul(this,e)},collect:function(){var t=v.findGCD(this.n,this.d),e=this.n/t,n=this.d/t;return 1===n?new y(e):new g(e,n)},negate:function(){return new g(-this.n,this.d)},abs:function(){return new g(Math.abs(this.n),this.d)},findGCD:function(t){if(t instanceof g){return new g(v.findGCD(this.n*t.d,t.n*this.d),this.d*t.d).collect()}return t instanceof y?new g(v.findGCD(this.n,t.n),this.d):t.findGCD(this)},raiseToThe:function(t){if(t instanceof y){var e=t.eval()>0,n=t.abs().eval(),r=Math.pow(this.n,n),i=Math.pow(this.d,n);return e?new g(r,i).collect():new g(i,r).collect()}return new m(this.eval()).raiseToThe(t)},getDenominator:function(){return new y(this.d)},isSimple:function(){return!1},asRational:function(){return this}}),y.prototype=new g(0,1),c.default.extend(y.prototype,{func:y,args:function(){return[this.n]},print:function(){return this.n.toString()},tex:function(){return this.n.toString()},negate:function(){return new y(-this.n)},abs:function(){return new y(Math.abs(this.n))},isSimple:function(){return!0},findGCD:function(t){return t instanceof y?new y(v.findGCD(this.n,t.n)):t.findGCD(this)}}),c.default.extend(y,{create:function(t){return new y(t).addHint("entered")}}),m.prototype=new v,c.default.extend(m.prototype,{func:m,args:function(){return[this.n]},eval:function(){return this.n},print:function(){return this.n.toString()},tex:function(){return this.n.toString()},add:function(t,e){return e&&e.preciseFloats?m.toDecimalPlaces(this.n+t.eval(),Math.max(this.getDecimalPlaces(),t.getDecimalPlaces())):new m(this.n+t.eval()).collect()},mul:function(t,e){return e&&e.preciseFloats?m.toDecimalPlaces(this.n*t.eval(),this.getDecimalPlaces()+t.getDecimalPlaces()):new m(this.n*t.eval()).collect()},collect:function(){return this},negate:function(){return new m(-this.n)},abs:function(){return new m(Math.abs(this.n))},findGCD:function(t){return t instanceof v?new m(v.findGCD(this.eval(),t.eval())).collect():t.findGCD(this)},raiseToThe:function(t,e){return e&&e.preciseFloats&&t instanceof y&&t.n>1?m.toDecimalPlaces(new o(this,t).eval(),this.getDecimalPlaces()*t.n):new m(new o(this,t).eval()).collect()},asRational:function(){var t=this.n.toString().split(".");return 1===t.length?new g(this.n,1):new g(Number(t.join("")),Math.pow(10,t[1].length)).collect()},getDenominator:function(){return this.asRational().getDenominator()},isSimple:function(){return!0}}),c.default.extend(m,{create:function(t){return new m(t).addHint("entered")},toDecimalPlaces:function(t,e){return new m(+t.toFixed(Math.min(e,20))).collect()}}),c.default.extend(v,{negativeOne:function(t){return"subtract"===t?v.Sub:"divide"===t?v.Div:v.Neg},findGCD:function(t,e){var n;if(t=Math.abs(t),e=Math.abs(e),t!==Math.floor(t)||e!==Math.floor(e)){ return 1; }for(;e;){ n=t%e,t=e,e=n; }return t},min:function(){return c.default.min(c.default.toArray(arguments),function(t){return t.eval()})},max:function(){return c.default.max(c.default.toArray(arguments),function(t){return t.eval()})}}),v.Neg=new y(-1).addHint("negate"),v.Sub=new y(-1).addHint("subtract"),v.Div=new y(-1).addHint("divide"),v.Sqrt=new g(1,2).addHint("root"),v.Zero=new y(0),v.One=new y(1),v.Ten=new y(10),r.prototype.identity=v.Zero,i.prototype.identity=v.One;var A=t.parser,M=function(t,e){throw new Error(e.loc.first_column)};A.yy={Add:r,Mul:i,Pow:o,Log:u,Trig:a,Eq:f,Abs:s,Func:p,Const:d,Var:h,Int:y,Float:m,parseError:M,constants:["e"],symbolLexer:function(t){return c.default.contains(A.yy.constants,t)?"CONST":c.default.contains(A.yy.functions,t)?"FUNC":"VAR"}},t.parse=function(t,e){try{e&&e.functions?A.yy.functions=c.default.without(e.functions,"i"):A.yy.functions=[],e&&e.decimal_separator&&(t=t.split(e.decimal_separator).join("."));return{parsed:!0,expr:A.parse(t).completeParse()}}catch(t){return{parsed:!1,error:t.message}}},x.prototype=new l;var E=function(t){if((0,c.default)(O).has(t)||(0,c.default)(I).has(t)){ return new x(t); }var e=(0,c.default)((0,c.default)(k).keys()).find(function(e){return new RegExp("^"+e).test(t)});if(e){var n=t.replace(new RegExp("^"+e),"");if((0,c.default)(O).has(n)||I[n]&&I[n].prefixes===j){ return new i(k[e],new x(n)); }throw new Error(n+" does not allow prefixes")}return new x(t)};t.unitParse=function(e){try{var n=t.unitParser.parse(e),r=[];(0,c.default)(n.unit.num).each(function(t){r.push(new o(E(t.name),new y(t.pow)));}),(0,c.default)(n.unit.denom).each(function(t){r.push(new o(E(t.name),new y(-1*t.pow)));});var u=new i(r).flatten();if("unitMagnitude"===n.type){return{parsed:!0,unit:u,expr:new i([new m(+n.magnitude)].concat(r)),coefficient:n.magnitude,type:n.type}}return{parsed:!0,unit:u,type:n.type}}catch(t){return{parsed:!1,error:t.message}}},c.default.extend(x.prototype,{func:x,args:function(){return[this.symbol]},recurse:function(){return this},eval:function(t,e){return 1},getUnits:function(){return[{unit:this.symbol,pow:1}]},codegen:function(){return"1"},print:function(){return this.symbol},tex:function(){return this.symbol},collect:function(t){if((0,c.default)(O).has(this.symbol)){ return this; }if((0,c.default)(I).has(this.symbol)){ return I[this.symbol].conversion; }throw new Error("could not understand unit: "+this.symbol)}});var O={m:new x("m"),g:new x("g"),s:new x("s"),A:new x("A"),K:new x("K"),mol:new x("mol"),cd:new x("cd")},k={a:new o(new y(10),new y(-18)),f:new o(new y(10),new y(-15)),p:new o(new y(10),new y(-12)),n:new o(new y(10),new y(-9)),u:new o(new y(10),new y(-6)),m:new o(new y(10),new y(-3)),c:new o(new y(10),new y(-2)),d:new o(new y(10),new y(-1)),da:new y(10),h:new o(new y(10),new y(2)),k:new o(new y(10),new y(3)),M:new o(new y(10),new y(6)),G:new o(new y(10),new y(9)),T:new o(new y(10),new y(12)),P:new o(new y(10),new y(15)),E:new o(new y(10),new y(18)),hella:new o(new y(10),new y(27))},j={},C={},R=function(e,n){var r=e.split("|"),u=r[0].trim(),a=r[1].trim(),s=v.One;""!==u&&(s=t.parse(u).expr);var c=a.split("/"),f=[s];return c[0]&&c[0].split(" ").filter(function(t){return""!==t}).map(function(t){f.push(new x(t));}),c[1]&&c[1].split(" ").filter(function(t){return""!==t}).map(function(t){f.push(new o(new x(t),v.Div));}),{conversion:new i(f),prefixes:n}},I={Da:R("1.6605388628 x 10^-24 | g",j),u:R("| Da",C),meter:R("| m",C),meters:R("| m",C),in:R("254 / 10000 | m",C),ft:R("3048  / 10000 | m",C),yd:R("9144  / 10000 | m",C),mi:R("1609344 / 1000 | m",C),ly:R("9.4607 x 10^15 | m",C),nmi:R("1852 | m",C),"Å":R("10^-10 | m",C),pc:R("3.0857 x 10^16 | m",C),min:R("60 | s",C),hr:R("3600 | s",C),sec:R("| s",C),day:R("86400 | s",C),wk:R("604800 | s",C),fortnight:R("14 | day",C),shake:R("10^-8 | s",C),olympiad:R("126200000 | s",C),"°C":R("1 | K",C),"°F":R("5/9 | K",C),"°R":R("5/9 | K",C),e:R("1.6021765314 x 10^-19 | C",C),c:R("299792458 | m / s",C),kn:R("514/1000 | m / s",C),kt:R("| kn",C),knot:R("| kn",C),J:R("| N m",j),BTU:R("1060 | J",C),cal:R("4184 / 1000 | J",j),eV:R("1.602176514 x 10^-19 | J",j),erg:R("10^−7 | J",j),W:R("| J / s",j),"H-e":R("80 | W",C),N:R("1000 | g m / s s",j),lb:R("4448221615 / 1000000000 | N",C),dyn:R("10^-5 | N",C),Pa:R("1 | N / m m m",j),bar:R("10^5 | Pa",j),"㏔":R("1/1000 | bar",C),"㍴":R("| bar",C),atm:R("101325 | Pa",C),Torr:R("1/760 | atm",C),mmHg:R("| Torr",C),ha:R("10^4 | m m",C),b:R("10^−28 | m m",j),barn:R("| b",j),acre:R("4046.87 | m m",C),skilodge:R("10^-31 | m m",C),outhouse:R("10^-34 | m m",C),shed:R("10^-52 | m m",C),L:R("1/1000 | m m m",j),gal:R("3785/1000 | L",j),cup:R("1/16 | gal",C),qt:R("1/4 | gal",C),quart:R("| qt",C),p:R("1/8 | gal",C),pt:R("| p",C),pint:R("| p",C),"fl oz":R("1/8 | cup",C),"fl. oz.":R("1/8 | cup",C),tbsp:R("1/16 | cup",C),tsp:R("1/3 | tbsp",C),rev:R("2 pi | rad",C),deg:R("180 pi | rad",C),"°":R("| deg",C),arcminute:R("1/60 | deg",C),arcsec:R("1/3600 | deg",C),Hu:R("1000 | dB",j),dozen:R("12 |",C),mol:R("6.0221412927 x 10^23 |",j),"%":R("1/100 |",C),percent:R("| %",C),ppm:R("1/1000000 |",C),V:R("1000 | g m m / s s C",j),C:R("| A s",j),ampere:R("| A",C),"Ω":R("| V / A",j),ohm:R("| Ω",C),F:R("| C / V",j),H:R("| ohm s",j),T:R("1000 | g / C s",j),Wb:R("1000 | g m m / C s",j),lm:R("pi x 10^4 | cd / m m",C),lx:R("| lm / m m",C),nit:R("| cd / m m",C),sb:R("10^4 | cd / m m",C),stilb:R("1 | sb",C),apostilb:R("1 / pi x 10^(-4) | sb",C),blondel:R("| apostilb",C),asb:R("| apostilb",C),la:R("| lm",C),Lb:R("| lm",C),sk:R("10^-7 | lm",C),skot:R("| sk",C),bril:R("10^-11 | lm",C),Hz:R("| / s",j)};t.Add=r,t.Mul=i,t.Pow=o,t.Log=u,t.Eq=f,t.Trig=a,t.Abs=s,t.Func=p,t.Var=h,t.Const=d,t.Unit=x,t.Rational=g,t.Int=y,t.Float=m,t.Zero=v.Zero,t.One=v.One;}(f),function(t){t.compare=function(t,e,n){var r={form:!1,simplify:!1};n=void 0!==n?c.default.extend(r,n):r;var i=t.sameVars(e);if(!i.equal){var o=null;return i.equalIgnoringCase&&(o="Some of your variables are in the wrong case (upper vs. lower)."),{equal:!1,message:o}}return t.compare(e)?n.form&&!t.sameForm(e)?{equal:!1,message:"Your answer is not in the correct form."}:n.simplify&&!t.isSimplified()?{equal:!1,message:"Your answer is not fully expanded and simplified."}:{equal:!0,message:null}:{equal:!1,message:null}};}(f),e.default=f;},function(t,e,n){t.exports={default:n(292),__esModule:!0};},function(t,e,n){t.exports={default:n(293),__esModule:!0};},function(t,e,n){t.exports={default:n(297),__esModule:!0};},function(t,e){t.exports=function(t){if("function"!=typeof t){ throw TypeError(t+" is not a function!"); }return t};},function(t,e){t.exports=function(t,e,n,r){if(!(t instanceof e)||void 0!==r&&r in t){ throw TypeError(n+": incorrect invocation!"); }return t};},function(t,e,n){var r=n(77),i=n(9)("toStringTag"),o="Arguments"==r(function(){return arguments}()),u=function(t,e){try{return t[e]}catch(t){}};t.exports=function(t){var e,n,a;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=u(e=Object(t),i))?n:o?r(e):"Object"==(a=r(e))&&"function"==typeof e.callee?"Arguments":a};},function(t,e,n){var r=n(23),i=n(17).document,o=r(i)&&r(i.createElement);t.exports=function(t){return o?i.createElement(t):{}};},function(t,e,n){t.exports=!n(16)&&!n(31)(function(){return 7!=Object.defineProperty(n(122)("div"),"a",{get:function(){return 7}}).a});},function(t,e,n){var r=n(77);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)};},function(t,e,n){var r=n(38),i=n(9)("iterator"),o=Array.prototype;t.exports=function(t){return void 0!==t&&(r.Array===t||o[i]===t)};},function(t,e,n){var r=n(77);t.exports=Array.isArray||function(t){return"Array"==r(t)};},function(t,e,n){var r=n(25);t.exports=function(t,e,n,i){try{return i?e(r(n)[0],n[1]):e(n)}catch(e){var o=t.return;throw void 0!==o&&r(o.call(t)),e}};},function(t,e){t.exports=function(t,e){return{value:e,done:!!t}};},function(t,e,n){var r=n(84),i=n(39),o=n(32),u=n(88),a=n(30),s=n(123),c=Object.getOwnPropertyDescriptor;e.f=n(16)?c:function(t,e){if(t=o(t),e=u(e,!0),s){ try{return c(t,e)}catch(t){} }if(a(t,e)){ return i(!r.f.call(t,e),t[e]) }};},function(t,e,n){var r=n(133),i=n(79).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return r(t,i)};},function(t,e){e.f=Object.getOwnPropertySymbols;},function(t,e,n){var r=n(30),i=n(53),o=n(85)("IE_PROTO"),u=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=i(t),r(t,o)?t[o]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null};},function(t,e,n){var r=n(30),i=n(32),o=n(302)(!1),u=n(85)("IE_PROTO");t.exports=function(t,e){var n,a=i(t),s=0,c=[];for(n in a){ n!=u&&r(a,n)&&c.push(n); }for(;e.length>s;){ r(a,n=e[s++])&&(~o(c,n)||c.push(n)); }return c};},function(t,e,n){var r=n(26);t.exports=function(t,e,n){for(var i in e){ n&&t[i]?t[i]=e[i]:r(t,i,e[i]); }return t};},function(t,e,n){t.exports=n(26);},function(t,e,n){var r=n(23);t.exports=function(t,e){if(!r(t)||t._t!==e){ throw TypeError("Incompatible receiver, "+e+" required!"); }return t};},function(t,e){},function(t,e,n){var r=n(14),i=n(2),o=i(function(t,e,n){if(e>=n.length||e<-n.length){ return n; }var i=e<0?n.length:0,o=i+e,u=r(n);return u[o]=t(n[o]),u});t.exports=o;},function(t,e,n){var r=n(0),i=r(function(t,e){return t&&e});t.exports=i;},function(t,e,n){var r=n(0),i=n(3),o=n(163),u=r(i(["any"],o,function(t,e){for(var n=0;n<e.length;){if(t(e[n])){ return!0; }n+=1;}return!1}));t.exports=u;},function(t,e,n){var r=n(0),i=r(function(t,e){return t.apply(this,e)});t.exports=i;},function(t,e,n){var r=n(2),i=n(7),o=n(27),u=n(103),a=n(57),s=n(167),c=r(function t(e,n,r){if(0===e.length){ return n; }var c=e[0];if(e.length>1){var f=!s(r)&&i(c,r)?r[c]:u(e[1])?[]:{};n=t(Array.prototype.slice.call(e,1),n,f);}if(u(c)&&o(r)){var l=[].concat(r);return l[c]=n,l}return a(c,n,r)});t.exports=c;},function(t,e,n){var r=n(18),i=n(0),o=i(function(t,e){return r(t.length,function(){return t.apply(e,arguments)})});t.exports=o;},function(t,e,n){function r(){if(0===arguments.length){ throw new Error("composeK requires at least one argument"); }var t=Array.prototype.slice.call(arguments),e=t.pop();return o(o.apply(this,u(i,t)),e)}var i=n(94),o=n(95),u=n(8);t.exports=r;},function(t,e,n){var r=n(0),i=n(97),o=n(68),u=r(function(t,e){if(t>10){ throw new Error("Constructor with greater than ten arguments"); }return 0===t?function(){return new e}:i(o(t,function(t,n,r,i,o,u,a,s,c,f){switch(arguments.length){case 1:return new e(t);case 2:return new e(t,n);case 3:return new e(t,n,r);case 4:return new e(t,n,r,i);case 5:return new e(t,n,r,i,o);case 6:return new e(t,n,r,i,o,u);case 7:return new e(t,n,r,i,o,u,a);case 8:return new e(t,n,r,i,o,u,a,s);case 9:return new e(t,n,r,i,o,u,a,s,c);case 10:return new e(t,n,r,i,o,u,a,s,c,f)}}))});t.exports=u;},function(t,e,n){var r=n(0),i=n(64),o=n(5),u=n(35),a=n(44),s=n(20),c=r(function(t,e){return o(s(u,0,a("length",e)),function(){var n=arguments,r=this;return t.apply(r,i(function(t){return t.apply(r,n)},e))})});t.exports=c;},function(t,e,n){var r=n(0),i=r(function(t,e){return null==e||e!==e?t:e});t.exports=i;},function(t,e,n){var r=n(34),i=n(0),o=i(function(t,e){for(var n=[],i=0,o=t.length;i<o;){ r(t[i],e)||r(t[i],n)||(n[n.length]=t[i]),i+=1; }return n});t.exports=o;},function(t,e,n){var r=n(59),i=n(2),o=i(function(t,e,n){for(var i=[],o=0,u=e.length;o<u;){ r(t,e[o],n)||r(t,e[o],i)||i.push(e[o]),o+=1; }return i});t.exports=o;},function(t,e,n){var r=n(0),i=r(function(t,e){var n={};for(var r in e){ n[r]=e[r]; }return delete n[t],n});t.exports=i;},function(t,e,n){var r=n(0),i=n(3),o=n(419),u=n(15),a=r(i(["drop"],o,function(t,e){return u(Math.max(0,t),1/0,e)}));t.exports=a;},function(t,e,n){var r=n(0),i=n(3),o=n(164),u=n(169),a=r(i([],o,function(t,e){var n=[],r=1,i=e.length;if(0!==i){ for(n[0]=e[0];r<i;){ t(u(n),e[r])||(n[n.length]=e[r]),r+=1; } }return n}));t.exports=a;},function(t,e,n){var r=n(1),i=n(160),o=n(27),u=n(104),a=n(41),s=r(function(t){return null!=t&&"function"==typeof t["fantasy-land/empty"]?t["fantasy-land/empty"]():null!=t&&null!=t.constructor&&"function"==typeof t.constructor["fantasy-land/empty"]?t.constructor["fantasy-land/empty"]():null!=t&&"function"==typeof t.empty?t.empty():null!=t&&null!=t.constructor&&"function"==typeof t.constructor.empty?t.constructor.empty():o(t)?[]:a(t)?"":u(t)?{}:i(t)?function(){return arguments}():void 0});t.exports=s;},function(t,e,n){var r=n(0),i=r(function(t,e){return t===e?0!==t||1/t==1/e:t!==t&&e!==e});t.exports=i;},function(t,e,n){function r(t,e,n,u){var a=function(i){for(var o=e.length,a=0;a<o;){if(t===e[a]){ return n[a]; }a+=1;}e[a+1]=t,n[a+1]=i;for(var s in t){ i[s]=u?r(t[s],e,n,!0):t[s]; }return i};switch(o(t)){case"Object":return a({});case"Array":return a([]);case"Date":return new Date(t.valueOf());case"RegExp":return i(t);default:return t}}var i=n(156),o=n(110);t.exports=r;},function(t,e){function n(t){return new RegExp(t.source,(t.global?"g":"")+(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.sticky?"y":"")+(t.unicode?"u":""))}t.exports=n;},function(t,e){function n(t){return function(){return!t.apply(this,arguments)}}t.exports=n;},function(t,e,n){function r(t){return o(function(e,n){return i(Math.max(0,e.length-n.length),function(){return e.apply(this,t(n,arguments))})})}var i=n(18),o=n(0);t.exports=r;},function(t,e,n){function r(t,e,n){var r,o;if("function"==typeof t.indexOf){ switch(typeof e){case"number":if(0===e){for(r=1/e;n<t.length;){if(0===(o=t[n])&&1/o===r){ return n; }n+=1;}return-1}if(e!==e){for(;n<t.length;){if("number"==typeof(o=t[n])&&o!==o){ return n; }n+=1;}return-1}return t.indexOf(e,n);case"string":case"boolean":case"function":case"undefined":return t.indexOf(e,n);case"object":if(null===e){ return t.indexOf(e,n) }} }for(;n<t.length;){if(i(t[n],e)){ return n; }n+=1;}return-1}var i=n(10);t.exports=r;},function(t,e,n){var r=n(7),i=Object.prototype.toString,o=function(){return"[object Arguments]"===i.call(arguments)?function(t){return"[object Arguments]"===i.call(t)}:function(t){return r("callee",t)}};t.exports=o;},function(t,e){function n(t){return"[object Number]"===Object.prototype.toString.call(t)}t.exports=n;},function(t,e,n){function r(t){return function e(n){for(var r,o,u,a=[],s=0,c=n.length;s<c;){if(i(n[s])){ for(r=t?e(n[s]):n[s],u=0,o=r.length;u<o;){ a[a.length]=r[u],u+=1; } }else { a[a.length]=n[s]; }s+=1;}return a}}var i=n(61);t.exports=r;},function(t,e,n){var r=n(0),i=n(28),o=n(4),u=function(){function t(t,e){this.xf=e,this.f=t,this.any=!1;}return t.prototype["@@transducer/init"]=o.init,t.prototype["@@transducer/result"]=function(t){return this.any||(t=this.xf["@@transducer/step"](t,!1)),this.xf["@@transducer/result"](t)},t.prototype["@@transducer/step"]=function(t,e){return this.f(e)&&(this.any=!0,t=i(this.xf["@@transducer/step"](t,!0))),t},t}(),a=r(function(t,e){return new u(t,e)});t.exports=a;},function(t,e,n){var r=n(0),i=n(4),o=function(){function t(t,e){this.xf=e,this.pred=t,this.lastValue=void 0,this.seenFirstValue=!1;}return t.prototype["@@transducer/init"]=i.init,t.prototype["@@transducer/result"]=i.result,t.prototype["@@transducer/step"]=function(t,e){var n=!1;return this.seenFirstValue?this.pred(this.lastValue,e)&&(n=!0):this.seenFirstValue=!0,this.lastValue=e,n?t:this.xf["@@transducer/step"](t,e)},t}(),u=r(function(t,e){return new o(t,e)});t.exports=u;},function(t,e){function n(t){return new r(t)}var r=function(){function t(t){this.f=t;}return t.prototype["@@transducer/init"]=function(){throw new Error("init not implemented on XWrap")},t.prototype["@@transducer/result"]=function(t){return t},t.prototype["@@transducer/step"]=function(t,e){return this.f(t,e)},t}();t.exports=n;},function(t,e,n){var r=n(0),i=r(function(t,e){return null!=e&&e.constructor===t||e instanceof t});t.exports=i;},function(t,e,n){var r=n(1),i=r(function(t){return null==t});t.exports=i;},function(t,e,n){var r=n(1),i=n(146),o=r(function(t){return i(function(){return Array.prototype.slice.call(arguments,0)},t)});t.exports=o;},function(t,e,n){var r=n(43),i=r(-1);t.exports=i;},function(t,e,n){var r=n(1),i=n(161),o=r(function(t){return null!=t&&i(t.length)?t.length:NaN});t.exports=o;},function(t,e,n){var r=n(0),i=n(11),o=n(93),u=n(5),a=n(8),s=r(function(t,e){var n=u(t,e);return u(t,function(){return i(o,a(n,arguments[0]),Array.prototype.slice.call(arguments,1))})});t.exports=s;},function(t,e,n){var r=n(1),i=n(186),o=r(function(t){return i(t)/t.length});t.exports=o;},function(t,e,n){var r=n(18),i=n(0),o=n(7),u=i(function(t,e){var n={};return r(e.length,function(){var r=t.apply(this,arguments);return o(r,n)||(n[r]=e.apply(this,arguments)),n[r]})});t.exports=u;},function(t,e,n){var r=n(0),i=r(function(t,e){return t*e});t.exports=i;},function(t,e,n){var r=n(1),i=r(function(t){return!t});t.exports=i;},function(t,e,n){var r=n(0),i=r(function(t,e){var n={};return n[t]=e,n});t.exports=i;},function(t,e,n){var r=n(0),i=r(function(t,e){return t||e});t.exports=i;},function(t,e,n){var r=n(2),i=function(t){return{value:t,map:function(e){return i(e(t))}}},o=r(function(t,e,n){return t(function(t){return i(e(t))})(n).value});t.exports=o;},function(t,e,n){var r=n(0),i=r(function(t,e){for(var n={},r=0,i=t.length;r<i;){var o=t[r];n[o]=e[o],r+=1;}return n});t.exports=i;},function(t,e,n){function r(){if(0===arguments.length){ throw new Error("pipe requires at least one argument"); }return i(arguments[0].length,u(o,arguments[0],a(arguments)))}var i=n(18),o=n(410),u=n(20),a=n(108);t.exports=r;},function(t,e,n){function r(){if(0===arguments.length){ throw new Error("pipeP requires at least one argument"); }return i(arguments[0].length,u(o,arguments[0],a(arguments)))}var i=n(18),o=n(411),u=n(20),a=n(108);t.exports=r;},function(t,e,n){var r=n(14),i=n(0),o=i(function(t,e){return r([t],e)});t.exports=o;},function(t,e,n){var r=n(2),i=r(function(t,e,n){for(var r=n.length-1;r>=0;){ e=t(n[r],e),r-=1; }return e});t.exports=i;},function(t,e,n){var r=n(2),i=r(function(t,e,n){var r=Array.prototype.slice.call(n,0);return r.splice(t,e),r});t.exports=i;},function(t,e,n){var r=n(0),i=n(93),o=n(8),u=n(182),a=n(183),s=r(function(t,e){return"function"==typeof e.sequence?e.sequence(t):a(function(t,e){return i(o(u,t),e)},t([]),e)});t.exports=s;},function(t,e,n){var r=n(56),i=n(20),o=i(r,0);t.exports=o;},function(t,e,n){var r=n(0),i=n(151),o=r(function(t,e){return i(t>=0?e.length-t:0,e)});t.exports=o;},function(t,e,n){var r=n(0),i=r(function(t,e){var n,r=Number(e),i=0;if(r<0||isNaN(r)){ throw new RangeError("n must be a non-negative number"); }for(n=new Array(r);i<r;){ n[i]=t(i),i+=1; }return n});t.exports=i;},function(t,e,n){var r=n(398),i=n(0),o=i(function(t,e){for(var n,i,o=new r,u=[],a=0;a<e.length;){ i=e[a],n=t(i),o.add(n)&&u.push(i),a+=1; }return u});t.exports=o;},function(t,e,n){var r=n(59),i=n(0),o=i(function(t,e){for(var n,i=0,o=e.length,u=[];i<o;){ n=e[i],r(t,n,u)||(u[u.length]=n),i+=1; }return u});t.exports=o;},function(t,e,n){var r=n(0),i=n(5),o=r(function(t,e){return i(e.length,function(){
var arguments$1 = arguments;
var this$1 = this;
for(var n=[],r=0;r<e.length;){ n.push(e[r].call(this$1,arguments$1[r])),r+=1; }return t.apply(this,n.concat(Array.prototype.slice.call(arguments,e.length)))})});t.exports=o;},function(t,e,n){var r=n(1),i=n(19),o=r(function(t){for(var e=i(t),n=e.length,r=[],o=0;o<n;){ r[o]=t[e[o]],o+=1; }return r});t.exports=o;},function(t,e,n){var r=n(0),i=n(7),o=r(function(t,e){for(var n in t){ if(i(n,t)&&!t[n](e[n])){ return!1; } }return!0});t.exports=o;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(72),i=n(46),o=function(t){var e=t;return"string"==typeof e&&(e=JSON.parse(e)),Array.isArray(e)?(0,i.newJudgeAnswerComposite)(e):(0,r.chooseJudgeVersion)(e)};e.default=o;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={grades:[{id:0,name:"child"},{id:1,name:"primary"},{id:2,name:"junior"},{id:3,name:"high"}],subjects:[{id:1,name:"verbal"},{id:2,name:"math"},{id:3,name:"english"},{id:4,name:"physics"},{id:5,name:"chemistry"},{id:6,name:"biology"},{id:8,name:"history"},{id:9,name:"geography"},{id:10,name:"politics"}],types:[{id:1,name:"keguanshuru",parentId:0},{id:2,name:"keguanguilv",parentId:0},{id:3,name:"zhuguanshuru",parentId:0},{id:4,name:"danxuan",parentId:0},{id:5,name:"duoxuan",parentId:0},{id:10,name:"guilv",parentId:0},{id:10001,name:"moxie",parentId:1},{id:10002,name:"pinyintianxie",parentId:1},{id:10003,name:"zicitianxie",parentId:1},{id:10004,name:"wenxuechangshi",parentId:1},{id:10005,name:"dancitianxie",parentId:1},{id:10006,name:"dancipinxie",parentId:1},{id:10007,name:"shouzimupinxie",parentId:1},{id:10008,name:"duanyutianxie",parentId:1},{id:10009,name:"wanchengjuzi",parentId:1},{id:10010,name:"jiandanshuzhi",parentId:1},{id:10011,name:"zhuanyeciyu",parentId:1},{id:10012,name:"shuzhi",parentId:1},{id:10013,name:"daidanweishuzhi",parentId:1},{id:10014,name:"daishushi",parentId:1},{id:10015,name:"daidanweidaishushi",parentId:1},{id:10016,name:"yinshifenjiejieguo",parentId:1},{id:10017,name:"huaxueshi",parentId:1},{id:10018,name:"huaxuefangchengshi",parentId:1},{id:10019,name:"zuobiao",parentId:1},{id:10020,name:"jiejifanwei",parentId:1},{id:10021,name:"qujian",parentId:1},{id:10022,name:"fangchengdejie",parentId:1},{id:10023,name:"fangcheng",parentId:1},{id:10024,name:"fangchengzudejie",parentId:1},{id:10025,name:"fangchengzu",parentId:1},{id:10026,name:"putonghanshu",parentId:1},{id:10027,name:"fenduanhanshu",parentId:1},{id:10028,name:"jihe",parentId:1},{id:10029,name:"kexuejishufa",parentId:1},{id:10030,name:"bizhi",parentId:1},{id:10031,name:"qitakeguandaan",parentId:1},{id:10032,name:"dancipinxiewuganrao",parentId:1},{id:20001,name:"dangeshuzhi",parentId:2},{id:20002,name:"pingmianzuobiao",parentId:2},{id:20003,name:"yicihanshu",parentId:2},{id:20004,name:"ercihanshu",parentId:2},{id:20005,name:"fanbilihanshu",parentId:2},{id:20006,name:"yiyuanyicifangcheng",parentId:2},{id:20007,name:"yiyuanercifangcheng",parentId:2},{id:100001,name:"dengyu",parentId:10},{id:100002,name:"dayu",parentId:10},{id:100003,name:"xiaoyu",parentId:10},{id:100004,name:"dayudengyu",parentId:10},{id:100005,name:"xiaoyudengyu",parentId:10},{id:100006,name:"budengyu",parentId:10},{id:100007,name:"shuyu",parentId:10},{id:100008,name:"beizhengchu",parentId:10},{id:20001001,name:"canshuM",parentId:20001},{id:20002001,name:"canshuX",parentId:20002},{id:20002002,name:"canshuY",parentId:20002},{id:20003001,name:"canshuK",parentId:20003},{id:20003002,name:"canshuB",parentId:20003},{id:20004001,name:"canshuA",parentId:20004},{id:20004002,name:"canshuB2",parentId:20004},{id:20004003,name:"canshuC",parentId:20004},{id:20004004,name:"panbieshi",parentId:20004},{id:20004005,name:"duichenzhou",parentId:20004},{id:20005001,name:"canshuK2",parentId:20005},{id:20006001,name:"canshuA2",parentId:20006},{id:20006002,name:"canshuB3",parentId:20006},{id:20006003,name:"fangchengjieX",parentId:20006},{id:20007001,name:"canshuA3",parentId:20007},{id:20007002,name:"canshuB4",parentId:20007},{id:20007003,name:"canshuC3",parentId:20007},{id:20007004,name:"panbieshi2",parentId:20007},{id:100007001,name:"ziranshuji",parentId:100007},{id:100007002,name:"zhengzhengshuji",parentId:100007},{id:100007003,name:"zhengshuji",parentId:100007},{id:100007004,name:"youlishuji",parentId:100007},{id:100007005,name:"shishuji",parentId:100007}]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0}),e.shishuji=e.youlishuji=e.zhengshuji=e.zhengzhengshuji=e.ziranshuji=e.panbieshi2=e.canshuC3=e.canshuB4=e.canshuA3=e.fangchengjieX=e.canshuB3=e.canshuA2=e.canshuK2=e.duichenzhou=e.panbieshi=e.canshuC=e.canshuB2=e.canshuA=e.canshuB=e.canshuK=e.canshuY=e.canshuX=e.canshuM=e.beizhengchu=e.shuyu=e.budengyu=e.xiaoyudengyu=e.dayudengyu=e.xiaoyu=e.dayu=e.dengyu=e.yiyuanercifangcheng=e.yiyuanyicifangcheng=e.fanbilihanshu=e.ercihanshu=e.yicihanshu=e.pingmianzuobiao=e.dangeshuzhi=e.dancipinxiewuganrao=e.qitakeguandaan=e.bizhi=e.kexuejishufa=e.jihe=e.fenduanhanshu=e.putonghanshu=e.fangchengzu=e.fangchengzudejie=e.fangcheng=e.fangchengdejie=e.qujian=e.jiejifanwei=e.zuobiao=e.huaxuefangchengshi=e.huaxueshi=e.yinshifenjiejieguo=e.daidanweidaishushi=e.daishushi=e.daidanweishuzhi=e.shuzhi=e.zhuanyeciyu=e.jiandanshuzhi=e.wanchengjuzi=e.duanyutianxie=e.shouzimupinxie=e.dancipinxie=e.dancitianxie=e.wenxuechangshi=e.zicitianxie=e.pinyintianxie=e.moxie=e.guilv=e.duoxuan=e.danxuan=e.zhuguanshuru=e.keguanguilv=e.keguanshuru=void 0;var i=n(243),o=r(i),u=n(242),a=r(u),s=n(269),c=r(s),f=n(221),l=r(f),p=n(227),h=r(p),d=n(236),v=r(d),g=n(245),y=r(g),m=n(249),x=r(m),w=n(270),b=r(w),_=n(258),S=r(_),A=n(219),M=r(A),E=n(217),O=r(E),k=n(254),j=r(k),C=n(225),R=r(C),I=n(257),P=r(I),T=n(239),q=r(T),L=n(268),z=r(L),N=n(256),D=r(N),F=n(215),U=r(F),B=n(216),G=r(B),H=n(214),V=r(H),Z=n(262),$=r(Z),K=n(238),W=r(K),J=n(237),Q=r(J),X=n(272),Y=r(X),tt=n(240),et=r(tt),nt=n(252),rt=r(nt),it=n(231),ot=r(it),ut=n(230),at=r(ut),st=n(234),ct=r(st),ft=n(233),lt=r(ft),pt=n(250),ht=r(pt),dt=n(235),vt=r(dt),gt=n(241),yt=r(gt),mt=n(244),xt=r(mt),wt=n(197),bt=r(wt),_t=n(251),St=r(_t),At=n(218),Mt=r(At),Et=n(220),Ot=r(Et),kt=n(248),jt=r(kt),Ct=n(261),Rt=r(Ct),It=n(228),Pt=r(It),Tt=n(229),qt=r(Tt),Lt=n(264),zt=r(Lt),Nt=n(263),Dt=r(Nt),Ft=n(224),Ut=r(Ft),Bt=n(222),Gt=r(Bt),Ht=n(259),Vt=r(Ht),Zt=n(223),$t=r(Zt),Kt=n(260),Wt=r(Kt),Jt=n(198),Qt=r(Jt),Xt=n(255),Yt=r(Xt),te=n(196),ee=r(te),ne=n(210),re=r(ne),ie=n(211),oe=r(ie),ue=n(212),ae=r(ue),se=n(208),ce=r(se),fe=n(202),le=r(fe),pe=n(199),he=r(pe),de=n(203),ve=r(de),ge=n(206),ye=r(ge),me=n(246),xe=r(me),we=n(226),be=r(we),_e=n(209),Se=r(_e),Ae=n(200),Me=r(Ae),Ee=n(204),Oe=r(Ee),ke=n(232),je=r(ke),Ce=n(201),Re=r(Ce),Ie=n(205),Pe=r(Ie),Te=n(207),qe=r(Te),Le=n(247),ze=r(Le),Ne=n(271),De=r(Ne),Fe=n(267),Ue=r(Fe),Be=n(266),Ge=r(Be),He=n(265),Ve=r(He),Ze=n(253),$e=r(Ze);e.keguanshuru=o.default,e.keguanguilv=a.default,e.zhuguanshuru=c.default,e.danxuan=l.default,e.duoxuan=h.default,e.guilv=v.default,e.moxie=y.default,e.pinyintianxie=x.default,e.zicitianxie=b.default,e.wenxuechangshi=S.default,e.dancitianxie=M.default,e.dancipinxie=O.default,e.shouzimupinxie=j.default,e.duanyutianxie=R.default,e.wanchengjuzi=P.default,e.jiandanshuzhi=q.default,e.zhuanyeciyu=z.default,e.shuzhi=D.default,e.daidanweishuzhi=U.default,e.daishushi=G.default,e.daidanweidaishushi=V.default,e.yinshifenjiejieguo=$.default,e.huaxueshi=W.default,e.huaxuefangchengshi=Q.default,e.zuobiao=Y.default,e.jiejifanwei=et.default,e.qujian=rt.default,e.fangchengdejie=ot.default,e.fangcheng=at.default,e.fangchengzudejie=ct.default,e.fangchengzu=lt.default,e.putonghanshu=ht.default,e.fenduanhanshu=vt.default,e.jihe=yt.default,e.kexuejishufa=xt.default,e.bizhi=bt.default,e.qitakeguandaan=St.default,e.dancipinxiewuganrao=Mt.default,e.dangeshuzhi=Ot.default,e.pingmianzuobiao=jt.default,e.yicihanshu=Rt.default,e.ercihanshu=Pt.default,e.fanbilihanshu=qt.default,e.yiyuanyicifangcheng=zt.default,e.yiyuanercifangcheng=Dt.default,e.dengyu=Ut.default,e.dayu=Gt.default,e.xiaoyu=Vt.default,e.dayudengyu=$t.default,e.xiaoyudengyu=Wt.default,e.budengyu=Qt.default,e.shuyu=Yt.default,e.beizhengchu=ee.default,e.canshuM=re.default,e.canshuX=oe.default,e.canshuY=ae.default,e.canshuK=ce.default,e.canshuB=le.default,e.canshuA=he.default,e.canshuB2=ve.default,e.canshuC=ye.default,e.panbieshi=xe.default,e.duichenzhou=be.default,e.canshuK2=Se.default,e.canshuA2=Me.default,e.canshuB3=Oe.default,e.fangchengjieX=je.default,e.canshuA3=Re.default,e.canshuB4=Pe.default,e.canshuC3=qe.default,e.panbieshi2=ze.default,e.ziranshuji=De.default,e.zhengzhengshuji=Ue.default,e.zhengshuji=Ge.default,e.youlishuji=Ve.default,e.shishuji=$e.default;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["convert","unitsStandard"],["specialConvert","daishushiUnitsToUpperCase"],["convert","unitsConvert"],["convert","replaceBlank"],["compute","compositeCompute"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["convert","unitsStandard"],["specialConvert","daishushiUnitsToUpperCase"],["convert","unitsConvert"],["convert","replaceBlank"],["compute","compositeCompute"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["specialConvert","daishushiUnitsToUpperCase"],["convert","splitDataExchange"],["convert","replaceBlank"],["convert","replaceChinaCode"],["compute","compositeCompute"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["specialConvert","zhuanhuanpie"],["convert","replaceBlank"],["convert","replaceChinaCode"],["convert","logogramReplace",["englishRegex","englishReplace"]],["convert","replaceBlank"],["convert","trim"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["specialConvert","zhuanhuanpie"],["convert","replaceBlank"],["convert","replaceChinaCode"],["convert","logogramReplace",["englishRegex","englishReplace"]],["convert","replaceBlank"],["convert","trim"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["specialConvert","zhuanhuanpie"],["convert","trim"],["convert","toLowerCase"],["convert","replaceBlank"],["convert","replaceChinaCode"],["convert","logogramReplace",["englishRegex","englishReplace"]],["convert","replaceBlank"],["convert","trim"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["specialConvert","zhuanhuanpie"],["convert","toLowerCase"],["convert","trim"],["convert","replaceBlank"],["convert","replaceChinaCode"],["convert","logogramReplace",["englishRegex","englishReplace"]],["convert","replaceBlank"],["convert","trim"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","trim"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["convert","splitDataExchange"],["convert","trim"],["convert","replaceBlank"],["convert","replaceChinaCode"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","trim"],["convert","replaceBlank"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","trim"],["convert","replaceBlank"],["convert","toDBC"],["convert","toLowerCase"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["specialConvert","zhuanhuanpie"],["convert","trim"],["convert","replaceBlank"],["convert","replaceChinaCode"],["convert","logogramReplace",["englishRegex","englishReplace"]],["convert","replaceBlank"],["specialConvert","daishushiUnitsToUpperCase"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["convert","splitDataExchange"],["convert","replaceBlank"],["convert","unitsConvert"],["convert","replaceChinaCode"],["compute","compositeCompute"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["specialConvert","zhuanhuanpie"],["convert","trim"],["convert","replaceBlank"],["convert","replaceChinaCode"],["convert","toLowerCase"],["convert","logogramReplace",["englishRegex","englishReplace"]],["convert","replaceBlank"],["convert","trim"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["convert","splitDataExchange"],["convert","trim"],["convert","replaceBlank"],["convert","replaceChinaCode"],["specialConvert","daishushiUnitsToUpperCase"],["compute","compositeCompute"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["specialConvert","zhuanhuanpie"],["convert","trim"],["convert","replaceBlank"],["convert","replaceChinaCode"],["convert","toLowerCase"],["convert","logogramReplace",["englishRegex","englishReplace"]],["convert","replaceBlank"],["convert","trim"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","trim"],["convert","replaceBlank"],["convert","toDBC"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["convert","replaceBlank"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","replaceBlank"],["convert","toDBC"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","trim"],["convert","replaceBlank"],["convert","toDBC"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={func:[["convert","toDBC"],["convert","trim"],["convert","toLowerCase"],["convert","codeStandard"],["convert","greekLetterStandard"],["convert","specificSymbolStandard"],["convert","trim"],["convert","replaceBlank"],["convert","replaceChinaCode"],["specialConvert","daishushiUnitsToUpperCase"],["specialConvert","zuobiao"],["specialConvert","qudakuohao"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={englishReplace:[[/i've/g,"i have"],[/they've/g,"they have"],[/we've'/g,"we have"],[/she's/g,"she is/she has"],[/he's/g,"he is/he has"],[/it's/g,"it is/it has"],[/what's/g,"what is/what has"],[/which's/g,"which is/which has"],[/who's/g,"who is/who has"],[/you'd/g,"you had"],[/i'd/g,"i would/i had"],[/i'll/g,"i will"],[/you'll/g,"you will"],[/she'll/g,"she will"],[/he'll/g,"he will"],[/we'll/g,"we will"],[/they'll/g,"they will"],[/don't/g,"do not"],[/doesn't/g,"does not"],[/didn't/g,"did not"],[/hasn't/g,"has not"],[/hadn't/g,"had not"],[/i'm/g,"i am"],[/you're/g,"you are"],[/can't/g,"can not"],[/won't/g,"will not"],[/shouldn't/g,"should not"],[/couldn't/g,"could not"],[/wouldn't/g,"would not"],[/mightn't/g,"might not"],[/oughtn't to/g,"ought not to"],[/needn't/g,"need not"],[/mustn't/g,"must not"],[/that's/g,"that is"]]};e.default=r;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={shouzimupinxie:"shouzimupinxie",duoxuan:"duoxuan"};e.default=r;},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(116),o=r(i),u=n(24),a=r(u),s=n(21),c=r(s),f=n(22),l=r(f),p=n(47),h=r(p),d=new h.default,v=function(){function t(){(0,c.default)(this,t);}return(0,l.default)(t,[{key:"sourceDataDispense",value:function(t){
var this$1 = this;
var e=[],n=t;if(n.blankAnswer&&d.isArray(n.blankAnswer.answer)){ for(var r=n.blankAnswer.answer,i=0,o=r.length;i<o;i+=1){var u=r[i],a=parseInt(u.typeId,10),s=null;switch(a){case 1:case 3:s=this$1.objectives(u,d.isArray(n.rigAnswer)?n.rigAnswer[i]:[]);break;case 4:case 5:s=this$1.singleInput(u,d.isArray(n.rigAnswer)?n.rigAnswer[i]:[]);}e.push({id:u.id||0,gradeGroupId:n.gradeGroupId,queId:n.queId,rigAnswer:s,stuAnswer:[n.stuAnswer[i]||""],type:parseInt(n.type,10),typeId:u.typeId&&parseInt(u.typeId,10),answerTypeId:u.childTypeId&&parseInt(u.childTypeId,10)||u.typeId&&parseInt(u.typeId,10),subjectId:parseInt(n.subjectId,10),isExactMatch:u.isExactMatch});} }return n.blankAnswer&&n.blankAnswer.group&&d.isArray(n.blankAnswer.group)&&n.blankAnswer.group.length>0?(n.blankAnswer.group=n.blankAnswer.group.filter(function(t){return t.length>0}),e=this.groupDataMerge(n.blankAnswer.group,e)):[e]}},{key:"objectives",value:function(t,e){var n=[];if(t&&d.isArray(t.content)){var r=!0,i=!1,o=void 0;try{for(var u,s=(0,a.default)(t.content);!(r=(u=s.next()).done);r=!0){var c=u.value;/<(svg|span|div)/.test(c.content)||n.push(c.content);}}catch(t){i=!0,o=t;}finally{try{!r&&s.return&&s.return();}finally{if(i){ throw o }}}}if(e&&d.isArray(e)){var f=!0,l=!1,p=void 0;try{for(var h,v=(0,a.default)(e);!(f=(h=v.next()).done);f=!0){var g=h.value;/<(svg|span|div)/.test(g)||n.push(g);}}catch(t){l=!0,p=t;}finally{try{!f&&v.return&&v.return();}finally{if(l){ throw p }}}}return n.filter(function(t){return!(!t||""===t)})}},{key:"singleInput",value:function(t){var e=[];if(t&&d.isArray(t.content)){var n=!0,r=!1,i=void 0;try{for(var o,u=(0,a.default)(t.content);!(n=(o=u.next()).done);n=!0){var s=o.value;s.isSelected&&(/<(svg|span|div)/.test(s.content)||e.push(s.content));}}catch(t){r=!0,i=t;}finally{try{!n&&u.return&&u.return();}finally{if(r){ throw i }}}}return[e.join("、")]}},{key:"groupDataMerge",value:function(t,e){var n=JSON.parse((0,o.default)(e));if(d.isArray(e)&&e.length>0){var r=!0,i=!1,u=void 0;try{for(var s,c=(0,a.default)(e);!(r=(s=c.next()).done);r=!0){var f=s.value;n.splice(f.id,1,f);}}catch(t){i=!0,u=t;}finally{try{!r&&c.return&&c.return();}finally{if(i){ throw u }}}}var l=[];if(t&&d.isArray(t)){var p=!0,h=!1,v=void 0;try{for(var g,y=(0,a.default)(t);!(p=(g=y.next()).done);p=!0){var m=g.value,x=[],w=!0,b=!1,_=void 0;try{for(var S,A=(0,a.default)(n);!(w=(S=A.next()).done);w=!0){var M=S.value;d.isArray(m)&&-1!==m.indexOf(M.id)&&x.push(M.rigAnswer);}}catch(t){b=!0,_=t;}finally{try{!w&&A.return&&A.return();}finally{if(b){ throw _ }}}l.push({group:m,answerGroup:d.fullSort(x)});}}catch(t){h=!0,v=t;}finally{try{!p&&y.return&&y.return();}finally{if(h){ throw v }}}}var E=[JSON.parse((0,o.default)(n))],O=!0,k=!1,j=void 0;try{for(var C,R=(0,a.default)(l);!(O=(C=R.next()).done);O=!0){var I=C.value,P=[];if(I&&I.answerGroup&&d.isArray(I.answerGroup)){ for(var T=0;T<E.length;T+=1){ for(var q=0;q<I.answerGroup.length;q+=1){for(var L=I.answerGroup[q],z=0;z<L.length;z+=1){var N=L[z];E[T][I.group[z]].rigAnswer=N;}P.push(JSON.parse((0,o.default)(E[T])));} } }E=JSON.parse((0,o.default)(P));}}catch(t){k=!0,j=t;}finally{try{!O&&R.return&&R.return();}finally{if(k){ throw j }}}return E}}]),t}();e.default=v;},function(t,e,n){"use strict";function r(t){if(t&&t.__esModule){ return t; }var e={};if(null!=t){ for(var n in t){ Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]); } }return e.default=t,e}Object.defineProperty(e,"__esModule",{value:!0}),e.judge=e.judgeAnswer=e.judgeAnswerComposite=void 0;var i=n(72),o=r(i),u=n(46),a=r(u),s=n(194),c=function(t){return t&&t.__esModule?t:{default:t}}(s);e.judgeAnswerComposite=a.judgeAnswerComposite,e.judgeAnswer=o.chooseJudgeVersion,e.judge=c.default;},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(24),o=r(i),u=n(118),a=r(u),s=n(37),c=r(s),f=n(21),l=r(f),p=n(22),h=r(p),d=function(){function t(){(0,l.default)(this,t);}return(0,h.default)(t,[{key:"lowerCaseToASCII",value:function(t){if(t&&t.charCodeAt(0)>96&&t.charCodeAt(0)<123){ return t.charCodeAt(0)-86; }if(["β","α","γ","π"].indexOf(t)>-1){ switch(t){case"β":return 3;case"α":return 5;case"γ":return 7;case"π":return 3.1415926} }return t}},{key:"cutOffString",value:function(t){
var this$1 = this;
var e=[];if(t&&t.length>1){e=t.split(""),e=e.join("").split("");for(var n=0,r=e.length;n<r;n+=1){ e[n]=this$1.lowerCaseToASCII(e[n]); }return e.join("")}return this.lowerCaseToASCII(t)}},{key:"addProduct",value:function(t){if(t&&t.length>1){for(var e=t.split(""),n=1,r=e.length;n<r;n+=1){var i=e[n],o=e[n-1].charAt(e[n-1].length-1);(/[a-z0-9]/.test(i)&&/[}]/.test(o)||/[{]/.test(i)&&!/[+*\/\-{^]/.test(o))&&(e[n]="*"+i);}return e.join("")}return t}},{key:"standardAEK_AFH",value:function(t){return t.replace(/[^a-z0-9+\-*\/().]/g,"")}},{key:"statisticsLowerCase",value:function(t){var e=t.split(""),n=[],r=!0,i=!1,u=void 0;try{for(var s,f=(0,o.default)(e);!(r=(s=f.next()).done);r=!0){var l=s.value;(/[a-z]/g.test(l)||["β","α","γ","π"].indexOf(l)>-1)&&n.push(l);}}catch(t){i=!0,u=t;}finally{try{!r&&f.return&&f.return();}finally{if(i){ throw u }}}return[].concat((0,c.default)(new a.default(n))).length}}]),t}();e.default=d;},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(21),o=r(i),u=n(22),a=r(u),s=n(195),c=r(s),f=function(){function t(){(0,o.default)(this,t),this.typeParent=[];}return(0,a.default)(t,[{key:"getGrade",value:function(t){for(var e in c.default.grades){ if(c.default.grades[e].id===t){ return c.default.grades[e].name; } }return 0}},{key:"getSubject",value:function(t){for(var e in c.default.subjects){ if(c.default.subjects[e].id===t){ return c.default.subjects[e].name; } }return 0}},{key:"getType",value:function(t){for(var e in c.default.types){ if(c.default.types[e].id===t){ return c.default.types[e].name; } }return 0}},{key:"getTypeParentId",value:function(t){for(var e in c.default.types){ if(c.default.types[e].id===t){ return c.default.types[e].parentId; } }return 0}},{key:"getTypeParent",value:function(t){if(0===t){ return this.typeParent; }var e=this.getTypeParentId(t);return this.typeParent.push(e),this.getTypeParent(e)}},{key:"getAnswerType",value:function(t){var e={};return e.grade=this.getGrade(Number(t.grade)),e.subject=this.getSubject(Number(t.subject)),e.type=this.getType(Number(t.type)),e}}]),t}();e.default=f;},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(73),o=r(i),u=n(280),a=r(u),s=n(46),c=r(s),f=n(114),l=r(f),p=n(281),h=r(p),d={Convert:o.default,NewJudge:a.default,OldJudge:c.default,Compute:l.default,SpecialConvert:h.default};e.default=d;},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(24),o=r(i),u=n(21),a=r(u),s=n(22),c=r(s),f=n(115),l=r(f),p=n(274),h=r(p),d=n(282),v=r(d),g=n(391),y=new v.default,m=function(){function t(){(0,a.default)(this,t);}return(0,c.default)(t,[{key:"judgeAnswer",value:function(t,e,n,r,i){var u=!0,a=!1,s=void 0;try{for(var c,f=(0,o.default)(e);!(u=(c=f.next()).done);u=!0){var p=c.value,d=!0,v=!1,m=void 0;try{for(var x,w=(0,o.default)(t);!(d=(x=w.next()).done);d=!0){var b=x.value;if(b===p){ return 1; }if(h.default[n]){if(y[n](b,p)){ return 1 }}if(p&&p.indexOf(";zk;")>-1&&b&&b.indexOf(";zk;")>-1){var _=p.split(";zk;"),S=b.split(";zk;");if(_.length===S.length){if(0===(0,g.symmetricDifference)(_)(S).length){ return 1 }}}if(!(["kexuejishufa","jiandanshuzhi"].indexOf(n)>-1)&&(-1!==[2,4,5,6].indexOf(i)&&!0!==r)){var A=l.default.parse(b).expr,M=l.default.parse(p).expr;if(A&&M){if(A.print&&M.print&&A.print()===M.print()){ return 1; }try{if(l.default.compare(A,M).equal){ return 1 }}catch(t){}try{if(A.collect()&&A.collect().print()===M.collect()&&M.collect().print()){ return 1 }}catch(t){}try{if(A.expand().print()===M.expand().print()){ return 1 }}catch(t){}try{if(A.expand().factor().print()===M.expand().factor().print()){ return 1 }}catch(t){}}}}}catch(t){v=!0,m=t;}finally{try{!d&&w.return&&w.return();}finally{if(v){ throw m }}}}}catch(t){a=!0,s=t;}finally{try{!u&&f.return&&f.return();}finally{if(a){ throw s }}}return 0}}]),t}();e.default=m;},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(48),o=r(i),u=n(21),a=r(u),s=n(22),c=r(s),f=n(75),l=r(f),p=n(74),h=r(p),d=n(73),v=r(d),g=n(114),y=r(g),m=new y.default,x=function(t){function e(){return(0,a.default)(this,e),(0,l.default)(this,(e.__proto__||(0,o.default)(e)).call(this))}return(0,h.default)(e,t),(0,c.default)(e,[{key:"zhuanhuanpie",value:function(t){return t.replace(/‘|’/g,"'")}},{key:"daishushiUnitsToUpperCase",value:function(t){return this.regexReplace("daishushiUnitsToUpperCase",t)}},{key:"zuobiao",value:function(t){for(var e=/\((.+?),(.+?(?:\))*)\)/g,n=t,r=void 0;null!==(r=e.exec(n));){r.index===e.lastIndex&&(e.lastIndex+=1);var i=n.split("");i.splice(r.index,r[0].length,"&&&&("+m.compositeCompute(r[1])+"$"+m.compositeCompute(r[2])+")&&&&"),n=i.join("");}return n=n.replace(/&&&&/g,""),n=this.splitDataExchange(n)}},{key:"qudakuohao",value:function(t){return t.replace(/\{|\}| |\\/g,"")}}]),e}(v.default);e.default=x;},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(24),o=r(i),u=n(48),a=r(u),s=n(21),c=r(s),f=n(22),l=r(f),p=n(75),h=r(p),d=n(74),v=r(d),g=n(47),y=r(g),m=function(t){function e(){return(0,c.default)(this,e),(0,h.default)(this,(e.__proto__||(0,a.default)(e)).call(this))}return(0,v.default)(e,t),(0,l.default)(e,[{key:"shouzimupinxie",value:function(t,e){return t===e.slice(1)}},{key:"duoxuan",value:function(t,e){if(t=t.split("、"),e=e.split("、"),t.length!==e.length){ return!1; }var n=0,r=!0,i=!1,u=void 0;try{for(var a,s=(0,o.default)(t);!(r=(a=s.next()).done);r=!0){var c=a.value;if(e.indexOf(c)>-1&&(n+=1),n===e.length){ return!0 }}}catch(t){i=!0,u=t;}finally{try{!r&&s.return&&s.return();}finally{if(i){ throw u }}}return!1}}]),e}(y.default);e.default=m;},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(284),i=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default={unitsConvert:i.default};},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t){var e=[];if(1===t.length){ return e.push(t),e; }for(var n=0;n<t.length;n+=1){var r=[];r.push(t[n]);var o=t.slice(0);o.splice(n,1);for(var u=i(o).concat(),a=0;a<u.length;a+=1){ u[a].unshift(r[0]),e.push(u[a]); }}return e}function o(t){for(var e={"零":0,"一":1,"二":2,"三":3,"四":4,"五":5,"六":6,"七":7,"八":8,"九":9},n={"十":{value:10,secUnit:!1},"百":{value:100,secUnit:!1},"千":{value:1e3,secUnit:!1},"万":{value:1e4,secUnit:!0},"亿":{value:1e8,secUnit:!0}},r=0,i=0,o=0,u=!1,a=t.split(""),s=0;s<a.length;s+=1){var c=e[a[s]];if(void 0!==c){ o=c,s===a.length-1&&(i+=o); }else{var f=n[a[s]].value;u=n[a[s]].secUnit,u?(i=(i+o)*f,r+=i,i=0):(0===o&&(o=1),i+=o*f),o=0;}}return r+i}function u(t){for(var e=/[零一二三四五六七八九十百千万亿]+/,n=t,r=void 0;null!==(r=e.exec(n));){r.index===e.lastIndex&&(e.lastIndex+=1);var i=n.split("");i.splice(r.index,r[0].length,"&&&&"+o(r[0])+"&&&&"),n=i.join("");}return n=n.replace(/&&&&/g,"")}function a(t,e){var n=String(t),r=parseInt(e,10),i=void 0,o=void 0,u="",a="";if(-1!==n.indexOf("e")?(u=n.substring(n.indexOf("e"),n.length),n=n.substring(0,n.indexOf("e"))):(-1!==n.indexOf("E")&&(u=n.substring(n.indexOf("E"),n.length),n=n.substring(0,n.indexOf("e"))),"-"===n.substring(0,1)&&(a="-",n=n.substring(1,n.length))),parseFloat(n)>=1){var s=n.indexOf(".");-1===s&&(s=n.length),o=s-r;}else{var c=String(n).lastIndexOf(".")+1;for(1===c&&(c+=1);"0"===String(n).charAt(c);){ c+=1; }c-=2,o=-(r+c);}if(i=Math.round(n/Math.pow(10,o)),o>=0){ for(var f=1;f<=o;f+=1){ i+="0"; } }else{if(i+="",i.length+o>0){ i=i.substring(0,i.length+o)+"."+i.substring(i.length+o,i.length); }else{for(var l="0.",p=-1;p>=i.length+o;p-=1){ l+="0"; }i=l+i;}for(;"0"===i.charAt(i.length-1);){ i=i.substring(0,i.length-1); }"."===i.charAt(i.length-1)&&(i=i.substring(0,i.length-1));}return i=a+i+u}function s(t,e,n,r){var i=0;return i=t*y[n][e],i>=0&&"-"===String(t).charAt(0)&&(i=-i),a(i/y[n][r],8)}function c(t){var e=t,n=!1,r=void 0,i=void 0,o=void 0,a=!0,c=!1,f=void 0;try{for(var l,p=(0,v.default)(g);!(a=(l=p.next()).done);a=!0){var h=l.value;i=h;for(var d=h[0];null!==(r=d.exec(e));){n=!0,r.index===d.lastIndex&&(d.lastIndex+=1);var y=e.split("");y.splice(r.index,r[0].length,""+h[1]),e=y.join(""),o=new RegExp("([+\\-0-9\\.]+)("+h[1]+")");break}if(n){ break }}}catch(t){c=!0,f=t;}finally{try{!a&&p.return&&p.return();}finally{if(c){ throw f }}}if(e=u(e),n){ for(;null!==(r=o.exec(e));){r.index===o.lastIndex&&(o.lastIndex+=1);var m=e.split("");m.splice(r.index,r[0].length,""+s(Number(e.match(o)[1]),i[1],i[2],i[3])+i[3]),e=m.join("");break} }return e}function f(t){var e=[t],n=["或",",","，","、"," ","和","或者"],r=!0,o=!1,u=void 0;try{for(var a,s=(0,v.default)(n);!(r=(a=s.next()).done);r=!0){var c=a.value,f=[],l=!0,p=!1,d=void 0;try{for(var g,y=(0,v.default)(e);!(l=(g=y.next()).done);l=!0){var m=g.value,x=m.split(c);Array.isArray(x)&&x.length>0&&f.push.apply(f,(0,h.default)(x));}}catch(t){p=!0,d=t;}finally{try{!l&&y.return&&y.return();}finally{if(p){ throw d }}}Array.isArray(f)&&f.length>0&&(e=f);}}catch(t){o=!0,u=t;}finally{try{!r&&s.return&&s.return();}finally{if(o){ throw u }}}return e.length>0&&(e=i(e)),e}function l(t){var e=f(t);if(Array.isArray(e)&&e.length>0){ for(var n=0;n<e.length;n+=1){var r=e[n];if(Array.isArray(r)&&r.length>0){ for(var i=0;i<r.length;i+=1){ r[i]=c(r[i]); } }} }for(var o=0,u=e.length;o<u;o+=1){ e.splice(o,1,e[o].join(",")); }return e}Object.defineProperty(e,"__esModule",{value:!0});var p=n(37),h=r(p),d=n(24),v=r(d),g=[[/分米|dm/,"mDecimeter","LENGTH_MEASURES","mMeter"],[/厘米|cm/,"mCentimeter","LENGTH_MEASURES","mMeter"],[/毫米|mm/,"mMillimeter","LENGTH_MEASURES","mMeter"],[/微米|μm|um/,"mMicronmeter","LENGTH_MEASURES","mMeter"],[/丈/,"mZhangmeter","LENGTH_MEASURES","mMeter"],[/尺/,"mChimeter","LENGTH_MEASURES","mMeter"],[/寸/,"mCunmeter","LENGTH_MEASURES","mMeter"],[/分/,"mFenmeter","LENGTH_MEASURES","mMeter"],[/厘/,"mmLimeter","LENGTH_MEASURES","mMeter"],[/海里|nmi/,"engFoot","LENGTH_MEASURES","mMeter"],[/英寻/,"engMile","LENGTH_MEASURES","mMeter"],[/弗隆/,"engFurlong","LENGTH_MEASURES","mMeter"],[/千瓦|KW|kw/,"Kilowatt","POWER_MEASURES","Kilowatt"],[/英制马力|HP|hp/,"Horsepower","POWER_MEASURES","Kilowatt"],[/米制马力|PS|ps/,"mHorsepower","POWER_MEASURES","Kilowatt"],[/公斤·米\/秒|千克·米\/秒|kg·m\/s/,"kgms","POWER_MEASURES","Kilowatt"],[/千卡\/秒|kcal\/s/,"kcals","POWER_MEASURES","Kilowatt"],[/英热单位\/秒|btu\/s/,"Btus","POWER_MEASURES","Kilowatt"],[/英尺·磅\/秒|ft·lb\/s/,"ftlbs","POWER_MEASURES","Kilowatt"],[/焦耳\/秒|j\/s/,"Js","POWER_MEASURES","Kilowatt"],[/牛顿·米\/秒|n·m\/s/,"Nms","POWER_MEASURES","Kilowatt"],[/瓦|W|w/,"Watt","POWER_MEASURES","Kilowatt"],[/平方公里|平方千米|km^2/,"mSquare_kilometer","AREA_MEASURES","mSquare_meter"],[/公顷|ha/,"mHectare","AREA_MEASURES","mSquare_meter"],[/平方米|m^2/,"mSquare_meter","AREA_MEASURES","mSquare_meter"],[/市亩/g,"mAre","AREA_MEASURES","mSquare_meter"],[/平方分米|dm^2/,"mSquare_decimeter","AREA_MEASURES","mSquare_meter"],[/平方厘米|cm^2/,"mSquare_centimeter","AREA_MEASURES","mSquare_meter"],[/平方毫米|mm^2/,"mSquare_millimeter","AREA_MEASURES","mSquare_meter"],[/平方英尺/,"engSquare_foot","AREA_MEASURES","mSquare_meter"],[/平方码/,"engSquare_yard","AREA_MEASURES","mSquare_meter"],[/平方竿/,"usSquare_rod","AREA_MEASURES","mSquare_meter"],[/英亩/,"engAcre","AREA_MEASURES","mSquare_meter"],[/平方英里/,"engSquare_mile","AREA_MEASURES","mSquare_meter"],[/平方英寸/,"engSquare_inch","AREA_MEASURES","mSquare_meter"],[/公石/,"mHectoliter","VOL_MEASURES","mLiter"],[/十升/,"mDekaliter","VOL_MEASURES","mLiter"],[/分升/,"mDeciliter","VOL_MEASURES","mLiter"],[/厘升/,"mCentiliter","VOL_MEASURES","mLiter"],[/立方厘米|cm^3|毫升|ml|ML/,"mMilliliter","VOL_MEASURES","mLiter"],[/立方毫米/,"mCubic_millimeter","VOL_MEASURES","mLiter"],[/汤勺/,"mcTable_spoon","VOL_MEASURES","mLiter"],[/调羹/,"mcTea_spoon","VOL_MEASURES","mLiter"],[/立方英寸/,"uscCubic_inch","VOL_MEASURES","mLiter"],[/亩英尺/,"uscAcre_foot","VOL_MEASURES","mLiter"],[/立方码/,"uscCubic_yard","VOL_MEASURES","mLiter"],[/立方英尺/,"uscCubic_foot","VOL_MEASURES","mLiter"],[/加仑/,"uslGallon","VOL_MEASURES","mLiter"],[/夸脱/,"uslQuart","VOL_MEASURES","mLiter"],[/品脱/,"uslPint","VOL_MEASURES","mLiter"],[/及耳/,"uslGill","VOL_MEASURES","mLiter"],[/盎司/,"uslFluid_ounce","VOL_MEASURES","mLiter"],[/打兰/,"uslFluid_dram","VOL_MEASURES","mLiter"],[/量滴/,"uslMinim","VOL_MEASURES","mLiter"],[/蒲式耳/,"usdBushel","VOL_MEASURES","mLiter"],[/配克/,"usdPeck","VOL_MEASURES","mLiter"],[/液量盎司/,"briFluid_ounce","VOL_MEASURES","mLiter"],[/立方米|m^3/,"mCubic_meter","VOL_MEASURES","mLiter"],[/吨|t/,"mTon","WEIGHT_MEASURES","mKilogram"],[/公斤|千克|kg|KG/,"mKilogram","WEIGHT_MEASURES","mKilogram"],[/毫克|mg/,"mMilligram","WEIGHT_MEASURES","mKilogram"],[/市斤|斤/,"cJin","WEIGHT_MEASURES","mKilogram"],[/担/,"cDan","WEIGHT_MEASURES","mKilogram"],[/两/,"cLiang","WEIGHT_MEASURES","mKilogram"],[/钱/,"cQian","WEIGHT_MEASURES","mKilogram"],[/磅|lb/,"avdpPound","WEIGHT_MEASURES","mKilogram"],[/长吨/,"briTon","WEIGHT_MEASURES","mKilogram"],[/短吨/,"usTon","WEIGHT_MEASURES","mKilogram"],[/英担/,"briCWT","WEIGHT_MEASURES","mKilogram"],[/美担/,"usCWT","WEIGHT_MEASURES","mKilogram"],[/英石/,"briStone","WEIGHT_MEASURES","mKilogram"],[/克|g/,"mGram","WEIGHT_MEASURES","mKilogram"],[/华氏度千帕|千帕|kPa|kpa/,"mKilopascal","PRESS_MEASURES","mPascal"],[/百帕|hpa/,"mHectopascal","PRESS_MEASURES","mPascal"],[/巴/,"mBar","PRESS_MEASURES","mPascal"],[/毫巴/,"mMillibar","PRESS_MEASURES","mPascal"],[/标准大气压/,"mAtm","PRESS_MEASURES","mPascal"],[/毫米汞柱/,"mMillimeter_Hg","PRESS_MEASURES","mPascal"],[/英吋汞柱|in\/hg/,"engInch_Hg","PRESS_MEASURES","mPascal"],[/毫米水柱/,"mmmH2O","PRESS_MEASURES","mPascal"],[/帕斯卡|帕|pa|n\/m^2/,"mPascal","PRESS_MEASURES","mPascal"],[/公里|千米|km/,"mKilometer","LENGTH_MEASURES","mMeter"],[/里/,"mLimeter","LENGTH_MEASURES","mMeter"],[/升|立方分米|l|L/,"mLiter","VOL_MEASURES","mLiter"],[/米|m/,"mMeter","LENGTH_MEASURES","mMeter"]],y={LENGTH_MEASURES:{mKilometer:1e3,mMeter:1,mDecimeter:.1,mCentimeter:.01,mMillimeter:.001,mMicronmeter:1e-6,mLimeter:500,mZhangmeter:10/3,mChimeter:1/3,mCunmeter:1/30,mFenmeter:1/300,mmLimeter:1/3e3,engFoot:.3048,engMile:1609.344,engFurlong:201.168,engYard:3*.3048,engInch:.3048/12,nautMile:1852,nautFathom:6*.3048},POWER_MEASURES:{Watt:.001,Kilowatt:1,Horsepower:.745712172,mHorsepower:.7352941,kgms:.0098039215,kcals:4.1841004,Btus:1.05507491,ftlbs:.0013557483731,Js:.001,Nms:.001},AREA_MEASURES:{mSquare_kilometer:1e6,mHectare:1e4,mSquare_meter:1,mAre:1e4/15*1,mSquare_decimeter:.1*.1,mSquare_centimeter:1e-4,mSquare_millimeter:1e-6,engSquare_foot:.09290304,engSquare_yard:9*.3048*.3048,usSquare_rod:82.9818*.3048,engAcre:82.9818*.3048*160,engSquare_mile:2589988.110336,engSquare_inch:.09290304/144},VOL_MEASURES:{mCubic_meter:1e3,mHectoliter:100,mDekaliter:10,mLiter:1,mDeciliter:.1,mCentiliter:.01,mMilliliter:.001,mCubic_millimeter:1e-6,mcTable_spoon:.015,mcTea_spoon:.005,uscCubic_inch:.016387064,uscAcre_foot:1233481.83754752,uscCubic_yard:764.554857984,uscCubic_foot:28.316846592,uslGallon:3.785411784,uslBarrel:158.987294928,uslQuart:.946352946,uslPint:.473176473,uslGill:.11829411825,uslFluid_ounce:.0295735295625,uslFluid_dram:3.785411784/1024,uslMinim:4.813399993896484e-7,usdBarrel:115.627123584,usdBushel:35.23907016688,usdPeck:8.80976754172,usdQuart:1.101220942715,usdPint:.5506104713575,uscCup:.2365882365,uscTable_spoon:.01478676478125,uscTea_spoon:.00492892159375,briGallon:4.54609,briBarrel:163.65924,briBushel:36.36872,briPint:.56826125,briFluid_ounce:4.54609/160},WEIGHT_MEASURES:{mTon:1e3,mKilogram:1,mGram:.001,mMilligram:1e-6,cJin:.5,cDan:50,cLiang:.05,cQian:.005,avdpPound:.45359237,briTon:2240*.45359237,usTon:907.18474,briCWT:50.80234544,usCWT:45.359237,briStone:6.35029318,avdpOunce:.45359237/16,avdpDram:.45359237/256,avdpGrain:.45359237/7e3,troyPound:.3732417216,troyOunce:.0311034768,troyDWT:.00155517384,troyGrain:.45359237/7e3},PRESS_MEASURES:{mKilopascal:1e3,mHectopascal:100,mPascal:1,mBar:1e5,mMillibar:100,mAtm:101325,mMillimeter_Hg:101325/760,engInch_Hg:2573655/760,engPound_sq_inch:6894.757,engPound_sq_foot:101325/760/144,xpressKg_sq_cm:98066.5,xpressKg_sq_m:9.80665,mmmH2O:1/.101972}};e.default=l;},function(t,e,n){t.exports={default:n(290),__esModule:!0};},function(t,e,n){t.exports={default:n(294),__esModule:!0};},function(t,e,n){t.exports={default:n(296),__esModule:!0};},function(t,e,n){t.exports={default:n(298),__esModule:!0};},function(t,e,n){t.exports={default:n(299),__esModule:!0};},function(t,e,n){n(55),n(324),t.exports=n(6).Array.from;},function(t,e,n){n(92),n(55),t.exports=n(323);},function(t,e,n){var r=n(6),i=r.JSON||(r.JSON={stringify:JSON.stringify});t.exports=function(t){return i.stringify.apply(i,arguments)};},function(t,e,n){n(326);var r=n(6).Object;t.exports=function(t,e){return r.create(t,e)};},function(t,e,n){n(327);var r=n(6).Object;t.exports=function(t,e,n){return r.defineProperty(t,e,n)};},function(t,e,n){n(328),t.exports=n(6).Object.getPrototypeOf;},function(t,e,n){n(329),t.exports=n(6).Object.setPrototypeOf;},function(t,e,n){n(137),n(55),n(92),n(330),n(334),n(333),n(332),t.exports=n(6).Set;},function(t,e,n){n(331),n(137),n(335),n(336),t.exports=n(6).Symbol;},function(t,e,n){n(55),n(92),t.exports=n(90).f("iterator");},function(t,e){t.exports=function(){};},function(t,e,n){var r=n(49);t.exports=function(t,e){var n=[];return r(t,!1,n.push,n,e),n};},function(t,e,n){var r=n(32),i=n(52),o=n(322);t.exports=function(t){return function(e,n,u){var a,s=r(e),c=i(s.length),f=o(u,c);if(t&&n!=n){for(;c>f;){ if((a=s[f++])!=a){ return!0 } }}else { for(;c>f;f++){ if((t||f in s)&&s[f]===n){ return t||f||0; } } }return!t&&-1}};},function(t,e,n){var r=n(29),i=n(124),o=n(53),u=n(52),a=n(305);t.exports=function(t,e){var n=1==t,s=2==t,c=3==t,f=4==t,l=6==t,p=5==t||l,h=e||a;return function(e,a,d){for(var v,g,y=o(e),m=i(y),x=r(a,d,3),w=u(m.length),b=0,_=n?h(e,w):s?h(e,0):void 0;w>b;b++){ if((p||b in m)&&(v=m[b],g=x(v,b,y),t)){ if(n){ _[b]=g; }else if(g){ switch(t){case 3:return!0;case 5:return v;case 6:return b;case 2:_.push(v);} }else if(f){ return!1; } } }return l?-1:c||f?f:_}};},function(t,e,n){var r=n(23),i=n(126),o=n(9)("species");t.exports=function(t){var e;return i(t)&&(e=t.constructor,"function"!=typeof e||e!==Array&&!i(e.prototype)||(e=void 0),r(e)&&null===(e=e[o])&&(e=void 0)),void 0===e?Array:e};},function(t,e,n){var r=n(304);t.exports=function(t,e){return new(r(t))(e)};},function(t,e,n){"use strict";var r=n(13).f,i=n(50),o=n(134),u=n(29),a=n(120),s=n(49),c=n(80),f=n(128),l=n(320),p=n(16),h=n(82).fastKey,d=n(136),v=p?"_s":"size",g=function(t,e){var n,r=h(e);if("F"!==r){ return t._i[r]; }for(n=t._f;n;n=n.n){ if(n.k==e){ return n } }};t.exports={getConstructor:function(t,e,n,c){var f=t(function(t,r){a(t,f,e,"_i"),t._t=e,t._i=i(null),t._f=void 0,t._l=void 0,t[v]=0,void 0!=r&&s(r,n,t[c],t);});return o(f.prototype,{clear:function(){for(var t=d(this,e),n=t._i,r=t._f;r;r=r.n){ r.r=!0,r.p&&(r.p=r.p.n=void 0),delete n[r.i]; }t._f=t._l=void 0,t[v]=0;},delete:function(t){var n=d(this,e),r=g(n,t);if(r){var i=r.n,o=r.p;delete n._i[r.i],r.r=!0,o&&(o.n=i),i&&(i.p=o),n._f==r&&(n._f=i),n._l==r&&(n._l=o),n[v]--;}return!!r},forEach:function(t){d(this,e);for(var n,r=u(t,arguments.length>1?arguments[1]:void 0,3);n=n?n.n:this._f;){ for(r(n.v,n.k,this);n&&n.r;){ n=n.p; } }},has:function(t){return!!g(d(this,e),t)}}),p&&r(f.prototype,"size",{get:function(){return d(this,e)[v]}}),f},def:function(t,e,n){var r,i,o=g(t,e);return o?o.v=n:(t._l=o={i:i=h(e,!0),k:e,v:n,p:r=t._l,n:void 0,r:!1},t._f||(t._f=o),r&&(r.n=o),t[v]++,"F"!==i&&(t._i[i]=o)),t},getEntry:g,setStrong:function(t,e,n){c(t,e,function(t,n){this._t=d(t,e),this._k=n,this._l=void 0;},function(){for(var t=this,e=t._k,n=t._l;n&&n.r;){ n=n.p; }return t._t&&(t._l=n=n?n.n:t._t._f)?"keys"==e?f(0,n.k):"values"==e?f(0,n.v):f(0,[n.k,n.v]):(t._t=void 0,f(1))},n?"entries":"values",!n,!0),l(e);}};},function(t,e,n){var r=n(121),i=n(301);t.exports=function(t){return function(){if(r(this)!=t){ throw TypeError(t+"#toJSON isn't generic"); }return i(this)}};},function(t,e,n){"use strict";var r=n(17),i=n(12),o=n(82),u=n(31),a=n(26),s=n(134),c=n(49),f=n(120),l=n(23),p=n(51),h=n(13).f,d=n(303)(0),v=n(16);t.exports=function(t,e,n,g,y,m){var x=r[t],w=x,b=y?"set":"add",_=w&&w.prototype,S={};return v&&"function"==typeof w&&(m||_.forEach&&!u(function(){(new w).entries().next();}))?(w=e(function(e,n){f(e,w,t,"_c"),e._c=new x,void 0!=n&&c(n,y,e[b],e);}),d("add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON".split(","),function(t){var e="add"==t||"set"==t;t in _&&(!m||"clear"!=t)&&a(w.prototype,t,function(n,r){if(f(this,w,t),!e&&m&&!l(n)){ return"get"==t&&void 0; }var i=this._c[t](0===n?0:n,r);return e?this:i});}),m||h(w.prototype,"size",{get:function(){return this._c.size}})):(w=g.getConstructor(e,t,y,b),s(w.prototype,n),o.NEED=!0),p(w,t),S[t]=w,i(i.G+i.W+i.F,S),m||g.setStrong(w,t,y),w};},function(t,e,n){"use strict";var r=n(13),i=n(39);t.exports=function(t,e,n){e in t?r.f(t,e,i(0,n)):t[e]=n;};},function(t,e,n){var r=n(83),i=n(131),o=n(84);t.exports=function(t){var e=r(t),n=i.f;if(n){ for(var u,a=n(t),s=o.f,c=0;a.length>c;){ s.call(t,u=a[c++])&&e.push(u); } }return e};},function(t,e,n){var r=n(17).document;t.exports=r&&r.documentElement;},function(t,e,n){"use strict";var r=n(50),i=n(39),o=n(51),u={};n(26)(u,n(9)("iterator"),function(){return this}),t.exports=function(t,e,n){t.prototype=r(u,{next:i(1,n)}),o(t,e+" Iterator");};},function(t,e,n){var r=n(9)("iterator"),i=!1;try{var o=[7][r]();o.return=function(){i=!0;},Array.from(o,function(){throw 2});}catch(t){}t.exports=function(t,e){if(!e&&!i){ return!1; }var n=!1;try{var o=[7],u=o[r]();u.next=function(){return{done:n=!0}},o[r]=function(){return u},t(o);}catch(t){}return n};},function(t,e,n){var r=n(13),i=n(25),o=n(83);t.exports=n(16)?Object.defineProperties:function(t,e){i(t);for(var n,u=o(e),a=u.length,s=0;a>s;){ r.f(t,n=u[s++],e[n]); }return t};},function(t,e,n){var r=n(32),i=n(130).f,o={}.toString,u="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],a=function(t){try{return i(t)}catch(t){return u.slice()}};t.exports.f=function(t){return u&&"[object Window]"==o.call(t)?a(t):i(r(t))};},function(t,e,n){var r=n(12),i=n(6),o=n(31);t.exports=function(t,e){var n=(i.Object||{})[t]||Object[t],u={};u[t]=e(n),r(r.S+r.F*o(function(){n(1);}),"Object",u);};},function(t,e,n){"use strict";var r=n(12),i=n(119),o=n(29),u=n(49);t.exports=function(t){r(r.S,t,{from:function(t){var e,n,r,a,s=arguments[1];return i(this),e=void 0!==s,e&&i(s),void 0==t?new this:(n=[],e?(r=0,a=o(s,arguments[2],2),u(t,!1,function(t){n.push(a(t,r++));})):u(t,!1,n.push,n),new this(n))}});};},function(t,e,n){"use strict";var r=n(12);t.exports=function(t){r(r.S,t,{of:function(){
var arguments$1 = arguments;
for(var t=arguments.length,e=new Array(t);t--;){ e[t]=arguments$1[t]; }return new this(e)}});};},function(t,e,n){var r=n(23),i=n(25),o=function(t,e){if(i(t),!r(e)&&null!==e){ throw TypeError(e+": can't set as prototype!") }};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,e,r){try{r=n(29)(Function.call,n(129).f(Object.prototype,"__proto__").set,2),r(t,[]),e=!(t instanceof Array);}catch(t){e=!0;}return function(t,n){return o(t,n),e?t.__proto__=n:r(t,n),t}}({},!1):void 0),check:o};},function(t,e,n){"use strict";var r=n(17),i=n(6),o=n(13),u=n(16),a=n(9)("species");t.exports=function(t){var e="function"==typeof i[t]?i[t]:r[t];u&&e&&!e[a]&&o.f(e,a,{configurable:!0,get:function(){return this}});};},function(t,e,n){var r=n(87),i=n(78);t.exports=function(t){return function(e,n){var o,u,a=String(i(e)),s=r(n),c=a.length;return s<0||s>=c?t?"":void 0:(o=a.charCodeAt(s),o<55296||o>56319||s+1===c||(u=a.charCodeAt(s+1))<56320||u>57343?t?a.charAt(s):o:t?a.slice(s,s+2):u-56320+(o-55296<<10)+65536)}};},function(t,e,n){var r=n(87),i=Math.max,o=Math.min;t.exports=function(t,e){return t=r(t),t<0?i(t+e,0):o(t,e)};},function(t,e,n){var r=n(25),i=n(91);t.exports=n(6).getIterator=function(t){var e=i(t);if("function"!=typeof e){ throw TypeError(t+" is not iterable!"); }return r(e.call(t))};},function(t,e,n){"use strict";var r=n(29),i=n(12),o=n(53),u=n(127),a=n(125),s=n(52),c=n(309),f=n(91);i(i.S+i.F*!n(313)(function(t){Array.from(t);}),"Array",{from:function(t){var e,n,i,l,p=o(t),h="function"==typeof this?this:Array,d=arguments.length,v=d>1?arguments[1]:void 0,g=void 0!==v,y=0,m=f(p);if(g&&(v=r(v,d>2?arguments[2]:void 0,2)),void 0==m||h==Array&&a(m)){ for(e=s(p.length),n=new h(e);e>y;y++){ c(n,y,g?v(p[y],y):p[y]); } }else { for(l=m.call(p),n=new h;!(i=l.next()).done;y++){ c(n,y,g?u(l,v,[i.value,y],!0):i.value); } }return n.length=y,n}});},function(t,e,n){"use strict";var r=n(300),i=n(128),o=n(38),u=n(32);t.exports=n(80)(Array,"Array",function(t,e){this._t=u(t),this._i=0,this._k=e;},function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0,i(1)):"keys"==e?i(0,n):"values"==e?i(0,t[n]):i(0,[n,t[n]])},"values"),o.Arguments=o.Array,r("keys"),r("values"),r("entries");},function(t,e,n){var r=n(12);r(r.S,"Object",{create:n(50)});},function(t,e,n){var r=n(12);r(r.S+r.F*!n(16),"Object",{defineProperty:n(13).f});},function(t,e,n){var r=n(53),i=n(132);n(316)("getPrototypeOf",function(){return function(t){return i(r(t))}});},function(t,e,n){var r=n(12);r(r.S,"Object",{setPrototypeOf:n(319).set});},function(t,e,n){"use strict";var r=n(306),i=n(136);t.exports=n(308)("Set",function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},{add:function(t){return r.def(i(this,"Set"),t=0===t?0:t,t)}},r);},function(t,e,n){"use strict";var r=n(17),i=n(30),o=n(16),u=n(12),a=n(135),s=n(82).KEY,c=n(31),f=n(86),l=n(51),p=n(54),h=n(9),d=n(90),v=n(89),g=n(310),y=n(126),m=n(25),x=n(23),w=n(32),b=n(88),_=n(39),S=n(50),A=n(315),M=n(129),E=n(13),O=n(83),k=M.f,j=E.f,C=A.f,R=r.Symbol,I=r.JSON,P=I&&I.stringify,T=h("_hidden"),q=h("toPrimitive"),L={}.propertyIsEnumerable,z=f("symbol-registry"),N=f("symbols"),D=f("op-symbols"),F=Object.prototype,U="function"==typeof R,B=r.QObject,G=!B||!B.prototype||!B.prototype.findChild,H=o&&c(function(){return 7!=S(j({},"a",{get:function(){return j(this,"a",{value:7}).a}})).a})?function(t,e,n){var r=k(F,e);r&&delete F[e],j(t,e,n),r&&t!==F&&j(F,e,r);}:j,V=function(t){var e=N[t]=S(R.prototype);return e._k=t,e},Z=U&&"symbol"==typeof R.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof R},$=function(t,e,n){return t===F&&$(D,e,n),m(t),e=b(e,!0),m(n),i(N,e)?(n.enumerable?(i(t,T)&&t[T][e]&&(t[T][e]=!1),n=S(n,{enumerable:_(0,!1)})):(i(t,T)||j(t,T,_(1,{})),t[T][e]=!0),H(t,e,n)):j(t,e,n)},K=function(t,e){m(t);for(var n,r=g(e=w(e)),i=0,o=r.length;o>i;){ $(t,n=r[i++],e[n]); }return t},W=function(t,e){return void 0===e?S(t):K(S(t),e)},J=function(t){var e=L.call(this,t=b(t,!0));return!(this===F&&i(N,t)&&!i(D,t))&&(!(e||!i(this,t)||!i(N,t)||i(this,T)&&this[T][t])||e)},Q=function(t,e){if(t=w(t),e=b(e,!0),t!==F||!i(N,e)||i(D,e)){var n=k(t,e);return!n||!i(N,e)||i(t,T)&&t[T][e]||(n.enumerable=!0),n}},X=function(t){for(var e,n=C(w(t)),r=[],o=0;n.length>o;){ i(N,e=n[o++])||e==T||e==s||r.push(e); }return r},Y=function(t){for(var e,n=t===F,r=C(n?D:w(t)),o=[],u=0;r.length>u;){ !i(N,e=r[u++])||n&&!i(F,e)||o.push(N[e]); }return o};U||(R=function(){if(this instanceof R){ throw TypeError("Symbol is not a constructor!"); }var t=p(arguments.length>0?arguments[0]:void 0),e=function(n){this===F&&e.call(D,n),i(this,T)&&i(this[T],t)&&(this[T][t]=!1),H(this,t,_(1,n));};return o&&G&&H(F,t,{configurable:!0,set:e}),V(t)},a(R.prototype,"toString",function(){return this._k}),M.f=Q,E.f=$,n(130).f=A.f=X,n(84).f=J,n(131).f=Y,o&&!n(81)&&a(F,"propertyIsEnumerable",J,!0),d.f=function(t){return V(h(t))}),u(u.G+u.W+u.F*!U,{Symbol:R});for(var tt="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),et=0;tt.length>et;){ h(tt[et++]); }for(var nt=O(h.store),rt=0;nt.length>rt;){ v(nt[rt++]); }u(u.S+u.F*!U,"Symbol",{for:function(t){return i(z,t+="")?z[t]:z[t]=R(t)},keyFor:function(t){if(!Z(t)){ throw TypeError(t+" is not a symbol!"); }for(var e in z){ if(z[e]===t){ return e } }},useSetter:function(){G=!0;},useSimple:function(){G=!1;}}),u(u.S+u.F*!U,"Object",{create:W,defineProperty:$,defineProperties:K,getOwnPropertyDescriptor:Q,getOwnPropertyNames:X,getOwnPropertySymbols:Y}),I&&u(u.S+u.F*(!U||c(function(){var t=R();return"[null]"!=P([t])||"{}"!=P({a:t})||"{}"!=P(Object(t))})),"JSON",{stringify:function(t){
var arguments$1 = arguments;
for(var e,n,r=[t],i=1;arguments.length>i;){ r.push(arguments$1[i++]); }if(n=e=r[1],(x(e)||void 0!==t)&&!Z(t)){ return y(e)||(e=function(t,e){if("function"==typeof n&&(e=n.call(this,t,e)),!Z(e)){ return e }}),r[1]=e,P.apply(I,r) }}}),R.prototype[q]||n(26)(R.prototype,q,R.prototype.valueOf),l(R,"Symbol"),l(Math,"Math",!0),l(r.JSON,"JSON",!0);},function(t,e,n){n(317)("Set");},function(t,e,n){n(318)("Set");},function(t,e,n){var r=n(12);r(r.P+r.R,"Set",{toJSON:n(307)("Set")});},function(t,e,n){n(89)("asyncIterator");},function(t,e,n){n(89)("observable");},function(t,e,n){var r=n(33),i=r(!1);t.exports=i;},function(t,e,n){var r=n(33),i=r(!0);t.exports=i;},function(t,e){t.exports={"@@functional/placeholder":!0};},function(t,e,n){var r=n(14),i=n(1),o=n(5),u=i(function(t){return o(t.length,function(){var e=0,n=arguments[0],i=arguments[arguments.length-1],o=Array.prototype.slice.call(arguments,0);return o[0]=function(){var t=n.apply(this,r(arguments,[e,i]));return e+=1,t},t.apply(this,o)})});t.exports=u;},function(t,e,n){var r=n(0),i=n(3),o=n(416),u=r(i(["all"],o,function(t,e){for(var n=0;n<e.length;){if(!t(e[n])){ return!1; }n+=1;}return!0}));t.exports=u;},function(t,e,n){var r=n(1),i=n(5),o=n(35),u=n(44),a=n(20),s=r(function(t){return i(a(o,0,u("length",t)),function(){
var arguments$1 = arguments;
var this$1 = this;
for(var e=0,n=t.length;e<n;){if(!t[e].apply(this$1,arguments$1)){ return!1; }e+=1;}return!0})});t.exports=s;},function(t,e,n){var r=n(1),i=n(5),o=n(35),u=n(44),a=n(20),s=r(function(t){return i(a(o,0,u("length",t)),function(){
var arguments$1 = arguments;
var this$1 = this;
for(var e=0,n=t.length;e<n;){if(t[e].apply(this$1,arguments$1)){ return!0; }e+=1;}return!1})});t.exports=s;},function(t,e,n){var r=n(399),i=n(0),o=n(3),u=n(417),a=i(o([],u,r));t.exports=a;},function(t,e,n){var r=n(14),i=n(0),o=i(function(t,e){return r(e,[t])});t.exports=o;},function(t,e,n){var r=n(1),i=n(141),o=n(5),u=n(8),a=n(35),s=n(44),c=n(20),f=n(192),l=r(function t(e){return e=u(function(e){return"function"==typeof e?e:t(e)},e),o(c(a,0,s("length",f(e))),function(){var t=arguments;return u(function(e){return i(e,t)},e)})});t.exports=l;},function(t,e,n){var r=n(0),i=r(function(t,e){return e(t)});t.exports=i;},function(t,e,n){var r=n(2),i=r(function(t,e,n){var r=t(e),i=t(n);return r<i?-1:r>i?1:0});t.exports=i;},function(t,e,n){var r=n(1),i=n(68),o=r(function(t){return i(2,t)});t.exports=o;},function(t,e,n){var r=n(0),i=n(62),o=n(139),u=n(66),a=r(function(t,e){return i(t)?function(){return t.apply(this,arguments)&&e.apply(this,arguments)}:u(o)(t,e)});t.exports=a;},function(t,e,n){var r=n(97),i=r(function(t){return t.apply(this,Array.prototype.slice.call(arguments,1))});t.exports=i;},function(t,e,n){var r=n(2),i=r(function(t,e,n){if(t>e){ throw new Error("min must not be greater than max in clamp(min, max, value)"); }return n<t?t:n>e?e:n});t.exports=i;},function(t,e,n){var r=n(155),i=n(1),o=i(function(t){return null!=t&&"function"==typeof t.clone?t.clone():r(t,[],[],!0)});t.exports=o;},function(t,e,n){var r=n(1),i=r(function(t){return function(e,n){return t(e,n)?-1:t(n,e)?1:0}});t.exports=i;},function(t,e,n){var r=n(66),i=n(175),o=r(i);t.exports=o;},function(t,e,n){function r(){if(0===arguments.length){ throw new Error("composeP requires at least one argument"); }return i.apply(this,o(arguments))}var i=n(181),o=n(71);t.exports=r;},function(t,e,n){var r=n(18),i=n(1),o=n(8),u=n(35),a=n(20),s=i(function(t){var e=a(u,0,o(function(t){return t[0].length},t));return r(e,function(){
var arguments$1 = arguments;
var this$1 = this;
for(var e=0;e<t.length;){if(t[e][0].apply(this$1,arguments$1)){ return t[e][1].apply(this$1,arguments$1); }e+=1;}})});t.exports=s;},function(t,e,n){var r=n(1),i=n(145),o=r(function(t){return i(t.length,t)});t.exports=o;},function(t,e,n){var r=n(34),i=n(0),o=i(r);t.exports=o;},function(t,e,n){var r=n(69),i=r(function(t,e){return t+1},0);t.exports=i;},function(t,e,n){var r=n(56),i=r(-1);t.exports=i;},function(t,e,n){var r=n(2),i=r(function(t,e,n){var r=t(e),i=t(n);return r>i?-1:r<i?1:0});t.exports=i;},function(t,e,n){var r=n(0),i=n(103),o=n(57),u=n(150),a=n(184),s=n(112),c=r(function t(e,n){switch(e.length){case 0:return n;case 1:return i(e[0])?a(e[0],1,n):u(e[0],n);default:var r=e[0],c=Array.prototype.slice.call(e,1);return null==n[r]?n:i(e[0])?s(r,t(c,n[r]),n):o(r,t(c,n[r]),n)}});t.exports=c;},function(t,e,n){var r=n(0),i=r(function(t,e){return t/e});t.exports=i;},function(t,e,n){var r=n(0),i=n(3),o=n(401),u=n(420),a=r(i([],u,o));t.exports=a;},function(t,e,n){var r=n(0),i=n(3),o=n(402),u=n(421),a=r(i([],u,o));t.exports=a;},function(t,e,n){var r=n(1),i=n(3),o=n(164),u=n(152),a=n(10),s=r(i([],o(a),u(a)));t.exports=s;},function(t,e,n){var r=n(0),i=n(3),o=n(422),u=n(15),a=r(i(["dropWhile"],o,function(t,e){for(var n=0,r=e.length;n<r&&t(e[n]);){ n+=1; }return u(n,1/0,e)}));t.exports=a;},function(t,e,n){var r=n(0),i=n(62),o=n(66),u=n(177),a=r(function(t,e){return i(t)?function(){return t.apply(this,arguments)||e.apply(this,arguments)}:o(u)(t,e)});t.exports=a;},function(t,e,n){var r=n(0),i=n(10),o=n(187),u=r(function(t,e){return i(o(t.length,e),t)});t.exports=u;},function(t,e,n){var r=n(2),i=n(10),o=r(function(t,e,n){return i(t(e),t(n))});t.exports=o;},function(t,e,n){var r=n(2),i=n(10),o=r(function(t,e,n){return i(e[t],n[t])});t.exports=o;},function(t,e,n){var r=n(0),i=r(function t(e,n){var r,i,o,u={};for(i in n){ r=e[i],o=typeof r,u[i]="function"===o?r(n[i]):r&&"object"===o?t(r,n[i]):n[i]; }return u});t.exports=i;},function(t,e,n){var r=n(0),i=n(3),o=n(424),u=r(i(["find"],o,function(t,e){for(var n=0,r=e.length;n<r;){if(t(e[n])){ return e[n]; }n+=1;}}));t.exports=u;},function(t,e,n){var r=n(0),i=n(3),o=n(425),u=r(i([],o,function(t,e){for(var n=0,r=e.length;n<r;){if(t(e[n])){ return n; }n+=1;}return-1}));t.exports=u;},function(t,e,n){var r=n(0),i=n(3),o=n(426),u=r(i([],o,function(t,e){for(var n=e.length-1;n>=0;){if(t(e[n])){ return e[n]; }n-=1;}}));t.exports=u;},function(t,e,n){var r=n(0),i=n(3),o=n(427),u=r(i([],o,function(t,e){for(var n=e.length-1;n>=0;){if(t(e[n])){ return n; }n-=1;}return-1}));t.exports=u;},function(t,e,n){var r=n(1),i=n(162),o=r(i(!0));t.exports=o;},function(t,e,n){var r=n(40),i=n(0),o=i(r("forEach",function(t,e){for(var n=e.length,r=0;r<n;){ t(e[r]),r+=1; }return e}));t.exports=o;},function(t,e,n){var r=n(0),i=n(19),o=r(function(t,e){for(var n=i(e),r=0;r<n.length;){var o=n[r];t(e[o],o,e),r+=1;}return e});t.exports=o;},function(t,e,n){var r=n(1),i=r(function(t){for(var e={},n=0;n<t.length;){ e[t[n][0]]=t[n][1],n+=1; }return e});t.exports=i;},function(t,e,n){var r=n(40),i=n(0),o=n(69),u=i(r("groupBy",o(function(t,e){return null==t&&(t=[]),t.push(e),t},null)));t.exports=u;},function(t,e,n){var r=n(0),i=r(function(t,e){for(var n=[],r=0,i=e.length;r<i;){for(var o=r+1;o<i&&t(e[o-1],e[o]);){ o+=1; }n.push(e.slice(r,o)),r=o;}return n});t.exports=i;},function(t,e,n){var r=n(0),i=r(function(t,e){return t>e});t.exports=i;},function(t,e,n){var r=n(0),i=r(function(t,e){return t>=e});t.exports=i;},function(t,e,n){var r=n(0),i=n(7),o=r(i);t.exports=o;},function(t,e,n){var r=n(0),i=r(function(t,e){return t in e});t.exports=i;},function(t,e,n){var r=n(43),i=r(0);t.exports=i;},function(t,e,n){var r=n(2),i=n(5),o=r(function(t,e,n){return i(Math.max(t.length,e.length,n.length),function(){return t.apply(this,arguments)?e.apply(this,arguments):n.apply(this,arguments)})});t.exports=o;},function(t,e,n){var r=n(56),i=r(1);t.exports=i;},function(t,e,n){t.exports={},t.exports.F=n(337),t.exports.T=n(338),t.exports.__=n(339),t.exports.add=n(56),t.exports.addIndex=n(340),t.exports.adjust=n(138),t.exports.all=n(341),t.exports.allPass=n(342),t.exports.always=n(33),t.exports.and=n(139),t.exports.any=n(140),t.exports.anyPass=n(343),t.exports.ap=n(93),t.exports.aperture=n(344),t.exports.append=n(345),t.exports.apply=n(141),t.exports.applySpec=n(346),t.exports.applyTo=n(347),t.exports.ascend=n(348),t.exports.assoc=n(57),t.exports.assocPath=n(142),t.exports.binary=n(349),t.exports.bind=n(143),t.exports.both=n(350),t.exports.call=n(351),t.exports.chain=n(94),t.exports.clamp=n(352),t.exports.clone=n(353),t.exports.comparator=n(354),t.exports.complement=n(355),t.exports.compose=n(95),t.exports.composeK=n(144),t.exports.composeP=n(356),t.exports.concat=n(96),t.exports.cond=n(357),t.exports.construct=n(358),t.exports.constructN=n(145),t.exports.contains=n(359),t.exports.converge=n(146),t.exports.countBy=n(360),t.exports.curry=n(97),t.exports.curryN=n(5),t.exports.dec=n(361),t.exports.defaultTo=n(147),t.exports.descend=n(362),t.exports.difference=n(148),t.exports.differenceWith=n(149),t.exports.dissoc=n(150),t.exports.dissocPath=n(363),t.exports.divide=n(364),t.exports.drop=n(151),t.exports.dropLast=n(365),t.exports.dropLastWhile=n(366),t.exports.dropRepeats=n(367),t.exports.dropRepeatsWith=n(152),t.exports.dropWhile=n(368),t.exports.either=n(369),t.exports.empty=n(153),t.exports.endsWith=n(370),t.exports.eqBy=n(371),t.exports.eqProps=n(372),t.exports.equals=n(10),t.exports.evolve=n(373),t.exports.filter=n(98),t.exports.find=n(374),t.exports.findIndex=n(375),t.exports.findLast=n(376),t.exports.findLastIndex=n(377),t.exports.flatten=n(378),t.exports.flip=n(58),t.exports.forEach=n(379),t.exports.forEachObjIndexed=n(380),t.exports.fromPairs=n(381),t.exports.groupBy=n(382),t.exports.groupWith=n(383),t.exports.gt=n(384),t.exports.gte=n(385),t.exports.has=n(386),t.exports.hasIn=n(387),t.exports.head=n(388),t.exports.identical=n(154),t.exports.identity=n(99),t.exports.ifElse=n(389),t.exports.inc=n(390),t.exports.indexBy=n(392),t.exports.indexOf=n(393),t.exports.init=n(394),t.exports.innerJoin=n(395),t.exports.insert=n(396),t.exports.insertAll=n(397),t.exports.intersection=n(433),t.exports.intersperse=n(434),t.exports.into=n(435),t.exports.invert=n(436),t.exports.invertObj=n(437),t.exports.invoker=n(42),t.exports.is=n(166),t.exports.isEmpty=n(438),t.exports.isNil=n(167),t.exports.join=n(439),t.exports.juxt=n(168),t.exports.keys=n(19),t.exports.keysIn=n(440),t.exports.last=n(169),t.exports.lastIndexOf=n(441),t.exports.length=n(170),t.exports.lens=n(65),t.exports.lensIndex=n(442),t.exports.lensPath=n(443),t.exports.lensProp=n(444),t.exports.lift=n(66),t.exports.liftN=n(171),t.exports.lt=n(445),t.exports.lte=n(446),t.exports.map=n(8),t.exports.mapAccum=n(447),t.exports.mapAccumRight=n(448),t.exports.mapObjIndexed=n(449),t.exports.match=n(450),t.exports.mathMod=n(451),t.exports.max=n(35),t.exports.maxBy=n(452),t.exports.mean=n(172),t.exports.median=n(453),t.exports.memoize=n(454),t.exports.memoizeWith=n(173),t.exports.merge=n(455),t.exports.mergeAll=n(456),t.exports.mergeDeepLeft=n(457),t.exports.mergeDeepRight=n(458),t.exports.mergeDeepWith=n(459),t.exports.mergeDeepWithKey=n(67),t.exports.mergeWith=n(460),t.exports.mergeWithKey=n(106),t.exports.min=n(461),t.exports.minBy=n(462),t.exports.modulo=n(463),t.exports.multiply=n(174),t.exports.nAry=n(68),t.exports.negate=n(464),t.exports.none=n(465),t.exports.not=n(175),t.exports.nth=n(43),t.exports.nthArg=n(466),t.exports.o=n(467),t.exports.objOf=n(176),t.exports.of=n(468),t.exports.omit=n(469),t.exports.once=n(470),t.exports.or=n(177),t.exports.over=n(178),t.exports.pair=n(471),t.exports.partial=n(472),t.exports.partialRight=n(473),t.exports.partition=n(474),t.exports.path=n(36),t.exports.pathEq=n(475),t.exports.pathOr=n(476),t.exports.pathSatisfies=n(477),t.exports.pick=n(478),t.exports.pickAll=n(179),t.exports.pickBy=n(479),t.exports.pipe=n(180),t.exports.pipeK=n(480),t.exports.pipeP=n(181),t.exports.pluck=n(44),t.exports.prepend=n(182),t.exports.product=n(481),t.exports.project=n(482),t.exports.prop=n(107),t.exports.propEq=n(483),t.exports.propIs=n(484),t.exports.propOr=n(485),t.exports.propSatisfies=n(486),t.exports.props=n(487),t.exports.range=n(488),t.exports.reduce=n(20),t.exports.reduceBy=n(69),t.exports.reduceRight=n(183),t.exports.reduceWhile=n(489),t.exports.reduced=n(490),t.exports.reject=n(70),t.exports.remove=n(184),t.exports.repeat=n(491),t.exports.replace=n(492),t.exports.reverse=n(71),t.exports.scan=n(493),t.exports.sequence=n(185),t.exports.set=n(494),t.exports.slice=n(15),t.exports.sort=n(495),t.exports.sortBy=n(496),t.exports.sortWith=n(497),t.exports.split=n(498),t.exports.splitAt=n(499),t.exports.splitEvery=n(500),t.exports.splitWhen=n(501),t.exports.startsWith=n(502),t.exports.subtract=n(503);t.exports.sum=n(186),t.exports.symmetricDifference=n(504),t.exports.symmetricDifferenceWith=n(505),t.exports.tail=n(108),t.exports.take=n(109),t.exports.takeLast=n(187),t.exports.takeLastWhile=n(506),t.exports.takeWhile=n(507),t.exports.tap=n(508),t.exports.test=n(509),t.exports.times=n(188),t.exports.toLower=n(510),t.exports.toPairs=n(511),t.exports.toPairsIn=n(512),t.exports.toString=n(45),t.exports.toUpper=n(513),t.exports.transduce=n(514),t.exports.transpose=n(515),t.exports.traverse=n(516),t.exports.trim=n(517),t.exports.tryCatch=n(518),t.exports.type=n(110),t.exports.unapply=n(519),t.exports.unary=n(520),t.exports.uncurryN=n(521),t.exports.unfold=n(522),t.exports.union=n(523),t.exports.unionWith=n(524),t.exports.uniq=n(111),t.exports.uniqBy=n(189),t.exports.uniqWith=n(190),t.exports.unless=n(525),t.exports.unnest=n(526),t.exports.until=n(527),t.exports.update=n(112),t.exports.useWith=n(191),t.exports.values=n(192),t.exports.valuesIn=n(528),t.exports.view=n(529),t.exports.when=n(530),t.exports.where=n(193),t.exports.whereEq=n(531),t.exports.without=n(532),t.exports.xprod=n(533),t.exports.zip=n(534),t.exports.zipObj=n(535),t.exports.zipWith=n(536);},function(t,e,n){var r=n(69),i=r(function(t,e){return e},null);t.exports=i;},function(t,e,n){var r=n(0),i=n(159),o=n(27),u=r(function(t,e){return"function"!=typeof e.indexOf||o(e)?i(e,t,0):e.indexOf(t)});t.exports=u;},function(t,e,n){var r=n(15),i=r(0,-1);t.exports=i;},function(t,e,n){var r=n(59),i=n(2),o=n(101),u=i(function(t,e,n){return o(function(e){return r(t,e,n)},e)});t.exports=u;},function(t,e,n){var r=n(2),i=r(function(t,e,n){t=t<n.length&&t>=0?t:n.length;var r=Array.prototype.slice.call(n,0);return r.splice(t,0,e),r});t.exports=i;},function(t,e,n){var r=n(2),i=r(function(t,e,n){return t=t<n.length&&t>=0?t:n.length,[].concat(Array.prototype.slice.call(n,0,t),e,Array.prototype.slice.call(n,t))});t.exports=i;},function(t,e,n){function r(t,e,n){var r,o=typeof t;switch(o){case"string":case"number":return 0===t&&1/t==-1/0?!!n._items["-0"]||(e&&(n._items["-0"]=!0),!1):null!==n._nativeSet?e?(r=n._nativeSet.size,n._nativeSet.add(t),n._nativeSet.size===r):n._nativeSet.has(t):o in n._items?t in n._items[o]||(e&&(n._items[o][t]=!0),!1):(e&&(n._items[o]={},n._items[o][t]=!0),!1);case"boolean":if(o in n._items){var u=t?1:0;return!!n._items[o][u]||(e&&(n._items[o][u]=!0),!1)}return e&&(n._items[o]=t?[!1,!0]:[!0,!1]),!1;case"function":return null!==n._nativeSet?e?(r=n._nativeSet.size,n._nativeSet.add(t),n._nativeSet.size===r):n._nativeSet.has(t):o in n._items?!!i(t,n._items[o])||(e&&n._items[o].push(t),!1):(e&&(n._items[o]=[t]),!1);case"undefined":return!!n._items[o]||(e&&(n._items[o]=!0),!1);case"object":if(null===t){ return!!n._items.null||(e&&(n._items.null=!0),!1); }default:return o=Object.prototype.toString.call(t),o in n._items?!!i(t,n._items[o])||(e&&n._items[o].push(t),!1):(e&&(n._items[o]=[t]),!1)}}var i=n(34),o=function(){function t(){this._nativeSet="function"==typeof Set?new Set:null,this._items={};}return t.prototype.add=function(t){return!r(t,!0,this)},t.prototype.has=function(t){return r(t,!1,this)},t}();t.exports=o;},function(t,e){function n(t,e){for(var n=0,r=e.length-(t-1),i=new Array(r>=0?r:0);n<r;){ i[n]=Array.prototype.slice.call(e,n,n+t),n+=1; }return i}t.exports=n;},function(t,e){function n(t){for(var e,n=[];!(e=t.next()).done;){ n.push(e.value); }return n}t.exports=n;},function(t,e,n){function r(t,e){return i(t<e.length?e.length-t:0,e)}var i=n(109);t.exports=r;},function(t,e,n){function r(t,e){for(var n=e.length-1;n>=0&&t(e[n]);){ n-=1; }return i(0,n+1,e)}var i=n(15);t.exports=r;},function(t,e,n){function r(t,e,n,r){function a(t,e){return i(t,e,n.slice(),r.slice())}var s=o(t),c=o(e);return!u(function(t,e){return!u(a,e,t)},c,s)}function i(t,e,n,o){if(c(t,e)){ return!0; }var u=l(t);if(u!==l(e)){ return!1; }if(null==t||null==e){ return!1; }if("function"==typeof t["fantasy-land/equals"]||"function"==typeof e["fantasy-land/equals"]){ return"function"==typeof t["fantasy-land/equals"]&&t["fantasy-land/equals"](e)&&"function"==typeof e["fantasy-land/equals"]&&e["fantasy-land/equals"](t); }if("function"==typeof t.equals||"function"==typeof e.equals){ return"function"==typeof t.equals&&t.equals(e)&&"function"==typeof e.equals&&e.equals(t); }switch(u){case"Arguments":case"Array":case"Object":if("function"==typeof t.constructor&&"Promise"===a(t.constructor)){ return t===e; }break;case"Boolean":case"Number":case"String":if(typeof t!=typeof e||!c(t.valueOf(),e.valueOf())){ return!1; }break;case"Date":if(!c(t.valueOf(),e.valueOf())){ return!1; }break;case"Error":return t.name===e.name&&t.message===e.message;case"RegExp":if(t.source!==e.source||t.global!==e.global||t.ignoreCase!==e.ignoreCase||t.multiline!==e.multiline||t.sticky!==e.sticky||t.unicode!==e.unicode){ return!1 }}for(var p=n.length-1;p>=0;){if(n[p]===t){ return o[p]===e; }p-=1;}switch(u){case"Map":return t.size===e.size&&r(t.entries(),e.entries(),n.concat([t]),o.concat([e]));case"Set":return t.size===e.size&&r(t.values(),e.values(),n.concat([t]),o.concat([e]));case"Arguments":case"Array":case"Object":case"Boolean":case"Number":case"String":case"Date":case"Error":case"RegExp":case"Int8Array":case"Uint8Array":case"Uint8ClampedArray":case"Int16Array":case"Uint16Array":case"Int32Array":case"Uint32Array":case"Float32Array":case"Float64Array":case"ArrayBuffer":break;default:return!1}var h=f(t);if(h.length!==f(e).length){ return!1; }var d=n.concat([t]),v=o.concat([e]);for(p=h.length-1;p>=0;){var g=h[p];if(!s(g,e)||!i(e[g],t[g],d,v)){ return!1; }p-=1;}return!0}var o=n(400),u=n(59),a=n(406),s=n(7),c=n(154),f=n(19),l=n(110);t.exports=i;},function(t,e,n){var r=n(405),i=n(61),o=n(11),u=n(4),a=function(t){return{"@@transducer/init":u.init,"@@transducer/result":function(e){return t["@@transducer/result"](e)},"@@transducer/step":function(e,n){var i=t["@@transducer/step"](e,n);return i["@@transducer/reduced"]?r(i):i}}},s=function(t){var e=a(t);return{"@@transducer/init":u.init,"@@transducer/result":function(t){return e["@@transducer/result"](t)},"@@transducer/step":function(t,n){return i(n)?o(e,t,n):o(e,t,[n])}}};t.exports=s;},function(t,e){function n(t){return{"@@transducer/value":t,"@@transducer/reduced":!0}}t.exports=n;},function(t,e){function n(t){var e=String(t).match(/^function (\w*)/);return null==e?"":e[1]}t.exports=n;},function(t,e){function n(t){return"[object RegExp]"===Object.prototype.toString.call(t)}t.exports=n;},function(t,e,n){function r(t){
var arguments$1 = arguments;
if(null==t){ throw new TypeError("Cannot convert undefined or null to object"); }for(var e=Object(t),n=1,r=arguments.length;n<r;){var o=arguments$1[n];if(null!=o){ for(var u in o){ i(u,o)&&(e[u]=o[u]); } }n+=1;}return e}var i=n(7);t.exports=r;},function(t,e){function n(t){return[t]}t.exports=n;},function(t,e){function n(t,e){return function(){return e.call(this,t.apply(this,arguments))}}t.exports=n;},function(t,e){function n(t,e){return function(){var n=this;return t.apply(n,arguments).then(function(t){return e.call(n,t)})}}t.exports=n;},function(t,e){function n(t){return'"'+t.replace(/\\/g,"\\\\").replace(/[\b]/g,"\\b").replace(/\f/g,"\\f").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t").replace(/\v/g,"\\v").replace(/\0/g,"\\0").replace(/"/g,'\\"')+'"'}t.exports=n;},function(t,e,n){function r(t){if(a(t)){ return t; }if(u(t)){ return c; }if("string"==typeof t){ return f; }if("object"==typeof t){ return l; }throw new Error("Cannot create transformer for "+t)}var i=n(100),o=n(102),u=n(61),a=n(105),s=n(176),c={"@@transducer/init":Array,"@@transducer/step":function(t,e){return t.push(e),t},"@@transducer/result":o},f={"@@transducer/init":String,"@@transducer/step":function(t,e){return t+e},"@@transducer/result":o},l={"@@transducer/init":Object,"@@transducer/step":function(t,e){return i(t,u(e)?s(e[0],e[1]):e)},"@@transducer/result":o};t.exports=r;},function(t,e){var n=function(t){return(t<10?"0":"")+t},r="function"==typeof Date.prototype.toISOString?function(t){return t.toISOString()}:function(t){return t.getUTCFullYear()+"-"+n(t.getUTCMonth()+1)+"-"+n(t.getUTCDate())+"T"+n(t.getUTCHours())+":"+n(t.getUTCMinutes())+":"+n(t.getUTCSeconds())+"."+(t.getUTCMilliseconds()/1e3).toFixed(3).slice(2,5)+"Z"};t.exports=r;},function(t,e,n){function r(t,e){var n=function(n){var o=e.concat([t]);return i(n,o)?"<Circular>":r(n,o)},f=function(t,e){return o(function(e){return u(e)+": "+n(t[e])},e.slice().sort())};switch(Object.prototype.toString.call(t)){case"[object Arguments]":return"(function() { return arguments; }("+o(n,t).join(", ")+"))";case"[object Array]":return"["+o(n,t).concat(f(t,c(function(t){return/^\d+$/.test(t)},s(t)))).join(", ")+"]";case"[object Boolean]":return"object"==typeof t?"new Boolean("+n(t.valueOf())+")":t.toString();case"[object Date]":return"new Date("+(isNaN(t.valueOf())?n(NaN):u(a(t)))+")";case"[object Null]":return"null";case"[object Number]":return"object"==typeof t?"new Number("+n(t.valueOf())+")":1/t==-1/0?"-0":t.toString(10);case"[object String]":return"object"==typeof t?"new String("+n(t.valueOf())+")":u(t);case"[object Undefined]":return"undefined";default:if("function"==typeof t.toString){var l=t.toString();if("[object Object]"!==l){ return l }}return"{"+f(t,s(t)).join(", ")+"}"}}var i=n(34),o=n(64),u=n(412),a=n(414),s=n(19),c=n(70);t.exports=r;},function(t,e,n){var r=n(0),i=n(28),o=n(4),u=function(){function t(t,e){this.xf=e,this.f=t,this.all=!0;}return t.prototype["@@transducer/init"]=o.init,t.prototype["@@transducer/result"]=function(t){return this.all&&(t=this.xf["@@transducer/step"](t,!0)),this.xf["@@transducer/result"](t)},t.prototype["@@transducer/step"]=function(t,e){return this.f(e)||(this.all=!1,t=i(this.xf["@@transducer/step"](t,!1))),t},t}(),a=r(function(t,e){return new u(t,e)});t.exports=a;},function(t,e,n){var r=n(14),i=n(0),o=n(4),u=function(){function t(t,e){this.xf=e,this.pos=0,this.full=!1,this.acc=new Array(t);}return t.prototype["@@transducer/init"]=o.init,t.prototype["@@transducer/result"]=function(t){return this.acc=null,this.xf["@@transducer/result"](t)},t.prototype["@@transducer/step"]=function(t,e){return this.store(e),this.full?this.xf["@@transducer/step"](t,this.getCopy()):t},t.prototype.store=function(t){this.acc[this.pos]=t,this.pos+=1,this.pos===this.acc.length&&(this.pos=0,this.full=!0);},t.prototype.getCopy=function(){return r(Array.prototype.slice.call(this.acc,this.pos),Array.prototype.slice.call(this.acc,0,this.pos))},t}(),a=i(function(t,e){return new u(t,e)});t.exports=a;},function(t,e,n){var r=n(0),i=n(404),o=n(8),u=r(function(t,e){return o(t,i(e))});t.exports=u;},function(t,e,n){var r=n(0),i=n(4),o=function(){function t(t,e){this.xf=e,this.n=t;}return t.prototype["@@transducer/init"]=i.init,t.prototype["@@transducer/result"]=i.result,t.prototype["@@transducer/step"]=function(t,e){return this.n>0?(this.n-=1,t):this.xf["@@transducer/step"](t,e)},t}(),u=r(function(t,e){return new o(t,e)});t.exports=u;},function(t,e,n){var r=n(0),i=n(4),o=function(){function t(t,e){this.xf=e,this.pos=0,this.full=!1,this.acc=new Array(t);}return t.prototype["@@transducer/init"]=i.init,t.prototype["@@transducer/result"]=function(t){return this.acc=null,this.xf["@@transducer/result"](t)},t.prototype["@@transducer/step"]=function(t,e){return this.full&&(t=this.xf["@@transducer/step"](t,this.acc[this.pos])),this.store(e),t},t.prototype.store=function(t){this.acc[this.pos]=t,this.pos+=1,this.pos===this.acc.length&&(this.pos=0,this.full=!0);},t}(),u=r(function(t,e){return new o(t,e)});t.exports=u;},function(t,e,n){var r=n(0),i=n(11),o=n(4),u=function(){function t(t,e){this.f=t,this.retained=[],this.xf=e;}return t.prototype["@@transducer/init"]=o.init,t.prototype["@@transducer/result"]=function(t){return this.retained=null,this.xf["@@transducer/result"](t)},t.prototype["@@transducer/step"]=function(t,e){return this.f(e)?this.retain(t,e):this.flush(t,e)},t.prototype.flush=function(t,e){return t=i(this.xf["@@transducer/step"],t,this.retained),this.retained=[],this.xf["@@transducer/step"](t,e)},t.prototype.retain=function(t,e){return this.retained.push(e),t},t}(),a=r(function(t,e){return new u(t,e)});t.exports=a;},function(t,e,n){var r=n(0),i=n(4),o=function(){function t(t,e){this.xf=e,this.f=t;}return t.prototype["@@transducer/init"]=i.init,t.prototype["@@transducer/result"]=i.result,t.prototype["@@transducer/step"]=function(t,e){if(this.f){if(this.f(e)){ return t; }this.f=null;}return this.xf["@@transducer/step"](t,e)},t}(),u=r(function(t,e){return new o(t,e)});t.exports=u;},function(t,e,n){var r=n(0),i=n(4),o=function(){function t(t,e){this.xf=e,this.f=t;}return t.prototype["@@transducer/init"]=i.init,t.prototype["@@transducer/result"]=i.result,t.prototype["@@transducer/step"]=function(t,e){return this.f(e)?this.xf["@@transducer/step"](t,e):t},t}(),u=r(function(t,e){return new o(t,e)});t.exports=u;},function(t,e,n){var r=n(0),i=n(28),o=n(4),u=function(){function t(t,e){this.xf=e,this.f=t,this.found=!1;}return t.prototype["@@transducer/init"]=o.init,t.prototype["@@transducer/result"]=function(t){return this.found||(t=this.xf["@@transducer/step"](t,void 0)),this.xf["@@transducer/result"](t)},t.prototype["@@transducer/step"]=function(t,e){return this.f(e)&&(this.found=!0,t=i(this.xf["@@transducer/step"](t,e))),t},t}(),a=r(function(t,e){return new u(t,e)});t.exports=a;},function(t,e,n){var r=n(0),i=n(28),o=n(4),u=function(){function t(t,e){this.xf=e,this.f=t,this.idx=-1,this.found=!1;}return t.prototype["@@transducer/init"]=o.init,t.prototype["@@transducer/result"]=function(t){return this.found||(t=this.xf["@@transducer/step"](t,-1)),this.xf["@@transducer/result"](t)},t.prototype["@@transducer/step"]=function(t,e){return this.idx+=1,this.f(e)&&(this.found=!0,t=i(this.xf["@@transducer/step"](t,this.idx))),t},t}(),a=r(function(t,e){return new u(t,e)});t.exports=a;},function(t,e,n){var r=n(0),i=n(4),o=function(){function t(t,e){this.xf=e,this.f=t;}return t.prototype["@@transducer/init"]=i.init,t.prototype["@@transducer/result"]=function(t){return this.xf["@@transducer/result"](this.xf["@@transducer/step"](t,this.last))},t.prototype["@@transducer/step"]=function(t,e){return this.f(e)&&(this.last=e),t},t}(),u=r(function(t,e){return new o(t,e)});t.exports=u;},function(t,e,n){var r=n(0),i=n(4),o=function(){function t(t,e){this.xf=e,this.f=t,this.idx=-1,this.lastIdx=-1;}return t.prototype["@@transducer/init"]=i.init,t.prototype["@@transducer/result"]=function(t){return this.xf["@@transducer/result"](this.xf["@@transducer/step"](t,this.lastIdx))},t.prototype["@@transducer/step"]=function(t,e){return this.idx+=1,this.f(e)&&(this.lastIdx=this.idx),t},t}(),u=r(function(t,e){return new o(t,e)});t.exports=u;},function(t,e,n){var r=n(0),i=n(4),o=function(){function t(t,e){this.xf=e,this.f=t;}return t.prototype["@@transducer/init"]=i.init,t.prototype["@@transducer/result"]=i.result,t.prototype["@@transducer/step"]=function(t,e){return this.xf["@@transducer/step"](t,this.f(e))},t}(),u=r(function(t,e){return new o(t,e)});t.exports=u;},function(t,e,n){var r=n(60),i=n(7),o=n(4),u=function(){function t(t,e,n,r){this.valueFn=t,this.valueAcc=e,this.keyFn=n,this.xf=r,this.inputs={};}return t.prototype["@@transducer/init"]=o.init,t.prototype["@@transducer/result"]=function(t){
var this$1 = this;
var e;for(e in this$1.inputs){ if(i(e,this$1.inputs)&&(t=this$1.xf["@@transducer/step"](t,this$1.inputs[e]),t["@@transducer/reduced"])){t=t["@@transducer/value"];break} }return this.inputs=null,this.xf["@@transducer/result"](t)},t.prototype["@@transducer/step"]=function(t,e){var n=this.keyFn(e);return this.inputs[n]=this.inputs[n]||[n,this.valueAcc],this.inputs[n][1]=this.valueFn(this.inputs[n][1],e),t},t}(),a=r(4,[],function(t,e,n,r){return new u(t,e,n,r)});t.exports=a;},function(t,e,n){var r=n(0),i=n(28),o=n(4),u=function(){function t(t,e){this.xf=e,this.n=t,this.i=0;}return t.prototype["@@transducer/init"]=o.init,t.prototype["@@transducer/result"]=o.result,t.prototype["@@transducer/step"]=function(t,e){this.i+=1;var n=0===this.n?t:this.xf["@@transducer/step"](t,e);return this.n>=0&&this.i>=this.n?i(n):n},t}(),a=r(function(t,e){return new u(t,e)});t.exports=a;},function(t,e,n){var r=n(0),i=n(28),o=n(4),u=function(){function t(t,e){this.xf=e,this.f=t;}return t.prototype["@@transducer/init"]=o.init,t.prototype["@@transducer/result"]=o.result,t.prototype["@@transducer/step"]=function(t,e){return this.f(e)?this.xf["@@transducer/step"](t,e):i(t)},t}(),a=r(function(t,e){return new u(t,e)});t.exports=a;},function(t,e,n){var r=n(0),i=n(4),o=function(){function t(t,e){this.xf=e,this.f=t;}return t.prototype["@@transducer/init"]=i.init,t.prototype["@@transducer/result"]=i.result,t.prototype["@@transducer/step"]=function(t,e){return this.f(e),this.xf["@@transducer/step"](t,e)},t}(),u=r(function(t,e){return new o(t,e)});t.exports=u;},function(t,e,n){var r=n(34),i=n(0),o=n(101),u=n(58),a=n(111),s=i(function(t,e){var n,i;return t.length>e.length?(n=t,i=e):(n=e,i=t),a(o(u(r)(n),i))});t.exports=s;},function(t,e,n){var r=n(40),i=n(0),o=i(r("intersperse",function(t,e){for(var n=[],r=0,i=e.length;r<i;){ r===i-1?n.push(e[r]):n.push(e[r],t),r+=1; }return n}));t.exports=o;},function(t,e,n){var r=n(155),i=n(2),o=n(105),u=n(11),a=n(413),s=i(function(t,e,n){return o(t)?u(e(t),t["@@transducer/init"](),n):u(e(a(t)),r(t,[],[],!1),n)});t.exports=s;},function(t,e,n){var r=n(1),i=n(7),o=n(19),u=r(function(t){for(var e=o(t),n=e.length,r=0,u={};r<n;){var a=e[r],s=t[a],c=i(s,u)?u[s]:u[s]=[];c[c.length]=a,r+=1;}return u});t.exports=u;},function(t,e,n){var r=n(1),i=n(19),o=r(function(t){for(var e=i(t),n=e.length,r=0,o={};r<n;){var u=e[r];o[t[u]]=u,r+=1;}return o});t.exports=o;},function(t,e,n){var r=n(1),i=n(153),o=n(10),u=r(function(t){return null!=t&&o(t,i(t))});t.exports=u;},function(t,e,n){var r=n(42),i=r(1,"join");t.exports=i;},function(t,e,n){var r=n(1),i=r(function(t){var e,n=[];for(e in t){ n[n.length]=e; }return n});t.exports=i;},function(t,e,n){var r=n(0),i=n(27),o=n(10),u=r(function(t,e){if("function"!=typeof e.lastIndexOf||i(e)){for(var n=e.length-1;n>=0;){if(o(e[n],t)){ return n; }n-=1;}return-1}return e.lastIndexOf(t)});t.exports=u;},function(t,e,n){var r=n(1),i=n(65),o=n(43),u=n(112),a=r(function(t){return i(o(t),u(t))});t.exports=a;},function(t,e,n){var r=n(1),i=n(142),o=n(65),u=n(36),a=r(function(t){return o(u(t),i(t))});t.exports=a;},function(t,e,n){var r=n(1),i=n(57),o=n(65),u=n(107),a=r(function(t){return o(u(t),i(t))});t.exports=a;},function(t,e,n){var r=n(0),i=r(function(t,e){return t<e});t.exports=i;},function(t,e,n){var r=n(0),i=r(function(t,e){return t<=e});t.exports=i;},function(t,e,n){var r=n(2),i=r(function(t,e,n){for(var r=0,i=n.length,o=[],u=[e];r<i;){ u=t(u[0],n[r]),o[r]=u[1],r+=1; }return[u[0],o]});t.exports=i;},function(t,e,n){var r=n(2),i=r(function(t,e,n){for(var r=n.length-1,i=[],o=[e];r>=0;){ o=t(n[r],o[0]),i[r]=o[1],r-=1; }return[i,o[0]]});t.exports=i;},function(t,e,n){var r=n(0),i=n(11),o=n(19),u=r(function(t,e){return i(function(n,r){return n[r]=t(e[r],r,e),n},{},o(e))});t.exports=u;},function(t,e,n){var r=n(0),i=r(function(t,e){return e.match(t)||[]});t.exports=i;},function(t,e,n){var r=n(0),i=n(103),o=r(function(t,e){return i(t)?!i(e)||e<1?NaN:(t%e+e)%e:NaN});t.exports=o;},function(t,e,n){var r=n(2),i=r(function(t,e,n){return t(n)>t(e)?n:e});t.exports=i;},function(t,e,n){var r=n(1),i=n(172),o=r(function(t){var e=t.length;if(0===e){ return NaN; }var n=2-e%2,r=(e-n)/2;return i(Array.prototype.slice.call(t,0).sort(function(t,e){return t<e?-1:t>e?1:0}).slice(r,r+n))});t.exports=o;},function(t,e,n){var r=n(173),i=n(45),o=r(function(){return i(arguments)});t.exports=o;},function(t,e,n){var r=n(100),i=n(0),o=i(function(t,e){return r({},t,e)});t.exports=o;},function(t,e,n){var r=n(100),i=n(1),o=i(function(t){return r.apply(null,[{}].concat(t))});t.exports=o;},function(t,e,n){var r=n(0),i=n(67),o=r(function(t,e){return i(function(t,e,n){return e},t,e)});t.exports=o;},function(t,e,n){var r=n(0),i=n(67),o=r(function(t,e){return i(function(t,e,n){return n},t,e)});t.exports=o;},function(t,e,n){var r=n(2),i=n(67),o=r(function(t,e,n){return i(function(e,n,r){return t(n,r)},e,n)});t.exports=o;},function(t,e,n){var r=n(2),i=n(106),o=r(function(t,e,n){return i(function(e,n,r){return t(n,r)},e,n)});t.exports=o;},function(t,e,n){var r=n(0),i=r(function(t,e){return e<t?e:t});t.exports=i;},function(t,e,n){var r=n(2),i=r(function(t,e,n){return t(n)<t(e)?n:e});t.exports=i;},function(t,e,n){var r=n(0),i=r(function(t,e){return t%e});t.exports=i;},function(t,e,n){var r=n(1),i=r(function(t){return-t});t.exports=i;},function(t,e,n){var r=n(157),i=n(0),o=n(3),u=n(163),a=n(140),s=i(r(o(["any"],u,a)));t.exports=s;},function(t,e,n){var r=n(1),i=n(5),o=n(43),u=r(function(t){return i(t<0?1:t+1,function(){return o(t,arguments)})});t.exports=u;},function(t,e,n){var r=n(2),i=r(function(t,e,n){return t(e(n))});t.exports=i;},function(t,e,n){var r=n(1),i=n(409),o=r(i);t.exports=o;},function(t,e,n){var r=n(0),i=r(function(t,e){for(var n={},r={},i=0,o=t.length;i<o;){ r[t[i]]=1,i+=1; }for(var u in e){ r.hasOwnProperty(u)||(n[u]=e[u]); }return n});t.exports=i;},function(t,e,n){var r=n(18),i=n(1),o=i(function(t){var e,n=!1;return r(t.length,function(){return n?e:(n=!0,e=t.apply(this,arguments))})});t.exports=o;},function(t,e,n){var r=n(0),i=r(function(t,e){return[t,e]});t.exports=i;},function(t,e,n){var r=n(14),i=n(158),o=i(r);t.exports=o;},function(t,e,n){var r=n(14),i=n(158),o=n(58),u=i(o(r));t.exports=u;},function(t,e,n){var r=n(98),i=n(168),o=n(70),u=i([r,o]);t.exports=u;},function(t,e,n){var r=n(2),i=n(10),o=n(36),u=r(function(t,e,n){return i(o(t,n),e)});t.exports=u;},function(t,e,n){var r=n(2),i=n(147),o=n(36),u=r(function(t,e,n){return i(t,o(e,n))});t.exports=u;},function(t,e,n){var r=n(2),i=n(36),o=r(function(t,e,n){return e.length>0&&t(i(e,n))});t.exports=o;},function(t,e,n){var r=n(0),i=r(function(t,e){for(var n={},r=0;r<t.length;){ t[r]in e&&(n[t[r]]=e[t[r]]),r+=1; }return n});t.exports=i;},function(t,e,n){var r=n(0),i=r(function(t,e){var n={};for(var r in e){ t(e[r],r,e)&&(n[r]=e[r]); }return n});t.exports=i;},function(t,e,n){function r(){if(0===arguments.length){ throw new Error("pipeK requires at least one argument"); }return i.apply(this,o(arguments))}var i=n(144),o=n(71);t.exports=r;},function(t,e,n){var r=n(174),i=n(20),o=i(r,1);t.exports=o;},function(t,e,n){var r=n(64),i=n(99),o=n(179),u=n(191),a=u(r,[o,i]);t.exports=a;},function(t,e,n){var r=n(2),i=n(10),o=r(function(t,e,n){return i(e,n[t])});t.exports=o;},function(t,e,n){var r=n(2),i=n(166),o=r(function(t,e,n){return i(t,n[e])});t.exports=o;},function(t,e,n){var r=n(2),i=n(7),o=r(function(t,e,n){return null!=n&&i(e,n)?n[e]:t});t.exports=o;},function(t,e,n){var r=n(2),i=r(function(t,e,n){return t(n[e])});t.exports=i;},function(t,e,n){var r=n(0),i=r(function(t,e){for(var n=t.length,r=[],i=0;i<n;){ r[i]=e[t[i]],i+=1; }return r});t.exports=i;},function(t,e,n){var r=n(0),i=n(161),o=r(function(t,e){if(!i(t)||!i(e)){ throw new TypeError("Both arguments to range must be numbers"); }for(var n=[],r=t;r<e;){ n.push(r),r+=1; }return n});t.exports=o;},function(t,e,n){var r=n(60),i=n(11),o=n(28),u=r(4,[],function(t,e,n,r){return i(function(n,r){return t(n,r)?e(n,r):o(n)},n,r)});t.exports=u;},function(t,e,n){var r=n(1),i=n(28),o=r(i);t.exports=o;},function(t,e,n){var r=n(0),i=n(33),o=n(188),u=r(function(t,e){return o(i(t),e)});t.exports=u;},function(t,e,n){var r=n(2),i=r(function(t,e,n){return n.replace(t,e)});t.exports=i;},function(t,e,n){var r=n(2),i=r(function(t,e,n){for(var r=0,i=n.length,o=[e];r<i;){ e=t(e,n[r]),o[r+1]=e,r+=1; }return o});t.exports=i;},function(t,e,n){var r=n(2),i=n(33),o=n(178),u=r(function(t,e,n){return o(t,i(e),n)});t.exports=u;},function(t,e,n){var r=n(0),i=r(function(t,e){return Array.prototype.slice.call(e,0).sort(t)});t.exports=i;},function(t,e,n){var r=n(0),i=r(function(t,e){return Array.prototype.slice.call(e,0).sort(function(e,n){var r=t(e),i=t(n);return r<i?-1:r>i?1:0})});t.exports=i;},function(t,e,n){var r=n(0),i=r(function(t,e){return Array.prototype.slice.call(e,0).sort(function(e,n){for(var r=0,i=0;0===r&&i<t.length;){ r=t[i](e,n),i+=1; }return r})});t.exports=i;},function(t,e,n){var r=n(42),i=r(1,"split");t.exports=i;},function(t,e,n){var r=n(0),i=n(170),o=n(15),u=r(function(t,e){return[o(0,t,e),o(t,i(e),e)]});t.exports=u;},function(t,e,n){var r=n(0),i=n(15),o=r(function(t,e){if(t<=0){ throw new Error("First argument to splitEvery must be a positive integer"); }for(var n=[],r=0;r<e.length;){ n.push(i(r,r+=t,e)); }return n});t.exports=o;},function(t,e,n){var r=n(0),i=r(function(t,e){for(var n=0,r=e.length,i=[];n<r&&!t(e[n]);){ i.push(e[n]),n+=1; }return[i,Array.prototype.slice.call(e,n)]});t.exports=i;},function(t,e,n){var r=n(0),i=n(10),o=n(109),u=r(function(t,e){return i(o(t.length,e),t)});t.exports=u;},function(t,e,n){var r=n(0),i=r(function(t,e){return Number(t)-Number(e)});t.exports=i;},function(t,e,n){var r=n(0),i=n(96),o=n(148),u=r(function(t,e){return i(o(t,e),o(e,t))});t.exports=u;},function(t,e,n){var r=n(2),i=n(96),o=n(149),u=r(function(t,e,n){return i(o(t,e,n),o(t,n,e))});t.exports=u;},function(t,e,n){var r=n(0),i=n(15),o=r(function(t,e){for(var n=e.length-1;n>=0&&t(e[n]);){ n-=1; }return i(n+1,1/0,e)});t.exports=o;},function(t,e,n){var r=n(0),i=n(3),o=n(431),u=n(15),a=r(i(["takeWhile"],o,function(t,e){for(var n=0,r=e.length;n<r&&t(e[n]);){ n+=1; }return u(0,n,e)}));t.exports=a;},function(t,e,n){var r=n(0),i=n(3),o=n(432),u=r(i([],o,function(t,e){return t(e),e}));t.exports=u;},function(t,e,n){var r=n(156),i=n(0),o=n(407),u=n(45),a=i(function(t,e){if(!o(t)){ throw new TypeError("‘test’ requires a value of type RegExp as its first argument; received "+u(t)); }return r(t).test(e)});t.exports=a;},function(t,e,n){var r=n(42),i=r(0,"toLowerCase");t.exports=i;},function(t,e,n){var r=n(1),i=n(7),o=r(function(t){var e=[];for(var n in t){ i(n,t)&&(e[e.length]=[n,t[n]]); }return e});t.exports=o;},function(t,e,n){var r=n(1),i=r(function(t){var e=[];for(var n in t){ e[e.length]=[n,t[n]]; }return e});t.exports=i;},function(t,e,n){var r=n(42),i=r(0,"toUpperCase");t.exports=i;},function(t,e,n){var r=n(11),i=n(165),o=n(5),u=o(4,function(t,e,n,o){return r(t("function"==typeof e?i(e):e),n,o)});t.exports=u;},function(t,e,n){var r=n(1),i=r(function(t){for(var e=0,n=[];e<t.length;){for(var r=t[e],i=0;i<r.length;){ void 0===n[i]&&(n[i]=[]),n[i].push(r[i]),i+=1; }e+=1;}return n});t.exports=i;},function(t,e,n){var r=n(2),i=n(8),o=n(185),u=r(function(t,e,n){return"function"==typeof n["fantasy-land/traverse"]?n["fantasy-land/traverse"](e,t):o(t,i(e,n))});t.exports=u;},function(t,e,n){var r=n(1),i="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff",o="​",u="function"==typeof String.prototype.trim,a=u&&!i.trim()&&o.trim()?function(t){return t.trim()}:function(t){var e=new RegExp("^["+i+"]["+i+"]*"),n=new RegExp("["+i+"]["+i+"]*$");return t.replace(e,"").replace(n,"")},s=r(a);t.exports=s;},function(t,e,n){var r=n(18),i=n(14),o=n(0),u=o(function(t,e){return r(t.length,function(){try{return t.apply(this,arguments)}catch(t){return e.apply(this,i([t],arguments))}})});t.exports=u;},function(t,e,n){var r=n(1),i=r(function(t){return function(){return t(Array.prototype.slice.call(arguments,0))}});t.exports=i;},function(t,e,n){var r=n(1),i=n(68),o=r(function(t){return i(1,t)});t.exports=o;},function(t,e,n){var r=n(0),i=n(5),o=r(function(t,e){return i(t,function(){
var arguments$1 = arguments;
var this$1 = this;
for(var n,r=1,i=e,o=0;r<=t&&"function"==typeof i;){ n=r===t?arguments$1.length:o+i.length,i=i.apply(this$1,Array.prototype.slice.call(arguments$1,o,n)),r+=1,o=n; }return i})});t.exports=o;},function(t,e,n){var r=n(0),i=r(function(t,e){for(var n=t(e),r=[];n&&n.length;){ r[r.length]=n[0],n=t(n[1]); }return r});t.exports=i;},function(t,e,n){var r=n(14),i=n(0),o=n(95),u=n(111),a=i(o(u,r));t.exports=a;},function(t,e,n){var r=n(14),i=n(2),o=n(190),u=i(function(t,e,n){return o(t,r(e,n))});t.exports=u;},function(t,e,n){var r=n(2),i=r(function(t,e,n){return t(n)?n:e(n)});t.exports=i;},function(t,e,n){var r=n(102),i=n(94),o=i(r);t.exports=o;},function(t,e,n){var r=n(2),i=r(function(t,e,n){for(var r=n;!t(r);){ r=e(r); }return r});t.exports=i;},function(t,e,n){var r=n(1),i=r(function(t){var e,n=[];for(e in t){ n[n.length]=t[e]; }return n});t.exports=i;},function(t,e,n){var r=n(0),i=function(t){return{value:t,"fantasy-land/map":function(){return this}}},o=r(function(t,e){return t(i)(e).value});t.exports=o;},function(t,e,n){var r=n(2),i=r(function(t,e,n){return t(n)?e(n):n});t.exports=i;},function(t,e,n){var r=n(0),i=n(10),o=n(8),u=n(193),a=r(function(t,e){return u(o(i,t),e)});t.exports=a;},function(t,e,n){var r=n(34),i=n(0),o=n(58),u=n(70),a=i(function(t,e){return u(o(r)(t),e)});t.exports=a;},function(t,e,n){var r=n(0),i=r(function(t,e){for(var n,r=0,i=t.length,o=e.length,u=[];r<i;){for(n=0;n<o;){ u[u.length]=[t[r],e[n]],n+=1; }r+=1;}return u});t.exports=i;},function(t,e,n){var r=n(0),i=r(function(t,e){for(var n=[],r=0,i=Math.min(t.length,e.length);r<i;){ n[r]=[t[r],e[r]],r+=1; }return n});t.exports=i;},function(t,e,n){var r=n(0),i=r(function(t,e){for(var n=0,r=Math.min(t.length,e.length),i={};n<r;){ i[t[n]]=e[n],n+=1; }return i});t.exports=i;},function(t,e,n){var r=n(2),i=r(function(t,e,n){for(var r=[],i=0,o=Math.min(e.length,n.length);i<o;){ r[i]=t(e[i],n[i]),i+=1; }return r});t.exports=i;},function(t,e,n){var r,i;(function(){function n(t){function e(e,n,r,i,o,u){for(;o>=0&&o<u;o+=t){var a=i?i[o]:o;r=n(r,e[a],a,e);}return r}return function(n,r,i,o){r=S(r,o,4);var u=!C(n)&&_.keys(n),a=(u||n).length,s=t>0?0:a-1;return arguments.length<3&&(i=n[u?u[s]:s],s+=t),e(n,r,i,u,s,a)}}function o(t){return function(e,n,r){n=A(n,r);for(var i=j(e),o=t>0?0:i-1;o>=0&&o<i;o+=t){ if(n(e[o],o,e)){ return o; } }return-1}}function u(t,e,n){return function(r,i,o){var u=0,a=j(r);if("number"==typeof o){ t>0?u=o>=0?o:Math.max(o+a,u):a=o>=0?Math.min(o+1,a):o+a+1; }else if(n&&o&&a){ return o=n(r,i),r[o]===i?o:-1; }if(i!==i){ return o=e(d.call(r,u,a),_.isNaN),o>=0?o+u:-1; }for(o=t>0?u:a-1;o>=0&&o<a;o+=t){ if(r[o]===i){ return o; } }return-1}}function a(t,e){var n=q.length,r=t.constructor,i=_.isFunction(r)&&r.prototype||l,o="constructor";for(_.has(t,o)&&!_.contains(e,o)&&e.push(o);n--;){ (o=q[n])in t&&t[o]!==i[o]&&!_.contains(e,o)&&e.push(o); }}var s=this,c=s._,f=Array.prototype,l=Object.prototype,p=Function.prototype,h=f.push,d=f.slice,v=l.toString,g=l.hasOwnProperty,y=Array.isArray,m=Object.keys,x=p.bind,w=Object.create,b=function(){},_=function(t){return t instanceof _?t:this instanceof _?void(this._wrapped=t):new _(t)};void 0!==t&&t.exports&&(e=t.exports=_),e._=_,_.VERSION="1.8.3";var S=function(t,e,n){if(void 0===e){ return t; }switch(null==n?3:n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,r){return t.call(e,n,r)};case 3:return function(n,r,i){return t.call(e,n,r,i)};case 4:return function(n,r,i,o){return t.call(e,n,r,i,o)}}return function(){return t.apply(e,arguments)}},A=function(t,e,n){return null==t?_.identity:_.isFunction(t)?S(t,e,n):_.isObject(t)?_.matcher(t):_.property(t)};_.iteratee=function(t,e){return A(t,e,1/0)};var M=function(t,e){return function(n){var r=arguments.length;if(r<2||null==n){ return n; }for(var i=1;i<r;i++){ for(var o=arguments[i],u=t(o),a=u.length,s=0;s<a;s++){var c=u[s];e&&void 0!==n[c]||(n[c]=o[c]);} }return n}},E=function(t){if(!_.isObject(t)){ return{}; }if(w){ return w(t); }b.prototype=t;var e=new b;return b.prototype=null,e},O=function(t){return function(e){return null==e?void 0:e[t]}},k=Math.pow(2,53)-1,j=O("length"),C=function(t){var e=j(t);return"number"==typeof e&&e>=0&&e<=k};_.each=_.forEach=function(t,e,n){e=S(e,n);var r,i;if(C(t)){ for(r=0,i=t.length;r<i;r++){ e(t[r],r,t); } }else{var o=_.keys(t);for(r=0,i=o.length;r<i;r++){ e(t[o[r]],o[r],t); }}return t},_.map=_.collect=function(t,e,n){e=A(e,n);for(var r=!C(t)&&_.keys(t),i=(r||t).length,o=Array(i),u=0;u<i;u++){var a=r?r[u]:u;o[u]=e(t[a],a,t);}return o},_.reduce=_.foldl=_.inject=n(1),_.reduceRight=_.foldr=n(-1),_.find=_.detect=function(t,e,n){var r;if(void 0!==(r=C(t)?_.findIndex(t,e,n):_.findKey(t,e,n))&&-1!==r){ return t[r] }},_.filter=_.select=function(t,e,n){var r=[];return e=A(e,n),_.each(t,function(t,n,i){e(t,n,i)&&r.push(t);}),r},_.reject=function(t,e,n){return _.filter(t,_.negate(A(e)),n)},_.every=_.all=function(t,e,n){e=A(e,n);for(var r=!C(t)&&_.keys(t),i=(r||t).length,o=0;o<i;o++){var u=r?r[o]:o;if(!e(t[u],u,t)){ return!1 }}return!0},_.some=_.any=function(t,e,n){e=A(e,n);for(var r=!C(t)&&_.keys(t),i=(r||t).length,o=0;o<i;o++){var u=r?r[o]:o;if(e(t[u],u,t)){ return!0 }}return!1},_.contains=_.includes=_.include=function(t,e,n,r){return C(t)||(t=_.values(t)),("number"!=typeof n||r)&&(n=0),_.indexOf(t,e,n)>=0},_.invoke=function(t,e){var n=d.call(arguments,2),r=_.isFunction(e);return _.map(t,function(t){var i=r?e:t[e];return null==i?i:i.apply(t,n)})},_.pluck=function(t,e){return _.map(t,_.property(e))},_.where=function(t,e){return _.filter(t,_.matcher(e))},_.findWhere=function(t,e){return _.find(t,_.matcher(e))},_.max=function(t,e,n){var r,i,o=-1/0,u=-1/0;if(null==e&&null!=t){t=C(t)?t:_.values(t);for(var a=0,s=t.length;a<s;a++){ (r=t[a])>o&&(o=r); }}else { e=A(e,n),_.each(t,function(t,n,r){((i=e(t,n,r))>u||i===-1/0&&o===-1/0)&&(o=t,u=i);}); }return o},_.min=function(t,e,n){var r,i,o=1/0,u=1/0;if(null==e&&null!=t){t=C(t)?t:_.values(t);for(var a=0,s=t.length;a<s;a++){ (r=t[a])<o&&(o=r); }}else { e=A(e,n),_.each(t,function(t,n,r){((i=e(t,n,r))<u||i===1/0&&o===1/0)&&(o=t,u=i);}); }return o},_.shuffle=function(t){for(var e,n=C(t)?t:_.values(t),r=n.length,i=Array(r),o=0;o<r;o++){ e=_.random(0,o),e!==o&&(i[o]=i[e]),i[e]=n[o]; }return i},_.sample=function(t,e,n){return null==e||n?(C(t)||(t=_.values(t)),t[_.random(t.length-1)]):_.shuffle(t).slice(0,Math.max(0,e))},_.sortBy=function(t,e,n){return e=A(e,n),_.pluck(_.map(t,function(t,n,r){return{value:t,index:n,criteria:e(t,n,r)}}).sort(function(t,e){var n=t.criteria,r=e.criteria;if(n!==r){if(n>r||void 0===n){ return 1; }if(n<r||void 0===r){ return-1 }}return t.index-e.index}),"value")};var R=function(t){return function(e,n,r){var i={};return n=A(n,r),_.each(e,function(r,o){var u=n(r,o,e);t(i,r,u);}),i}};_.groupBy=R(function(t,e,n){_.has(t,n)?t[n].push(e):t[n]=[e];}),_.indexBy=R(function(t,e,n){t[n]=e;}),_.countBy=R(function(t,e,n){_.has(t,n)?t[n]++:t[n]=1;}),_.toArray=function(t){return t?_.isArray(t)?d.call(t):C(t)?_.map(t,_.identity):_.values(t):[]},_.size=function(t){return null==t?0:C(t)?t.length:_.keys(t).length},_.partition=function(t,e,n){e=A(e,n);var r=[],i=[];return _.each(t,function(t,n,o){(e(t,n,o)?r:i).push(t);}),[r,i]},_.first=_.head=_.take=function(t,e,n){if(null!=t){ return null==e||n?t[0]:_.initial(t,t.length-e) }},_.initial=function(t,e,n){return d.call(t,0,Math.max(0,t.length-(null==e||n?1:e)))},_.last=function(t,e,n){if(null!=t){ return null==e||n?t[t.length-1]:_.rest(t,Math.max(0,t.length-e)) }},_.rest=_.tail=_.drop=function(t,e,n){return d.call(t,null==e||n?1:e)},_.compact=function(t){return _.filter(t,_.identity)};var I=function(t,e,n,r){for(var i=[],o=0,u=r||0,a=j(t);u<a;u++){var s=t[u];if(C(s)&&(_.isArray(s)||_.isArguments(s))){e||(s=I(s,e,n));var c=0,f=s.length;for(i.length+=f;c<f;){ i[o++]=s[c++]; }}else { n||(i[o++]=s); }}return i};_.flatten=function(t,e){return I(t,e,!1)},_.without=function(t){return _.difference(t,d.call(arguments,1))},_.uniq=_.unique=function(t,e,n,r){_.isBoolean(e)||(r=n,n=e,e=!1),null!=n&&(n=A(n,r));for(var i=[],o=[],u=0,a=j(t);u<a;u++){var s=t[u],c=n?n(s,u,t):s;e?(u&&o===c||i.push(s),o=c):n?_.contains(o,c)||(o.push(c),i.push(s)):_.contains(i,s)||i.push(s);}return i},_.union=function(){return _.uniq(I(arguments,!0,!0))},_.intersection=function(t){for(var e=[],n=arguments.length,r=0,i=j(t);r<i;r++){var o=t[r];if(!_.contains(e,o)){for(var u=1;u<n&&_.contains(arguments[u],o);u++){  }u===n&&e.push(o);}}return e},_.difference=function(t){var e=I(arguments,!0,!0,1);return _.filter(t,function(t){return!_.contains(e,t)})},_.zip=function(){return _.unzip(arguments)},_.unzip=function(t){for(var e=t&&_.max(t,j).length||0,n=Array(e),r=0;r<e;r++){ n[r]=_.pluck(t,r); }return n},_.object=function(t,e){for(var n={},r=0,i=j(t);r<i;r++){ e?n[t[r]]=e[r]:n[t[r][0]]=t[r][1]; }return n},_.findIndex=o(1),_.findLastIndex=o(-1),_.sortedIndex=function(t,e,n,r){n=A(n,r,1);for(var i=n(e),o=0,u=j(t);o<u;){var a=Math.floor((o+u)/2);n(t[a])<i?o=a+1:u=a;}return o},_.indexOf=u(1,_.findIndex,_.sortedIndex),_.lastIndexOf=u(-1,_.findLastIndex),_.range=function(t,e,n){null==e&&(e=t||0,t=0),n=n||1;for(var r=Math.max(Math.ceil((e-t)/n),0),i=Array(r),o=0;o<r;o++,t+=n){ i[o]=t; }return i};var P=function(t,e,n,r,i){if(!(r instanceof e)){ return t.apply(n,i); }var o=E(t.prototype),u=t.apply(o,i);return _.isObject(u)?u:o};_.bind=function(t,e){if(x&&t.bind===x){ return x.apply(t,d.call(arguments,1)); }if(!_.isFunction(t)){ throw new TypeError("Bind must be called on a function"); }var n=d.call(arguments,2),r=function(){return P(t,r,e,this,n.concat(d.call(arguments)))};return r},_.partial=function(t){var e=d.call(arguments,1),n=function(){
var arguments$1 = arguments;
for(var r=0,i=e.length,o=Array(i),u=0;u<i;u++){ o[u]=e[u]===_?arguments$1[r++]:e[u]; }for(;r<arguments.length;){ o.push(arguments$1[r++]); }return P(t,n,this,this,o)};return n},_.bindAll=function(t){
var arguments$1 = arguments;
var e,n,r=arguments.length;if(r<=1){ throw new Error("bindAll must be passed function names"); }for(e=1;e<r;e++){ n=arguments$1[e],t[n]=_.bind(t[n],t); }return t},_.memoize=function(t,e){var n=function(r){var i=n.cache,o=""+(e?e.apply(this,arguments):r);return _.has(i,o)||(i[o]=t.apply(this,arguments)),i[o]};return n.cache={},n},_.delay=function(t,e){var n=d.call(arguments,2);return setTimeout(function(){return t.apply(null,n)},e)},_.defer=_.partial(_.delay,_,1),_.throttle=function(t,e,n){var r,i,o,u=null,a=0;n||(n={});var s=function(){a=!1===n.leading?0:_.now(),u=null,o=t.apply(r,i),u||(r=i=null);};return function(){var c=_.now();a||!1!==n.leading||(a=c);var f=e-(c-a);return r=this,i=arguments,f<=0||f>e?(u&&(clearTimeout(u),u=null),a=c,o=t.apply(r,i),u||(r=i=null)):u||!1===n.trailing||(u=setTimeout(s,f)),o}},_.debounce=function(t,e,n){var r,i,o,u,a,s=function(){var c=_.now()-u;c<e&&c>=0?r=setTimeout(s,e-c):(r=null,n||(a=t.apply(o,i),r||(o=i=null)));};return function(){o=this,i=arguments,u=_.now();var c=n&&!r;return r||(r=setTimeout(s,e)),c&&(a=t.apply(o,i),o=i=null),a}},_.wrap=function(t,e){return _.partial(e,t)},_.negate=function(t){return function(){return!t.apply(this,arguments)}},_.compose=function(){var t=arguments,e=t.length-1;return function(){
var this$1 = this;
for(var n=e,r=t[e].apply(this,arguments);n--;){ r=t[n].call(this$1,r); }return r}},_.after=function(t,e){return function(){if(--t<1){ return e.apply(this,arguments) }}},_.before=function(t,e){var n;return function(){return--t>0&&(n=e.apply(this,arguments)),t<=1&&(e=null),n}},_.once=_.partial(_.before,2);var T=!{toString:null}.propertyIsEnumerable("toString"),q=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"];_.keys=function(t){if(!_.isObject(t)){ return[]; }if(m){ return m(t); }var e=[];for(var n in t){ _.has(t,n)&&e.push(n); }return T&&a(t,e),e},_.allKeys=function(t){if(!_.isObject(t)){ return[]; }var e=[];for(var n in t){ e.push(n); }return T&&a(t,e),e},_.values=function(t){for(var e=_.keys(t),n=e.length,r=Array(n),i=0;i<n;i++){ r[i]=t[e[i]]; }return r},_.mapObject=function(t,e,n){e=A(e,n);for(var r,i=_.keys(t),o=i.length,u={},a=0;a<o;a++){ r=i[a],u[r]=e(t[r],r,t); }return u},_.pairs=function(t){for(var e=_.keys(t),n=e.length,r=Array(n),i=0;i<n;i++){ r[i]=[e[i],t[e[i]]]; }return r},_.invert=function(t){for(var e={},n=_.keys(t),r=0,i=n.length;r<i;r++){ e[t[n[r]]]=n[r]; }return e},_.functions=_.methods=function(t){var e=[];for(var n in t){ _.isFunction(t[n])&&e.push(n); }return e.sort()},_.extend=M(_.allKeys),_.extendOwn=_.assign=M(_.keys),_.findKey=function(t,e,n){e=A(e,n);for(var r,i=_.keys(t),o=0,u=i.length;o<u;o++){ if(r=i[o],e(t[r],r,t)){ return r } }},_.pick=function(t,e,n){var r,i,o={},u=t;if(null==u){ return o; }_.isFunction(e)?(i=_.allKeys(u),r=S(e,n)):(i=I(arguments,!1,!1,1),r=function(t,e,n){return e in n},u=Object(u));for(var a=0,s=i.length;a<s;a++){var c=i[a],f=u[c];r(f,c,u)&&(o[c]=f);}return o},_.omit=function(t,e,n){if(_.isFunction(e)){ e=_.negate(e); }else{var r=_.map(I(arguments,!1,!1,1),String);e=function(t,e){return!_.contains(r,e)};}return _.pick(t,e,n)},_.defaults=M(_.allKeys,!0),_.create=function(t,e){var n=E(t);return e&&_.extendOwn(n,e),n},_.clone=function(t){return _.isObject(t)?_.isArray(t)?t.slice():_.extend({},t):t},_.tap=function(t,e){return e(t),t},_.isMatch=function(t,e){var n=_.keys(e),r=n.length;if(null==t){ return!r; }for(var i=Object(t),o=0;o<r;o++){var u=n[o];if(e[u]!==i[u]||!(u in i)){ return!1 }}return!0};var L=function(t,e,n,r){if(t===e){ return 0!==t||1/t==1/e; }if(null==t||null==e){ return t===e; }t instanceof _&&(t=t._wrapped),e instanceof _&&(e=e._wrapped);var i=v.call(t);if(i!==v.call(e)){ return!1; }switch(i){case"[object RegExp]":case"[object String]":return""+t==""+e;case"[object Number]":return+t!=+t?+e!=+e:0==+t?1/+t==1/e:+t==+e;case"[object Date]":case"[object Boolean]":return+t==+e}var o="[object Array]"===i;if(!o){if("object"!=typeof t||"object"!=typeof e){ return!1; }var u=t.constructor,a=e.constructor;if(u!==a&&!(_.isFunction(u)&&u instanceof u&&_.isFunction(a)&&a instanceof a)&&"constructor"in t&&"constructor"in e){ return!1 }}n=n||[],r=r||[];for(var s=n.length;s--;){ if(n[s]===t){ return r[s]===e; } }if(n.push(t),r.push(e),o){if((s=t.length)!==e.length){ return!1; }for(;s--;){ if(!L(t[s],e[s],n,r)){ return!1 } }}else{var c,f=_.keys(t);if(s=f.length,_.keys(e).length!==s){ return!1; }for(;s--;){ if(c=f[s],!_.has(e,c)||!L(t[c],e[c],n,r)){ return!1 } }}return n.pop(),r.pop(),!0};_.isEqual=function(t,e){return L(t,e)},_.isEmpty=function(t){return null==t||(C(t)&&(_.isArray(t)||_.isString(t)||_.isArguments(t))?0===t.length:0===_.keys(t).length)},_.isElement=function(t){return!(!t||1!==t.nodeType)},_.isArray=y||function(t){return"[object Array]"===v.call(t)},_.isObject=function(t){var e=typeof t;return"function"===e||"object"===e&&!!t},_.each(["Arguments","Function","String","Number","Date","RegExp","Error"],function(t){_["is"+t]=function(e){return v.call(e)==="[object "+t+"]"};}),_.isArguments(arguments)||(_.isArguments=function(t){return _.has(t,"callee")}),"function"!=typeof/./&&"object"!=typeof Int8Array&&(_.isFunction=function(t){return"function"==typeof t||!1}),_.isFinite=function(t){return isFinite(t)&&!isNaN(parseFloat(t))},_.isNaN=function(t){return _.isNumber(t)&&t!==+t},_.isBoolean=function(t){return!0===t||!1===t||"[object Boolean]"===v.call(t)},_.isNull=function(t){return null===t},_.isUndefined=function(t){return void 0===t},_.has=function(t,e){return null!=t&&g.call(t,e)},_.noConflict=function(){return s._=c,this},_.identity=function(t){return t},_.constant=function(t){return function(){return t}},_.noop=function(){},_.property=O,_.propertyOf=function(t){return null==t?function(){}:function(e){return t[e]}},_.matcher=_.matches=function(t){return t=_.extendOwn({},t),function(e){return _.isMatch(e,t)}},_.times=function(t,e,n){var r=Array(Math.max(0,t));e=S(e,n,1);for(var i=0;i<t;i++){ r[i]=e(i); }return r},_.random=function(t,e){return null==e&&(e=t,t=0),t+Math.floor(Math.random()*(e-t+1))},_.now=Date.now||function(){return(new Date).getTime()};var z={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},N=_.invert(z),D=function(t){var e=function(e){return t[e]},n="(?:"+_.keys(t).join("|")+")",r=RegExp(n),i=RegExp(n,"g");return function(t){return t=null==t?"":""+t,r.test(t)?t.replace(i,e):t}};_.escape=D(z),_.unescape=D(N),_.result=function(t,e,n){var r=null==t?void 0:t[e];return void 0===r&&(r=n),_.isFunction(r)?r.call(t):r};var F=0;_.uniqueId=function(t){var e=++F+"";return t?t+e:e},_.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var U=/(.)^/,B={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},G=/\\|'|\r|\n|\u2028|\u2029/g,H=function(t){return"\\"+B[t]};_.template=function(t,e,n){!e&&n&&(e=n),e=_.defaults({},e,_.templateSettings);var r=RegExp([(e.escape||U).source,(e.interpolate||U).source,(e.evaluate||U).source].join("|")+"|$","g"),i=0,o="__p+='";t.replace(r,function(e,n,r,u,a){return o+=t.slice(i,a).replace(G,H),i=a+e.length,n?o+="'+\n((__t=("+n+"))==null?'':_.escape(__t))+\n'":r?o+="'+\n((__t=("+r+"))==null?'':__t)+\n'":u&&(o+="';\n"+u+"\n__p+='"),e}),o+="';\n",e.variable||(o="with(obj||{}){\n"+o+"}\n"),o="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+o+"return __p;\n";try{var u=new Function(e.variable||"obj","_",o);}catch(t){throw t.source=o,t}var a=function(t){return u.call(this,t,_)};return a.source="function("+(e.variable||"obj")+"){\n"+o+"}",a},_.chain=function(t){var e=_(t);return e._chain=!0,e};var V=function(t,e){return t._chain?_(e).chain():e};_.mixin=function(t){_.each(_.functions(t),function(e){var n=_[e]=t[e];_.prototype[e]=function(){var t=[this._wrapped];return h.apply(t,arguments),V(this,n.apply(_,t))};});},_.mixin(_),_.each(["pop","push","reverse","shift","sort","splice","unshift"],function(t){var e=f[t];_.prototype[t]=function(){var n=this._wrapped;return e.apply(n,arguments),"shift"!==t&&"splice"!==t||0!==n.length||delete n[0],V(this,n)};}),_.each(["concat","join","slice"],function(t){var e=f[t];_.prototype[t]=function(){return V(this,e.apply(this._wrapped,arguments))};}),_.prototype.value=function(){return this._wrapped},_.prototype.valueOf=_.prototype.toJSON=_.prototype.value,_.prototype.toString=function(){return""+this._wrapped},r=[],void 0!==(i=function(){return _}.apply(e,r))&&(t.exports=i);}).call(this);}]);


window.judge = control.judge;window.judgeAnswer = control.judgeAnswer;window.judgeAnswerComposite = control.judgeAnswerComposite;

window.getVersionCode = function (){return {versionCode: '0.2.11'}};


//judge@0.2.11  by:xuhongbo &lt;xuhongbo@outlook.com&gt;
//Build date: Wed Jul 11 2018 17:02:44 GMT+0800 (CST)

var EVENT_NAME_SAPCE = "TALQS_INTERACTION";

var TALQS_EVENT = {
    CHANGE: (EVENT_NAME_SAPCE + "_CHANGE"), // 用户初始化数据
    TOGGLE_INTEACTION: (EVENT_NAME_SAPCE + "_TOGGLE_INTEACTION"), // 切换交互
    COMPLEX_CHANGE: (EVENT_NAME_SAPCE + "_COMPLEX_CHANGE"),
    HIDE_KEYBOARD: (EVENT_NAME_SAPCE + "_HIDE_KEYBOARD"), // 隐藏自定义键盘
    RESET_KEYBOARD_STATE: (EVENT_NAME_SAPCE + "_RESET_KEYBOARD_STATE"), // 重置自定义键盘
};

// 用户作答数据更新
var dispatchUpdateEvent = function (data) {
    var onChange = TalqsInteraction.onChange;
    if (onChange && typeof onChange === 'function') {
        onChange(data);
    }
};

/**
 * 数据存储中心
 */
var talqsStorageData = (function () {
    var Data = function Data() {
        this._cache = {};
    };

    var prototypeAccessors = { cache: {} };

    prototypeAccessors.cache.get = function () {
        return this._cache
    };

    Data.prototype.set = function set (key, data) {
        console.log(key, data);
        this._cache[key] = data;
        // 派发数据给复合题
        // CustomEvent 解决无法携带数据信息的问题
        document.dispatchEvent(new CustomEvent(TALQS_EVENT.COMPLEX_CHANGE, {
            bubbles: 'true',
            cancelable: 'true',
            detail: key
        }));            
    };

    /**
     * 获取作答数据（可传试题 ID 获取对应试题的作答数据）
     * @param  {[String]} id [试题 ID]
     * @return {[Array]} [作答数据]
     */
    Data.prototype.get = function get (id) {
            var this$1 = this;

        var result = [];
        for (var key in this$1._cache) {
            var item = this$1._cache[key];
            if (id) {
                if (key === id) { // 直接命中
                    result.push(item);
                    break;
                } else if (item.rootId === id) { // 获取 rootId 集合
                    result.push(item);
                }
            } else {
                result.push(item);
            }
        }
        return result.length ? result : undefined;
    };

    Data.prototype.remove = function remove (key) {
        delete this._cache[key];
    };

    Object.defineProperties( Data.prototype, prototypeAccessors );
    return new Data();
})();

/**
 * 交互属性集合
 */

var rootId = 'data-talqs-root';
var logicType = 'data-logic-type';
var queId = 'data-que-id';
var app = 'talqs-app';

var attr = {
    app: app,
    // 公用
    rootId: rootId,
    type: 'data-talqs-type',
    queId: queId,
    logicType: logicType,
    addition: 'data-addition',

    // 选项
    optionList: 'option-list-root',
    autoLayout: 'data-auto-layout',
    optionGroup: 'data-option-group',
    optionItem: 'data-option-item',
    optionContent: 'data-option-content',
    optionIndex: 'data-option-index',
    optionAnalyze: 'data-option-analyze',
    anchor: 'data-anchor-item',


    // 填空题
    blankContentType: 'data-content-type',
    blankItem: 'data-blank-item',
    blankPopupTrigger: 'data-blank-popup-trigger',
    blankOption: 'data-blank-option',
    blankOptionList: 'data-option-list',
    blankAlphaTrigger: 'data-blank-alpha-trigger',
    blankPopupType: 'data-popup-type',
    blankType: 'data-blank-type',
    blankIndex: 'data-blank-index',
    targetIndex: 'data-traget-index',


    // 完型填空下拉
    inputid: 'data-inputid',

    // 拖拽
    dragItem: 'data-talqs-drag-item',
    dragContainer: 'data-talqs-drag-container',
    dragMain: 'drag-main',
    currentOption: 'data-current-option',
    currentIndex: 'data-current-index',
    questionIndexMain: 'question-index-main',

    // 连词成句
    sortLineContainer: 'sort-line-container', // 下划线容器
    sortLine: 'sort-line', // 下划线
    sortWord: 'data-sort-word',
    sortItem: 'sort-item',

    // 判断
    tofv: 'data-true-flase',

    // 配对
    matchItem: 'data-match-item',
    matchContainer: 'data-match-container',
    // 拍照
    cameraButton: 'data-camera-button',
    // 复合题子题序号
    dataIndex: 'data-index',
};

var ROOT = rootId;
var LOGIC_TYPE = logicType;
var QUEID = queId;
var APP_CONTAINER = app;

/**
 * 样式类名集合
 */

var main$1 = 'talqs';
var options$1 = main$1 + "_options";

var disable = main$1 + "_disable";
var active = main$1 + "_active";
var wrong = main$1 + "_wrong";
var right = main$1 + "_right";

var style$1 = {
    content: (main$1 + "_content"),
    stems: (main$1 + "_main"),

    options: options$1,
    optionsList: (options$1 + "_list"),
    optionsRows: (options$1 + "_rows"),
    optionsColumns: (options$1 + "_columns"),
    optionsItem: (options$1 + "_columns_item"),
    optionsIndex: (options$1 + "_index"),
    optionsLabel: (options$1 + "_label"),
    optionsContent: (options$1 + "_content"),
    optionWrapper: (options$1 + "_analyze"),
    optionAnalyze: (options$1 + "_analyze_group"),

    analyzeContainer: (main$1 + "_analysis_container"),

    clear: 'clearfix',
    hidden: 'hidden',

    input: (main$1 + "_blank_input"),
    inputContainer: (main$1 + "_blank_span"),
    // 填空题
    inputShadow: (main$1 + "_input_shadow"),

    label: (main$1 + "_label"),
    panel: (main$1 + "_panel"),

    // 连词成句
    sortLineContainer: (main$1 + "_line_cont"),
    sortLine: (main$1 + "_word_line"),
    sortWord: (main$1 + "_word_btn"),
    sortPlaceHolder: 'sortable-placeholder',


    dnd: (main$1 + "_dnd_container"),
    dndShort: (main$1 + "_dnd_container_short"),
    dndLong: (main$1 + "_dnd_container_long"),
    anchor: (main$1 + "_anchor_container"),
    sentence: "sentence_type",

    // 判断题
    tfText: (options$1 + "_tf_text"),

    // 配对题
    optionMatch: (options$1 + "_match"),

    dropActive: (main$1 + "_drop_highlight"),
    dropHover: (main$1 + "_drop_hover"),

    // 状态
    active: active,
    wrong: wrong,
    right: right,
    enable: (main$1 + "_enable"),
    disable: disable,

    mathInput: (main$1 + "_math_input"),

    // 解答题
    imgsContainer: (main$1 + "_img_container"),
    imgLoader: (main$1 + "_img_loader"),
    subqs: 'talqs_subqs',

    correctContainer: (main$1 + "_correct_container"),

    // 表格
    tableContaier: "table_container",
    selectWrapper: 'talqs_select_main',

    // 作答过
    answered: (main$1 + "_answered"),

    failAnswer: (main$1 + "_fail_answer")
};

var COMMON_STYLE = {
    DISABLE: disable,
    ACTIVE: active,
    RIGHT: right,
    WRONG: wrong
};

/**
 * [BLANK_REGEX 空格正则匹配]
 * @type {RegExp}
 */
var BLANK_REGEX = /(?:&nbsp;)*<(?:u|span\s[^>]+)>(?:&nbsp;|\s){3,}(\d*)(?:&nbsp;|\s){3,}<\/(?:u|span)>(?:&nbsp;)*/g;

// 填空题无效字符过滤
var INVALID_CHAR_REGEX = /[^\s\w\u4e00-\u9fa5,./<>?:;'"`~!@#$%^&*()-_+={}\[\]|，。、《》？；：’‘“”·~！￥……（）——【】]/g;
// 
// "，！。？'-/：；（）¥@.。，、？！“”【】｛｝#%-*+=_—\\|～《》&·。…,?!'“", "", ""
// 竖式作答空替换
var VERTICAL_MATH_REGEX = /(<(?:td|span) [^>]*\bneedFill\b[^>]*">)[^<]*(<\/(?:td|span)>)/g;

// 所有作答空
var TALQS_INPUT_REGEX = /<talqs-blank ([^>]*)>/g;

// 所有图片
var IMG_REGEX = /(<img[^>]*>)/g;

// 所有表格
var TABLE_START_REGEX = /(<table[^>]*>)/g;

var TABLE_END_REGEX = /(<\/table>)/g;

var DEFAULT_VALUE = '';

var DATA_API_KEY = '.data-api';

var STYLE = COMMON_STYLE;

/**
 * [isDisableEle 判断元素是否有 disable 类]
 * @param  {[DOM Element]}  element [DOM元素]
 * @return {Boolean}                [禁用状态值]
 */
var isDisableEle = function (element) {
    if (element) {
        var classList = [].slice.call(element.classList);
        if (classList.indexOf(COMMON_STYLE.DISABLE) >= 0) { return true; }
    }
    return false;
};

/**
 * [getClosestQuestionEle 获取当前元素距离最近的试题元素]
 * @param  {[DOM Element]} element  [当前元素]
 * @param  {[String]} selector      [选择符]
 * @return {[DOM Element]}          [距离最近的试题元素]
 */
var getClosetEl = function (element, selector) {
    var closestList = $(element).closest(selector);
    return closestList && closestList[0];
};

var getClosestElement = getClosetEl;


/**
 * [getRootId 获取 rootID]
 * @param  {[DOM Element]} element [当前元素]
 * @return {[String]}              [试题rootID]
 */
var getRootId = function (element) {
    var rootContainer = getClosetEl(element, ("[" + ROOT + "]"));
    return rootContainer && rootContainer.getAttribute(ROOT);
};

/**
 * [getQueId 获取试题ID]
 * @param  {[DOM Element]} element [当前元素]
 * @return {[String]}              [试题ID]
 */
var getQueId = function (element) {
    return element.getAttribute(QUEID);
};

/**
 * [getLogicType 获取试题逻辑类型]
 * @param  {[DOM Element]} element [试题元素]
 * @return {[Number]}              [逻辑题型ID]
 */
var getLogicType = function (element) {
    return parseInt(element.getAttribute(LOGIC_TYPE), 10);
};

/**
 * [getQuestionEleByQueId 根据试题ID获取DOM元素]
 * @param  {[String]} type       [试题交互类型]
 * @param  {[String]} queId      [试题ID]
 * @return {[DOM Element]}       [试题DOM]
 */
var getQuestionEleByQueId = function (type, queId) {
    return document.querySelector((type + "[" + QUEID + "=\"" + queId + "\"]"));
};

/**
 * [toggleClass 添加或者移除类]
 * @param  {[DOM Element]} element   [DOM元素]
 * @param  {[String]} className      [样式名称]
 * @param  {[Boolean]} toggle        [添加或者移除]
 */
var toggleClass = function (element, className, toggle) {
    if (!element) { return }
    if (toggle) {
        element.classList.add(className);
    } else {
        element.classList.remove(className);
    }
};

/**
 * [setResultState 更新作答正确或者错误的状态样式]
 * @param {[DOM Element]} element [待设置样式元素]
 * @param {[Number]} result       [判题结果]
 */
var setResultState = function (element, result) {
    toggleClass(element, COMMON_STYLE.WRONG, result === 0);
    toggleClass(element, COMMON_STYLE.RIGHT, result === 1);
};

/**
 * [resetListActive description]
 * @param  {[type]} list      [description]
 * @param  {[type]} className [description]
 * @return {[type]}           [description]
 */
var resetListActive = function (list, className) {
    [].forEach.call(list, function (item) {
        toggleClass(item, className, false);
    });
};

/**
 * [MutationObserverEventListener 使用 MutationObserver 检测 DOM 变化]
 * @param {Function} cb [DOM变化回调]
 */
var MutationObserverEventListener = function (cb) {
    // 使用 MutationObserver 检测 DOM 变化，从而判断是否有需要进行拖拽类型的监听
    var APP = document.querySelector(("[" + APP_CONTAINER + "]"));
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(cb);
    APP && observer.observe(APP, { 'childList': true, 'attributes': true, 'subtree':true });
};

/**
 * [replaceInvalidStr 格式化输入的数据]
 * @param  {[String]} value [输入框的数据]
 */
var replaceInvalidStr = function (value) {
    return value.replace(INVALID_CHAR_REGEX, '').replace(/\s{1,}/g, ' ');
};

/**
 * [cumulativeOffset 计算一个元素的偏移量坐标]
 * @param  {[DOM Element]} element [需要计算的元素]
 * @return {[Object]}              [位置对象]
 */
var cumulativeOffset = function (element) {
    var top = 0;
    // left = 0;
    do {
        top += element.offsetTop || 0;
        // left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while (element);

    return {
        top: top,
        // left: left
    };
};

/**
 * 判断是否是pc
 * 
 * @returns true为PC端，false为手机端
 */
var IsPC = function () {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"
    ];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
};

/**
 * 选择型作答交互
 * 适用的题型有
 * 1. 单选       data-logic-type='1'
 * 2. 多选       data-logic-type='2'
 * 3. 判断       data-logic-type='5'
 * 4. 完型填空    data-logic-type='10'(完型填空显示选项时是可以点击的)
 * 5. 多选多      data-logic-type='3'
 * 6. 配对       data-logic-type='6'
 */
var ChoiceTypeQuestion = (function ($) {

    var NAME = 'choice';
    var DATA_KEY = "talqs." + NAME;
    var EVENT_KEY = "." + DATA_KEY;

    var Events = {
        CLICK_DATA_API: ("click" + EVENT_KEY + DATA_API_KEY),
    };

    var Selector = {
        CHOICE_TYPE: ("[" + (attr.type) + "=\"" + NAME + "\"]"), // 选择类型交互
        CHOICE_GROUP: ("[" + (attr.optionGroup) + "]"), // 选项组容器
        CHOICE_ITEM: ("[" + (attr.optionItem) + "]"), // 选项
        CHOICE_CONTENT: ("[" + (attr.optionContent) + "]"), // 选项内容
        TARGET_INDEX: ("[" + (attr.targetIndex) + "]"),
        BLANK_ITEM: ("[" + (attr.blankItem) + "]"),
        OPTION_ROOT: ("[" + (attr.optionList) + "]"),
        MATCH_ITEM: ("[" + (attr.matchItem) + "]")
    };

    var ATTRS = {
        CHOICE_GROUP: attr.optionGroup,
        CHOICE_ITEM: attr.optionItem,
        TARGET_INDEX: attr.targetIndex,
        BLANK_ITEM: attr.blankItem,
        MATCH_ITEM: attr.matchItem,
        ADDITION: attr.addition,
    };

    var ChoiceType = function ChoiceType(queId, rootId, element, data, config) {
        this._queId = queId;
        this._rootId = rootId;
        this._element = element;
        this._config = config;

        // 选项列表
        this._optionRoot = element.querySelector(Selector.OPTION_ROOT);

        // 计算答案的数量
        if (config.multiBlank) {
            // 有单独的层级来显示选项或者试题
            if (config.hasCover) {
                // 完型填空题号，其他类型的空号数值元素列表
                this._indexList = element.querySelectorAll(Selector.TARGET_INDEX);
                this._blankItemList = element.querySelectorAll(Selector.BLANK_ITEM);
            }

            if (config.match) {
                this._blankItemList = element.querySelectorAll(Selector.MATCH_ITEM);
                this._mathFillItemList = element.querySelectorAll('.matchfill');
            }

            // 多选多计算下划线数量
            if (config.multiMatch) {
                this._childrenLen = this._blankItemList.length;
            } else {
                this._childrenLen = this._optionRoot.children.length;
            }
        }

        if (config.clozeChoice) {
            this._childQuestionList = element.querySelectorAll(Selector.CHOICE_GROUP);
        }

        // 作答数据
        this._selected = data || [];
        // 判题结果
        this._result = [];

        var addition = element.getAttribute(ATTRS.ADDITION);
        this._clickEffect = (addition && addition.split(' ')[1]) || 'option';
    };

    // private
    ChoiceType.prototype._updateResultState = function _updateResultState (element, wrong, right) {
        toggleClass(element, STYLE.WRONG, wrong);
        toggleClass(element, STYLE.RIGHT, right);
    };

    /**
     * [_updateItemStyle 更新某行样式]
     * @param  {[DOM Element]} element [选择题选项容器DOM]
     * @param  {[Number]} index        [当前题号]
     * @param  {[Boolean]} multiBlank [多答案标示]
     * @param  {[Boolean]} trueorfalseType [判断题标示]
     */
    ChoiceType.prototype._updateItemStyle = function _updateItemStyle (element, index, multiBlank, trueorfalseType) {
            var this$1 = this;

        // 当前答案
        var currentOption = multiBlank ? this._selected[index] : this._selected;
        // 判题结果
        var result = multiBlank ? this._result[index] : this._result[0];
        var isRight = result === 1;
        var isWrong = result === 0;
        var emptyResult = result === void 0 || result === '';
        if (trueorfalseType) { // 判断题
            this._updateResultState(element.children[0], isWrong, isRight);
        }
        var childList = element.querySelectorAll(Selector.CHOICE_ITEM);

        [].forEach.call(childList, function (subItem, subIndex) {
            var option = subItem.getAttribute(ATTRS.CHOICE_ITEM);
            var contain = option === currentOption;
            // 如果传递的是数组，则判断是否包含(多选题)
            if (Array.isArray(currentOption)) {
                contain = !(currentOption.indexOf(option) < 0);
            }
            // 不是判断题，也不是完形填空或者多选多或者配对题
            if (!trueorfalseType) {
                this$1._updateResultState(subItem, contain && isWrong, contain && isRight);
            }
            toggleClass(subItem, STYLE.ACTIVE, contain && (emptyResult || trueorfalseType));
            // toggleClass(subItem, STYLE.ACTIVE, contain);
        });
        // 完型填空更新下划线的状态
        if (this._config.clozeChoice || this._config.multiMatch || this._config.match) {
            this._updateResultState(this._blankItemList[index], isWrong, isRight);
            // 更新题号的状态
            this._updateResultState(this._indexList[index], isWrong, isRight);
            // 更新是否已经作答过
            toggleClass(this._indexList[index], style$1.answered, !!currentOption);
            // 未作答
            toggleClass(this._indexList[index], style$1.failAnswer, !(!!currentOption));
        }
    };
    /**
     * [_updateItemStyle 更新某行样式仅适用于多选多]
     * @param  {[DOM Element]} element [选择题选项容器DOM]
     * @param  {[Number]} index        [当前题号]
     * @param  {[Boolean]} multiBlank [多答案标示]
     */
    ChoiceType.prototype._updateItemStyleOfMultiMatch = function _updateItemStyleOfMultiMatch () {
            var this$1 = this;

        var question_index_main = document.querySelectorAll('.question-index-main')[0].children;
        if (this._result.length > 0) {
            [].forEach.call(this._result, function (item, index) {
                var result = this$1._result[index];
                var isRight = result === 1;
                var isWrong = result === 0;
                var emptyResult = result === void 0 || result === '';
                this$1._updateResultState(this$1._indexList[index], isWrong, isRight);
            });
        } else {
            [].forEach.call(question_index_main, function (item, index) {
                this$1._updateResultState(this$1._indexList[index], false, false);
            });
        }
    };

    /**
     * [_updateStyleState 更新选中状态样式]
     * @param  {[Number]} index [需要更新的空]
     */
    ChoiceType.prototype._updateStyleState = function _updateStyleState (index) {
            var this$1 = this;

        // 获取整个选项列表 DOM
        var list = this._optionRoot.children;
        debugger
        // 多空型试题
        var multiBlank = this._config.multiBlank;
        var trueorfalseType = this._config.trueorfalseType;
        // 共用选项（多选多和配对）
        var publicOption = this._config.multiMatch || this._config.match;
        if (!isNaN(index) && multiBlank && !publicOption) {
            // 更新某行样式(完型填空更新某行)
            this._updateItemStyle(list[index], index, multiBlank, trueorfalseType);
        } else {
            // 更新整个列表样式
            [].forEach.call(list, function (item, subIndex) {
                this$1._updateItemStyle(item, publicOption ? (index || 0) : subIndex, multiBlank, trueorfalseType);
                // 只针对多选多题型
                if (this$1._config.multiMatch || this$1._config.match) {
                    this$1._updateItemStyleOfMultiMatch();
                }
            });
        }
    };

    /**
     * [getOptionContent 获取选项内容]
     * @param  {[DOM Element]} element [选项]
     * @return {[String]}          [选项内容]
     */
    ChoiceType.prototype.getOptionContent = function getOptionContent (element, html) {
        // 选项内容 DOM (完型填空需要)
        var contentEle = element.querySelector(Selector.CHOICE_CONTENT);
        var value = DEFAULT_VALUE;
        if (contentEle) {
            value = html ? contentEle.innerHTML : contentEle.innerText;
        }
        return value;
    };

    /**
     * [_updateBlankFill 完型填空同步数据到题干中]
     * @param  {[Number]} index   [子题索引值]
     * @param  {[String]} content [子题答案代表的选项内容]
     */
    ChoiceType.prototype._updateBlankFill = function _updateBlankFill (index, content) {
        var isMatch = this._config.match;
        var list = isMatch ? this._mathFillItemList : this._blankItemList;
        if (!list.length) { return; }
        if (!isNaN(index)) { // 指定更新某行数据
            var item = list[index];
            item.innerHTML = content;
            if (content.length > 1) {
                toggleClass(item, 'inline', true);
            }
        } else {
            var instance = this;
            // 完型填空标志
            var isCloze = instance._config.clozeChoice;
            // 根据答案更新整个列表
            var answerData = instance._selected;

            [].forEach.call(list, function (item, index) {
                var answer = answerData[index];
                var content = DEFAULT_VALUE;
                var optionContainer;
                if (answer) {
                    // 复合题有子题
                    if (isCloze) {
                        optionContainer = instance._childQuestionList[index];
                    } else { // 子选项
                        optionContainer = instance._optionRoot;
                    }
                    // 根据答案去选项找题干
                    var optionElement = optionContainer.querySelector(("[" + (ATTRS.CHOICE_ITEM) + "=\"" + answer + "\"]"));
                    content = instance.getOptionContent(optionElement, isMatch);
                    if (content) {
                        item.innerHTML = content;
                        toggleClass(item, 'inline', true);
                    }
                }
            });
        }
    };

    // public
    // 派发数据更新
    ChoiceType.prototype.updataData = function updataData () {
        // 作答数据
        var inputData = {
            rootId: this._rootId,
            queId: this._queId,
            data: this._selected,
            type: this._config.type,
        };

        talqsStorageData.set(this._queId, inputData);
        // 派发数据改变事件
        dispatchUpdateEvent(inputData);
    };

    /**
     * [updateSelectedState 更新作答数据]
     * @param  {[Object]} data [作答数据]
     */
    ChoiceType.prototype.updateSelectedState = function updateSelectedState (data) {
            var this$1 = this;

        var option = data.option;
        var index = parseInt(data.index, 10);
        // 多空型试题（完型填空，判断，多选多）
        if (this._config.multiBlank) {
            // 重复点击
            if (this._selected[index] === option) { return; }
            // 非重复点击，存储点击的值
            this._selected[index] = option;

            // 设置默认值，将未答题的答案设置成''
            for (var i = 0; i < this._childrenLen; i++) {
                this$1._selected[i] = this$1._selected[i] || DEFAULT_VALUE;
            }
            //
            if (this._config.hasCover) {
                var content = this._clickEffect === 'content' ? data.content : option;
                this._updateBlankFill(index, content);
            }

        } else {
            // 非完型填空类型(单选，多选)
            // 判断是否包含
            var cindex = this._selected.indexOf(option);
            if (this._config.multipleChoice) { // 多选题
                // 添加一个答案
                if (cindex < 0) {
                    this._selected.push(option);
                } else {
                    // 移除对应答案
                    this._selected.splice(cindex, 1);
                }
            } else {
                // 单选题(重复点击则return)
                if (cindex !== -1) { return; }
                // 记录最新的答案
                this._selected = [option];
            }
            // 按字母顺序排序
            this._selected.sort();
        }

        // 更新选中样式
        this._updateStyleState(index);
        this.updataData();
    };


    // -----------------------------------------------------------------------

    /**
     * [fillDataIntoComponent 更新整个作答数据列表]
     * @param  {[type]} data [作答数据]
     */
    ChoiceType.prototype.fillDataIntoComponent = function fillDataIntoComponent (userData) {
        // 作答数据赋值
        this._selected = userData.data || [];
        this._result = userData.result || [];
        // 更新样式
        this._updateStyleState();
        // 完型填空和多选多填充答案到下划线
        var needFill = this._config.multiMatch || this._config.clozeChoice || this._config.match;
        if (needFill) {
            this._updateBlankFill();
        }
    };

    // -----------------------------------------------------------------------

    // static
    // ---------------------------------------------------------------------------------------

    /**
     * [_getInstance 获取一个组件实例，如果没有则初始化一个新的实例]
     * @param  {[type]}   element  [挂载元素]
     * @return {[ChoiceType]}      [组件实例]
     */
    ChoiceType._getInstance = function _getInstance (element) {
        // 获取组件缓存
        var instance = $(element).data(DATA_KEY);
        if (!instance) {
            var queId = getQueId(element);
            var rootId = getRootId(element);
            // 初始化组件并写入缓存
            instance = new ChoiceType(queId, rootId, element, [], ChoiceType._getConfig(element));
            $(element).data(DATA_KEY, instance);
        }
        return instance;
    };

    /**
     * [getConfig description]
     * @param  {[type]} type [description]
     * @return {[type]}  [description]
     */
    ChoiceType._getConfig = function _getConfig (element) {
        var type = getLogicType(element);
        var config = {
            type: type,
            multipleChoice: type === 2,
            clozeChoice: type === 10,
            multiBlank: [3, 5, 6, 10].indexOf(type) !== -1,
            trueorfalse: type === 5,
            multiMatch: type === 3, // 多选多
            match: type === 6, // 配对
            hasCover: [3, 6, 10].indexOf(type) !== -1,
        };
        return config;
    };

    //---------------------------------------------------------

    /**
     * [isDisable 获取是否被禁用交互]
     * @param  {[DOM Element]}  element [DOM元素]
     * @return {Boolean}            [是否禁用标示]
     */
    ChoiceType.isDisable = function isDisable (element) {
        return !TalqsInteraction.isInteractive || isDisableEle(element);
    };

    /**
     * [_dataApiClickHandler 点击选项事件监听]
     */
    ChoiceType._dataApiClickHandler = function _dataApiClickHandler () {
        // 选项容器
        var parentElement = getClosestElement(this, Selector.CHOICE_GROUP);
        if (ChoiceType.isDisable(parentElement)) { return; }
        // 获取试题 DOM 容器
        var containerElement = getClosestElement(this, Selector.CHOICE_TYPE);
        // 创建实例
        var instance = ChoiceType._getInstance(containerElement);
        // 获取索引值(获取是第几子题), 多选多会把题号标记到实例上
        var index;
        if (instance._config.multiMatch || instance._config.match) {
            index = instance.currentIndex || 0;
        } else {
            index = parentElement.getAttribute(ATTRS.CHOICE_GROUP);
        }
        // 获取点选选项的数据
        var data = {
            // 选项字母
            option: this.getAttribute(ATTRS.CHOICE_ITEM),
            index: index,
            // 获取选项内容文字
            content: instance.getOptionContent(this, instance._config.match),
        };
        // 更新选项数据
        instance.updateSelectedState(data);
    };
    //---------------------------------------------------------

    // 带初始化数据的初始化组件
    ChoiceType._dataInitialHandler = function _dataInitialHandler () {
        // 获取所有选择题
        var choiceTypeList = document.querySelectorAll(Selector.CHOICE_TYPE);
        [].forEach.call(choiceTypeList, function (item) {
            var queId = getQueId(item);
            // 缓存中对应该试题的数据
            var initialData = queId && talqsStorageData.cache[queId];
            if (initialData) {
                ChoiceType._getInstance(item).fillDataIntoComponent(initialData);
            }
        });
    };


    // 切换作答空
    ChoiceType._changeBlankIndex = function _changeBlankIndex () {
        var containerElement = getClosestElement(this, Selector.CHOICE_TYPE);
        var currentIndex = this.getAttribute(ATTRS.TARGET_INDEX) ||
            this.getAttribute(ATTRS.BLANK_ITEM) ||
            parseInt(this.getAttribute(ATTRS.MATCH_ITEM)) - 1;
        // 创建实例
        var instance = ChoiceType._getInstance(containerElement);
        instance.currentIndex = currentIndex;

        // 切换完型填空试题
        if (instance._config.clozeChoice) {
            [].forEach.call(instance._optionRoot.children, function (item, index) {
                toggleClass(item, 'current', currentIndex == index);
            });
        }
        // 更新题号的选中
        [].forEach.call(instance._indexList, function (item, index) {
            toggleClass(item, 'current', currentIndex == index);
        });
        // 更新空的选中
        [].forEach.call(instance._blankItemList, function (item, index) {
            toggleClass(item, STYLE.ACTIVE, currentIndex == index);
        });

        // 更新选中样式
        instance._updateStyleState(parseInt(currentIndex));

        // 多选多更新答案的显示
        if (instance._config.multiMatch) {
            if (!instance.analysis) {
                instance.analysis = instance._element.querySelector('.talqs_analysis_container');
            }
            var list = instance.analysis.children;
            [].forEach.call(list, function (item, index) {
                toggleClass(item, 'current', currentIndex == index);
            });
        }
    };


    //---------------------------------------------------------
    /**
     * 更新交互状态
     * 完型填空和判断需要更新到具体的子题
     */
    ChoiceType._toggleInteractionHandler = function _toggleInteractionHandler (evt) {
        var list = evt.data || [];
        list.forEach(function (item) {
            // 获取试题对象DOM
            var element = getQuestionEleByQueId(Selector.CHOICE_TYPE, item.queId);
            if (element) {
                // 获取可点击的选项列表
                var childList = element.querySelectorAll(Selector.CHOICE_GROUP);
                // 是否是多答案类型的选择（判断，完形填空需要细化到每个空），其他类型只需要取第一个
                var multiBlank = ChoiceType._getConfig(element).multiBlank;
                [].forEach.call(childList, function (subItem, index) {
                    var valueIndex = multiBlank ? index : 0;
                    var disable = item.rectifyState[valueIndex] === 0;
                    toggleClass(subItem, STYLE.DISABLE, disable);
                });
            }
        });
    };

    // 选项点击事件监听
    $(document).on(Events.CLICK_DATA_API, ((Selector.CHOICE_TYPE) + " " + (Selector.CHOICE_ITEM)), ChoiceType._dataApiClickHandler);
    // 设置用户作答事件监听
    $(document).on(TALQS_EVENT.CHANGE, ChoiceType._dataInitialHandler);
    // 订正状态更新事件监听
    document.addEventListener(TALQS_EVENT.TOGGLE_INTEACTION, ChoiceType._toggleInteractionHandler);
    // 点击下划线空和空号事件
    $(document).on(Events.CLICK_DATA_API, ((Selector.CHOICE_TYPE) + " " + (Selector.TARGET_INDEX)), ChoiceType._changeBlankIndex);
    $(document).on(Events.CLICK_DATA_API, ((Selector.CHOICE_TYPE) + " " + (Selector.BLANK_ITEM)), ChoiceType._changeBlankIndex);
    // 点击配对作答空
    $(document).on(Events.CLICK_DATA_API, ((Selector.CHOICE_TYPE) + " " + (Selector.MATCH_ITEM)), ChoiceType._changeBlankIndex);
})(jQuery);

/**
 * 数学键盘数据管理
 */
var MathStore = function MathStore() {
    this._inputList = [];
    this._keypad = null;
    this._currentField = null;
};

var prototypeAccessors = { list: {},keypad: {},currentField: {} };

prototypeAccessors.list.get = function () {
    return this._inputList;
};

MathStore.prototype.putList = function putList (input) {
    this._inputList.push(input);
};

prototypeAccessors.keypad.set = function (pad) {
    this._keypad = pad;
};

prototypeAccessors.keypad.get = function () {
    return this._keypad;
};

prototypeAccessors.currentField.set = function (field) {
    this._currentField = field;
};

prototypeAccessors.currentField.get = function () {
    return this._currentField;
};

/**
 * [resetCursor 重置光标]
 * @param  {[type]} input [description]
 * @return {[type]}   [description]
 */
MathStore.prototype.resetCursor = function resetCursor (input) {
    if (this._inputList.length) {
        this._inputList.forEach(function(item) {
            item && item.focused && item.blur();
        });
    }
    this.currentField = input;
};

Object.defineProperties( MathStore.prototype, prototypeAccessors );

var InputAndKeyboard=function(e){function t(i){if(n[i]){ return n[i].exports; }var r=n[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i});},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=44)}([function(e,t,n){"use strict";function i(e,t){if(void 0===e){ throw new Error("element参数没有正确传入"); }if(void 0===t){ throw new Error("styleObj参数没有正确传入"); }for(var n in t){ t.hasOwnProperty(n)&&(e.style[n]=t[n]); }}function r(e){var t=e.style.transform,n=t.match("\\((.+?)\\)");return null===n?null:n[1].replace("deg","")}function a(e){var t=e.style.transform,n=t.match("\\((.+?)\\)");if(null===n){ return null; }var i=n[1].split(",");return console.log(i),i}function o(e,t){for(var n=window.getComputedStyle(e),i=[],r=void 0,a=t.length,o=0;o<a;o++){ r=n[t[o]],-1!==r.indexOf("px")?i.push(Number(r.replace("px",""))):i.push(r); }return i}function s(e,t){var n=window.getComputedStyle(e,"style")[t];return-1!==n.indexOf("px")?Number(n.replace("px","")):n}function l(e,t){var n=window.getComputedStyle(e),i=n.color;if(-1===i.indexOf("rgba")){ i=i.replace("rgb","rgba"),i=i.replace(")",","+t+")"); }else{var r=i.lastIndexOf(",");i=i.substring(0,r)+","+t+")";}return i}function c(){var e=document.createElement("style");document.getElementsByTagName("head").appendChild(e);}function u(e,t){var n=e.className,i=""!==n?" ":"";if(!m(e,t)){var r=n+i+t;e.className=r;}}function h(e,t){var n=e,i=""!==n?" ":"";return this.hasClass2(e,t)?e:n+i+t}function f(e,t){var n=" "+e.className+" ";n=n.replace(/(\s+)/gi," ");var i=n.replace(" "+t+" "," ");i=i.replace(/(^\s+)|(\s+$)/g,""),e.className=i;}function p(e,t){var n=" "+e+" ";n=n.replace(/(\s+)/gi," ");var i=n.replace(" "+t+" "," ");return i=i.replace(/(^\s+)|(\s+$)/g,"")}function d(e,t){
var this$1 = this;
for(var n=e.length,i=0;i<n;i++){ this$1.removeClass(e[i],t); }}function m(e,t){var n=e.className,i=n.split(/\s+/),r=0;for(r in i){ if(i[r]===t){ return!0; } }return!1}function v(e,t){if("string"==typeof e){var n=e.split(/\s+/),i=0;for(i in n){ if(n[i]===t){ return!0 } }}return!1}Object.defineProperty(t,"__esModule",{value:!0}),t.setStyleGroup=i,t.getStyleRotated=r,t.getStyleMatrix=a,t.cssValues=o,t.cssValue=s,t.colorAlpha=l,t.addStyle=c,t.addClass=u,t.addClass2=h,t.removeClass=f,t.removeClass2=p,t.removeClassArr=d,t.hasClass=m,t.hasClass2=v;},function(e,t,n){"use strict";function i(e,t,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:void 0,r=document.createEvent("HTMLEvents");r.initEvent(t,!0,!0),r.eventType=n,i&&(r.value=i),e.dispatchEvent(r);}Object.defineProperty(t,"__esModule",{value:!0}),t.customEventDispatch=i,t.CustomEvent={SOFTKEYBOARD_SHOW:"softkeyboard_show",SOFTKEYBOARD_HIDE:"softkeyboard_hide",SOFTKEYBOARD_TOUCH:"softkeyboard_touch",NOT_SOFTKEYBOARD_TOUCH:"not_softkeyboard_touch",SOFTKEYBOARD_INPUT_DELETE:"softkeyboard_delete",SOFTKEYBOARD_INPUT_MOVELEFT:"softkeyboard_moveLeft",SOFTKEYBOARD_INPUT_MOVERIGHT:"softkeyboard_moveRight",SOFTKEYBOARD_INPUT_VALUE:"softkeyboard_input_value",SYSKEYBOARD_SHOW:"systemkeyboard_show",INPUT_FOCUS:"input_focus",INPUT_BLUR:"input_blur",INPUT_HIT:"input_hit",INPUT_FOCUSOUT:"input_focusout",INPUT_CHANGE_LINE:"input_change_line"},t.EventType={SOFTKEYBOARD_INPUT:"softKeyboardInput",SOFTKEYBOARD:"softKeyboard",INPUTBOX:"inputBox"};},function(e,t,n){"use strict";function r(){return{w:window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,h:window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight}}function a(e,t){for(var n=void 0,i=t.length,r=0;r<i;r++){ -1!==(n=e.indexOf(t[r]))&&e.splice(n,1); }}function o(){var e=document.documentElement.style.fontSize;return Number(e.substr(0,e.length-2))}function s(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{x:0,y:0};if(document.documentElement.getBoundingClientRect){var n=G(),i=X(),r=Z(),a=J();t.x=e.getBoundingClientRect().left,t.y=e.getBoundingClientRect().top,t.x+=n-r,t.y+=i-a;}else{for(;e!==document.body;){ t.x+=e.offsetLeft,t.y+=e.offsetTop,e=e.offsetParent; }t.x+=window.screenLeft+document.body.clientLeft-document.body.scrollLeft,t.y+=window.screenTop+document.body.clientTop-document.body.scrollTop;}return t}function l(e,t){var n={x:0,y:0};if(document.documentElement.getBoundingClientRect){var i=X(),r=G(),a=Z(),o=J(),s=e.getBoundingClientRect(),l=(0,ee.cssValues)(e,["border-left-width","border-top-width","padding-left","padding-top"]),c=t.getBoundingClientRect(),u=(0,ee.cssValues)(t,["border-left-width","border-top-width"]);n.x=s.left-c.left-a+r-u[0]+l[0]+l[2],n.y=s.top-c.top-o+i-u[1]+l[1]+l[3];}else{for(;e!==t;){if(e===document.body){ throw new Error("参数 toElement 必须是 element的父级之一"); }n.x+=e.offsetLeft,n.y+=e.offsetTop,e=e.offsetParent;}n.x+=window.screenLeft+document.body.clientLeft-document.body.scrollLeft,n.y+=window.screenTop+document.body.clientTop-document.body.scrollTop;}return n}function c(e,t){var n=e.offsetWidth,i=e.offsetHeight,r=l(e,t);return{x:r.x,y:r.y,width:n,height:i,top:r.y,left:r.x,right:r.x+n,bottom:r.y+i}}function u(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{x:0,y:0},n=Z(),i=J(),r=e.getBoundingClientRect(),a=(0,ee.cssValues)(e,["border-left-width","border-top-width","padding-left","padding-top"]),o=e.parentNode;if(null!==o){var s=o.getBoundingClientRect(),l=(0,ee.cssValues)(o,["border-left-width","border-top-width"]);t.x=r.left-s.left-n-l[0]+a[0]+a[2],t.y=r.top-s.top-i-l[1]+a[1]+a[3];}else { t.x=r.left-n+a[0]+a[2],t.y=r.top-i+a[1]+a[3]; }return t}function h(e,t,n){if("rem"===n){var i=f();e.style.height=t/i+n;}else{ "px"===n&&(e.style.height=t+n); }}function f(){var e=document.documentElement.style.fontSize;return e=Number(e.substr(0,e.length-2))}function p(e){for(var t=e.parentNode,n=t.children,i=n.length,r=0;r<i;r++){ if(n[r]===e){ return r; } }return-1}function d(e,t){for(var n=e.childNodes,i=[],r=n.length,a=0;a<r;a++){ 1===n[a].nodeType&&i.push(n[a]); }return i[t]}function m(e){
var this$1 = this;
for(var t=e.split(","),n=document,i=[n],r=void 0,a=void 0,o=void 0,s=void 0,l=void 0,c=void 0,u=t.length,h=0;h<u;h++){ if(o=[],s=t[h],l=s.indexOf("#"),c=s.indexOf("."),a=i.length,-1!==l){s=s.replace("#","");for(var f=0;f<a;f++){ n=i[f],o.push(n.getElementById(s)); }i=o;}else if(-1!==c){s=s.replace(/\./g," ");for(var p=0;p<a;p++){ n=i[p],r=n.getElementsByClassName(s),o=o.concat(this$1.collectionToArray(r)); }i=o;}else{for(var d=0;d<a;d++){ n=i[d],r=n.getElementsByTagName(s),o=o.concat(this$1.collectionToArray(r)); }i=o;} }return i}function v(e){for(var t=[],n=void 0,i=e.childNodes,r=i.length,a=void 0,o=0;o<r;o++){ a=i[o],n=window.getComputedStyle(a),"none"!==n.display&&t.push(a); }return t}function g(e,t){var n=[],i=t.substr(1,t.length),r=void 0;if(-1!==t.indexOf("#")){ return K(i); }if(-1!==t.indexOf(".")){ return Y(e,i,n); }for(r=0;r<len;r++){ collection[r].tagName===t&&n.push(collection[r]); }return n}function y(e,t){var n=t.substr(1,t.length);return-1!==t.indexOf("#")?void 0:-1!==t.indexOf(".")?$(e,n):null}function b(e,t){
var this$1 = this;
var n=e.children,i=n.length,r=[],a=t.substr(1,t.length),o=void 0;if(-1!==t.indexOf("#")){for(o=0;o<i;o++){ n[o].id===t&&r.push(n[o]); }return r[0]}if(-1!==t.indexOf(".")){for(o=0;o<i;o++){ this$1.hasClass2(n[o].className,a)&&r.push(n[o]); }return r}for(o=0;o<i;o++){ n[o].tagName===t&&r.push(n[o]); }return r}function x(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0,i=t.substr(1,t.length);if(-1!==t.indexOf("#")){  }else if(-1!==t.indexOf(".")){var r=void 0;return void 0!==n&&(r=n.substr(1,n.length)),W(e,i,r)}}function w(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0,i=e.children,r=i.length;if(void 0!==n){ for(var a=n.substr(1,n.length),o=0;o<r;o++){var s=i[o];-1!==n.indexOf(".")?(0,ee.hasClass2)(s.className,a)||(t(s),w(s,t,n)):-1!==n.indexOf("#")||s.tagName!==n&&(t(s),w(s,t,n));} }else { for(var l=0;l<r;l++){var c=i[l];t(c),w(c,t);} }}function k(e,t){for(var n=document.getElementsByClassName(e),i=n.length,r=0;r<i;r++){ t(n[r]); }}function T(e,t,n){var i=document.createAttribute(t);i.nodeValue=n,e.attributes.setNamedItem(i);}function C(e,t){e.attributes.removeNamedItem(t);}function S(e,t){return e.attributes.getNamedItem(t)}function q(e){return Array.prototype.slice.call(e,0)}function O(e,t){if(null===t.parentNode){ throw new Error("insertAfter() 参数 element 没有父级"); }var n=t.parentNode;n.lastChild===t?n.appendChild(e):n.insertBefore(e,t.nextSibling);}function E(e){return e.nextElementSibling}function L(e){for(var t=[],n=e.nextElementSibling;null!==n;){ t.push(n),n=n.nextElementSibling; }return t}function _(e){return e.previousElementSibling}function D(e){for(var t=[],n=e.previousElementSibling;null!==n;){ t.push(n),n=n.previousElementSibling; }return t}function j(e){var t=[],n=this.nextEs(e),i=this.prevEs(e);return t=t.concat(n,i)}function A(e){return e.parentNode}function B(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=0,r=void 0;if(n&&(r=t(e))){ return r; }for(var a=e;i<1e3&&(i++,a=a.parentNode,"BODY"!==a.tagName);){ if(r=t(a)){ return!0; } }return!1}function Q(e,t){
var this$1 = this;
for(var n=void 0,i=void 0,r=e.length,a=0;a<r;a++){ if(n=e[a],i=this$1.contains(n,t)){ return!0; } }return i}function R(e,t){if("function"==typeof e.contains){ return e.contains(t); }if("function"==typeof e.compareDocumentPosition){ return!!(16&e.compareDocumentPosition(t)); }var n=t.parentNode;do{if(n===e){ return!0; }n=n.parentNode;}while(null!==n);return!1}function z(e){var t=void 0;window.getSelection&&document.createRange?(t=document.createRange(),t.selectNodeContents(e)):document.body.createTextRange&&(t=document.body.createTextRange(),t.moveToElementText(e),t.collapse(!0),t.select());}function N(e){document.all?e.createTextRange().select():(e.setSelectionRange(0,e.value.length),e.focus());}function I(e){if(document.all){var t=e.createTextRange();t.moveEnd("character",e.value.length),t.collapse(!1),t.select();}else { e.setSelectionRange(e.value.length,e.value.length),e.focus(); }}function M(){var e=navigator.userAgent.toLowerCase();return/msie/i.test(e)&&!/opera/.test(e)?void console.log("IE"):/firefox/i.test(e)?void console.log("Firefox"):/chrome/i.test(e)&&/webkit/i.test(e)&&/mozilla/i.test(e)?void console.log("Chrome"):/opera/i.test(e)?void console.log("Opera"):!/webkit/i.test(e)||/chrome/i.test(e)&&/webkit/i.test(e)&&/mozilla/i.test(e)?void console.log("unKnow"):void console.log("Safari")}function F(e,t,n){for(var i=e.length,r=0;r<i;r++){ e[r].addEventListener(t,n); }}function P(e,t){for(var n=e.length,i=0;i<n;i++){ t(i,e[i]); }}function H(e,t){var n=0,i=t.length;for(n;n<i;n++){ e.appendChild(t[n]); }}function V(e,t,n){var i=e.children,r=i[t],a=0,o=n.length;for(a;a<o;a++){ e.insertBefore(r,n[a]); }}function U(e,t,n){var i=e.children,r=0;for(r;r<n;r++){ e.removeChild(i[t]); }}function K(e){for(i=0;i<len;i++){ if(collection[i].id===findString){resultArr.push(collection[i]);break} }if(0===resultArr.length){ for(i=0;i<len;i++){ if(collection[i].id===findString){resultArr.push(collection[i]);break} } }return resultArr[0]}function Y(e,t,n){var i=e.children,r=i.length;if(0!==r){var a=void 0;for(a=0;a<r;a++){ (0,ee.hasClass2)(i[a].className,t)&&n.push(i[a]); }for(a=0;a<r;a++){ Y(i[a],t,n); }}return n}function $(e,t){var n=e.children,i=n.length,r=void 0;if(0!==i){var a=void 0;for(a=0;a<i;a++){ if((0,ee.hasClass2)(n[a].className,t)){ return r=n[a]; } }for(a=0;a<i;a++){ if(void 0!==(r=$(n[a],t))){ return r } }}return r}function W(e,t){for(var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0,i=0,r=e;i<1e3;){if("BODY"===r.tagName){ return null; }if((0,ee.hasClass2)(r.className,t)){ return r; }if((0,ee.hasClass2)(r.className,n)){ return null; }i++,r=r.parentNode;}}function G(){return window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0}function X(){return window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0}function Z(){return document.documentElement.clientLeft||document.body.clientLeft}function J(){return document.documentElement.clientTop||document.body.clientTop}Object.defineProperty(t,"__esModule",{value:!0}),t.getViewSize=r,t.arrRemoveGroup=a,t.rootFsValue=o,t.getPosToPage=s,t.getPosRelative=l,t.getRectRelative=c,t.getPosToParent=u,t.setHeight=h,t.getRemValue=f,t.indexOfElement=p,t.getChildElementAt=d,t.getEsByCondition=m,t.getChildrenVisible=v,t.getPosteritiesBy=g,t.getFirstPosterityBy=y,t.getChildrenBy=b,t.getParentBy=x,t.traversePosterities=w,t.groupByClass=k,t.addAttr=T,t.removeAttr=C,t.hasAttr=S,t.collectionToArray=q,t.insertAfter=O,t.nextE=E,t.nextEs=L,t.prevE=_,t.prevEs=D,t.siblingsEs=j,t.parentE=A,t.parentTo=B,t.containsFor=Q,t.contains=R,t.cursorPos=z,t.selectTextBefore=N,t.selectTextAfter=I,t.userBrowser=M,t.groupAddListener=F,t.groupExecute=P,t.addChildren=H,t.addChildrenBefore=V,t.removeChildrenAfter=U;var ee=n(0);},function(e,t,n){"use strict";function i(e,t){for(var n=e.length,i=void 0,r=0;r<n;r++){ if(t(r,e[r])){i=r;break} }return i}Object.defineProperty(t,"__esModule",{value:!0}),t.forArray=i;},function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="18">\n  <path fill="currentColor" d="M4.2 4.8a3.6 3.6 0 0 0-.1.1L1.9 7.1a10.1 10.1 0 0 1-.3.3L1 8l-.3.5c-.2.5-.2 1 0 1.4 0 .3.2.4.3.6a6.4 6.4 0 0 0 .6.6l.2.2 2 2a10.7 10.7 0 0 0 .3.3 2955 2955 0 0 1 4 3.7l1 .3a7.7 7.7 0 0 0 1.7.2h7.4a26.5 26.5 0 0 1 1.6-.2 4.1 4.1 0 0 0 2.2-1 4 4 0 0 0 1.1-2.2 7.5 7.5 0 0 0 .1-1.7V5.5a9.8 9.8 0 0 0 0-1.4L22.7 3A4 4 0 0 0 20 .8a7.8 7.8 0 0 0-2-.1h-.2v1.2a61.3 61.3 0 0 1 2 .1c.2 0 .5.1.7.3a2.6 2.6 0 0 1 1.2 1.1l.3.8a6.5 6.5 0 0 1 0 1.2v7.3a15.6 15.6 0 0 0 0 .4v1l-.3.8a2.8 2.8 0 0 1-2 1.4 6.6 6.6 0 0 1-1.4.1h-7.4a18.4 18.4 0 0 0-.5 0h-1a2.7 2.7 0 0 1-1.6-.9c0-.2-.1-.3-.2-.3l-2.5-2.5a5.8 5.8 0 0 0-.1-.2l-.2-.2-2-2-.2-.1a6.2 6.2 0 0 1-.5-.6L2 9.3v-.4a4.7 4.7 0 0 1 .6-.6l.2-.2 2-2 .1-.2H5l.1-.1 2.2-2.2.3-.3a18.6 18.6 0 0 1 1-1l.9-.2a6.4 6.4 0 0 1 1.4 0h6.9V.6h-6.3a31.6 31.6 0 0 0-2.2 0L8 1.2a4 4 0 0 0-1 .9l-.4.3-.3.3-2.1 2.1zM11 6.6a.6.6 0 1 1 1-.7l2.4 2.5 2.4-2.5.1-.1a.6.6 0 1 1 .8.8l-2.5 2.6 2.4 2.4h.1a.6.6 0 1 1-.8.9L14.4 10l-2.6 2.5a.6.6 0 1 1-.7-.9l2.5-2.4L11 6.6z"/>\n</svg>\n';},function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="10">\n  <text fill="currentColor" fill-rule="evenodd" font-family="PingFangSC-Regular, PingFang SC" font-size="20" letter-spacing="-1" transform="translate(-20 -22)">\n    <tspan x="20" y="34">←</tspan>\n  </text>\n</svg>\n';},function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="10">\n  <text fill="currentColor" fill-rule="evenodd" font-family="PingFangSC-Regular, PingFang SC" font-size="20" letter-spacing="-1" transform="translate(-20 -22)">\n    <tspan x="20.5" y="34">→</tspan>\n  </text>\n</svg>\n';},function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="5">\n  <path fill="currentColor" d="M1.1 0v2.8c0 .6.6 1 1.2 1h15.4c.6 0 1.2-.4 1.2-1V0H20v3.3c0 1-.8 1.7-1.7 1.7H1.7C.7 5 0 4.3 0 3.3V0h1.1z"/>\n</svg>\n';},function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" width="19" height="17">\n  <path fill="currentColor" d="M18.1 10.5H14v4.8l-.1.4a1.3 1.3 0 0 1-.6.6l-.4.1a3 3 0 0 1-.5 0H6.5a3 3 0 0 1-.4 0l-.4-.1a1.4 1.4 0 0 1-.6-.6l-.1-.4v-4.9H.6c-.5 0-1-.9-.5-1.4L9 .2l.4-.2c.2 0 .3 0 .4.2L18.6 9c.6.5.1 1.5-.5 1.5z"/>\n</svg>\n';},function(e,t,n){"use strict";function i(){var e=navigator.userAgent.toLowerCase(),t=-1!==e.indexOf("mac"),n=-1!==e.indexOf("macintosh"),i=-1!==e.indexOf("ipad"),r=-1!==e.indexOf("iphone os"),a=-1!==e.indexOf("android"),o=-1!==e.indexOf("windows nt"),s=-1!==e.indexOf("Windows Phone"),l=-1!==e.indexOf("mobile"),c=void 0;return o?c="windows computer":s?c="windows phone":t&&n?c="ios computer":i?c="ios pad":r?c="ios phone":a?c=l?"android phone":"android pad":(c="other",console.log("sUserAgent,",e)),c}Object.defineProperty(t,"__esModule",{value:!0}),t.judgeDeviceOfBrowser=i;},function(e,t){e.exports={name:"InputAndKeyboard",version:"0.1.4",description:"mathquill input and soft-keyboard",main:"index.js",scripts:{dev:"webpack-dev-server --config build/webpack.dev.js  --progress --profile --colors","build:umd":"webpack --config build/webpack.umd.js","build:var":"webpack --config build/webpack.var.js",buildT:"webpack --config build/webpack.proTest.js"},author:"siyao",license:"ISC",devDependencies:{"assets-webpack-plugin":"^3.5.1",autoprefixer:"^8.5.0","babel-core":"^6.26.0","babel-loader":"^7.1.2","babel-plugin-transform-runtime":"^6.23.0","babel-polyfill":"^6.26.0","babel-preset-es2015":"^6.24.1","babel-preset-stage-2":"^6.24.1","clean-webpack-plugin":"^0.1.17","copy-webpack-plugin":"^4.4.2","css-loader":"^0.28.8","extract-text-webpack-plugin":"^3.0.2","file-loader":"^1.1.6",fs:"0.0.1-security","html-webpack-plugin":"^2.30.1","json-loader":"^0.5.7","node-sass":"^4.7.2",postcss:"^6.0.22","postcss-loader":"^2.1.5","raw-loader":"^0.5.1","sass-loader":"^6.0.6","style-loader":"^0.19.1",webpack:"^3.10.0","webpack-bundle-analyzer":"^2.10.0","webpack-dev-server":"^2.10.0","webpack-merge":"^4.1.1","webpack-spritesmith":"^0.4.0","webpack-visualizer-plugin":"^0.1.11"},dependencies:{},browserslist:["iOS>=7","last 3 iOS versions"]};},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.iconSvg=t.keyTypeCollection=void 0;var r=n(19),a=i(r),o=n(20),s=i(o),l=n(4),c=i(l),u=n(21),h=i(u),f=n(22),p=i(f),d=n(23),m=i(d),v=n(5),g=i(v),y=n(24),b=i(y),x=n(25),w=i(x),k=n(26),T=i(k),C=n(6),S=i(C),q=n(27),O=i(q),E=n(7),L=i(E),_=n(8),D=i(_),j=n(28),A=i(j),B=n(29),Q=i(B),R=n(30),z=i(R),N=n(31),I=i(N),M=n(32),F=i(M);t.keyTypeCollection={number:[{type:"number",value:"0",latex:""},{type:"number",value:"1",latex:""},{type:"number",value:"2",latex:""},{type:"number",value:"3",latex:""},{type:"number",value:"4",latex:""},{type:"number",value:"5",latex:""},{type:"number",value:"6",latex:""},{type:"number",value:"7",latex:""},{type:"number",value:"8",latex:""},{type:"number",value:"9",latex:""}],lowercase:{a:{type:"lowercase",value:"a",latex:""},b:{type:"lowercase",value:"b",latex:""},c:{type:"lowercase",value:"c",latex:""},d:{type:"lowercase",value:"d",latex:""},e:{type:"lowercase",value:"e",latex:""},f:{type:"lowercase",value:"f",latex:""},g:{type:"lowercase",value:"g",latex:""},h:{type:"lowercase",value:"h",latex:""},i:{type:"lowercase",value:"i",latex:""},j:{type:"lowercase",value:"j",latex:""},k:{type:"lowercase",value:"k",latex:""},l:{type:"lowercase",value:"l",latex:""},m:{type:"lowercase",value:"m",latex:""},n:{type:"lowercase",value:"n",latex:""},o:{type:"lowercase",value:"o",latex:""},p:{type:"lowercase",value:"p",latex:""},q:{type:"lowercase",value:"q",latex:""},r:{type:"lowercase",value:"r",latex:""},s:{type:"lowercase",value:"s",latex:""},t:{type:"lowercase",value:"t",latex:""},u:{type:"lowercase",value:"u",latex:""},v:{type:"lowercase",value:"v",latex:""},w:{type:"lowercase",value:"w",latex:""},x:{type:"lowercase",value:"x",latex:""},y:{type:"lowercase",value:"y",latex:""},z:{type:"lowercase",value:"z",latex:""}},capital:{a:{type:"capital",value:"A",latex:""},b:{type:"capital",value:"B",latex:""},c:{type:"capital",value:"C",latex:""},d:{type:"capital",value:"D",latex:""},e:{type:"capital",value:"E",latex:""},f:{type:"capital",value:"F",latex:""},g:{type:"capital",value:"G",latex:""},h:{type:"capital",value:"H",latex:""},i:{type:"capital",value:"I",latex:""},j:{type:"capital",value:"J",latex:""},k:{type:"capital",value:"K",latex:""},l:{type:"capital",value:"L",latex:""},m:{type:"capital",value:"M",latex:""},n:{type:"capital",value:"N",latex:""},o:{type:"capital",value:"O",latex:""},p:{type:"capital",value:"P",latex:""},q:{type:"capital",value:"Q",latex:""},r:{type:"capital",value:"R",latex:""},s:{type:"capital",value:"S",latex:""},t:{type:"capital",value:"T",latex:""},u:{type:"capital",value:"U",latex:""},v:{type:"capital",value:"V",latex:""},w:{type:"capital",value:"W",latex:""},x:{type:"capital",value:"X",latex:""},y:{type:"capital",value:"Y",latex:""},z:{type:"capital",value:"Z",latex:""}},mathSymbol:{add:{type:"mathSymbol",value:"+",latex:""},sub:{type:"mathSymbol",value:"-",latex:""},mul:{type:"mathSymbol",value:"×",latex:"\\times"},div:{type:"mathSymbol",value:"÷",latex:"\\div"},pN:{type:"mathSymbol",value:"±",latex:"\\pm"},equal:{type:"mathSymbol",value:"=",latex:""},unequal:{type:"mathSymbol",value:"≠",latex:"\\ne"},greater:{type:"mathSymbol",value:">",latex:""},less:{type:"mathSymbol",value:"<",latex:""},greatOrEqual:{type:"mathSymbol",value:"≥",latex:"\\geqslant"},lessOrEqual:{type:"mathSymbol",value:"≤",latex:"\\leqslant "},farGreater:{type:"mathSymbol",value:"≫",latex:"\\gg"},farLess:{type:"mathSymbol",value:"≪",latex:"\\ll"},pi:{type:"mathSymbol",value:"π",latex:"\\pi"},dot:{type:"mathSymbol",value:".",latex:""},percent:{type:"mathSymbol",value:"%",latex:"\\%"},cdot:{type:"mathSymbol",value:"·",latex:"\\cdot"},odot:{type:"mathSymbol",value:"⨀",latex:"\\odot"},oplus:{type:"mathSymbol",value:"⊕",latex:"\\oplus"},otimes:{type:"mathSymbol",value:"⊗",latex:"\\otimes"},approx:{type:"mathSymbol",value:"≈",latex:"\\approx"},equiv:{type:"mathSymbol",value:"≡",latex:"\\equiv"},triangle:{type:"mathSymbol",value:"△",latex:"\\triangle"},angle:{type:"mathSymbol",value:"∠",latex:"\\angle"},perp:{type:"mathSymbol",value:"⊥",latex:"\\bot"},parallel:{type:"mathSymbol",value:"//",latex:"//"},backsim:{type:"mathSymbol",value:"∽",latex:"\\backsim"},cong:{type:"mathSymbol",value:"≌",latex:""},cdots:{type:"mathSymbol",value:"⋯",latex:"\\cdots"},mid:{type:"mathSymbol",value:"|",latex:""},in:{type:"mathSymbol",value:"∈",latex:"\\in"},notin:{type:"mathSymbol",value:"∉",latex:"\\notin"},subseteq:{type:"mathSymbol",value:"⊆",latex:"\\subseteq"},subsetneqq:{type:"mathSymbol",value:"⫋",latex:"\\subsetneqq"},subset:{type:"mathSymbol",value:"∁",latex:"\\complement"},varnothing:{type:"mathSymbol",value:"∅",latex:"\\varnothing"},cup:{type:"mathSymbol",value:"∪",latex:"\\cup"},cap:{type:"mathSymbol",value:"∩",latex:"\\cap"},int:{type:"mathSymbol",value:"∫",latex:"\\int"},infty:{type:"mathSymbol",value:"∞",latex:"\\infty"},exists:{type:"mathSymbol",value:"∃",latex:"\\exists"},forall:{type:"mathSymbol",value:"∀",latex:"\\forall"},Rightarrow:{type:"mathSymbol",value:"⇒",latex:"\\Rightarrow"},Leftrightarrow:{type:"mathSymbol",value:"⇔",latex:"\\Leftrightarrow"},lnot:{type:"mathSymbol",value:"¬",latex:""},lor:{type:"mathSymbol",value:"∨",latex:"\\vee"},wedge:{type:"mathSymbol",value:"∧",latex:"\\wedge"}},parentheses:{left:{type:"parentheses",value:"(",latex:""},right:{type:"parentheses",value:")",latex:""}},squareBrackets:{left:{type:"squareBrackets",value:"[",latex:""},right:{type:"squareBrackets",value:"]",latex:""}},brackets:{left:{type:"brackets",value:"{",latex:"\\lbrace"},right:{type:"brackets",value:"}",latex:"\\rbrace"}},unit:{degree:{type:"unit",value:"°",latex:"^\\circ",iconType:"svg",iconName:"blackDu"}},chinese:{huo:{type:"chinese",value:"或",latex:""}},greekLower:{alpha:{type:"greekLower",value:"α",latex:"\\alpha",iconType:"text"},beta:{type:"greekLower",value:"β",latex:"\\beta",iconType:"text"},gamma:{type:"greekLower",value:"γ",latex:"\\gamma",iconType:"text"},delta:{type:"greekLower",value:"δ",latex:"\\delta",iconType:"text"},epsilon:{type:"greekLower",value:"ϵ",latex:"\\epsilon",iconType:"text"},varepsilon:{type:"greekLower",value:"ε",latex:"\\varepsilon",iconType:"text"},zeta:{type:"greekLower",value:"ζ",latex:"\\zeta",iconType:"text"},eta:{type:"greekLower",value:"η",latex:"\\eta",iconType:"text"},theta:{type:"greekLower",value:"θ",latex:"\\theta",iconType:"text"},iota:{type:"greekLower",value:"ι",latex:"\\iota",iconType:"text"},kappa:{type:"greekLower",value:"κ",latex:"\\kappa",iconType:"text"},lambda:{type:"greekLower",value:"λ",latex:"\\lambda",iconType:"text"},mu:{type:"greekLower",value:"μ",latex:"\\mu",iconType:"text"},nu:{type:"greekLower",value:"ν",latex:"\\nu",iconType:"text"},xi:{type:"greekLower",value:"ξ",latex:"\\xi",iconType:"text"},omicron:{type:"greekLower",value:"ο",latex:"",iconType:"text"},pi:{type:"greekLower",value:"π",latex:"\\pi",iconType:"text"},rho:{type:"greekLower",value:"ρ",latex:"\\rho",iconType:"text"},sigma:{type:"greekLower",value:"σ",latex:"\\sigma",iconType:"text"},tau:{type:"greekLower",value:"τ",latex:"\\tau",iconType:"text"},upsilon:{type:"greekLower",value:"υ",latex:"\\upsilon",iconType:"text"},chi:{type:"greekLower",value:"χ",latex:"\\chi",iconType:"text"},psi:{type:"greekLower",value:"ψ",latex:"\\psi",iconType:"text"},omega:{type:"greekLower",value:"ω",latex:"\\omega",iconType:"text"},phi:{type:"greekLower",value:"ϕ",latex:"\\phi",iconType:"svg",iconName:"blackPhi2"},varphi:{type:"greekLower",value:"φ",latex:"\\varphi",iconType:"svg",iconName:"blackPhi1"}},greekCapital:{alpha:{type:"greekCapital",value:"A",latex:"A"},beta:{type:"greekCapital",value:"B",latex:"B"},gamma:{type:"greekCapital",value:"Γ",latex:"\\Gamma"},delta:{type:"greekCapital",value:"Δ",latex:"\\Delta"},epsilon:{type:"greekCapital",value:"E",latex:"E"},zeta:{type:"greekCapital",value:"Z",latex:"Z"},eta:{type:"greekCapital",value:"H",latex:"H"},theta:{type:"greekCapital",value:"Θ",latex:"\\Theta"},iota:{type:"greekCapital",value:"Ι",latex:"I"},kappa:{type:"greekCapital",value:"K",latex:"K"},lambda:{type:"greekCapital",value:"Λ",latex:"\\Lambda"},mu:{type:"greekCapital",value:"M",latex:"M"},nu:{type:"greekCapital",value:"N",latex:"N"},xi:{type:"greekCapital",value:"Ξ",latex:"\\Xi"},omicron:{type:"greekCapital",value:"O",latex:"O"},pi:{type:"greekCapital",value:"Π",latex:"\\Pi"},rho:{type:"greekCapital",value:"P",latex:"P"},sigma:{type:"greekCapital",value:"Σ",latex:"\\Sigma"},tau:{type:"greekCapital",value:"T",latex:"T"},upsilon:{type:"greekCapital",value:"Υ",latex:"\\Upsilon"},phi:{type:"greekCapital",value:"Φ",latex:"\\Phi"},chi:{type:"greekCapital",value:"X",latex:"X"},psi:{type:"greekCapital",value:"Ψ",latex:"\\Psi"},omega:{type:"greekCapital",value:"Ω",latex:"\\Omega"}},symbol:{colon:{type:"mathSymbol",value:":",latex:""},comma:{type:"mathSymbol",value:",",latex:""},minutePrime:{type:"mathSymbol",value:"'"},secondPrime:{type:"mathSymbol",value:'"'},at:{type:"symbol",value:"@",latex:""},hash:{type:"symbol",value:"#",latex:""},dollar:{type:"symbol",value:"$",latex:""},rmb:{type:"symbol",value:"¥",latex:""},and:{type:"symbol",value:"&",latex:""},asterisk:{type:"symbol",value:"*",latex:"\\ast"},excla:{type:"symbol",value:"!",latex:""},pause:{type:"symbol",value:"、",latex:""},slash:{type:"symbol",value:"／",latex:""},backslash:{type:"symbol",value:"\\",latex:"\\backslash"},question:{type:"symbol",value:"?",latex:""}},specialText:{circle1:{type:"specialText",value:"①",latex:""},circle2:{type:"specialText",value:"②",latex:""},circle3:{type:"specialText",value:"③",latex:""},circle4:{type:"specialText",value:"④",latex:""},circle5:{type:"specialText",value:"⑤",latex:""},circle6:{type:"specialText",value:"⑥",latex:""},circle7:{type:"specialText",value:"⑦",latex:""},circle8:{type:"specialText",value:"⑧",latex:""},circle9:{type:"specialText",value:"⑨",latex:""},circle10:{type:"specialText",value:"⑩",latex:""},rightarrow:{type:"specialText",value:"→",latex:"\\rightarrow"},leftarrow:{type:"specialText",value:"←",latex:"\\leftarrow"},uparrow:{type:"specialText",value:"↑",latex:"\\uparrow"},downarrow:{type:"specialText",value:"↓",latex:"\\downarrow"},nwarrow:{type:"specialText",value:"↖",latex:"\\nwarrow"},nearrow:{type:"specialText",value:"↗",latex:"\\nearrow"},bigstar:{type:"specialText",value:"☆",latex:"\\bigstar"},diamond:{type:"specialText",value:"◊",latex:"\\diamond"},bigcirc:{type:"specialText",value:"◯",latex:"\\bigcirc"},square:{type:"specialText",value:"□",latex:"\\square"}},formula:{fraction:{type:"formula",value:"fraction",latex:"\\frac{}{}",iconName:"blackFrac"},radical:{type:"formula",value:"radical",latex:"\\sqrt{}",iconName:"blackSqrt"},radicalN:{type:"formula",value:"radicalN",latex:"\\sqrt[]{}",iconName:"blackRootN"},mean:{type:"formula",value:"mean",latex:"\\bar{}",iconName:"blackHeng"},vector:{type:"formula",value:"vector",latex:"\\overrightarrow{}",iconName:"blackVec"},arc:{type:"formula",value:"arc",latex:"\\overarc{}",iconName:"blackArc"},repeat:{type:"formula",value:"repeat",latex:"\\dot{}",iconName:"blackLoop"},sup:{type:"formula",value:"sup",latex:"^{}",iconName:"blackSup"},sub:{type:"formula",value:"sub",latex:"_{}",iconName:"blackSub"},combination:{type:"formula",value:"combination",latex:"^{}_{}",iconName:"blackSupSub"},braces:{type:"formula",value:"·",latex:"\\cdot",iconName:"blackBrace"}},functional:{del:{type:"functional",value:"del",latex:"",iconType:"svg",iconName:"blackDelete"},shift:{type:"functional",value:"shift",latex:"",iconType:"svg",iconName:"blackShift"},space:{type:"functional",value:"space",latex:"\\ ",iconType:"png",iconName:"blackShape"},left:{type:"functional",value:"left",latex:"",iconType:"svg",iconName:"blackLeft"},right:{type:"functional",value:"right",latex:"",iconType:"svg",iconName:"blackRight"}},placeholder:{place:{type:"placeholder",iconClass:"",value:""}},switch:{number:{type:"switch",value:"123",latex:"",selected:!1},english:{type:"switch",value:"abc",latex:"",selected:!1},greek:{type:"switch",value:"αβγ",latex:"",selected:!1},common:{type:"switch",value:"常用",latex:"",selected:!1,keyMap:"common"},formula:{type:"switch",value:"公式",latex:"",selected:!1,keyMap:"formula"},symbol:{type:"switch",value:"符号",latex:"",selected:!1,keyMap:"symbol"},symbolSimple:{type:"switch",value:"符",latex:"",selected:!1,keyMap:"symbolSimple"}}},t.iconSvg={blackArc:a.default,blackBrace:s.default,blackDelete:c.default,blackDu:h.default,blackFrac:p.default,blackHeng:m.default,blackLeft:g.default,blackLoop:b.default,blackPhi1:w.default,blackPhi2:T.default,blackRight:S.default,blackRootN:O.default,blackShape:L.default,blackShift:D.default,blackSqrt:A.default,blackSub:Q.default,blackSup:z.default,blackSupSub:I.default,blackVec:F.default};},,,,function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t)){ throw new TypeError("Cannot call a class as a function") }}Object.defineProperty(t,"__esModule",{value:!0}),n(16),n(17);var r=n(0),a=n(1),o=function e(t,n,o){function s(){p="Backspace";}function l(){p="";}function c(){var e=g.getInfoOfCursorLeft(),t=e[-1].ctrlSeq;isNaN(t)?(g.keystroke("Left"),g.keystroke("Left")):g.keystroke("Left");}function u(){var e=g.getInfoOfCursorLeft(),t=e[-1].ctrlSeq;isNaN(t)?(g.keystroke("Left"),g.keystroke("Left"),g.keystroke("Left")):(g.keystroke("Left"),g.keystroke("Left"));}i(this,e);var h=this;this.id=t.index;var f=!0,p=void 0,d=void 0,m=MathQuill.getInterface(2);if(void 0===o){ throw new Error("请传入 containerEl参数"); }this.el=o;var v=this.el,g=m.MathField(v,{handlers:{edit:function(e){if(d=e.getCurrentElement(),(0,r.hasClass)(d,"mq-upperDot-number")){var t=d.children.length;if("Backspace"!==p){ if(2===t){ g.keystroke("Right"); }else if(3===t){var n=e.getCursorNeighbor();"/"===n[0].ctrlSeq||n[1]&&"/"===n[1].ctrlSeq?g.keystroke("Right"):(e.keystroke("Backspace"),e.moveToRightEnd(),g.keystroke("Right"));}else { t>3&&(e.keystroke("Backspace"),e.moveToRightEnd(),g.keystroke("Right")); } }}(0,a.customEventDispatch)(document,"input_broadcast","broadcast",JSON.stringify({index:h.id,latex:e.latex()}));}}});void 0!==t.className&&(0,r.addClass)(v,t.className),void 0!==t.value&&""!==t.value&&g.write(t.value),v.addEventListener("SystemBackspaceEvent",s),v.addEventListener("SystemInputEvent",l),g.setDeviceType(n),this.inputHandler=function(e){f&&(p=e,g.write(e),"\\frac{}{}"===e?g.keystroke("Left"):"^{}"===e?c():"_{}"===e?c():"^{}_{}"===e?u():"\\sqrt{}"===e?g.keystroke("Left"):"\\sqrt[]{}"===e?(g.keystroke("Left"),g.keystroke("Left")):"\\dot{}"===e?g.keystroke("Left"):"\\overarc{}"===e?g.keystroke("Left"):"\\bar{}"===e?g.keystroke("Left"):"\\overrightarrow{}"===e&&g.keystroke("Left"));},this.setWidth=function(e){v.querySelector(".mq-root-block").style.width=e+"px";},this.deleteHandler=function(){p="Backspace",g.keystroke("Backspace");},this.moveLeftHandler=function(){g.keystroke("Left");},this.moveRightHandler=function(){g.keystroke("Right");},this.addInto=function(e){e.appendChild(v);},this.addClass=function(e){(0,r.addClass)(v,e);},this.addInputResponse=function(e){v.addEventListener("hitInputStart",e);},this.remove=function(){var e=v.parentNode;void 0!==e&&e.removeChild(v);},this.focusDisguise=function(){g.focusDisguise();},this.hasFocus=function(){return g.hasFocus()},this.focus=function(){g.focus();},this.blur=function(){g.blur();},this.setLatex=function(e){g.latex(e);},this.getLatex=function(){return g.latex()},this.setEnabled=function(e){f=e,e?(0,r.removeClass)(v,"unabled"):(0,r.addClass)(v,"unabled"),g.setEnabled(e);},this.getCompositionBoo=function(){return g.getCompositionBoo()},this.setCompositionLeft=function(e){g.setCompositionLeft(e);};};t.default=o;},function(e,t){},function(e,t,n){(function(e){!function(){function t(){}function n(e){var t=e.length-1;return function(){var n=T.call(arguments,0,t),i=T.call(arguments,t);return e.apply(this,n.concat([i]))}}function i(e){return n(function(t,n){"function"!=typeof t&&(t=C(t));var i=function(e){return t.apply(e,[e].concat(n))};return e.call(this,i)})}function r(e){var t=T.call(arguments,1);return function(){return e.apply(this,t)}}function a(e,t){if(!t){ throw new Error("prayer failed: "+e) }}function o(e){a("a direction was passed",e===q||e===O);}function s(e,t,n){a("a parent is always present",e),a("leftward is properly set up",function(){return t?t[O]===n&&t.parent===e:e.ends[q]===n}()),a("rightward is properly set up",function(){return n?n[q]===t&&n.parent===e:e.ends[O]===t}());}function l(){window.console&&console.warn('You are using the MathQuill API without specifying an interface version, which will fail in v1.0.0. You can fix this easily by doing this before doing anything else:\n\n    MathQuill = MathQuill.getInterface(1);\n    // now MathQuill.MathField() works like it used to\n\nSee also the "`dev` branch (2014–2015) → v0.10.0 Migration Guide" at\n  https://github.com/mathquill/mathquill/wiki/%60dev%60-branch-(2014%E2%80%932015)-%E2%86%92-v0.10.0-Migration-Guide');}function c(e){return l(),Me(e)}function u(e){function n(e){if(!e||!e.nodeType){ return null; }var t=E(e).children(".mq-root-block").attr(x),n=t&&_.byId[t].controller;return n?r[n.KIND_OF_MQ](n):null}function i(e,t){t&&t.handlers&&(t.handlers={fns:t.handlers,APIClasses:r});for(var n in t){ if(t.hasOwnProperty(n)){var i=t[n],a=I[n];e[n]=a?a(i):i;} }}if(!(P<=e&&e<=H)){ throw"Only interface versions between "+P+" and "+H+" supported. You specified: "+e; }var r={};n.L=q,n.R=O,n.config=function(e){return i(N.p,e),this},n.registerEmbed=function(e,t){if(!/^[a-z][a-z0-9]*$/i.test(e)){ throw"Embed name must start with letter and be only letters and digits"; }F[e]=t;};var a=r.AbstractMathQuill=S(M,function(e){e.init=function(e){this.__controller=e,this.__options=e.options,this.id=e.id,this.data=e.data;},e.__mathquillify=function(e){var t=this.__controller,n=t.root,i=t.container;t.createTextarea();var r=i.addClass(e).contents().detach();n.jQ=E('<span class="mq-root-block"/>').attr(x,n.id).appendTo(i),this.latex(r.text()),this.revert=function(){return i.empty().unbind(".mathquill").removeClass("mq-editable-field mq-math-mode mq-text-mode").append(r)};},e.config=function(e){return i(this.__options,e),this},e.el=function(){return this.__controller.container[0]},e.text=function(){return this.__controller.exportText()},e.latex=function(e){return arguments.length>0?(this.__controller.renderLatexMath(e),this.__controller.blurred&&this.__controller.cursor.hide().parent.blur(),this):this.__controller.exportLatex()},e.html=function(){return this.__controller.root.jQ.html().replace(/ mathquill-(?:command|block)-id="?\d+"?/g,"").replace(/<span class="?mq-cursor( mq-blink)?"?>.?<\/span>/i,"").replace(/ mq-hasCursor|mq-hasCursor ?/,"").replace(/ class=(""|(?= |>))/g,"")},e.reflow=function(){return this.__controller.root.postOrder("reflow"),this};});n.prototype=a.prototype,r.EditableField=S(a,function(e,n){e.__mathquillify=function(){return n.__mathquillify.apply(this,arguments),this.__controller.editable=!0,this.__controller.delegateMouseEvents(),this.__controller.editablesTextareaEvents(),this},e.focus=function(){return console.log("Z _.focus"),this.__controller.textarea.focus(),this},e.blur=function(){return console.log("Z _.blur"),this.__controller.textarea.blur(),this},e.hasFocus=function(){return this.__controller.textarea[0]===document.activeElement},e.focusDisguise=function(){return this.__controller.container.trigger("focusCamouflage"),this},e.setDeviceType=function(e){return y=e,this},e.getCompositionBoo=function(){return this.__controller.compositionBoo},e.setCompositionLeft=function(e){return this.__controller.compositionLeft=e,this},e.getCurrentElement=function(){return this.__controller.cursor.parent.jQ[0]},e.setEnabled=function(e){return this.__controller.enabled=e,this},e.getInfoOfCursorLeft=function(){return this.__controller.cursor[-1]},e.getCursorNeighbor=function(){var e=[];return 0!==this.__controller.cursor[1]&&e.push(this.__controller.cursor[1]),0!==this.__controller.cursor[-1]&&e.push(this.__controller.cursor[-1]),e},e.write=function(e){return this.__controller.writeLatex(e),this.__controller.scrollHoriz(),this.__controller.blurred&&!this.__controller.virtualFocus&&this.__controller.cursor.hide().parent.blur(),this},e.cmd=function(e){var t=this.__controller.notify(),n=t.cursor;if(/^\\[a-z]+$/i.test(e)){e=e.slice(1);var i=j[e];i&&(e=i(e),n.selection&&e.replaces(n.replaceSelection()),e.createLeftOf(n.show()),this.__controller.scrollHoriz());}else { n.parent.write(n,e); }return t.blurred&&n.hide().parent.blur(),this},e.select=function(){var e=this.__controller;for(e.notify("move").cursor.insAtRightEnd(e.root);e.cursor[q];){ e.selectLeft(); }return this},e.clearSelection=function(){return this.__controller.cursor.clearSelection(),this},e.moveToDirEnd=function(e){return this.__controller.notify("move").cursor.insAtDirEnd(e,this.__controller.root),this},e.moveToLeftEnd=function(){return this.moveToDirEnd(q)},e.moveToRightEnd=function(){return this.moveToDirEnd(O)},e.keystroke=function(e){
var this$1 = this;
for(var e=e.replace(/^\s+|\s+$/g,"").split(/\s+/),n=0;n<e.length;n+=1){ this$1.__controller.keystroke(e[n],{preventDefault:t}); }return this},e.typedText=function(e){
var this$1 = this;
for(var t=0;t<e.length;t+=1){ this$1.__controller.typedText(e.charAt(t)); }return this},e.dropEmbedded=function(e,t,n){var i=e-E(window).scrollLeft(),r=t-E(window).scrollTop(),a=document.elementFromPoint(i,r);this.__controller.seek(E(a),e,t),Ie().setOptions(n).createLeftOf(this.__controller.cursor);};}),n.EditableField=function(){throw"wtf don't call me, I'm 'abstract'"},n.EditableField.prototype=r.EditableField.prototype;for(var o in z){ !function(t,i){var a=r[t]=i(r);n[t]=function(i,r){var o=n(i);if(o instanceof a||!i||!i.nodeType){ return o; }var s=R(a.RootBlock(),E(i),N());return s.KIND_OF_MQ=t,a(s).__mathquillify(r,e)},n[t].prototype=a.prototype;}(o,z[o]); }return n}function h(e){for(var t="moveOutOf deleteOutOf selectOutOf upOutOf downOutOf".split(" "),n=0;n<t.length;n+=1){ !function(t){e[t]=function(e){this.controller.handle(t,e);};}(t[n]); }e.reflow=function(){this.controller.handle("reflow"),this.controller.handle("edited"),this.controller.handle("edit");};}function f(e,t,n,i){var r=document.createEvent("HTMLEvents");r.initEvent(t,!0,!0),r.eventType=n,i&&(r.value=i),e.dispatchEvent(r);}function p(e,t,n){return S(te,{ctrlSeq:e,htmlTemplate:"<"+t+" "+n+">&0</"+t+">"})}function d(e){var t=this.parent,n=e;do{if(n[O]){ return e.insLeftOf(t); }n=n.parent.parent;}while(n!==t);e.insRightOf(t);}function m(e,t){e.jQadd=function(){t.jQadd.apply(this,arguments),this.delimjQs=this.jQ.children(":first").add(this.jQ.children(":last")),this.contentjQ=this.jQ.children(":eq(1)");},e.reflow=function(){var e=this.contentjQ.outerHeight()/parseFloat(this.contentjQ.css("fontSize"));ke(this.delimjQs,w(1+.2*(e-1),1.2),1.2*e);};}function v(e,t){var t=t||e,n=ze[e],i=ze[t];A[e]=r(Re,q,e,n,t,i),A[n]=r(Re,O,e,n,t,i);}var g,y,b=e,x="mathquill-block-id",w=Math.min,k=Math.max,T=[].slice,C=n(function(e,t){return n(function(n,i){if(e in n){ return n[e].apply(n,t.concat(i)) }})}),S=function(e,t,n){function i(e){return"object"==typeof e}function r(e){return"function"==typeof e}function a(){}return function e(n,o){function s(){var e=new l;return r(e.init)&&e.init.apply(e,arguments),e}function l(){}void 0===o&&(o=n,n=Object),s.Bare=l;var c,u=a.prototype=n.prototype,h=l.prototype=s.prototype=s.p=new a;return h.constructor=s,s.mixin=function(t){return l.prototype=s.prototype=e(s,t).prototype,s},(s.open=function(e){if(c={},r(e)?c=e.call(s,h,u,s,n):i(e)&&(c=e),i(c)){ for(var a in c){ t.call(c,a)&&(h[a]=c[a]); } }return r(h.init)||(h.init=n),s})(o)}}(0,{}.hasOwnProperty),q=-1,O=1,E=S(b,function(e){e.insDirOf=function(e,t){return e===q?this.insertBefore(t.first()):this.insertAfter(t.last())},e.insAtDirEnd=function(e,t){return e===q?this.prependTo(t):this.appendTo(t)};}),L=S(function(e){e.parent=0,e[q]=0,e[O]=0,e.init=function(e,t,n){this.parent=e,this[q]=t,this[O]=n;},this.copy=function(e){return L(e.parent,e[q],e[O])};}),_=S(function(e){function t(){return n+=1}e[q]=0,e[O]=0,e.parent=0;var n=0;this.byId={},e.init=function(){this.id=t(),_.byId[this.id]=this,this.ends={},this.ends[q]=0,this.ends[O]=0;},e.dispose=function(){delete _.byId[this.id];},e.toString=function(){return"{{ MathQuill Node #"+this.id+" }}"},e.jQ=E(),e.jQadd=function(e){return this.jQ=this.jQ.add(e)},e.jQize=function(e){function t(e){if(e.getAttribute){var n=e.getAttribute("mathquill-command-id"),i=e.getAttribute("mathquill-block-id");n&&_.byId[n].jQadd(e),i&&_.byId[i].jQadd(e);}for(e=e.firstChild;e;e=e.nextSibling){ t(e); }}for(var e=E(e||this.html()),n=0;n<e.length;n+=1){ t(e[n]); }return e},e.createDir=function(e,t){o(e);var n=this;return n.jQize(),n.jQ.insDirOf(e,t.jQ),t[e]=n.adopt(t.parent,t[q],t[O]),n},e.createLeftOf=function(e){return this.createDir(q,e)},e.selectChildren=function(e,t){return Q(e,t)},e.bubble=i(function(e){for(var t=this;t&&!1!==e(t);t=t.parent){  }return this}),e.postOrder=i(function(e){return function t(n){n.eachChild(t),e(n);}(this),this}),e.isEmpty=function(){return 0===this.ends[q]&&0===this.ends[O]},e.children=function(){return D(this.ends[q],this.ends[O])},e.eachChild=function(){var e=this.children();return e.each.apply(e,arguments),this},e.foldChildren=function(e,t){return this.children().fold(e,t)},e.withDirAdopt=function(e,t,n,i){return D(this,this).withDirAdopt(e,t,n,i),this},e.adopt=function(e,t,n){return D(this,this).adopt(e,t,n),this},e.disown=function(){return D(this,this).disown(),this},e.remove=function(){return this.jQ.remove(),this.postOrder("dispose"),this.disown()};}),D=S(function(e){e.init=function(e,t,n){if(n===g&&(n=q),o(n),a("no half-empty fragments",!e==!t),this.ends={},e){a("withDir is passed to Fragment",e instanceof _),a("oppDir is passed to Fragment",t instanceof _),a("withDir and oppDir have the same parent",e.parent===t.parent),this.ends[n]=e,this.ends[-n]=t;var i=this.fold([],function(e,t){return e.push.apply(e,t.jQ.get()),e});this.jQ=this.jQ.add(i);}},e.jQ=E(),e.withDirAdopt=function(e,t,n,i){return e===q?this.adopt(t,n,i):this.adopt(t,i,n)},e.adopt=function(e,t,n){s(e,t,n);var i=this;i.disowned=!1;var r=i.ends[q];if(!r){ return this; }var a=i.ends[O];return t||(e.ends[q]=r),n?n[q]=a:e.ends[O]=a,i.ends[O][O]=n,i.each(function(n){n[q]=t,n.parent=e,t&&(t[O]=n),t=n;}),i},e.disown=function(){var e=this,t=e.ends[q];if(!t||e.disowned){ return e; }e.disowned=!0;var n=e.ends[O],i=t.parent;return s(i,t[q],t),s(i,n,n[O]),t[q]?t[q][O]=n[O]:i.ends[q]=n[O],n[O]?n[O][q]=t[q]:i.ends[O]=t[q],e},e.remove=function(){return this.jQ.remove(),this.each("postOrder","dispose"),this.disown()},e.each=i(function(e){var t=this,n=t.ends[q];if(!n){ return t; }for(;n!==t.ends[O][O]&&!1!==e(n);n=n[O]){  }return t}),e.fold=function(e,t){return this.each(function(n){e=t.call(this,e,n);}),e};}),j={},A={},B=S(L,function(e){e.init=function(e,t){this.parent=e,this.options=t;var n=this.jQ=this._jQ=E('<span class="mq-cursor">&#8203;</span>');this.blink=function(){n.toggleClass("mq-blink");},this.upDownCache={};},e.show=function(){return this.jQ=this._jQ.removeClass("mq-blink"),"intervalId"in this?clearInterval(this.intervalId):(this[O]?this.selection&&this.selection.ends[q][q]===this[q]?this.jQ.insertBefore(this.selection.jQ):this.jQ.insertBefore(this[O].jQ.first()):this.jQ.appendTo(this.parent.jQ),this.parent.focus()),this.intervalId=setInterval(this.blink,500),this},e.hide=function(){return"intervalId"in this&&clearInterval(this.intervalId),delete this.intervalId,this.jQ.detach(),this.jQ=E(),this},e.withDirInsertAt=function(e,t,n,i){var r=this.parent;this.parent=t,this[e]=n,this[-e]=i,r!==t&&r.blur&&r.blur();},e.insDirOf=function(e,t){return o(e),this.jQ.insDirOf(e,t.jQ),this.withDirInsertAt(e,t.parent,t[e],t),this.parent.jQ.addClass("mq-hasCursor"),this},e.insLeftOf=function(e){return this.insDirOf(q,e)},e.insRightOf=function(e){return this.insDirOf(O,e)},e.insAtDirEnd=function(e,t){return o(e),this.jQ.insAtDirEnd(e,t.jQ),this.withDirInsertAt(e,t,0,t.ends[e]),t.focus(),this},e.insAtLeftEnd=function(e){return this.insAtDirEnd(q,e)},e.insAtRightEnd=function(e){return this.insAtDirEnd(O,e)},e.jumpUpDown=function(e,t){var n=this;n.upDownCache[e.id]=L.copy(n);var i=n.upDownCache[t.id];if(i){ i[O]?n.insLeftOf(i[O]):n.insAtRightEnd(i.parent); }else{var r=n.offset().left;t.seek(r,n);}},e.offset=function(){var e=this,t=e.jQ.removeClass("mq-cursor").offset();return e.jQ.addClass("mq-cursor"),t},e.unwrapGramp=function(){
var this$1 = this;
var e=this.parent.parent,t=e.parent,n=e[O],i=this,r=e[q];if(e.disown().eachChild(function(i){i.isEmpty()||(i.children().adopt(t,r,n).each(function(t){t.jQ.insertBefore(e.jQ.first());}),r=i.ends[O]);}),!this[O]){ if(this[q]){ this[O]=this[q][O]; }else { for(;!this[O];){if(this$1.parent=this$1.parent[O],!this$1.parent){this$1[O]=e[O],this$1.parent=t;break}this$1[O]=this$1.parent.ends[q];} } }this[O]?this.insLeftOf(this[O]):this.insAtRightEnd(t),e.jQ.remove(),e[q].siblingDeleted&&e[q].siblingDeleted(i.options,O),e[O].siblingDeleted&&e[O].siblingDeleted(i.options,q);},e.startSelection=function(){for(var e=this.anticursor=L.copy(this),t=e.ancestors={},n=e;n.parent;n=n.parent){ t[n.parent.id]=n; }},e.endSelection=function(){delete this.anticursor;},e.select=function(){var e=this.anticursor;if(this[q]===e[q]&&this.parent===e.parent){ return!1; }for(var t=this;t.parent;t=t.parent){ if(t.parent.id in e.ancestors){var n=t.parent;break} }a("cursor and anticursor in the same tree",n);var i,r,o=e.ancestors[n.id],s=O;if(t[q]!==o){ for(var l=t;l;l=l[O]){ if(l[O]===o[O]){s=q,i=t,r=o;break} } }return s===O&&(i=o,r=t),i instanceof L&&(i=i[O]),r instanceof L&&(r=r[q]),this.hide().selection=n.selectChildren(i,r),this.insDirOf(s,this.selection.ends[s]),this.selectionChanged(),!0},e.clearSelection=function(){return this.selection&&(this.selection.clear(),delete this.selection,this.selectionChanged()),this},e.deleteSelection=function(){this.selection&&(this[q]=this.selection.ends[q][q],this[O]=this.selection.ends[O][O],this.selection.remove(),this.selectionChanged(),delete this.selection);},e.replaceSelection=function(){var e=this.selection;return e&&(this[q]=e.ends[q][q],this[O]=e.ends[O][O],delete this.selection),e};}),Q=S(D,function(e,t){e.init=function(){t.init.apply(this,arguments),this.jQ=this.jQ.wrapAll('<span class="mq-selection"></span>').parent();},e.adopt=function(){return this.jQ.replaceWith(this.jQ=this.jQ.children()),t.adopt.apply(this,arguments)},e.clear=function(){return this.jQ.replaceWith(this.jQ[0].childNodes),this},e.join=function(e){return this.fold("",function(t,n){return t+n[e]()})};}),R=S(function(e){e.init=function(e,t,n){this.id=e.id,this.data={},this.compositionBoo=!1,this.compositionLeft=!1,this.enabled=!0,this.virtualFocus=!1,this.root=e,this.container=t,this.options=n,e.controller=this,this.cursor=e.cursor=B(e,n);},e.handle=function(e,t){var n=this.options.handlers;if(n&&n.fns[e]){var i=n.APIClasses[this.KIND_OF_MQ](this);t===q||t===O?n.fns[e](t,i):n.fns[e](i);}};var t=[];this.onNotify=function(e){t.push(e);},e.notify=function(){
var arguments$1 = arguments;
var this$1 = this;
for(var e=0;e<t.length;e+=1){ t[e].apply(this$1.cursor,arguments$1); }return this};}),z={},N=S(),I={},M=S(),F={};c.prototype=M.p,c.interfaceVersion=function(e){if(1!==e){ throw"Only interface version 1 supported. You specified: "+e; }return l=function(){window.console&&console.warn('You called MathQuill.interfaceVersion(1); to specify the interface version, which will fail in v1.0.0. You can fix this easily by doing this before doing anything else:\n\n    MathQuill = MathQuill.getInterface(1);\n    // now MathQuill.MathField() works like it used to\n\nSee also the "`dev` branch (2014–2015) → v0.10.0 Migration Guide" at\n  https://github.com/mathquill/mathquill/wiki/%60dev%60-branch-(2014%E2%80%932015)-%E2%86%92-v0.10.0-Migration-Guide');},l(),c},c.getInterface=u;var P=u.MIN=1,H=u.MAX=2;c.noConflict=function(){return window.MathQuill=V,c};var V=window.MathQuill;window.MathQuill=c;var U=S(function(e,t,n){function i(e,t){throw e=e?"'"+e+"'":"EOF","Parse Error: "+t+" at "+e}e.init=function(e){this._=e;},e.parse=function(e){function t(e,t){return t}return this.skip(s)._(""+e,t,i)},e.or=function(e){a("or is passed a parser",e instanceof n);var t=this;return n(function(n,i,r){function a(t){return e._(n,i,r)}return t._(n,i,a)})},e.then=function(e){var t=this;return n(function(i,r,o){function s(t,i){var s=e instanceof n?e:e(i);return a("a parser is returned",s instanceof n),s._(t,r,o)}return t._(i,s,o)})},e.many=function(){var e=this;return n(function(t,n,i){function r(e,n){return t=e,o.push(n),!0}function a(){return!1}for(var o=[];e._(t,r,a);){  }return n(t,o)})},e.times=function(e,t){arguments.length<2&&(t=e);var i=this;return n(function(n,r,a){function o(e,t){return u.push(t),n=e,!0}function s(e,t){return c=t,n=e,!1}function l(e,t){return!1}for(var c,u=[],h=!0,f=0;f<e;f+=1){ if(!(h=i._(n,o,s))){ return a(n,c); } }for(;f<t&&h;f+=1){ h=i._(n,o,l); }return r(n,u)})},e.result=function(e){return this.then(o(e))},e.atMost=function(e){return this.times(0,e)},e.atLeast=function(e){var t=this;return t.times(e).then(function(e){return t.many().map(function(t){return e.concat(t)})})},e.map=function(e){return this.then(function(t){return o(e(t))})},e.skip=function(e){return this.then(function(t){return e.result(t)})};var r=(this.string=function(e){var t=e.length,i="expected '"+e+"'";return n(function(n,r,a){var o=n.slice(0,t);return o===e?r(n.slice(t),o):a(n,i)})},this.regex=function(e){a("regexp parser is anchored","^"===e.toString().charAt(1));var t="expected "+e;return n(function(n,i,r){var a=e.exec(n);if(a){var o=a[0];return i(n.slice(o.length),o)}return r(n,t)})}),o=n.succeed=function(e){return n(function(t,n){return n(t,e)})},s=(n.fail=function(e){return n(function(t,n,i){return i(t,e)})},n.letter=r(/^[a-z]/i),n.letters=r(/^[a-z]*/i),n.digit=r(/^[0-9]/),n.digits=r(/^[0-9]*/),n.whitespace=r(/^\s+/),n.optWhitespace=r(/^\s*/),n.any=n(function(e,t,n){return e?t(e.slice(1),e.charAt(0)):n(e,"expected any character")}),n.all=n(function(e,t,n){return t("",e)}),n.eof=n(function(e,t,n){return e?n(e,"expected EOF"):t(e,e)}));}),K=function(){function e(e,t){var i,r=e.which||e.keyCode,a=e.key,o=n[r],s=[];return e.ctrlKey&&s.push("Ctrl"),e.originalEvent&&e.originalEvent.metaKey&&s.push("Meta"),e.altKey&&s.push("Alt"),e.shiftKey&&s.push("Shift"),i=t?o||a||String.fromCharCode(r):o||String.fromCharCode(r),s.length||o?(s.push(i),s.join("-")):i}var n={8:"Backspace",9:"Tab",10:"Enter",13:"Enter",16:"Shift",17:"Control",18:"Alt",20:"CapsLock",27:"Esc",32:"Spacebar",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",45:"Insert",46:"Del",144:"NumLock"};return function(n,i){function r(e){j=e,clearTimeout(C),C=setTimeout(e);}function a(e){f(i.container[0],"SystemBackspaceEvent","systemBoard"),"keyup"===e.type&&(O=!1);}function o(e){j(),j=t,clearTimeout(C),E.val(e),e&&E[0].select&&E[0].select(),A=!!e;}function s(){var e=E[0];return"selectionStart"in e&&e.selectionStart!==e.selectionEnd}function l(){i.keystroke(e(S,i.compositionBoo),S);}function c(e){S=e,q=null,A&&r(function(e){e&&"focusout"===e.type||!E[0].select||E[0].select(),j=t,clearTimeout(C);}),l();}function u(e){S&&q&&l(),q=e;}function h(e){i.compositionBoo=!0,_=!0;}function p(e){_=!1,i.compositionBoo=!1,E.val("");}function d(){if(!s()){var e=E.val();D=e.replace(/\s+/g,""),i.typedText(e.substr(-1,1));}}function m(){if(!s()){var e=E.val();E.val(""),x(),i.typedText(e);}}function v(){if(!s()){var e=E.val();i.compositionBoo&&_?(D=e.replace(/\s+/g,""),i.typedText(e.substr(-1,1))):i.compositionBoo&&!_?(x(),i.typedText(e),i.compositionBoo=!1):1===e.length?(E.val(""),i.typedText(e)):e&&E[0].select&&E[0].select();}}function g(){if(!s()){var e=E.val();i.compositionBoo?i.typedText(e):(E.val(""),i.typedText(e));}}function x(){for(var e=D.length,t=0;t<e;t++){ i.backspace(); }D="",E.val("");}function w(){S=q=null;}function k(e){E.focus(),r(T);}function T(){var e=E.val();E.val(""),e&&i.paste(e);}var C,S=null,q=null,O=!1,E=b(n),L=b(i.container||E),_=!1,D="",j=t;L.bind("keydown keypress input keyup focusout paste",function(e){console.log("第一响应:",e,",textarea:",E.val()),-1!==y.indexOf("computer")?"Backspace"===e.key?f(i.container[0],"SystemBackspaceEvent","systemBoard"):("keyup"===e.type&&v(),f(i.container[0],"SystemInputEvent","systemBoard")):("keydown"===e.type?O=!0:"keyup"===e.type&&f(i.container[0],"SystemInputEvent","systemBoard"),-1!==y.indexOf("android")?"Backspace"===e.key?a(e):i.compositionBoo?O?_&&"keyup"===e.type?d():_||"keyup"!==e.type||(m(),i.compositionBoo=!1):"input"===e.type&&d():"input"===e.type&&m():-1!==y.indexOf("ios")&&("Backspace"===e.key?a(e):"input"===e.type&&g()));});var A=!1;return L.bind({compositionstart:h,compositionend:p,keydown:c,keypress:u,focusout:w,paste:k}),{select:o}}}();R.open(function(e,t){e.exportText=function(){return this.root.foldChildren("",function(e,t){return e+t.text()})};}),R.open(function(e){e.focusBlurEvents=function(){function e(e){r.enabled&&("hitInputStart"===e.type||"focusCamouflage"===e.type?r.virtualFocus=!0:r.blurred=!1,clearTimeout(i),r.container.addClass("mq-focused"),o.parent||o.insAtRightEnd(a),o.selection?(o.selection.jQ.removeClass("mq-blur"),r.selectionChanged()):o.show());}function t(){clearTimeout(i),o.selection&&o.selection.jQ.addClass("mq-blur"),n();}function n(){o.hide().parent.blur(),r.container.removeClass("mq-focused"),E(window).off("blur",t);}var i,r=this,a=r.root,o=r.cursor;r.container[0].addEventListener("hitInputStart",e),r.container.bind("focusCamouflage",e),r.textarea.focus(e).blur(function(){r.blurred=!0,r.virtualFocus=!1,r.enabled&&(f(r.container[0],"mathquill_blur","mathquill"),i=setTimeout(function(){a.postOrder("intentionalBlur"),o.clearSelection().endSelection(),n();}),E(window).on("blur",t));}),r.blurred=!0,o.hide().parent.blur();};}),R.open(function(e){e.keystroke=function(e,t){this.cursor.parent.keystroke(e,t,this);};}),_.open(function(e){e.keystroke=function(e,t,n){var i=n.cursor;switch(e){case"Ctrl-Shift-Backspace":case"Ctrl-Backspace":n.ctrlDeleteDir(q);break;case"Shift-Backspace":case"Backspace":n.backspace();break;case"Esc":case"Tab":return void n.escapeDir(O,e,t);case"Shift-Tab":case"Shift-Esc":return void n.escapeDir(q,e,t);case"End":n.notify("move").cursor.insAtRightEnd(i.parent);break;case"Ctrl-End":n.notify("move").cursor.insAtRightEnd(n.root);break;case"Shift-End":for(;i[O];){ n.selectRight(); }break;case"Ctrl-Shift-End":for(;i[O]||i.parent!==n.root;){ n.selectRight(); }break;case"Home":n.notify("move").cursor.insAtLeftEnd(i.parent);break;case"Ctrl-Home":n.notify("move").cursor.insAtLeftEnd(n.root);break;case"Shift-Home":for(;i[q];){ n.selectLeft(); }break;case"Ctrl-Shift-Home":for(;i[q]||i.parent!==n.root;){ n.selectLeft(); }break;case"Left":n.moveLeft();break;case"Shift-Left":n.selectLeft();break;case"Ctrl-Left":break;case"Right":n.moveRight();break;case"Shift-Right":n.selectRight();break;case"Ctrl-Right":break;case"Up":n.moveUp();break;case"Down":n.moveDown();break;case"Shift-Up":if(i[q]){ for(;i[q];){ n.selectLeft(); } }else { n.selectLeft(); }case"Shift-Down":if(i[O]){ for(;i[O];){ n.selectRight(); } }else { n.selectRight(); }case"Ctrl-Up":case"Ctrl-Down":break;case"Ctrl-Shift-Del":case"Ctrl-Del":n.ctrlDeleteDir(O);break;case"Shift-Del":case"Del":n.deleteForward();break;case"Meta-A":case"Ctrl-A":for(n.notify("move").cursor.insAtRightEnd(n.root);i[q];){ n.selectLeft(); }break;default:return}t.preventDefault(),n.scrollHoriz();},e.moveOutOf=e.moveTowards=e.deleteOutOf=e.deleteTowards=e.unselectInto=e.selectOutOf=e.selectTowards=function(){a("overridden or never called on this node");};}),R.open(function(e){function t(e,t){var n=e.notify("upDown").cursor,i=t+"Into",r=t+"OutOf";return n[O][i]?n.insAtLeftEnd(n[O][i]):n[q][i]?n.insAtRightEnd(n[q][i]):n.parent.bubble(function(e){var t=e[r];if(t&&("function"==typeof t&&(t=e[r](n)),t instanceof _&&n.jumpUpDown(e,t),!0!==t)){ return!1 }}),e}this.onNotify(function(e){"move"!==e&&"upDown"!==e||this.show().clearSelection();}),e.escapeDir=function(e,t,n){o(e);var i=this.cursor;if(i.parent!==this.root&&n.preventDefault(),i.parent!==this.root){ return i.parent.moveOutOf(e,i),this.notify("move") }},I.leftRightIntoCmdGoes=function(e){if(e&&"up"!==e&&"down"!==e){ throw'"up" or "down" required for leftRightIntoCmdGoes option, got "'+e+'"'; }return e},e.moveDir=function(e){o(e);var t=this.cursor,n=t.options.leftRightIntoCmdGoes;return t.selection?t.insDirOf(e,t.selection.ends[e]):t[e]?t[e].moveTowards(e,t,n):t.parent.moveOutOf(e,t,n),this.notify("move")},e.moveLeft=function(){return this.moveDir(q)},e.moveRight=function(){return this.moveDir(O)},e.moveUp=function(){return t(this,"up")},e.moveDown=function(){return t(this,"down")},this.onNotify(function(e){"upDown"!==e&&(this.upDownCache={});}),this.onNotify(function(e){"edit"===e&&this.show().deleteSelection();}),e.deleteDir=function(e){o(e);var t=this.cursor,n=t.selection;return this.notify("edit"),n||(t[e]?t[e].deleteTowards(e,t):t.parent.deleteOutOf(e,t)),t[q].siblingDeleted&&t[q].siblingDeleted(t.options,O),t[O].siblingDeleted&&t[O].siblingDeleted(t.options,q),t.parent.bubble("reflow"),this},e.ctrlDeleteDir=function(e){o(e);var t=this.cursor;return!t[q]||t.selection?ctrlr.deleteDir():(this.notify("edit"),D(t.parent.ends[q],t[q]).remove(),t.insAtDirEnd(q,t.parent),t[q].siblingDeleted&&t[q].siblingDeleted(t.options,O),t[O].siblingDeleted&&t[O].siblingDeleted(t.options,q),t.parent.bubble("reflow"),this)},e.backspace=function(){return this.deleteDir(q)},e.deleteForward=function(){return this.deleteDir(O)},this.onNotify(function(e){"select"!==e&&this.endSelection();}),e.selectDir=function(e){var t=this.notify("select").cursor,n=t.selection;o(e),t.anticursor||t.startSelection();var i=t[e];i?n&&n.ends[e]===i&&t.anticursor[-e]!==i?i.unselectInto(e,t):i.selectTowards(e,t):t.parent.selectOutOf(e,t),t.clearSelection(),t.select()||t.show();},e.selectLeft=function(){return this.selectDir(q)},e.selectRight=function(){return this.selectDir(O)};});var Y=function(){function e(e){var t=J();return e.adopt(t,0,0),t}function t(e){for(var t=e[0]||J(),n=1;n<e.length;n+=1){ e[n].children().adopt(t,t.ends[O],0); }return t}var n=U.string,i=U.regex,r=U.letter,a=U.any,o=U.optWhitespace,s=U.succeed,l=U.fail,c=r.map(function(e){return se(e)}),u=i(/^[^${}\\_^]/).map(function(e){return X(e)}),h=i(/^[^\\a-eg-zA-Z]/).or(n("\\").then(i(/^[a-z]+/i).or(i(/^\s+/).result(" ")).or(a))).then(function(e){var t=j[e];return t?t(e).parser():l("unknown command: \\"+e)}),f=h.or(c).or(u),p=n("{").then(function(){return m}).skip(n("}")),d=o.then(p.or(f.map(e))),m=d.many().map(t).skip(o),v=n("[").then(d.then(function(e){return"]"!==e.join("latex")?s(e):l()}).many().map(t).skip(o)).skip(n("]")),g=m;return g.block=d,g.optBlock=v,g}();R.open(function(e,t){e.exportLatex=function(){return this.root.latex().replace(/(\\[a-z]+) (?![a-z])/gi,"$1")},e.writeLatex=function(e){var t=this.notify("edit").cursor,n=U.all,i=U.eof,r=Y.skip(i).or(n.result(!1)).parse(e);return r&&!r.isEmpty()&&(r.children().adopt(t.parent,t[q],t[O]),r.jQize().insertBefore(t.jQ),t[q]=r.ends[O],r.finalizeInsert(t.options,t),r.ends[O][O].siblingCreated&&r.ends[O][O].siblingCreated(t.options,q),r.ends[q][q].siblingCreated&&r.ends[q][q].siblingCreated(t.options,O),t.parent.bubble("reflow")),this},e.renderLatexMath=function(e){var t=this.root,n=this.cursor,i=U.all,r=U.eof,a=Y.skip(r).or(i.result(!1)).parse(e);t.eachChild("postOrder","dispose"),t.ends[q]=t.ends[O]=0,a&&a.children().adopt(t,0,0);var o=t.jQ;if(a){var s=a.join("html");o.html(s),t.jQize(o.children()),t.finalizeInsert(n.options);}else { o.empty(); }delete n.selection,n.insAtRightEnd(t);},e.renderLatexText=function(e){var t=this.root,n=this.cursor;t.jQ.children().slice(1).remove(),t.eachChild("postOrder","dispose"),t.ends[q]=t.ends[O]=0,delete n.selection,n.show().insAtRightEnd(t);var i=U.regex,r=U.string,a=U.eof,o=U.all,s=r("$").then(Y).skip(r("$").or(a)).map(function(e){var t=ie(n);t.createBlocks();var i=t.ends[q];return e.children().adopt(i,0,0),t}),l=r("\\$").result("$"),c=l.or(i(/^[^$]/)).map(X),u=s.or(c).many(),h=u.skip(a).or(o.result(!1)).parse(e);if(h){for(var f=0;f<h.length;f+=1){ h[f].adopt(t,t.ends[O],0); }t.jQize().appendTo(t.jQ),t.finalizeInsert(n.options);}};}),R.open(function(e){e.delegateMouseEvents=function(){var e=this.root.jQ;this.container.bind("mousedown.mathquill",function(n){function i(e){p=E(e.target);}function r(e){u.anticursor||u.startSelection(),c.seek(p,e.pageX,e.pageY).cursor.select(),p=g;}function a(e){c.enabled&&(e.preventDefault(),u.blink=h,u.selection||(c.editable?u.show():d.detach()),o.unbind("mousemove",i),E(e.target.ownerDocument).unbind("mousemove",r).unbind("mouseup",a),f(o[0],"hitInputEnd","mathquill",e.target));}var o,s=n.target;o=E(s).hasClass("mq-editable-field")?E(s.querySelector(".mq-root-block")):E(s).closest(".mq-root-block");var l=_.byId[o.attr(x)||e.attr(x)],c=l.controller,u=c.cursor,h=u.blink;if(c.enabled){var p,d=c.textareaSpan,m=c.textarea;c.blurred&&(c.editable||o.prepend(d),-1!==y.indexOf("computer")&&m.focus(),f(o[0],"hitInputStart","mathquill",n.target)),n.preventDefault(),n.target.unselectable=!0,u.blink=t,c.seek(E(n.target),n.pageX,n.pageY).cursor.startSelection(),o.mousemove(i),E(n.target.ownerDocument).mousemove(r).mouseup(a);}});};}),R.open(function(e){e.seek=function(e,t,n){var i=this.notify("select").cursor;if(e){var r=e.attr(x)||e.attr("mathquill-command-id");if(!r){var o=e.parent();r=o.attr(x)||o.attr("mathquill-command-id");}}var s=r?_.byId[r]:this.root;return a("nodeId is the id of some Node that exists",s),i.clearSelection().show(),s.seek(t,i),this.scrollHoriz(),this};}),R.open(function(e){e.scrollHoriz=function(){var e=this.cursor,t=e.selection,n=this.root.jQ[0].getBoundingClientRect();if(t){var i=t.jQ[0].getBoundingClientRect(),r=i.left-(n.left+20),a=i.right-(n.right-20);if(t.ends[q]===e[O]){ if(r<0){ var o=r; }else{if(!(a>0)){ return; }if(i.left-a<n.left+20){ var o=r; }else { var o=a; }} }else if(a>0){ var o=a; }else{if(!(r<0)){ return; }if(i.right-r>n.right-20){ var o=a; }else { var o=r; }}}else{var s=e.jQ[0].getBoundingClientRect().left;if(s>n.right-20){ var o=s-(n.right-20); }else{if(!(s<n.left+20)){ return; }var o=s-(n.left+20);}}this.root.jQ.stop().animate({scrollLeft:"+="+o},100);};}),R.open(function(e){N.p.substituteTextarea=function(){return E("<textarea autocapitalize=off autocomplete=off autocorrect=off spellcheck=false x-palm-disable-ste-all=true />")[0]},e.createTextarea=function(){var e=this.textareaSpan=E('<span class="mq-textarea"></span>'),t=this.options.substituteTextarea();if(!t.nodeType){ throw"substituteTextarea() must return a DOM element, got "+t; }t=this.textarea=E(t).appendTo(e);var n=this;n.cursor.selectionChanged=function(){n.selectionChanged();},n.container.bind("copy",function(){n.setTextareaSelection();});},e.selectionChanged=function(){var e=this;Ce(e.container[0]),e.textareaSelectionTimeout===g&&(e.textareaSelectionTimeout=setTimeout(function(){e.setTextareaSelection();}));},e.setTextareaSelection=function(){this.textareaSelectionTimeout=g;var e="";this.cursor.selection&&(e=this.cursor.selection.join("latex"),this.options.statelessClipboard&&(e="$"+e+"$")),this.selectFn(e);},e.staticMathTextareaEvents=function(){function e(){r.detach(),t.blurred=!0;}var t=this,n=(t.root,t.cursor),i=t.textarea,r=t.textareaSpan;this.container.prepend('<span class="mq-selectable">$'+t.exportLatex()+"$</span>"),t.blurred=!0,i.bind("cut paste",!1).focus(function(){t.blurred=!1;}).blur(function(){n.selection&&n.selection.clear(),setTimeout(e);}),t.selectFn=function(e){i.val(e),e&&i.select();};},e.editablesTextareaEvents=function(){var e=this,t=(e.root,e.cursor),n=e.textarea,i=e.textareaSpan,r=K(n,this);this.selectFn=function(e){r.select(e);},this.container.prepend(i).on("cut",function(n){t.selection&&setTimeout(function(){e.notify("edit"),t.parent.bubble("reflow");});}),this.focusBlurEvents();},e.typedText=function(e){if("\n"===e){ return this.handle("enter"); }var t=this.notify().cursor,n=e.length;if(1===n){ t.parent.write(t,e); }else { for(var i=0;i<n;i++){ t.parent.write(t,e.charAt(i)); } }this.scrollHoriz();},e.paste=function(e){this.options.statelessClipboard&&(e="$"===e.slice(0,1)&&"$"===e.slice(-1)?e.slice(1,-1):"\\text{"+e+"}"),this.writeLatex(e).cursor.show();};});var $=S(_,function(e,t){e.finalizeInsert=function(e,t){var n=this;n.postOrder("finalizeTree",e),n.postOrder("contactWeld",t),n.postOrder("blur"),n.postOrder("reflow"),n[O].siblingCreated&&n[O].siblingCreated(e,q),n[q].siblingCreated&&n[q].siblingCreated(e,O),n.bubble("reflow");};}),W=S($,function(e,t){e.init=function(e,n,i){var r=this;t.init.call(r),r.ctrlSeq||(r.ctrlSeq=e),n&&(r.htmlTemplate=n),i&&(r.textTemplate=i);},e.replaces=function(e){e.disown(),this.replacedFragment=e;},e.isEmpty=function(){return this.foldChildren(!0,function(e,t){return e&&t.isEmpty()})},e.parser=function(){var e=Y.block,t=this;return e.times(t.numBlocks()).map(function(e){t.blocks=e;for(var n=0;n<e.length;n+=1){ e[n].adopt(t,t.ends[O],0); }return t})},e.createLeftOf=function(e){var n=this,i=n.replacedFragment;n.createBlocks(),t.createLeftOf.call(n,e),i&&(i.adopt(n.ends[q],0,0),i.jQ.appendTo(n.ends[q].jQ)),n.finalizeInsert(e.options),n.placeCursor(e);},e.createBlocks=function(){for(var e=this,t=e.numBlocks(),n=e.blocks=Array(t),i=0;i<t;i+=1){ (n[i]=J()).adopt(e,e.ends[O],0); }},e.placeCursor=function(e){e.insAtRightEnd(this.foldChildren(this.ends[q],function(e,t){return e.isEmpty()?e:t}));},e.moveTowards=function(e,t,n){var i=n&&this[n+"Into"];t.insAtDirEnd(-e,i||this.ends[-e]);},e.deleteTowards=function(e,t){this.isEmpty()?t[e]=this.remove()[e]:this.moveTowards(e,t,null);},e.selectTowards=function(e,t){t[-e]=this,t[e]=this[e];},e.selectChildren=function(){return Q(this,this)},e.unselectInto=function(e,t){t.insAtDirEnd(-e,t.anticursor.ancestors[this.id]);},e.seek=function(e,t){function n(e){var t={};return t[q]=e.jQ.offset().left,t[O]=t[q]+e.jQ.outerWidth(),t}var i=this,r=n(i);if(e<r[q]){ return t.insLeftOf(i); }if(e>r[O]){ return t.insRightOf(i); }var a=r[q];i.eachChild(function(o){var s=n(o);return e<s[q]?(e-a<s[q]-e?o[q]?t.insAtRightEnd(o[q]):t.insLeftOf(i):t.insAtLeftEnd(o),!1):e>s[O]?void(o[O]?a=s[O]:r[O]-e<e-s[O]?t.insRightOf(i):t.insAtRightEnd(o)):(o.seek(e,t),!1)});},e.numBlocks=function(){var e=this.htmlTemplate.match(/&\d+/g);return e?e.length:0},e.html=function(){var e=this,t=e.blocks,n=" mathquill-command-id="+e.id,i=e.htmlTemplate.match(/<[^<>]+>|[^<>]+/g);a("no unmatched angle brackets",i.join("")===this.htmlTemplate);for(var r=0,o=i[0];o;r+=1,o=i[r]){ if("/>"===o.slice(-2)){ i[r]=o.slice(0,-2)+n+"/>"; }else if("<"===o.charAt(0)){a("not an unmatched top-level close tag","/"!==o.charAt(1)),i[r]=o.slice(0,-1)+n+">";var s=1;do{r+=1,o=i[r],a("no missing close tags",o),"</"===o.slice(0,2)?s-=1:"<"===o.charAt(0)&&"/>"!==o.slice(-2)&&(s+=1);}while(s>0)} }return i.join("").replace(/>&(\d+)/g,function(e,n){return" mathquill-block-id="+t[n].id+">"+t[n].join("html")})},e.latex=function(){return this.foldChildren(this.ctrlSeq,function(e,t){return e+"{"+(t.latex()||" ")+"}"})},e.textTemplate=[""],e.text=function(){var e=this,t=0;return e.foldChildren(e.textTemplate[t],function(n,i){t+=1;var r=i.text();return n&&"("===e.textTemplate[t]&&"("===r[0]&&")"===r.slice(-1)?n+r.slice(1,-1)+e.textTemplate[t]:n+i.text()+(e.textTemplate[t]||"")})};}),G=S(W,function(e,n){e.init=function(e,t,i){i||(i=e&&e.length>1?e.slice(1):e),n.init.call(this,e,t,[i]);},e.parser=function(){return U.succeed(this)},e.numBlocks=function(){return 0},e.replaces=function(e){e.remove();},e.createBlocks=t,e.moveTowards=function(e,t){t.jQ.insDirOf(e,this.jQ),t[-e]=this,t[e]=this[e];},e.deleteTowards=function(e,t){t[e]=this.remove()[e];},e.seek=function(e,t){e-this.jQ.offset().left<this.jQ.outerWidth()/2?t.insLeftOf(this):t.insRightOf(this);},e.latex=function(){return this.ctrlSeq},e.text=function(){return this.textTemplate},e.placeCursor=t,e.isEmpty=function(){return!0};}),X=S(G,function(e,t){e.init=function(e,n){t.init.call(this,e,"<span>"+(n||e)+"</span>");};}),Z=S(G,function(e,t){e.init=function(e,n,i){t.init.call(this,e,'<span class="mq-binary-operator">'+n+"</span>",i);};}),J=S($,function(e,t){e.join=function(e){return this.foldChildren("",function(t,n){return t+n[e]()})},e.html=function(){return this.join("html")},e.latex=function(){return this.join("latex")},e.text=function(){return this.ends[q]===this.ends[O]&&0!==this.ends[q]?this.ends[q].text():this.join("text")},e.keystroke=function(e,n,i){return!i.options.spaceBehavesLikeTab||"Spacebar"!==e&&"Shift-Spacebar"!==e?t.keystroke.apply(this,arguments):(n.preventDefault(),void i.escapeDir("Shift-Spacebar"===e?q:O,e,n))},e.moveOutOf=function(e,t,n){n&&this.parent[n+"Into"]||!this[e]?t.insDirOf(e,this.parent):t.insAtDirEnd(-e,this[e]);},e.selectOutOf=function(e,t){t.insDirOf(e,this.parent);},e.deleteOutOf=function(e,t){t.unwrapGramp();},e.seek=function(e,t){var n=this.ends[O];if(!n||n.jQ.offset().left+n.jQ.outerWidth()<e){ return t.insAtRightEnd(this); }if(e<this.ends[q].jQ.offset().left){ return t.insAtLeftEnd(this); }for(;e<n.jQ.offset().left;){ n=n[q]; }return n.seek(e,t)},e.chToCmd=function(e){var t;return e.match(/^[a-eg-zA-Z]$/)?se(e):/^\d$/.test(e)?ae(e):(t=A[e]||j[e])?t(e):X(e)},e.write=function(e,t){var n=this.chToCmd(t);e.selection&&n.replaces(e.replaceSelection()),n.createLeftOf(e.show());},e.focus=function(){return this.jQ.addClass("mq-hasCursor"),this.jQ.removeClass("mq-empty"),this},e.blur=function(){return this.jQ.removeClass("mq-hasCursor"),this.isEmpty()&&this.jQ.addClass("mq-empty"),this};});z.StaticMath=function(e){return S(e.AbstractMathQuill,function(t,n){this.RootBlock=J,t.__mathquillify=function(){return n.__mathquillify.call(this,"mq-math-mode"),this.__controller.delegateMouseEvents(),this.__controller.staticMathTextareaEvents(),this},t.init=function(){n.init.apply(this,arguments),this.__controller.root.postOrder("registerInnerField",this.innerFields=[],e.MathField);},t.latex=function(){var t=n.latex.apply(this,arguments);return arguments.length>0&&this.__controller.root.postOrder("registerInnerField",this.innerFields=[],e.MathField),t};})};var ee=S(J,h);z.MathField=function(e){return S(e.EditableField,function(e,n){this.RootBlock=ee,e.__mathquillify=function(e,i){return this.config(e),i>1&&(this.__controller.root.reflow=t),n.__mathquillify.call(this,"mq-editable-field mq-math-mode noFastClick"),delete this.__controller.root.reflow,this};})};var te=S(_,function(e,t){function n(e){e.jQ[0].normalize();var t=e.jQ[0].firstChild;a("only node in TextBlock span is Text node",3===t.nodeType);var n=ne(t.data);return n.jQadd(t),e.children().disown(),n.adopt(e,0,0)}e.ctrlSeq="\\text",e.replaces=function(e){e instanceof D?this.replacedText=e.remove().jQ.text():"string"==typeof e&&(this.replacedText=e);},e.jQadd=function(e){t.jQadd.call(this,e),this.ends[q]&&this.ends[q].jQadd(this.jQ[0].firstChild);},e.createLeftOf=function(e){var n=this;if(t.createLeftOf.call(this,e),n[O].siblingCreated&&n[O].siblingCreated(e.options,q),n[q].siblingCreated&&n[q].siblingCreated(e.options,O),n.bubble("reflow"),e.insAtRightEnd(n),n.replacedText){ for(var i=0;i<n.replacedText.length;i+=1){ n.write(e,n.replacedText.charAt(i)); } }},e.parser=function(){var e=this,t=U.string,n=U.regex;return U.optWhitespace.then(t("{")).then(n(/^[^}]*/)).skip(t("}")).map(function(t){return ne(t).adopt(e,0,0),e})},e.textContents=function(){return this.foldChildren("",function(e,t){return e+t.text})},e.text=function(){return'"'+this.textContents()+'"'},e.latex=function(){return"\\text{"+this.textContents()+"}"},e.html=function(){return'<span class="mq-text-mode" mathquill-command-id='+this.id+">"+this.textContents()+"</span>"},e.moveTowards=function(e,t){t.insAtDirEnd(-e,this);},e.moveOutOf=function(e,t){t.insDirOf(e,this);},e.unselectInto=e.moveTowards,e.selectTowards=W.prototype.selectTowards,e.deleteTowards=W.prototype.deleteTowards,e.selectOutOf=function(e,t){t.insDirOf(e,this);},e.deleteOutOf=function(e,t){this.isEmpty()&&t.insRightOf(this);},e.write=function(e,n){if(e.show().deleteSelection(),"$"!==n){ e[q]?e[q].appendText(n):ne(n).createLeftOf(e); }else if(this.isEmpty()){ e.insRightOf(this),X("\\$","$").createLeftOf(e); }else if(e[O]){ if(e[q]){var i=te(),r=this.ends[q];r.disown(),r.adopt(i,0,0),e.insLeftOf(this),t.createLeftOf.call(i,e);}else { e.insLeftOf(this); } }else { e.insRightOf(this); }},e.seek=function(e,t){t.hide();var i=n(this),r=this.jQ.width()/this.text.length,a=Math.round((e-this.jQ.offset().left)/r);a<=0?t.insAtLeftEnd(this):a>=i.text.length?t.insAtRightEnd(this):t.insLeftOf(i.splitRight(a));for(var o=e-t.show().offset().left,s=o&&o<0?q:O,l=s;t[s]&&o*l>0;){ t[s].moveTowards(s,t),l=o,o=e-t.offset().left; }if(s*o<-s*l&&t[-s].moveTowards(-s,t),t.anticursor){if(t.anticursor.parent===this){var c=t[q]&&t[q].text.length;if(this.anticursorPosition===c){ t.anticursor=L.copy(t); }else{if(this.anticursorPosition<c){var u=t[q].splitRight(this.anticursorPosition);t[q]=u;}else { var u=t[O].splitRight(this.anticursorPosition-c); }t.anticursor=L(this,u[q],u);}}}else { this.anticursorPosition=t[q]&&t[q].text.length; }},e.blur=function(){J.prototype.blur.call(this),n(this);},e.focus=J.prototype.focus;}),ne=S(_,function(e,t){function n(e,t){return t.charAt(e===q?0:-1+t.length)}e.init=function(e){t.init.call(this),this.text=e;},e.jQadd=function(e){this.dom=e,this.jQ=E(e);},e.jQize=function(){return this.jQadd(document.createTextNode(this.text))},e.appendText=function(e){this.text+=e,this.dom.appendData(e);},e.prependText=function(e){this.text=e+this.text,this.dom.insertData(0,e);},e.insTextAtDirEnd=function(e,t){o(t),t===O?this.appendText(e):this.prependText(e);},e.splitRight=function(e){var t=ne(this.text.slice(e)).adopt(this.parent,this,this[O]);return t.jQadd(this.dom.splitText(e)),this.text=this.text.slice(0,e),t},e.moveTowards=function(e,t){o(e);var i=n(-e,this.text),r=this[-e];return r?r.insTextAtDirEnd(i,e):ne(i).createDir(-e,t),this.deleteTowards(e,t)},e.latex=function(){return this.text},e.deleteTowards=function(e,t){this.text.length>1?e===O?(this.dom.deleteData(0,1),this.text=this.text.slice(1)):(this.dom.deleteData(-1+this.text.length,1),this.text=this.text.slice(0,-1)):(this.remove(),this.jQ.remove(),t[e]=this[e]);},e.selectTowards=function(e,t){o(e);var i=t.anticursor,r=n(-e,this.text);if(i[e]===this){var a=ne(r).createDir(e,t);i[e]=a,t.insDirOf(e,a);}else{var s=this[-e];if(s){ s.insTextAtDirEnd(r,e); }else{var a=ne(r).createDir(-e,t);a.jQ.insDirOf(-e,t.selection.jQ);}1===this.text.length&&i[-e]===this&&(i[-e]=this[-e]);}return this.deleteTowards(e,t)};});A.$=j.text=j.textnormal=j.textrm=j.textup=j.textmd=te,j.em=j.italic=j.italics=j.emph=j.textit=j.textsl=p("\\textit","i",'class="mq-text-mode"'),j.strong=j.bold=j.textbf=p("\\textbf","b",'class="mq-text-mode"'),j.sf=j.textsf=p("\\textsf","span",'class="mq-sans-serif mq-text-mode"'),j.tt=j.texttt=p("\\texttt","span",'class="mq-monospace mq-text-mode"'),j.textsc=p("\\textsc","span",'style="font-variant:small-caps" class="mq-text-mode"'),j.uppercase=p("\\uppercase","span",'style="text-transform:uppercase" class="mq-text-mode"'),j.lowercase=p("\\lowercase","span",'style="text-transform:lowercase" class="mq-text-mode"');var ie=S(W,function(e,t){e.init=function(e){t.init.call(this,"$"),this.cursor=e;},e.htmlTemplate='<span class="mq-math-mode">&0</span>',e.createBlocks=function(){t.createBlocks.call(this),this.ends[q].cursor=this.cursor,this.ends[q].write=function(e,t){"$"!==t?J.prototype.write.call(this,e,t):this.isEmpty()?(e.insRightOf(this.parent),this.parent.deleteTowards(dir,e),X("\\$","$").createLeftOf(e.show())):e[O]?e[q]?J.prototype.write.call(this,e,t):e.insLeftOf(this.parent):e.insRightOf(this.parent);};},e.latex=function(){return"$"+this.ends[q].latex()+"$"};}),re=S(ee,function(e,t){e.keystroke=function(e){if("Spacebar"!==e&&"Shift-Spacebar"!==e){ return t.keystroke.apply(this,arguments) }},e.write=function(e,t){if(e.show().deleteSelection(),"$"===t){ ie(e).createLeftOf(e); }else{var n;"<"===t?n="&lt;":">"===t&&(n="&gt;"),X(t,n).createLeftOf(e);}};});z.TextField=function(e){return S(e.EditableField,function(e,t){this.RootBlock=re,e.__mathquillify=function(){return t.__mathquillify.call(this,"mq-editable-field mq-text-mode")},e.latex=function(e){return arguments.length>0?(this.__controller.renderLatexText(e),this.__controller.blurred&&this.__controller.cursor.hide().parent.blur(),this):this.__controller.exportLatex()};})},A["\\"]=S(W,function(e,t){e.ctrlSeq="\\",e.replaces=function(e){this._replacedFragment=e.disown(),this.isEmpty=function(){return!1};},e.htmlTemplate='<span class="mq-latex-command-input mq-non-leaf">\\<span>&0</span></span>',e.textTemplate=["\\"],e.createBlocks=function(){t.createBlocks.call(this),this.ends[q].focus=function(){return this.parent.jQ.addClass("mq-hasCursor"),this.isEmpty()&&this.parent.jQ.removeClass("mq-empty"),this},this.ends[q].blur=function(){return this.parent.jQ.removeClass("mq-hasCursor"),this.isEmpty()&&this.parent.jQ.addClass("mq-empty"),this},this.ends[q].write=function(e,t){e.show().deleteSelection(),t.match(/[a-z]/i)?X(t).createLeftOf(e):(this.parent.renderCommand(e),"\\"===t&&this.isEmpty()||this.parent.parent.write(e,t));},this.ends[q].keystroke=function(e,n,i){return"Tab"===e||"Enter"===e||"Spacebar"===e?(this.parent.renderCommand(i.cursor),void n.preventDefault()):t.keystroke.apply(this,arguments)};},e.createLeftOf=function(e){if(t.createLeftOf.call(this,e),this._replacedFragment){var n=this.jQ[0];this.jQ=this._replacedFragment.jQ.addClass("mq-blur").bind("mousedown mousemove",function(e){return E(e.target=n).trigger(e),!1}).insertBefore(this.jQ).add(this.jQ);}},e.latex=function(){return"\\"+this.ends[q].latex()+" "},e.renderCommand=function(e){this.jQ=this.jQ.last(),this.remove(),this[O]?e.insLeftOf(this[O]):e.insAtRightEnd(this.parent);var t=this.ends[q].latex();t||(t=" ");var n=j[t];n?(n=n(t),this._replacedFragment&&n.replaces(this._replacedFragment),n.createLeftOf(e)):(n=te(),n.replaces(t),n.createLeftOf(e),e.insRightOf(n),this._replacedFragment&&this._replacedFragment.remove());};}),j.notin=j.cong=j.equiv=j.oplus=j.otimes=S(Z,function(e,t){e.init=function(e){t.init.call(this,"\\"+e+" ","&"+e+";");};}),j["≠"]=j.ne=j.neq=r(Z,"\\ne ","&ne;"),j.ast=j.star=j.loast=j.lowast=r(Z,"\\ast ","&lowast;"),j.bigast=j.bigstar=r(Z,"\\bigstar ","&#8902;"),j.therefor=j.therefore=r(Z,"\\therefore ","&there4;"),j.cuz=j.because=r(Z,"\\because ","&#8757;"),j.prop=j.propto=r(Z,"\\propto ","&prop;"),j["≈"]=j.asymp=j.approx=r(Z,"\\approx ","&asymp;"),j.isin=j.in=r(Z,"\\in ","&isin;"),j.ni=j.contains=r(Z,"\\ni ","&ni;"),j.notni=j.niton=j.notcontains=j.doesnotcontain=r(Z,"\\not\\ni ","&#8716;"),j.complement=r(Z,"\\complement ","&#8705;"),j.subsetneqq=r(Z,"\\subsetneqq ","&#10955;"),j.sub=j.subset=r(Z,"\\subset ","&sub;"),j.sup=j.supset=j.superset=r(Z,"\\supset ","&sup;"),j.nsub=j.notsub=j.nsubset=j.notsubset=r(Z,"\\not\\subset ","&#8836;"),j.nsup=j.notsup=j.nsupset=j.notsupset=j.nsuperset=j.notsuperset=r(Z,"\\not\\supset ","&#8837;"),j.sube=j.subeq=j.subsete=j.subseteq=r(Z,"\\subseteq ","&sube;"),j.supe=j.supeq=j.supsete=j.supseteq=j.supersete=j.superseteq=r(Z,"\\supseteq ","&supe;"),j.nsube=j.nsubeq=j.notsube=j.notsubeq=j.nsubsete=j.nsubseteq=j.notsubsete=j.notsubseteq=r(Z,"\\not\\subseteq ","&#8840;"),j.nsupe=j.nsupeq=j.notsupe=j.notsupeq=j.nsupsete=j.nsupseteq=j.notsupsete=j.notsupseteq=j.nsupersete=j.nsuperseteq=j.notsupersete=j.notsuperseteq=r(Z,"\\not\\supseteq ","&#8841;"),j.N=j.naturals=j.Naturals=r(X,"\\mathbb{N}","&#8469;"),j.P=j.primes=j.Primes=j.projective=j.Projective=j.probability=j.Probability=r(X,"\\mathbb{P}","&#8473;"),j.Z=j.integers=j.Integers=r(X,"\\mathbb{Z}","&#8484;"),j.Q=j.rationals=j.Rationals=r(X,"\\mathbb{Q}","&#8474;"),j.R=j.reals=j.Reals=r(X,"\\mathbb{R}","&#8477;"),j.C=j.complex=j.Complex=j.complexes=j.Complexes=j.complexplane=j.Complexplane=j.ComplexPlane=r(X,"\\mathbb{C}","&#8450;"),j.H=j.Hamiltonian=j.quaternions=j.Quaternions=r(X,"\\mathbb{H}","&#8461;"),j.quad=j.emsp=r(X,"\\quad ","    "),j.qquad=r(X,"\\qquad ","        "),j.diamond=r(X,"\\diamond ","&#9671;"),j.bigtriangleup=r(X,"\\bigtriangleup ","&#9651;"),j.ominus=r(X,"\\ominus ","&#8854;"),j.uplus=r(X,"\\uplus ","&#8846;"),j.bigtriangledown=r(X,"\\bigtriangledown ","&#9661;"),j.sqcap=r(X,"\\sqcap ","&#8851;"),j.triangleleft=r(X,"\\triangleleft ","&#8882;"),j.sqcup=r(X,"\\sqcup ","&#8852;"),j.triangleright=r(X,"\\triangleright ","&#8883;"),j.odot=j.circledot=r(X,"\\odot ","&#8857;"),j.bigcirc=r(X,"\\bigcirc ","&#9711;"),j.dagger=r(X,"\\dagger ","&#0134;"),j.ddagger=r(X,"\\ddagger ","&#135;"),j.wr=r(X,"\\wr ","&#8768;"),j.amalg=r(X,"\\amalg ","&#8720;"),j.models=r(X,"\\models ","&#8872;"),j.prec=r(X,"\\prec ","&#8826;"),j.succ=r(X,"\\succ ","&#8827;"),j.preceq=r(X,"\\preceq ","&#8828;"),j.succeq=r(X,"\\succeq ","&#8829;"),j.simeq=r(X,"\\simeq ","&#8771;"),j.mid=r(X,"\\mid ","&#8739;"),j.ll=r(X,"\\ll ","&#8810;"),j.gg=r(X,"\\gg ","&#8811;"),j.parallel=r(X,"\\parallel ","&#8741;"),j.nparallel=r(X,"\\nparallel ","&#8742;"),j.bowtie=r(X,"\\bowtie ","&#8904;"),j.sqsubset=r(X,"\\sqsubset ","&#8847;"),j.sqsupset=r(X,"\\sqsupset ","&#8848;"),j.smile=r(X,"\\smile ","&#8995;"),j.sqsubseteq=r(X,"\\sqsubseteq ","&#8849;"),j.sqsupseteq=r(X,"\\sqsupseteq ","&#8850;"),j.doteq=r(X,"\\doteq ","&#8784;"),j.frown=r(X,"\\frown ","&#8994;"),j.vdash=r(X,"\\vdash ","&#8870;"),j.dashv=r(X,"\\dashv ","&#8867;"),j.nless=r(X,"\\nless ","&#8814;"),j.ngtr=r(X,"\\ngtr ","&#8815;"),j.longleftarrow=r(X,"\\longleftarrow ","&#8592;"),j.longrightarrow=r(X,"\\longrightarrow ","&#8594;"),j.Longleftarrow=r(X,"\\Longleftarrow ","&#8656;"),j.Longrightarrow=r(X,"\\Longrightarrow ","&#8658;"),j.longleftrightarrow=r(X,"\\longleftrightarrow ","&#8596;"),j.updownarrow=r(X,"\\updownarrow ","&#8597;"),j.Longleftrightarrow=r(X,"\\Longleftrightarrow ","&#8660;"),j.Updownarrow=r(X,"\\Updownarrow ","&#8661;"),j.mapsto=r(X,"\\mapsto ","&#8614;"),j.nearrow=r(X,"\\nearrow ","&#8599;"),j.hookleftarrow=r(X,"\\hookleftarrow ","&#8617;"),j.hookrightarrow=r(X,"\\hookrightarrow ","&#8618;"),j.searrow=r(X,"\\searrow ","&#8600;"),j.leftharpoonup=r(X,"\\leftharpoonup ","&#8636;"),j.rightharpoonup=r(X,"\\rightharpoonup ","&#8640;"),j.swarrow=r(X,"\\swarrow ","&#8601;"),j.leftharpoondown=r(X,"\\leftharpoondown ","&#8637;"),j.rightharpoondown=r(X,"\\rightharpoondown ","&#8641;"),j.nwarrow=r(X,"\\nwarrow ","&#8598;"),j.ldots=r(X,"\\ldots ","&#8230;"),j.cdots=r(X,"\\cdots ","&#8943;"),j.vdots=r(X,"\\vdots ","&#8942;"),j.ddots=r(X,"\\ddots ","&#8945;"),j.surd=r(X,"\\surd ","&#8730;"),j.triangle=r(X,"\\triangle ","&#9651;"),j.ell=r(X,"\\ell ","&#8467;"),j.top=r(X,"\\top ","&#8868;"),j.flat=r(X,"\\flat ","&#9837;"),j.natural=r(X,"\\natural ","&#9838;"),j.sharp=r(X,"\\sharp ","&#9839;"),j.wp=r(X,"\\wp ","&#8472;"),j.bot=r(X,"\\bot ","&#8869;"),j.clubsuit=r(X,"\\clubsuit ","&#9827;"),j.diamondsuit=r(X,"\\diamondsuit ","&#9826;"),j.heartsuit=r(X,"\\heartsuit ","&#9825;"),j.spadesuit=r(X,"\\spadesuit ","&#9824;"),j.parallelogram=r(X,"\\parallelogram ","&#9649;"),j.square=r(X,"\\square ","&#9633;"),j.oint=r(X,"\\oint ","&#8750;"),j.bigcap=r(X,"\\bigcap ","&#8745;"),j.bigcup=r(X,"\\bigcup ","&#8746;"),j.bigsqcup=r(X,"\\bigsqcup ","&#8852;"),j.bigvee=r(X,"\\bigvee ","&#8744;"),j.bigwedge=r(X,"\\bigwedge ","&#8743;"),j.bigodot=r(X,"\\bigodot ","&#8857;"),j.bigotimes=r(X,"\\bigotimes ","&#8855;"),j.bigoplus=r(X,"\\bigoplus ","&#8853;"),j.biguplus=r(X,"\\biguplus ","&#8846;"),j.lfloor=r(X,"\\lfloor ","&#8970;"),j.rfloor=r(X,"\\rfloor ","&#8971;"),j.lceil=r(X,"\\lceil ","&#8968;"),j.rceil=r(X,"\\rceil ","&#8969;"),j.opencurlybrace=j.lbrace=r(X,"\\lbrace ","{"),j.closecurlybrace=j.rbrace=r(X,"\\rbrace ","}"),j.lbrack=r(X,"["),j.rbrack=r(X,"]"),j["∫"]=j.int=j.integral=r(G,"\\int ","<big>&int;</big>"),j.slash=r(X,"/"),j.vert=r(X,"|"),j.perp=j.perpendicular=r(X,"\\perp ","&perp;"),j.nabla=j.del=r(X,"\\nabla ","&nabla;"),j.hbar=r(X,"\\hbar ","&#8463;"),j.AA=j.Angstrom=j.angstrom=r(X,"\\text\\AA ","&#8491;"),j.ring=j.circ=j.circle=r(X,"\\circ ","&#8728;"),j.bull=j.bullet=r(X,"\\bullet ","&bull;"),j.setminus=j.smallsetminus=r(X,"\\setminus ","&#8726;"),j.not=j["¬"]=j.neg=r(X,"\\neg ","&not;"),j["…"]=j.dots=j.ellip=j.hellip=j.ellipsis=j.hellipsis=r(X,"\\dots ","&hellip;"),j.converges=j.darr=j.dnarr=j.dnarrow=j.downarrow=r(X,"\\downarrow ","&darr;"),j.dArr=j.dnArr=j.dnArrow=j.Downarrow=r(X,"\\Downarrow ","&dArr;"),j.diverges=j.uarr=j.uparrow=r(X,"\\uparrow ","&uarr;"),j.uArr=j.Uparrow=r(X,"\\Uparrow ","&uArr;"),j.to=r(Z,"\\to ","&rarr;"),j.rarr=j.rightarrow=r(X,"\\rightarrow ","&rarr;"),j.implies=r(Z,"\\Rightarrow ","&rArr;"),j.rArr=j.Rightarrow=r(X,"\\Rightarrow ","&rArr;"),j.gets=r(Z,"\\gets ","&larr;"),j.larr=j.leftarrow=r(X,"\\leftarrow ","&larr;"),j.impliedby=r(Z,"\\Leftarrow ","&lArr;"),j.lArr=j.Leftarrow=r(X,"\\Leftarrow ","&lArr;"),j.harr=j.lrarr=j.leftrightarrow=r(X,"\\leftrightarrow ","&harr;"),j.iff=r(Z,"\\Leftrightarrow ","&hArr;"),j.hArr=j.lrArr=j.Leftrightarrow=r(X,"\\Leftrightarrow ","&hArr;"),j.Re=j.Real=j.real=r(X,"\\Re ","&real;"),j.Im=j.imag=j.image=j.imagin=j.imaginary=j.Imaginary=r(X,"\\Im ","&image;"),j.part=j.partial=r(X,"\\partial ","&part;"),j.infty=j.infin=j.infinity=r(X,"\\infty ","&infin;"),j.alef=j.alefsym=j.aleph=j.alephsym=r(X,"\\aleph ","&alefsym;"),j.xist=j.xists=j.exist=j.exists=r(X,"\\exists ","&exist;"),j.and=j.land=j.wedge=r(X,"\\wedge ","&and;"),j.or=j.lor=j.vee=r(X,"\\vee ","&or;"),j.o=j.O=j.empty=j.emptyset=j.oslash=j.Oslash=j.nothing=j.varnothing=r(Z,"\\varnothing ","&empty;"),j.cup=j.union=r(Z,"\\cup ","&cup;"),j.cap=j.intersect=j.intersection=r(Z,"\\cap ","&cap;"),j.deg=j.degree=r(X,"\\degree ","&deg;"),j.ang=j.angle=r(X,"\\angle ","&ang;"),j.measuredangle=r(X,"\\measuredangle ","&#8737;");var ae=S(X,function(e,t){e.createLeftOf=function(e){e.options.autoSubscriptNumerals&&e.parent!==e.parent.parent.sub&&(e[q]instanceof oe&&!1!==e[q].isItalic||e[q]instanceof _e&&e[q][q]instanceof oe&&!1!==e[q][q].isItalic)?(j._().createLeftOf(e),t.createLeftOf.call(this,e),e.insRightOf(e.parent.parent)):t.createLeftOf.call(this,e);};}),oe=S(G,function(e,t){e.init=function(e,n){t.init.call(this,e,"<var>"+(n||e)+"</var>");},e.text=function(){var e=this.ctrlSeq;return!this[q]||this[q]instanceof oe||this[q]instanceof Z||"\\ "===this[q].ctrlSeq||(e="*"+e),!this[O]||this[O]instanceof Z||this[O]instanceof _e||(e+="*"),e};});N.p.autoCommands={_maxLength:0},I.autoCommands=function(e){if(!/^[a-z]+(?: [a-z]+)*$/i.test(e)){ throw'"'+e+'" not a space-delimited list of only letters'; }for(var t=e.split(" "),n={},i=0,r=0;r<t.length;r+=1){var a=t[r];if(a.length<2){ throw'autocommand "'+a+'" not minimum length of 2'; }if(j[a]===he){ throw'"'+a+'" is a built-in operator name'; }n[a]=1,i=k(i,a.length);}return n._maxLength=i,n};var se=S(oe,function(e,t){function n(e){return e instanceof G&&!(e instanceof Z)}e.init=function(e){return t.init.call(this,this.letter=e)},e.createLeftOf=function(e){var n=e.options.autoCommands,i=n._maxLength;if(i>0){for(var r=this.letter,a=e[q],o=1;a instanceof se&&o<i;){ r=a.letter+r,a=a[q],o+=1; }for(;r.length;){if(n.hasOwnProperty(r)){for(var o=2,a=e[q];o<r.length;o+=1,a=a[q]){  }return D(a,e[q]).remove(),e[q]=a[q],j[r](r).createLeftOf(e)}r=r.slice(1);}}t.createLeftOf.apply(this,arguments);},e.italicize=function(e){return this.isItalic=e,this.jQ.toggleClass("mq-operator-name",!e),this},e.finalizeTree=e.siblingDeleted=e.siblingCreated=function(e,t){t!==q&&this[O]instanceof se||this.autoUnItalicize(e);},e.autoUnItalicize=function(e){var t=e.autoOperatorNames;if(0!==t._maxLength){for(var i=this.letter,r=this[q];r instanceof se;r=r[q]){ i=r.letter+i; }for(var a=this[O];a instanceof se;a=a[O]){ i+=a.letter; }D(r[O]||this.parent.ends[q],a[q]||this.parent.ends[O]).each(function(e){e.italicize(!0).jQ.removeClass("mq-first mq-last"),e.ctrlSeq=e.letter;});e:for(var o=0,s=r[O]||this.parent.ends[q];o<i.length;o+=1,s=s[O]){ for(var l=w(t._maxLength,i.length-o);l>0;l-=1){var c=i.slice(o,o+l);if(t.hasOwnProperty(c)){for(var u=0,h=s;u<l;u+=1,h=h[O]){h.italicize(!1);var f=h;}var p=le.hasOwnProperty(c);s.ctrlSeq=(p?"\\":"\\operatorname{")+s.ctrlSeq,f.ctrlSeq+=p?" ":"}",ue.hasOwnProperty(c)&&f[q][q][q].jQ.addClass("mq-last"),n(s[q])&&s.jQ.addClass("mq-first"),n(f[O])&&f.jQ.addClass("mq-last"),o+=l-1,s=f;continue e}} }}};}),le={},ce=N.p.autoOperatorNames={_maxLength:9},ue={limsup:1,liminf:1,projlim:1,injlim:1};!function(){for(var e="arg deg det dim exp gcd hom inf ker lg lim ln log max min sup limsup liminf injlim projlim Pr".split(" "),t=0;t<e.length;t+=1){ le[e[t]]=ce[e[t]]=1; }for(var n="sin cos tan arcsin arccos arctan sinh cosh tanh sec csc cot coth".split(" "),t=0;t<n.length;t+=1){ le[n[t]]=1; }for(var i="sin cos tan sec cosec csc cotan cot ctg".split(" "),t=0;t<i.length;t+=1){ ce[i[t]]=ce["arc"+i[t]]=ce[i[t]+"h"]=ce["ar"+i[t]+"h"]=ce["arc"+i[t]+"h"]=1; }for(var r="gcf hcf lcm proj span".split(" "),t=0;t<r.length;t+=1){ ce[r[t]]=1; }}(),I.autoOperatorNames=function(e){if(!/^[a-z]+(?: [a-z]+)*$/i.test(e)){ throw'"'+e+'" not a space-delimited list of only letters'; }for(var t=e.split(" "),n={},i=0,r=0;r<t.length;r+=1){var a=t[r];if(a.length<2){ throw'"'+a+'" not minimum length of 2'; }n[a]=1,i=k(i,a.length);}return n._maxLength=i,n};var he=S(G,function(e,t){e.init=function(e){this.ctrlSeq=e;},e.createLeftOf=function(e){for(var t=this.ctrlSeq,n=0;n<t.length;n+=1){ se(t.charAt(n)).createLeftOf(e); }},e.parser=function(){for(var e=this.ctrlSeq,t=J(),n=0;n<e.length;n+=1){ se(e.charAt(n)).adopt(t,t.ends[O],0); }return U.succeed(t.children())};});for(var fe in ce){ ce.hasOwnProperty(fe)&&(j[fe]=he); }j.operatorname=S(W,function(e){e.createLeftOf=t,e.numBlocks=function(){return 1},e.parser=function(){return Y.block.map(function(e){return e.children()})};}),j.f=S(se,function(e,t){e.init=function(){G.p.init.call(this,this.letter="f",'<var class="mq-f">f</var>');},e.italicize=function(e){return this.jQ.html("f").toggleClass("mq-f",e),t.italicize.apply(this,arguments)};}),j[" "]=j.space=r(X,"\\ ","&nbsp;"),j["'"]=j.prime=r(X,"'","&prime;"),j.backslash=r(X,"\\backslash ","\\"),A["\\"]||(A["\\"]=j.backslash),j.$=r(X,"\\$","$");var pe=S(G,function(e,t){e.init=function(e,n){t.init.call(this,e,'<span class="mq-nonSymbola">'+(n||e)+"</span>");};});j["@"]=pe,j["&"]=r(pe,"\\&","&amp;"),j["%"]=r(pe,"\\%","%"),j.alpha=j.beta=j.gamma=j.delta=j.zeta=j.eta=j.theta=j.iota=j.kappa=j.mu=j.nu=j.xi=j.rho=j.sigma=j.tau=j.chi=j.psi=j.omega=S(oe,function(e,t){e.init=function(e){t.init.call(this,"\\"+e+" ","&"+e+";");};}),j.phi=r(oe,"\\phi ","&#966;"),j.phiv=j.varphi=r(oe,"\\varphi ","&#981;"),j.epsilon=r(oe,"\\epsilon ","&#1013;"),j.epsiv=j.varepsilon=r(oe,"\\varepsilon ","&#949;"),j.piv=j.varpi=r(oe,"\\varpi ","&piv;"),j.sigmaf=j.sigmav=j.varsigma=r(oe,"\\varsigma ","&sigmaf;"),j.thetav=j.vartheta=j.thetasym=r(oe,"\\vartheta ","&thetasym;"),j.upsilon=j.upsi=r(oe,"\\upsilon ","&upsilon;"),j.gammad=j.Gammad=j.digamma=r(oe,"\\digamma ","&#989;"),j.kappav=j.varkappa=r(oe,"\\varkappa ","&#1008;"),j.rhov=j.varrho=r(oe,"\\varrho ","&#1009;"),j.pi=j["π"]=r(pe,"\\pi ","&pi;"),j.lambda=r(pe,"\\lambda ","&lambda;"),j.Upsilon=j.Upsi=j.upsih=j.Upsih=r(G,"\\Upsilon ",'<var style="font-family: serif">&upsih;</var>'),j.Gamma=j.Delta=j.Theta=j.Lambda=j.Xi=j.Pi=j.Sigma=j.Phi=j.Psi=j.Omega=j.forall=S(X,function(e,t){e.init=function(e){t.init.call(this,"\\"+e+" ","&"+e+";");};});var de=S(W,function(e){e.init=function(e){this.latex=e;},e.createLeftOf=function(e){var t=Y.parse(this.latex);t.children().adopt(e.parent,e[q],e[O]),e[q]=t.ends[O],t.jQize().insertBefore(e.jQ),t.finalizeInsert(e.options,e),t.ends[O][O].siblingCreated&&t.ends[O][O].siblingCreated(e.options,q),t.ends[q][q].siblingCreated&&t.ends[q][q].siblingCreated(e.options,O),e.parent.bubble("reflow");},e.parser=function(){var e=Y.parse(this.latex).children();return U.succeed(e)};});j["¹"]=r(de,"^1"),j["²"]=r(de,"^2"),j["³"]=r(de,"^3"),j["¼"]=r(de,"\\frac14"),j["½"]=r(de,"\\frac12"),j["¾"]=r(de,"\\frac34");var me=S(Z,function(e){e.init=X.prototype.init,e.contactWeld=e.siblingCreated=e.siblingDeleted=function(e,t){if(t!==O){ return this.jQ[0].className=!this[q]||this[q]instanceof Z?"":"mq-binary-operator",this }};});j["+"]=r(me,"+","+"),j["–"]=j["-"]=r(me,"-","&minus;"),j["±"]=j.pm=j.plusmn=j.plusminus=r(me,"\\pm ","&plusmn;"),j.mp=j.mnplus=j.minusplus=r(me,"\\mp ","&#8723;"),A["*"]=j.sdot=j.cdot=r(Z,"\\cdot ","&middot;","*");var ve=S(Z,function(e,t){e.init=function(e,n){this.data=e,this.strict=n;var i=n?"Strict":"";t.init.call(this,e["ctrlSeq"+i],e["html"+i],e["text"+i]);},e.swap=function(e){this.strict=e;var t=e?"Strict":"";this.ctrlSeq=this.data["ctrlSeq"+t],this.jQ.html(this.data["html"+t]),this.textTemplate=[this.data["text"+t]];},e.deleteTowards=function(e,n){if(e===q&&!this.strict){ return this.swap(!0),void this.bubble("reflow"); }t.deleteTowards.apply(this,arguments);};}),ge={ctrlSeq:"\\lt ",html:"&#60;",text:"<",ctrlSeqStrict:"<",htmlStrict:"&lt;",textStrict:"<"},ye={ctrlSeq:"\\gt ",html:"&#62;",text:">",ctrlSeqStrict:">",htmlStrict:"&gt;",textStrict:">"},be={ctrlSeq:"\\leqslant ",html:"&#8804;",text:"≤",ctrlSeqStrict:"≤",htmlStrict:"&le;",textStrict:"≤"},xe={ctrlSeq:"\\geqslant ",html:"&#8805;",text:"≥",ctrlSeqStrict:"≥",htmlStrict:"&ge;",textStrict:"≥"};j["<"]=j.lt=r(ve,ge,!0),j[">"]=j.gt=r(ve,ye,!0),j.leqslant=j["≤"]=j.le=j.leq=r(ve,be,!1),j.geqslant=j["≥"]=j.ge=j.geq=r(ve,xe,!1);var we=S(Z,function(e,t){e.init=function(){t.init.call(this,"=","=");},e.createLeftOf=function(e){if(e[q]instanceof ve&&e[q].strict){ return e[q].swap(!1),void e[q].bubble("reflow"); }t.createLeftOf.apply(this,arguments);};});j["="]=we,j["×"]=j.times=r(Z,"\\times ","&times;","[x]"),j["÷"]=j.div=j.divide=j.divides=r(Z,"\\div ","&divide;","[/]"),A["~"]=j.sim=r(Z,"\\sim ","~","~"),A["∽"]=j.backsim=r(Z,"\\backsim ","&#8765;","∽");var ke,Te,Ce=t,Se=document.createElement("div"),qe=Se.style,Oe={transform:1,WebkitTransform:1,MozTransform:1,OTransform:1,msTransform:1};for(var Ee in Oe){ if(Ee in qe){Te=Ee;break} }Te?ke=function(e,t,n){e.css(Te,"scale("+t+","+n+")");}:"filter"in qe?(Ce=function(e){e.className=e.className;},ke=function(e,t,n){function i(){e.css("marginRight",(r.width()-1)*(t-1)/t+"px");}t/=1+(n-1)/2,e.css("fontSize",n+"em"),e.hasClass("mq-matrixed-container")||e.addClass("mq-matrixed-container").wrapInner('<span class="mq-matrixed"></span>');var r=e.children().css("filter","progid:DXImageTransform.Microsoft.Matrix(M11="+t+",SizingMethod='auto expand')");i();var a=setInterval(i);E(window).load(function(){clearTimeout(a),i();});}):ke=function(e,t,n){e.css("fontSize",n+"em");};var Le=S(W,function(e,t){e.init=function(e,n,i){t.init.call(this,e,"<"+n+" "+i+">&0</"+n+">");};});j.mathrm=r(Le,"\\mathrm","span",'class="mq-roman mq-font"'),j.mathit=r(Le,"\\mathit","i",'class="mq-font"'),j.mathbf=r(Le,"\\mathbf","b",'class="mq-font"'),j.mathsf=r(Le,"\\mathsf","span",'class="mq-sans-serif mq-font"'),j.mathtt=r(Le,"\\mathtt","span",'class="mq-monospace mq-font"'),j.upperArc=j.overarc=r(Le,"\\overarc","span",'class="mq-non-leaf mq-upperArc"'),j.underline=r(Le,"\\underline","span",'class="mq-non-leaf mq-underline"'),j.overline=j.bar=r(Le,"\\overline","span",'class="mq-non-leaf mq-overline"'),j.overrightarrow=r(Le,"\\overrightarrow","span",'class="mq-non-leaf mq-overarrow mq-arrow-right"'),j.overleftarrow=r(Le,"\\overleftarrow","span",'class="mq-non-leaf mq-overarrow mq-arrow-left"');var _e=(j.textcolor=S(W,function(e,t){e.setColor=function(e){this.color=e,this.htmlTemplate='<span class="mq-textcolor" style="color:'+e+'">&0</span>';},e.latex=function(){return"\\textcolor{"+this.color+"}{"+this.blocks[0].latex()+"}"},e.parser=function(){var e=this,n=U.optWhitespace,i=U.string,r=U.regex;return n.then(i("{")).then(r(/^[#\w\s.,()%-]*/)).skip(i("}")).then(function(n){return e.setColor(n),t.parser.call(e)})};}),j.class=S(W,function(e,t){e.parser=function(){var e=this,n=U.string,i=U.regex;return U.optWhitespace.then(n("{")).then(i(/^[-\w\s\\\xA0-\xFF]*/)).skip(n("}")).then(function(n){return e.htmlTemplate='<span class="mq-class '+n+'">&0</span>',t.parser.call(e)})};}),S(W,function(e,t){e.ctrlSeq="_{...}^{...}",e.createLeftOf=function(e){if(e[q]||!e.options.supSubsRequireOperand){ return t.createLeftOf.apply(this,arguments) }},e.contactWeld=function(e){
var this$1 = this;
for(var t=q;t;t=t===q&&O){ if(this$1[t]instanceof _e){for(var n="sub";n;n="sub"===n&&"sup"){var i=this$1[n],r=this$1[t][n];if(i){if(r){ if(i.isEmpty()){ var a=L(r,0,r.ends[q]); }else{i.jQ.children().insAtDirEnd(-t,r.jQ);var o=i.children().disown(),a=L(r,o.ends[O],r.ends[q]);t===q?o.adopt(r,r.ends[O],0):o.adopt(r,0,r.ends[q]);} }else { this$1[t].addBlock(i.disown()); }this$1.placeCursor=function(e,n){return function(i){i.insAtDirEnd(-t,e||n);}}(r,i);}}this$1.remove(),e&&e[q]===this$1&&(t===O&&a?a[q]?e.insRightOf(a[q]):e.insAtLeftEnd(a.parent):e.insRightOf(this$1[t]));break} }this.respace();},N.p.charsThatBreakOutOfSupSub="",e.finalizeTree=function(){this.ends[q].write=function(e,t){if(e.options.autoSubscriptNumerals&&this===this.parent.sub){if("_"===t){ return; }var n=this.chToCmd(t);return n instanceof G?e.deleteSelection():e.clearSelection().insRightOf(this.parent),n.createLeftOf(e.show())}e[q]&&!e[O]&&!e.selection&&e.options.charsThatBreakOutOfSupSub.indexOf(t)>-1&&e.insRightOf(this.parent),J.p.write.apply(this,arguments);};},e.moveTowards=function(e,n,i){n.options.autoSubscriptNumerals&&!this.sup?n.insDirOf(e,this):t.moveTowards.apply(this,arguments);},e.deleteTowards=function(e,n){if(n.options.autoSubscriptNumerals&&this.sub){var i=this.sub.ends[-e];i instanceof G?i.remove():i&&i.deleteTowards(e,n.insAtDirEnd(-e,this.sub)),this.sub.isEmpty()&&(this.sub.deleteOutOf(q,n.insAtLeftEnd(this.sub)),this.sup&&n.insDirOf(-e,this));}else { t.deleteTowards.apply(this,arguments); }},e.latex=function(){function e(e,t){var n=t&&t.latex();return t?e+(1===n.length?n:"{"+(n||" ")+"}"):""}return e("_",this.sub)+e("^",this.sup)},e.respace=e.siblingCreated=e.siblingDeleted=function(e,t){t!==O&&this.jQ.toggleClass("mq-limit","\\int "===this[q].ctrlSeq);},e.addBlock=function(e){
var this$1 = this;
"sub"===this.supsub?(this.sup=this.upInto=this.sub.upOutOf=e,e.adopt(this,this.sub,0).downOutOf=this.sub,e.jQ=E('<span class="mq-sup"/>').append(e.jQ.children()).attr(x,e.id).prependTo(this.jQ)):(this.sub=this.downInto=this.sup.downOutOf=e,e.adopt(this,0,this.sup).upOutOf=this.sup,e.jQ=E('<span class="mq-sub"></span>').append(e.jQ.children()).attr(x,e.id).appendTo(this.jQ.removeClass("mq-sup-only")),this.jQ.append('<span style="display:inline-block;width:0">&#8203;</span>'));for(var t=0;t<2;t+=1){ !function(e,t,n,i){e[t].deleteOutOf=function(r,a){if(a.insDirOf(this[r]?-r:r,this.parent),!this.isEmpty()){var o=this.ends[r];this.children().disown().withDirAdopt(r,a.parent,a[r],a[-r]).jQ.insDirOf(-r,a.jQ),a[-r]=o;}e.supsub=n,delete e[t],delete e[i+"Into"],e[n][i+"OutOf"]=d,delete e[n].deleteOutOf,"sub"===t&&E(e.jQ.addClass("mq-sup-only")[0].lastChild).remove(),this.remove();};}(this$1,"sub sup".split(" ")[t],"sup sub".split(" ")[t],"down up".split(" ")[t]); }};}));j.subscript=j._=S(_e,function(e,t){e.supsub="sub",e.htmlTemplate='<span class="mq-supsub mq-non-leaf"><span class="mq-sub">&0</span><span style="display:inline-block;width:0">&#8203;</span></span>',e.textTemplate=["_"],e.finalizeTree=function(){this.downInto=this.sub=this.ends[q],this.sub.upOutOf=d,t.finalizeTree.call(this);};}),j.superscript=j.supscript=j["^"]=S(_e,function(e,t){e.supsub="sup",e.htmlTemplate='<span class="mq-supsub mq-non-leaf mq-sup-only"><span class="mq-sup">&0</span></span>',e.textTemplate=["^"],e.finalizeTree=function(){this.upInto=this.sup=this.ends[O],this.sup.downOutOf=d,t.finalizeTree.call(this);};});var De=S(W,function(e,t){e.init=function(e,t){var n='<span class="mq-large-operator mq-non-leaf"><span class="mq-to"><span>&1</span></span><big>'+t+'</big><span class="mq-from"><span>&0</span></span></span>';G.prototype.init.call(this,e,n);},e.createLeftOf=function(e){t.createLeftOf.apply(this,arguments),e.options.sumStartsWithNEquals&&(se("n").createLeftOf(e),we().createLeftOf(e));},e.latex=function(){function e(e){return 1===e.length?e:"{"+(e||" ")+"}"}return this.ctrlSeq+"_"+e(this.ends[q].latex())+"^"+e(this.ends[O].latex())},e.parser=function(){for(var e=U.string,t=U.optWhitespace,n=U.succeed,i=Y.block,r=this,a=r.blocks=[J(),J()],o=0;o<a.length;o+=1){ a[o].adopt(r,r.ends[O],0); }return t.then(e("_").or(e("^"))).then(function(e){var t=a["_"===e?0:1];return i.then(function(e){return e.children().adopt(t,t.ends[O],0),n(r)})}).many().result(r)},e.finalizeTree=function(){this.downInto=this.ends[q],this.upInto=this.ends[O],this.ends[q].upOutOf=this.ends[O],this.ends[O].downOutOf=this.ends[q];};});j["∑"]=j.sum=j.summation=r(De,"\\sum ","&sum;"),j["∏"]=j.prod=j.product=r(De,"\\prod ","&prod;"),j.coprod=j.coproduct=r(De,"\\coprod ","&#8720;");var je=j.frac=j.dfrac=j.cfrac=j.fraction=S(W,function(e,t){e.ctrlSeq="\\frac",e.htmlTemplate='<span class="mq-fraction mq-non-leaf"><span class="mq-numerator">&0</span><span class="mq-denominator">&1</span><span style="display:inline-block;width:0">&#8203;</span></span>',e.textTemplate=["(",")/(",")"],e.finalizeTree=function(){this.upInto=this.ends[O].upOutOf=this.ends[q],this.downInto=this.ends[q].downOutOf=this.ends[O];};}),Ae=j.over=A["/"]=S(je,function(e,n){e.createLeftOf=function(e){if(!this.replacedFragment){for(var i=e[q];i&&!(i instanceof Z||i instanceof(j.text||t)||i instanceof De||"\\ "===i.ctrlSeq||/^[,;:]$/.test(i.ctrlSeq));){ i=i[q]; }i instanceof De&&i[O]instanceof _e&&(i=i[O],i[O]instanceof _e&&i[O].ctrlSeq!=i.ctrlSeq&&(i=i[O])),i!==e[q]&&(this.replaces(D(i[O]||e.parent.ends[q],e[q])),e[q]=i);}n.createLeftOf.call(this,e);};});j.dot=S(W,function(e,t){e.ctrlSeq="\\dot",e.htmlTemplate='<span class="mq-non-leaf mq-upperDot"><span class="mq-upperDot-number">&0</span></span>',e.textTemplate=["dot(",")"];});var Be=j.sqrt=j["√"]=S(W,function(e,t){e.ctrlSeq="\\sqrt",e.htmlTemplate='<span class="mq-non-leaf"><span class="mq-scaled mq-sqrt-prefix">&radic;</span><span class="mq-non-leaf mq-sqrt-stem">&0</span></span>',e.textTemplate=["sqrt(",")"],e.parser=function(){return Y.optBlock.then(function(e){return Y.block.map(function(t){var n=Qe();return n.blocks=[e,t],e.adopt(n,0,0),t.adopt(n,e,0),n})}).or(t.parser.call(this))},e.reflow=function(){var e=this.ends[O].jQ;ke(e.prev(),1,e.innerHeight()/+e.css("fontSize").slice(0,-2)-.1);};}),Qe=(j.vec=S(W,function(e,t){e.ctrlSeq="\\vec",e.htmlTemplate='<span class="mq-non-leaf"><span class="mq-vector-prefix">&rarr;</span><span class="mq-vector-stem">&0</span></span>',e.textTemplate=["vec(",")"];}),j.nthroot=S(Be,function(e,t){e.htmlTemplate='<sup class="mq-nthroot mq-non-leaf">&0</sup><span class="mq-scaled"><span class="mq-sqrt-prefix mq-scaled">&radic;</span><span class="mq-sqrt-stem mq-non-leaf">&1</span></span>',e.textTemplate=["sqrt[","](",")"],e.latex=function(){return"\\sqrt["+this.ends[q].latex()+"]{"+this.ends[O].latex()+"}"};})),Re=(j.equSet=S(W,function(e,t){e.ctrlSeq="\\begin{equation}{ }\\\\ { }\\\\ \\end{equation}";}),S(S(W,m),function(e,n){e.init=function(e,t,i,r,a){n.init.call(this,"\\left"+r,g,[t,i]),this.side=e,this.sides={},this.sides[q]={ch:t,ctrlSeq:r},this.sides[O]={ch:i,ctrlSeq:a};},e.numBlocks=function(){return 1},e.html=function(){return this.htmlTemplate='<span class="mq-non-leaf"><span class="mq-scaled mq-paren'+(this.side===O?" mq-ghost":"")+'">'+this.sides[q].ch+'</span><span class="mq-non-leaf">&0</span><span class="mq-scaled mq-paren'+(this.side===q?" mq-ghost":"")+'">'+this.sides[O].ch+"</span></span>",n.html.call(this)},e.latex=function(){return"\\left"+this.sides[q].ctrlSeq+this.ends[q].latex()+"\\right"+this.sides[O].ctrlSeq},e.oppBrack=function(e,t,n){return t instanceof Re&&t.side&&t.side!==-n&&("|"===this.sides[this.side].ch||t.side===-this.side)&&(!e.restrictMismatchedBrackets||ze[this.sides[this.side].ch]===t.sides[t.side].ch||{"(":"]","[":")"}[this.sides[q].ch]===t.sides[O].ch)&&t},e.closeOpposing=function(e){e.side=0,e.sides[this.side]=this.sides[this.side],e.delimjQs.eq(this.side===q?0:1).removeClass("mq-ghost").html(this.sides[this.side].ch);},e.createLeftOf=function(e){if(!this.replacedFragment){ var t=e.options,i=this.oppBrack(t,e[q],q)||this.oppBrack(t,e[O],O)||this.oppBrack(t,e.parent.parent); }if(i){var r=this.side=-i.side;this.closeOpposing(i),i===e.parent.parent&&e[r]&&(D(e[r],e.parent.ends[r],-r).disown().withDirAdopt(-r,i.parent,i,i[r]).jQ.insDirOf(r,i.jQ),i.bubble("reflow"));}else { i=this,r=i.side,i.replacedFragment?i.side=0:e[-r]&&(i.replaces(D(e[-r],e.parent.ends[-r],r)),e[-r]=0),n.createLeftOf.call(i,e); }r===q?e.insAtLeftEnd(i.ends[q]):e.insRightOf(i);},e.placeCursor=t,e.unwrap=function(){this.ends[q].children().disown().adopt(this.parent,this,this[O]).jQ.insertAfter(this.jQ),this.remove();},e.deleteSide=function(e,t,n){var i=this.parent,r=this[e],a=i.ends[e];if(e===this.side){ return this.unwrap(),void(r?n.insDirOf(-e,r):n.insAtDirEnd(e,i)); }var o=n.options,s=!this.side;if(this.side=-e,this.oppBrack(o,this.ends[q].ends[this.side],e)){this.closeOpposing(this.ends[q].ends[this.side]);var l=this.ends[q].ends[e];this.unwrap(),l.siblingCreated&&l.siblingCreated(n.options,e),r?n.insDirOf(-e,r):n.insAtDirEnd(e,i);}else{if(this.oppBrack(o,this.parent.parent,e)){ this.parent.parent.closeOpposing(this),this.parent.parent.unwrap(); }else{if(t&&s){ return this.unwrap(),void(r?n.insDirOf(-e,r):n.insAtDirEnd(e,i)); }this.sides[e]={ch:ze[this.sides[this.side].ch],ctrlSeq:ze[this.sides[this.side].ctrlSeq]},this.delimjQs.removeClass("mq-ghost").eq(e===q?0:1).addClass("mq-ghost").html(this.sides[e].ch);}if(r){var l=this.ends[q].ends[e];D(r,a,-e).disown().withDirAdopt(-e,this.ends[q],l,0).jQ.insAtDirEnd(e,this.ends[q].jQ.removeClass("mq-empty")),l.siblingCreated&&l.siblingCreated(n.options,e),n.insDirOf(-e,r);}else { t?n.insDirOf(e,this):n.insAtDirEnd(e,this.ends[q]); }}},e.deleteTowards=function(e,t){this.deleteSide(-e,!1,t);},e.finalizeTree=function(){this.ends[q].deleteOutOf=function(e,t){this.parent.deleteSide(e,!0,t);},this.finalizeTree=this.intentionalBlur=function(){this.delimjQs.eq(this.side===q?1:0).removeClass("mq-ghost"),this.side=0;};},e.siblingCreated=function(e,t){t===-this.side&&this.finalizeTree();};})),ze={"(":")",")":"(","[":"]","]":"[","{":"}","}":"{","\\{":"\\}","\\}":"\\{","&lang;":"&rang;","&rang;":"&lang;","\\langle ":"\\rangle ","\\rangle ":"\\langle ","|":"|"};v("("),v("["),v("{","\\{"),j.langle=r(Re,q,"&lang;","&rang;","\\langle ","\\rangle "),j.rangle=r(Re,O,"&lang;","&rang;","\\langle ","\\rangle "),A["|"]=r(Re,q,"|","|","|","|"),j.left=S(W,function(e){e.parser=function(){var e=U.regex,t=U.string,n=(U.succeed,U.optWhitespace);return n.then(e(/^(?:[([|]|\\\{)/)).then(function(i){var r="\\"===i.charAt(0)?i.slice(1):i;return Y.then(function(a){return t("\\right").skip(n).then(e(/^(?:[\])|]|\\\})/)).map(function(e){var t="\\"===e.charAt(0)?e.slice(1):e,n=Re(0,r,t,i,e);return n.blocks=[a],a.adopt(n,0,0),n})})})};}),j.right=S(W,function(e){e.parser=function(){return U.fail("unmatched \\right")};});var Ne=j.binom=j.binomial=S(S(W,m),function(e,t){e.ctrlSeq="\\binom",e.htmlTemplate='<span class="mq-non-leaf"><span class="mq-paren mq-scaled">(</span><span class="mq-non-leaf"><span class="mq-array mq-non-leaf"><span>&0</span><span>&1</span></span></span><span class="mq-paren mq-scaled">)</span></span>',e.textTemplate=["choose(",",",")"];});j.choose=S(Ne,function(e){e.createLeftOf=Ae.prototype.createLeftOf;}),j.editable=j.MathQuillMathField=S(W,function(e,t){e.ctrlSeq="\\MathQuillMathField",e.htmlTemplate='<span class="mq-editable-field"><span class="mq-root-block">&0</span></span>',e.parser=function(){var e=this,n=U.string,i=U.regex,r=U.succeed;return n("[").then(i(/^[a-z][a-z0-9]*/i)).skip(n("]")).map(function(t){e.name=t;}).or(r()).then(t.parser.call(e))},e.finalizeTree=function(){var e=R(this.ends[q],this.jQ,N());e.KIND_OF_MQ="MathField",e.editable=!0,e.createTextarea(),e.editablesTextareaEvents(),e.cursor.insAtRightEnd(e.root),h(e.root);},e.registerInnerField=function(e,t){e.push(e[this.name]=t(this.ends[q].controller));},e.latex=function(){return this.ends[q].latex()},e.text=function(){return this.ends[q].text()};});var Ie=j.embed=S(G,function(e,t){e.setOptions=function(e){function t(){return""}return this.text=e.text||t,this.htmlTemplate=e.htmlString||"",this.latex=e.latex||t,this},e.parser=function(){var e=this;return string=U.string,regex=U.regex,succeed=U.succeed,string("{").then(regex(/^[a-z][a-z0-9]*/i)).skip(string("}")).then(function(t){return string("[").then(regex(/^[-\w\s]*/)).skip(string("]")).or(succeed()).map(function(n){return e.setOptions(F[t](n))})})};}),Me=u(1);for(var Fe in Me){ !function(e,t){"function"==typeof t?(c[e]=function(){return l(),t.apply(this,arguments)},c[e].prototype=t.prototype):c[e]=t;}(Fe,Me[Fe]); }}();}).call(t,n(18));},function(e,t){e.exports=jQuery;},function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="28">\n  <defs>\n    <path id="arc" d="M1 8h18v20H1z"/>\n    <mask id="bArc" width="18" height="20" x="0" y="0" fill="#fff">\n      <use xlink:href="#arc"/>\n    </mask>\n  </defs>\n  <g fill="none" fill-rule="evenodd">\n    <use stroke="currentColor" stroke-dasharray="2 2" stroke-width="2" mask="url(#bArc)" xlink:href="#arc"/>\n    <path fill="currentColor" d="M19 3.6V5a19.3 19.3 0 0 0-9.3-2.8 16 16 0 0 0-5.2.9C3.1 3.5 1.7 4 .4 5V3.6a17.6 17.6 0 0 1 9.3-3c1.8 0 3.5.3 5.3 1 1.4.4 2.8 1 4 2z"/>\n  </g>\n</svg>\n';},function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="30">\n  <defs>\n    <path id="aBrace" d="M12 0h8v9.6h-8z"/>\n    <mask id="cBrace" width="9" height="10" x="0" y="0" fill="#fff">\n      <use xlink:href="#aBrace"/>\n    </mask>\n    <path id="bBrace" d="M12 20h8v9.6h-8z"/>\n    <mask id="dBrace" width="9" height="10" x="0" y="0" fill="#fff">\n      <use xlink:href="#bBrace"/>\n    </mask>\n  </defs>\n  <g fill="none" fill-rule="evenodd">\n    <path fill="currentColor" d="M6.1 2c-1.1 0-2 .4-2.6 1-.6.7-.9 1.7-.9 2.8v5.6c0 .8-.2 1.4-.5 1.8-.4.5-1.1.7-2.1.7v1.8c1 0 1.7.3 2 .8.4.3.6 1 .6 1.8v5.6c0 1.1.3 2 .9 2.7.6.7 1.5 1 2.6 1H8V26H6.5c-1.2 0-1.9-.6-1.9-2v-5.7c0-1.6-.7-2.8-2.2-3.4a3.3 3.3 0 0 0 2.2-3.3V5.8c0-1.4.7-2 1.9-2H8V2H6.1z"/>\n    <use stroke="currentColor" stroke-dasharray="2 2" stroke-width="2" mask="url(#cBrace)" xlink:href="#aBrace"/>\n    <use stroke="currentColor" stroke-dasharray="2 2" stroke-width="2" mask="url(#dBrace)" xlink:href="#bBrace"/>\n  </g>\n</svg>\n';},function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="27" height="24">\n  <defs>\n    <path id="aDu" d="M0 8h16v20H0z"/>\n    <mask id="bDu" width="16" height="20" x="0" y="0" fill="#fff">\n      <use xlink:href="#aDu"/>\n    </mask>\n  </defs>\n  <g fill-rule="evenodd" transform="translate(0 -4)">\n    <text fill="currentColor" font-family="PingFangSC-Regular, PingFang SC" font-size="20" letter-spacing="-1">\n      <tspan x="20.7" y="21">°</tspan>\n    </text>\n    <use fill-opacity=".1" stroke="currentColor" stroke-dasharray="2 2" stroke-width="2" mask="url(#bDu)" xlink:href="#aDu"/>\n  </g>\n</svg>\n';},function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="26" height="25">\n  <defs>\n    <path id="aFrac" d="M6 0h14.3v10H6V0z"/>\n    <mask id="cFrac" width="14.3" height="10" x="0" y="0" fill="#fff">\n      <use xlink:href="#aFrac"/>\n    </mask>\n    <path id="bFrac" d="M6 15h14.3v10H6V15z"/>\n    <mask id="dFrac" width="14.3" height="10" x="0" y="0" fill="#fff">\n      <use xlink:href="#bFrac"/>\n    </mask>\n  </defs>\n  <g fill="none" fill-rule="evenodd">\n    <use stroke="currentColor" stroke-dasharray="2 2" stroke-width="2" mask="url(#cFrac)" xlink:href="#aFrac"/>\n    <use stroke="currentColor" stroke-dasharray="2 2" stroke-width="2" mask="url(#dFrac)" xlink:href="#bFrac"/>\n    <path fill="currentColor" fill-rule="nonzero" d="M0 13v-1h26v1z"/>\n  </g>\n</svg>\n';},function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="26">\n  <defs>\n    <path id="aHeng" d="M0 4h18v22H0z"/>\n    <mask id="bHeng" width="18" height="22" x="0" y="0" fill="#fff">\n      <use xlink:href="#aHeng"/>\n    </mask>\n  </defs>\n  <g fill="none" fill-rule="evenodd">\n    <use stroke="currentColor" stroke-dasharray="2 2" stroke-width="2" mask="url(#bHeng)" xlink:href="#aHeng"/>\n    <path fill="currentColor" fill-rule="nonzero" d="M0 1V0h18v1z"/>\n  </g>\n</svg>\n';},function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="29">\n  <defs>\n    <path id="aDelete" d="M0 9h18v20H0z"/>\n    <mask id="bDelete" width="18" height="20" x="0" y="0" fill="#fff">\n      <use xlink:href="#aDelete"/>\n    </mask>\n  </defs>\n  <g fill="none" fill-rule="evenodd">\n    <circle cx="9" cy="3" r="3" fill="currentColor"/>\n    <use stroke="currentColor" stroke-dasharray="2 2" stroke-width="2" mask="url(#bDelete)" xlink:href="#aDelete"/>\n  </g>\n</svg>\n';},function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" width="13" height="19">\n  <path fill="currentColor" fill-rule="evenodd" d="M5.7.7h1.6v3.8c1.6.1 2.8.5 3.8 1.3a5 5 0 0 1 1.9 4 5 5 0 0 1-1.9 4c-1 .8-2.2 1.2-3.8 1.3V19H5.7v-4a6 6 0 0 1-3.8-1.3 4.8 4.8 0 0 1-1.8-4c0-1.7.6-3 1.8-4 1-.8 2.3-1.2 3.8-1.3V.7zm0 5.2c-1.2 0-2.1.4-2.8 1-.8.7-1.2 1.6-1.2 2.9a4 4 0 0 0 1.2 3c.7.5 1.6.9 2.8 1v-8zm1.6 7.9c1.2-.1 2.2-.5 2.9-1 .7-.8 1.1-1.7 1.1-3s-.4-2.2-1.1-2.9c-.7-.6-1.7-1-2.9-1v7.9z"/>\n</svg>\n';},function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" width="14" height="15">\n  <path fill="currentColor" fill-rule="evenodd" d="M5.2 9.6l.7-2.9C6.7 3.5 8.3.4 11.3.4c1.3 0 2.3 1 2.3 3.4 0 3-2.6 6.4-6.8 6.4l-1 3.8H4.2l1-3.8C2.5 10.2.7 9 .7 6.6A6.5 6.5 0 0 1 7 .3h.5v.3c-2.6.3-4.8 3-4.8 5.9 0 1.7 1 3 2.5 3zM8 4.8L6.9 9.6c2.1 0 4.9-3 4.9-6 0-1.7-.5-2-1-2-1 0-2.3 1.4-2.7 3.2z"/>\n</svg>\n';},function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="32">\n  <defs>\n    <path id="aRootN" d="M14 11h14v18H14z"/>\n    <mask id="cRootN" width="14" height="18" x="0" y="0" fill="#fff">\n      <use xlink:href="#aRootN"/>\n    </mask>\n    <path id="bRootN" d="M0 0h8v9.6H0z"/>\n    <mask id="dRootN" width="9" height="10" x="0" y="0" fill="#fff">\n      <use xlink:href="#bRootN"/>\n    </mask>\n  </defs>\n  <g fill="none" fill-rule="evenodd">\n    <path fill="currentColor" d="M11.3 5L5.6 27.2l-2.2-4.6L0 25.2l.6 1 1.8-1.4 3.2 6.7 6.6-25.3h17.4V5z"/>\n    <use stroke="currentColor" stroke-dasharray="2 2" stroke-width="2" mask="url(#cRootN)" xlink:href="#aRootN"/>\n    <use stroke="currentColor" stroke-dasharray="2 2" stroke-width="2" mask="url(#dRootN)" xlink:href="#bRootN"/>\n  </g>\n</svg>\n';},function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="27">\n  <defs>\n    <path id="aSqrt" d="M14 6h14v18H14z"/>\n    <mask id="bSqrt" width="14" height="18" x="0" y="0" fill="#fff">\n      <use xlink:href="#aSqrt"/>\n    </mask>\n  </defs>\n  <g fill="none" fill-rule="evenodd">\n    <path fill="currentColor" d="M11.3 0L5.6 22.2l-2.2-4.6L0 20.2l.6 1 1.8-1.4 3.2 6.7 6.6-25.3h17.4V0z"/>\n    <use stroke="currentColor" stroke-dasharray="2 2" stroke-width="2" mask="url(#bSqrt)" xlink:href="#aSqrt"/>\n  </g>\n</svg>\n';},function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="28" height="25">\n  <defs>\n    <path id="aSub" d="M20 15h8v9.6h-8z"/>\n    <mask id="cSub" width="9" height="10" x="0" y="0" fill="#fff">\n      <use xlink:href="#aSub"/>\n    </mask>\n    <path id="bSub" d="M0 0h16v20H0z"/>\n    <mask id="dSub" width="16" height="20" x="0" y="0" fill="#fff">\n      <use xlink:href="#bSub"/>\n    </mask>\n  </defs>\n  <g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-dasharray="2 2" stroke-width="2">\n    <use mask="url(#cSub)" xlink:href="#aSub"/>\n    <use fill="currentColor" fill-opacity=".1" mask="url(#dSub)" xlink:href="#bSub"/>\n  </g>\n</svg>\n';},function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="28" height="25">\n  <defs>\n    <path id="aSup" d="M20 0h8v9.6h-8z"/>\n    <mask id="cSup" width="9" height="10" x="0" y="0" fill="#fff">\n      <use xlink:href="#aSup"/>\n    </mask>\n    <path id="bSup" d="M0 5h16v20H0z"/>\n    <mask id="dSup" width="16" height="20" x="0" y="0" fill="#fff">\n      <use xlink:href="#bSup"/>\n    </mask>\n  </defs>\n  <g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-dasharray="2 2" stroke-width="2">\n    <use mask="url(#cSup)" xlink:href="#aSup"/>\n    <use fill="currentColor" fill-opacity=".1" mask="url(#dSup)" xlink:href="#bSup"/>\n  </g>\n</svg>\n';},function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="26" height="30">\n  <defs>\n    <path id="aSupb" d="M0 6h14v18H0z"/>\n    <mask id="dSupb" width="14" height="18" x="0" y="0" fill="#fff">\n      <use xlink:href="#aSupb"/>\n    </mask>\n    <path id="bSupb" d="M18 0h8v9.6h-8z"/>\n    <mask id="eSupb" width="9" height="10" x="0" y="0" fill="#fff">\n      <use xlink:href="#bSupb"/>\n    </mask>\n    <path id="cSupb" d="M18 20h8v9.6h-8z"/>\n    <mask id="fSupb" width="9" height="10" x="0" y="0" fill="#fff">\n      <use xlink:href="#cSupb"/>\n    </mask>\n  </defs>\n  <g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-dasharray="2 2" stroke-width="2">\n    <use mask="url(#dSupb)" xlink:href="#aSupb"/>\n    <use mask="url(#eSupb)" xlink:href="#bSupb"/>\n    <use mask="url(#fSupb)" xlink:href="#cSupb"/>\n  </g>\n</svg>\n';},function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="19" height="30">\n  <defs>\n    <path id="aVec" d="M0 10h18v20H0z"/>\n    <mask id="bVec" width="18" height="20" x="0" y="0" fill="#fff">\n      <use xlink:href="#aVec"/>\n    </mask>\n  </defs>\n  <g fill="none" fill-rule="evenodd">\n    <use stroke="currentColor" stroke-dasharray="2 2" stroke-width="2" mask="url(#bVec)" xlink:href="#aVec"/>\n    <path fill="currentColor" d="M1 4c0 .2 0 .3.2.4l.6.2h14.3L12.6 7c-.4.3-.4.5 0 .8.4.3.8.3 1.1 0l5-3.4.2-.2.1-.2v-.2l-.3-.2-5-3.4c-.3-.3-.7-.3-1.1 0-.4.3-.4.5 0 .8L16 3.4H1.8a1 1 0 0 0-.6.2L1 4z"/>\n  </g>\n</svg>\n';},,,,,,,,,,,,function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t)){ throw new TypeError("Cannot call a class as a function") }}Object.defineProperty(t,"__esModule",{value:!0});var a=n(15),o=i(a),s=n(1),l=n(3),c=n(2),u=n(0),h=n(45),f=i(h),p=n(9),d=n(10),m=function e(t,n,i){function a(e){V||K.focus(),K.inputHandler(e.value);}function h(){V||K.focus(),K.deleteHandler();}function m(){V||K.focus(),K.moveLeftHandler();}function v(){V||K.focus(),K.moveRightHandler();}function g(e){var t=void 0;t=e.changedTouches?e.changedTouches[0].target:e.target,y(t);}function y(e){if(console.log("任意某点击,touchstart:",e),te.el.contains(e)){ void 0!==K&&null!=K&&"systemBtn"!==e.getAttribute("id")&&(K.hasFocus()?setTimeout(K.focusDisguise,50):K.focusDisguise()); }else{var t=e.tagName;"HTML"!==t&&"BODY"!==t?(0,c.parentTo)(e,k,!0)||(console.log("%c1 点击其它取消焦点和隐藏键盘","color:royalblue"),w()):(console.log("%c2 点击其它取消焦点和隐藏键盘","color:royalblue"),b(),w());}}function b(){}function x(e,t){(0,l.forArray)(Y,function(n,i){e!==i&&i.setEnabled(t);});}function w(){$=!1,I(void 0,K),L();}function k(e){return e.className.length>0&&(0,u.hasClass)(e,"mq-editable-field")}function T(e){b(),C(e.currentTarget);}function C(e){var n=K;K=O(e),I(e,n),W?S()&&D(t):setTimeout(function(){_();},100);}function S(){return-1!==F.indexOf("android")}function q(){return-1!==F.indexOf("ios")}function O(e){function t(t,n){var i=n.el;return i===e||i.contains(e)}var n=(0,l.forArray)(Y,t);return void 0!==n?Y[n]:null}function E(){return K.el.getBoundingClientRect().top}function L(e){W=!1,te.remove(),void 0!==e&&!0!==e||N(t),te.unTransparent();}function _(){W=!0,te.addInto(n),void 0===X&&(X=te.el.getBoundingClientRect()),D(t);}function D(e){var t=K.el.getBoundingClientRect();if(X.top<t.bottom){var n=X.top-t.bottom;if("static"===(0,u.cssValue)(e,"position")){ e.style.position="relative",e.style.top=n+"px"; }else{var i=(0,u.cssValue)(e,"top");e.style.top=i+n+"px";}}ee=E();}function j(){console.log("%cphone,调用系统键盘-------","color:royalblue"),K.focus(),te.transparent(),$=!0,x(K,!1),setTimeout(function(){console.log("%cphone,100ms","color:royalblue"),x(K,!0),L(!1);},100),P||setTimeout(function(){R(t),console.log("%cphone, 180ms","color:royalblue");},180),S()&&(K.el.addEventListener("mathquill_blur",A),setTimeout(function(){K.el.removeEventListener("mathquill_blur",A);},200));}function A(){console.log("收到模糊事件"),K.focus(),setTimeout(K.focusDisguise,50),K.el.removeEventListener("mathquill_blur",A);}function B(){if(console.log("%cphone, resize事件","color:royalblue"),G){ G=!1; }else{var e=window.innerHeight;e-M>140&&K&&(W||_(),K.blur(),K.focusDisguise()),M=e;}}function Q(e){console.log("%cphone, 响应focusout事件,","color:royalblue"),$&&K&&(K.focusDisguise(),$=!1,W||setTimeout(function(){_();},100));}function R(e){var t=K.el.getBoundingClientRect(),n=t.top,i=X.top-H;if(i<t.bottom){var r=i-t.bottom,a=(0,u.cssValue)(e,"position"),o=void 0;"static"===a?(e.style.position="relative",o=r):o=(0,u.cssValue)(e,"top")+r,n+=r;var s=0;n<=0&&(s=0-n,o+=s),e.style.top=o+"px";}ee=E();}function z(e){if(void 0!==K&&null!==K){var n=K.el.getBoundingClientRect().top,i=n-ee;if(Math.abs(i)>5){var r=0,a=0,o=K.el.getBoundingClientRect();X.top-H<o.bottom?"static"===(0,u.cssValue)(t,"position")?(t.style.position="relative",r=-i):(a=(0,u.cssValue)(t,"top"),r=a-i):(i=0,r=(0,u.cssValue)(t,"top"));var s=n+i,l=0;s<=0&&(l=1-s,r+=l),t.style.top=r+"px";}}}function N(e){"static"===J?(e.style.position="",e.style.top=""):e.style.top=Z+"px";}function I(e,t){null!==t&&void 0!==t&&(null!==e&&void 0!==e&&t.el===e||(t.blur(),t=null));}if(r(this,e),arguments.length<3){ throw new Error("参数数量不对"); }this.version=d.version,console.log("版本：",this.version,i);var M=window.innerHeight,F=i.device;void 0===F&&(i.device=F=(0,p.judgeDeviceOfBrowser)());var P=void 0;P=!0===i.browser;var H=80,V="ontouchend"in document,U={start:"",move:"",end:""};V?(U.start="touchstart",U.move="touchmove",U.end="touchend"):(U.start="mousedown",U.move="mousemove",U.end="mouseup");var K=void 0,Y=[],$=!1,W=!1,G=!1,X=void 0,Z=(0,u.cssValue)(t,"top"),J=(0,u.cssValue)(t,"position");isNaN(Z)&&(Z=0);var ee=void 0,te=new f.default(i);"BODY"!==n.tagName&&(te.el.style.position="absolute"),function(){document.addEventListener(s.CustomEvent.SOFTKEYBOARD_INPUT_VALUE,a),document.addEventListener(s.CustomEvent.SOFTKEYBOARD_INPUT_DELETE,h),document.addEventListener(s.CustomEvent.SOFTKEYBOARD_INPUT_MOVELEFT,m),document.addEventListener(s.CustomEvent.SOFTKEYBOARD_INPUT_MOVERIGHT,v),document.addEventListener(s.CustomEvent.SYSKEYBOARD_SHOW,j),document.addEventListener(U.start,g),document.addEventListener("input_broadcast",z),q()?document.addEventListener("focusout",Q):S()&&window.addEventListener("resize",B),window.addEventListener("orientationchange",function(){G=!0;});}(),this.hideBoard=L,this.addInto=function(e){e.appendChild(el);},this.createText=function(e,t){var n=new o.default(e,F,t);return Y.push(n),n.addInputResponse(T),n.el},this.removeText=function(e){for(var t=void 0,n=Y.length,i=0;i<n;i++){ if(t=Y[i],t.el===e){t.remove(),Y.splice(i,1);break} }},this.setTextValue=function(e,t){O(e).setLatex(t);},this.setTextFocus=function(e){var t=K;K=O(e),I(e,t),K.focusDisguise(),W||setTimeout(function(){_();},50);},this.setAllTextBlur=function(){for(var e=void 0,t=Y.length,n=0;n<t;n++){ e=Y[n],e.blur(); }},this.setTextEnabled=function(e,t){O(e).setEnabled(t);},this.setAllTextEnabled=function(e){for(var t=void 0,n=Y.length,i=0;i<n;i++){ t=Y[i],t.setEnabled(e); }};};t.default=m,m.device={windows:"windows computer",ipad:"ios pad",iphone:"ios phone",mac:"ios computer",aPhone:"android phone",aPad:"android pad"},m.theme=[];},function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t)){ throw new TypeError("Cannot call a class as a function") }}Object.defineProperty(t,"__esModule",{value:!0}),n(46);var r=n(0),a=n(47),o=n(2),s=n(11),l=n(1),c=function e(t){function n(e,t){var n=document.createElement("div");F.appendChild(n),(0,r.addClass)(n,e.classString);var i=e.list,a=t.columnNum;if(-1!==e.classString.indexOf("rowEvenScroll")){var o=i[0].keys.list,l=o.length,u=l%a;if(0!==u){ for(var h=a-u,f=0;f<h;f++){ o.push(s.keyTypeCollection.placeholder.place); } }}return c(n,i),n}function c(e,t){u(e,t);}function u(e,t){for(var n=t.length,i=void 0,a=void 0,o=void 0,s=0;s<n;s++){ a=document.createElement("div"),e.appendChild(a),i=t[s],(0,r.addClass)(a,i.classString),o=i.keys,"size_uneven"===i.sizeType?p(a,o,f):p(a,o,h); }}function h(e,t,n){(0,r.addClass)(e,t.classString),""!==n.latex&&void 0!==n.latex?e.data=n.latex:e.data=n.value,"svg"===n.iconType||"formula"===n.type||"functional"===n.type?e.innerHTML=s.iconSvg[n.iconName]:e.innerHTML=n.value;}function f(e,t,n){(0,r.addClass)(e,t.classString),(0,r.addClass)(e,n.classString),""!==n.latex&&void 0!==n.latex?e.data=n.latex:e.data=n.value;var i=n.base;"svg"===i.iconType||"formula"===i.type||"functional"===n.type?(e.innerHTML=s.iconSvg[i.iconName],e.data=n.value):(e.innerHTML=i.value,e.data=n.value);}function p(e,t,n){for(var i=void 0,r=void 0,a=t.list,o=a.length,s=0;s<o;s++){ i=document.createElement("span"),e.appendChild(i),r=a[s],n(i,t,r); }}function d(){return screen.orientation?screen.orientation.angle:window.orientation}function m(e){var t=void 0,i=void 0,r=d();0===r||180===r?(t=R.horizontal,Q="vertical",console.log("竖屏"),""===R.vertical?(i=n(N.boardData,N.layoutInfo),R.vertical=i):i=R.vertical):(t=R.vertical,console.log("横屏"),Q="horizontal",""===R.horizontal?(i=n(N.boardData2,N.layoutInfo),R.horizontal=i):i=R.horizontal),H===t&&(H=i),F.removeChild(t),i.style.display=t.style.display,F.insertBefore(i,F.children[0]);}function v(e){var t=e.currentTarget;t.addEventListener("touchmove",g),t.addEventListener("touchend",y),(0,l.customEventDispatch)(document,"talqs_swiperEvent","softKeyboard",1);var n=M.children,i=e.target;if(!(0,r.hasClass)(i,"switchSelected")){var a=(0,o.indexOfElement)(i);5===a?(0,l.customEventDispatch)(document,l.CustomEvent.SYSKEYBOARD_SHOW,l.EventType.SOFTKEYBOARD):((0,r.removeClass)(n[A],"switchSelected"),(0,r.addClass)(i,"switchSelected"),A=a,L(A));}}function g(e){e.preventDefault(),e.stopPropagation(),b(e,U),x();}function y(e){var t=(e.target,e.currentTarget);t.removeEventListener("touchmove",g),t.removeEventListener("touchend",y),(0,l.customEventDispatch)(document,"talqs_swiperEvent","softKeyboard",2);}function b(e,t){if(e.changedTouches){var n=e.changedTouches[0];t.x=n.clientX,t.y=n.clientY;}else { t.x=e.clientX,t.y=e.clientY; }}function x(){(Math.abs(U.x-V.x)>3||Math.abs(U.y-V.y)>3)&&(j=!0);}function w(e){if(e.preventDefault(),e.stopPropagation(),(0,l.customEventDispatch)(document,"talqs_swiperEvent","softKeyboard",1),(0,r.hasClass)(H,"rowEvenScroll")){var t=e.changedTouches[0];V.x=t.clientX,V.y=t.clientY;var n=H.querySelector(".moveLayer");(0,o.getPosToParent)(n,K),H.addEventListener("touchend",S),H.addEventListener("touchmove",C);}else { j=!1,H.addEventListener("touchend",k),H.addEventListener("touchmove",T),q(e.target); }}function k(e){e.preventDefault(),e.stopPropagation(),H.removeEventListener("touchend",k),H.removeEventListener("touchmove",T),(0,l.customEventDispatch)(document,"talqs_swiperEvent","softKeyboard",2);}function T(e){e.preventDefault(),e.stopPropagation();}function C(e){e.preventDefault(),e.stopPropagation();var t=H.querySelector(".moveLayer"),n=e.changedTouches[0],i=n.clientY-V.y;if(Math.abs(i)>3){var r=K.y+i,a=H.clientHeight,o=t.scrollHeight;r+o<a?r=a-o:r>0&&(r=0),t.style.top=r+"px",j=!0;}}function S(e){e.preventDefault(),e.stopPropagation(),(0,l.customEventDispatch)(document,"talqs_swiperEvent","softKeyboard",2),H.removeEventListener("touchend",S),H.removeEventListener("touchmove",C),j||q(e.target),j=!1;}function q(e){var t=_(e);if(null!==t){var n=t.data;switch(n){case"del":(0,l.customEventDispatch)(document,l.CustomEvent.SOFTKEYBOARD_INPUT_DELETE,l.EventType.SOFTKEYBOARD_INPUT,n);break;case"left":(0,l.customEventDispatch)(document,l.CustomEvent.SOFTKEYBOARD_INPUT_MOVELEFT,l.EventType.SOFTKEYBOARD_INPUT,n);break;case"right":(0,l.customEventDispatch)(document,l.CustomEvent.SOFTKEYBOARD_INPUT_MOVERIGHT,l.EventType.SOFTKEYBOARD_INPUT,n);break;case"shift":O(t),E();break;case void 0:case"":console.log("无值");break;default:(0,l.customEventDispatch)(document,l.CustomEvent.SOFTKEYBOARD_INPUT_VALUE,l.EventType.SOFTKEYBOARD_INPUT,n);}}}function O(e){(0,r.hasClass)(e,"keyColorSelected")?(0,r.removeClass)(e,"keyColorSelected"):(0,r.addClass)(e,"keyColorSelected");}function E(){for(var e=H.children,t=N.boardData.list,n=t.length,i=void 0,r=void 0,a=void 0,o=void 0,l=void 0,c=void 0,u=void 0,h=void 0,f=void 0,p=0;p<n;p++){l=t[p],u=l.keys,h=u.list,f=u.listBackup,u.list=f,u.listBackup=h,c=e[p],r=c.children,o=f.length;for(var d=0;d<o;d++){ a=f[d],i=r[d],"svg"===a.iconType||"formula"===a.type||"functional"===a.type?i.innerHTML=s.iconSvg[a.iconName]:(i.innerHTML=a.value,i.data=a.value); }}}function L(e){var t=z[e];void 0!==H&&(H.style.display="none"),"string"==typeof t?(N=(0,a.getKeyboardConfig)(e),z[e]=N,H=n(N.boardData,N.layoutInfo),F.appendChild(H)):(N=z[e],H=F.querySelector(".order"+(e+1)),H.style.display="");}function _(e){return(0,o.getParentBy)(e,".keyBtn")||null}i(this,e);var D=t.device,j=!1,A=0,B=(0,a.getSwitchBarConfig)(),Q="",R={horizontal:"",vertical:""},z=["","","","","","",""],N=(0,a.getKeyboardConfig)(A);z[A]=N,this.el=function(){var e=document.createElement("div");return(0,r.addClass)(e,"keyboardLayerOfPhone flexAlignCenter noFastClick"),e}();var I=this.el,M=function(){var e=document.createElement("div");(0,r.addClass)(e,"switchDiv"),I.appendChild(e),-1===D.indexOf("computer")&&B.push({name:"中文",selected:!1});for(var t=void 0,n=void 0,i=B.length,a=0;a<i;a++){ t=B[a],n=document.createElement("span"),e.appendChild(n),n.innerHTML=t.name,(0,r.addClass)(n,"switchBtn flexAlignCenter"); }return B[0].selected=!0,(0,r.addClass)(e.children[0],"switchSelected"),e}(),F=function(){var e=document.createElement("div");return(0,r.addClass)(e,"boardsDiv"),I.appendChild(e),e}(),P=function(e){var t=d();return 90===t|-90===t?(Q="horizontal",console.log("横屏 currentDir:",Q),e.boardData2):(Q="vertical",console.log("竖屏 currentDir:",Q),e.boardData)}(N),H=n(P,N.layoutInfo);R[Q]=H;var V={},U={};!function(){F.addEventListener("touchstart",w),M.addEventListener("touchstart",v),window.addEventListener("orientationchange",m);}();var K={};this.addInto=function(e){e.appendChild(I);},this.insertAfter=function(e){(0,o.insertAfter)(I,e);},this.remove=function(){var e=I.parentNode;e&&e.removeChild(I);},this.transparent=function(){(0,r.addClass)(I,"opacity");},this.unTransparent=function(){(0,r.removeClass)(I,"opacity");};};t.default=c;},function(e,t){},function(e,t,n){"use strict";function i(){for(var e=s.length,t=void 0,n=void 0,i=[],r=0;r<e;r++){ t=s[r],n={name:t.name,selected:!1},i.push(n); }return i}function r(e){return s[e]}Object.defineProperty(t,"__esModule",{value:!0}),t.getSwitchBarConfig=i,t.getKeyboardConfig=r;var a=n(11),o={column:{even:"column_even",uneven:{width:"column_width_uneven",number:"column_number_uneven"}},row:{even:"row_even",uneven:{width:"row_width_uneven",height:"row_height_uneven",number:"row_number_uneven"}},size:{even:"size_even",uneven:"size_uneven"}},s=[{name:"常用",boardData:function(){var e=a.keyTypeCollection.number,t=a.keyTypeCollection.mathSymbol,n=a.keyTypeCollection.functional,i=a.keyTypeCollection.unit,r=a.keyTypeCollection.formula;return{classString:"keyboardLayout flexLayoutRow order1",list:[{keys:{classString:"keyBtn keyColor1 flexAlignCenter",list:[t.add,t.sub,t.mul,t.div]},sizeType:o.size.even,classString:"column columnNarrow flexLayoutColumn"},{keys:{classString:"keyBtn keyColor1 flexAlignCenter",list:[e[7],e[8],e[9],e[4],e[5],e[6],e[1],e[2],e[3],t.equal,e[0],t.dot]},sizeType:o.size.even,classString:"column columnWide flexLayoutRow"},{keys:{classString:"keyBtn keyColor2 flexAlignCenter",list:[n.del,t.pi,i.degree,r.fraction]},sizeType:o.size.even,classString:"column columnNarrow flexLayoutColumn"}]}}(),boardData2:function(){var e=a.keyTypeCollection.number,t=a.keyTypeCollection.mathSymbol,n=a.keyTypeCollection.functional,i=a.keyTypeCollection.unit,r=a.keyTypeCollection.formula;return{classString:"keyboardLayout rowEvenNoScroll order1",list:[{keys:{classString:"keyBtn keyColor1 flexAlignCenter",list:[e[1],e[2],e[3],e[4],e[5],e[6],e[7],e[8],e[9],e[0],t.add,t.sub,t.mul,t.div,t.equal,t.dot,t.pi,i.degree,r.fraction,n.del]},sizeType:o.size.even,classString:"noMoveLayer flexLayoutRow"}]}}(),layoutInfo:{type:o.column.uneven.width}},{name:"abc",boardData:function(){var e=a.keyTypeCollection.lowercase,t=a.keyTypeCollection.capital,n=a.keyTypeCollection.functional;return{classString:"keyboardLayout flexLayoutColumn order2",list:[{keys:{classString:"keyBtn keyColor1 flexAlignCenter",list:[e.q,e.w,e.e,e.r,e.t,e.y,e.u,e.i,e.o,e.p],listBackup:[t.q,t.w,t.e,t.r,t.t,t.y,t.u,t.i,t.o,t.p]},sizeType:o.size.even,classString:"row flexLayoutRowCenter"},{keys:{classString:"keyBtn keyColor1 flexAlignCenter",list:[e.a,e.s,e.d,e.f,e.g,e.h,e.j,e.k,e.l],listBackup:[t.a,t.s,t.d,t.f,t.g,t.h,t.j,t.k,t.l]},sizeType:o.size.even,classString:"row flexLayoutRowCenter"},{keys:{classString:"keyBtn keyColor1 flexAlignCenter",list:[n.shift,e.z,e.x,e.c,e.v,e.b,e.n,e.m,n.space,n.del],listBackup:[n.shift,t.z,t.x,t.c,t.v,t.b,t.n,t.m,n.space,n.del]},sizeType:o.size.even,classString:"row flexLayoutRowCenter"}]}}(),layoutInfo:{type:o.row.uneven.number}},{name:"αβγ",boardData:function(){var e=a.keyTypeCollection.greekLower,t=a.keyTypeCollection.greekCapital;return e.phi.iconType="text",{classString:"keyboardLayout rowEvenScroll order3",list:[{keys:{classString:"keyBtn keyColor1 flexAlignCenter",list:[e.alpha,e.beta,e.gamma,e.delta,e.varepsilon,e.zeta,e.eta,e.theta,e.iota,e.kappa,e.lambda,e.mu,e.nu,e.xi,e.omicron,e.pi,e.rho,e.sigma,e.tau,e.upsilon,e.phi,e.chi,e.psi,e.omega,e.epsilon,t.alpha,t.beta,t.gamma,t.delta,t.epsilon,t.zeta,t.eta,t.theta,t.iota,t.kappa,t.lambda,t.mu,t.nu,t.xi,t.omicron,t.pi,t.rho,t.sigma,t.tau,t.upsilon,t.phi,t.chi,t.psi,t.omega]},sizeType:o.size.even,classString:"moveLayer flexLayoutRow"}]}}(),layoutInfo:{type:o.row.even,columnNum:6}},{name:"公式",boardData:function(){var e=a.keyTypeCollection.formula,t=a.keyTypeCollection.mathSymbol,n=a.keyTypeCollection.parentheses,i=a.keyTypeCollection.symbol,r=a.keyTypeCollection.chinese,s=a.keyTypeCollection.unit;return{classString:"keyboardLayout rowEvenScroll order4",list:[{keys:{classString:"keyBtn keyColor1 flexAlignCenter",list:[t.greater,t.less,t.greatOrEqual,t.lessOrEqual,t.unequal,t.pN,t.percent,n.left,n.right,i.colon,i.comma,r.huo,e.fraction,e.radical,e.sup,e.sub,s.degree,e.mean,e.vector,e.arc,e.repeat,e.radicalN,e.combination,t.cdot,t.odot,t.oplus,t.otimes,t.approx,t.equiv,t.triangle,t.angle,t.perp,t.parallel,t.backsim,t.cong,t.cdots,t.mid,t.in,t.notin,t.subseteq,t.subsetneqq,t.subset,t.varnothing,t.cup,t.cap,t.int,t.infty,t.exists,t.forall,t.Rightarrow,t.Leftrightarrow,t.lnot,t.lor,t.wedge]},sizeType:o.size.even,classString:"moveLayer flexLayoutRow"}]}}(),layoutInfo:{type:o.row.even,columnNum:6}},{name:"符号",boardData:function(){var e=a.keyTypeCollection.specialText,t=a.keyTypeCollection.symbol,n=a.keyTypeCollection.brackets,i=a.keyTypeCollection.squareBrackets,r=a.keyTypeCollection.mathSymbol;return{classString:"keyboardLayout rowEvenScroll order5",list:[{keys:{classString:"keyBtn keyColor1 flexAlignCenter",list:[e.circle1,e.circle2,e.circle3,e.circle4,e.circle5,e.circle6,e.circle7,e.circle8,e.circle9,e.circle10,t.at,t.hash,t.dollar,t.rmb,t.and,t.asterisk,i.left,i.right,n.left,n.right,e.rightarrow,e.leftarrow,e.uparrow,e.downarrow,t.minutePrime,t.secondPrime,t.excla,t.pause,t.slash,t.backslash,t.question,e.bigstar,e.diamond,e.bigcirc,e.square,r.farLess,r.farGreater]},sizeType:o.size.even,classString:"moveLayer flexLayoutRow"}]}}(),layoutInfo:{type:o.row.even,columnNum:6}}];}]);

/**
 * 填空型作答
 * 需要优化
 * 适用题型
 * 1. 填空题 data-logic-type='4'
 */
// import { simpleMathKeypad } from '../helper/keypad';
var manager = undefined;

var FillBlankTypeQuestion = (function ($) {

    var NAME = 'fillblank';
    var DATA_KEY = "talqs." + NAME;
    var EVENT_KEY = "." + DATA_KEY;
    var KEYPAD_BLANK = 'keypadblank';
    var DEFAULT_SEPARATOR = '、';
    var SUFFIX = "" + EVENT_KEY + DATA_API_KEY;

    var mathStore = new MathStore();
    var initKeypad = false;

    var Event = {
        BLUR_DATA_API: ("blur" + SUFFIX),
        INPUT_DATA_API: ("input" + SUFFIX),
        CLICK_API: ("" + (IsPC()?'click':'touchstart') + SUFFIX),
        FOCUS_DATA_API: ("focus" + SUFFIX),
        COMPOSITION_START: ("compositionstart" + SUFFIX),
        COMPOSITION_END: ("compositionend" + SUFFIX),
    };

    var Selector = {
        ROOT_QS_CONTAINER: ("[" + (attr.rootId) + "]"),
        FILL_BLANK_TYPE: ("[" + (attr.type) + "=\"" + NAME + "\"]"),
        FILL_BLANK_ITEM: ("[" + (attr.blankItem) + "]"),
        MATH_INPUT_ITEM: ("." + (style$1.mathInput)),
        BLANK_POPUP_TRIGGER: ("[" + (attr.blankPopupTrigger) + "]"),
        BLANK_ALPHA_TRIGGER: ("[" + (attr.blankAlphaTrigger) + "]"),
        BLANK_OPTION: ("[" + (attr.blankOption) + "]"),
        MAIN_CONTENT: '.talqs_main',
        MATH_KEYPAD: '.keypad',
        BLANK_OPTION_KEYPAD: '.blankOptionKeypad',
        BLANK_POPOVER: '.blank-popover',
    };

    var ATTRS = {
        QUE_ID: attr.queId,
        FILL_BLANK_ITEM: attr.blankItem,
        BLANK_POPUP_INDEX: attr.blankPopupTrigger,
        BLANK_OPTION: attr.blankOption,
        BLANK_OPTION_LIST: attr.blankOptionList,
        BLANK_POPUP_TYPE: attr.blankPopupType,
        BLANK_TYPE: attr.blankType,
        BLANK_CONTENT_TYPE: attr.blankContentType,
    };

    var ClassName = {
        SHADOW: style$1.inputShadow,
        MATH_INPUT: style$1.mathInput,
        MATH_SVG_INPUT: style$1.inputContainer,
    };

    var FillBlankType = function FillBlankType(queId, rootId, element, data) {
        this._queId = queId;
        this._rootId = rootId;
        this._element = element;
        this._blankData = data || [];
        this._blankInputList = FillBlankType._getBlankItemList(element);
        this._num = this._blankInputList.length || 0;
        this._logicType = getLogicType(element);
    };

    // public

    /**
     * [updateBlankValueByIndex 更新某空的输入数据]
     * @param  {[Number]} index [填空的索引值]
     * @param  {[String]} value [输入的数据]
     */
    FillBlankType.prototype.updateBlankValueByIndex = function updateBlankValueByIndex (index, value) {
            var this$1 = this;

        // 如果空号转换出错，则直接返回
        index = parseInt(index, 10);
        if (isNaN(index)) { return; }

        // 与当前值比对，看是否有更新, 没有更新就直接返回
        var currentValue = this._blankData[index];
        if (currentValue === value) { return; }

        // --------------填空值更新------------------------

        // 更新对应空号的数据
        this._blankData[index] = value;

        // 答案数据数组封装，没有作答的直接添加默认值（空字符串）
        var tempList = [];
        for (var i = 0; i < this._num; i++) {
            tempList.push(this$1._blankData[i] || DEFAULT_VALUE);
        }

        // 用户输入数据封装
        var inputData = {
            queId: this._queId,
            rootId: this._rootId,
            data: tempList,
            type: this._logicType,
        };

        // 添加到作答数据记录列表
        talqsStorageData.set(this._queId, inputData);
        // 派发更新事件
        dispatchUpdateEvent(inputData);
    };

    /**
     * [fillItemWithState 给input填值，并更新作答状态]
     * @param  {[DOM Element]} item  [输入框]
     * @param  {[String]}  value [输入值]
     * @param  {[Number]}  state [判题结果]
     */
    FillBlankType.prototype.fillItemWithState = function fillItemWithState (item, value, state) {
        // 数学键盘类型的填空题
        if (item.className.indexOf(ClassName.MATH_INPUT) >= 0) {
            // 如果已经初始化，则直接填值
            if (item.mathInput) {
                item.mathInput.value = value;
            } else { // 初始化数学输入框
                FillBlankType._initMathInput(item, value);
            }
            // 如果是处于焦点状态，则收起键盘，失去焦点
            // if (item.mathInput.focused) {
            // FillBlankType.toggleKeypad(false);
            // }
        } else if (item.className.indexOf(ClassName.MATH_SVG_INPUT) >= 0) { // 数学选择型填空题（包含SVG结构）
            var mathList = value.split(DEFAULT_SEPARATOR) || [];
            // 获取所有选项列表
            var mathBlankOptionList = document.querySelectorAll(Selector.BLANK_OPTION);
            item.innerHTML = '';
            for (var i = 0, len = mathList.length; i < len; i++) {
                var latex = mathList[i];
                for (var j = 0, blankOptionLen = mathBlankOptionList.length; j < blankOptionLen; j++) {
                    var optionItem = mathBlankOptionList[j];
                    var optionLatex = optionItem.getAttribute(ATTRS.BLANK_OPTION);
                    if (optionLatex == latex) {
                        item.appendChild(optionItem.children[0].cloneNode(true));
                        break;
                    }
                }
            }
        } else { // 非数学填空，直接赋值，再调整宽度
            item.value = value;
            item.style.width = FillBlankType._getInputWidthByText(value);
        }

        // 更新作答正确或者错误的状态样式
        setResultState(item, state);
    };

    /**
     * [fillDataIntoComponent 更新整个作答数据列表]
     * @param  {[type]} data [作答数据]
     */
    FillBlankType.prototype.fillDataIntoComponent = function fillDataIntoComponent (userData) {
        // 作答数据赋值
        var data = userData.data || [];
        // 判题结果数据
        var result = userData.result || [];
        // 
        this._blankData = data;

        // 遍历挂载容器元素下所有填空，并将对应的值写入输入框
        var blankItemList = this._blankInputList;
        var instance = this;
        [].forEach.call(blankItemList, function (item, index) {
            var value = userData.data[index] || DEFAULT_VALUE;
            // 作答结果判定， 1正确，0错误
            var state = result[index];
            // 单词拼写特殊处理，需要拆分答案单词，把各个字母填入对应的空
            if (FillBlankType.isSpellBlankType(item)) {
                var alphaList = FillBlankType.getAlphaInputList(item);
                [].forEach.call(alphaList, function (alphaItem, subIndex) {
                    instance.fillItemWithState(alphaItem, value[subIndex] || DEFAULT_VALUE, state);
                });
            } else {
                instance.fillItemWithState(item, value, state);
            }
        });

        // 如果有小低英语，就收起小低面板
        if (this.blankOptionKeypad) {
            this.togglePopup(false);
        }
    };

    /**
     * [_getInputWidthByText 获取输入框的宽度，用于动态调整输入框宽度]
     * @param  {[String]} value [输入框字符串]
     * @return {[Number]}   [输入框应该占用的宽度]
     */
    FillBlankType._getInputWidthByText = function _getInputWidthByText (value) {
        var inputShadow = document.querySelector(("." + (ClassName.SHADOW)));
        // 为了自适应输入框，创建一个span
        if (!inputShadow) {
            inputShadow = document.createElement('span');
            toggleClass(inputShadow, ClassName.SHADOW, true);
            document.body.appendChild(inputShadow);
        }
        inputShadow.innerText = value;
        var width = inputShadow.offsetWidth + 'px';
        inputShadow.innerText = '';
        inputShadow.parentNode.removeChild(inputShadow);
        return width;
    };


    /**
     * [_updateInputData 派发更新输入框数据]
     * @param  {[Element]} input [输入框]
     */
    FillBlankType._updateInputData = function _updateInputData (input) {
        var value = replaceInvalidStr(input.value);
        input.value = value;
        if (typeof($(input).attr("x-palm-disable-ste-all"))=="undefined") {
            input.style.width = FillBlankType._getInputWidthByText(value);
        }
        FillBlankType._updateInputDataHandler(input, value);
    };

    /**
     * [getBlankIndex 根据DOM获取填空编号]
     * @param  {[DOM Element]} blankItem [作答空DOM]
     * @return {[Number]}            [空号]
     */
    FillBlankType.prototype.getBlankIndex = function getBlankIndex (blankItem) {
        return parseInt(blankItem.getAttribute(ATTRS.FILL_BLANK_ITEM), 10);
    };

    /**
     * [_updateInputDataHandler 更新空的数据]
     * @param  {[DOM Element]} target [作答空]
     * @param  {[String]}  value  [作答数据]
     */
    FillBlankType._updateInputDataHandler = function _updateInputDataHandler (target, value) {
        var instance = FillBlankType._getClosestInstanceByElement(target);
        if (instance) {
            var index = instance.getBlankIndex(target);
            instance.updateBlankValueByIndex(index, value);
            // 如果是选择型，更新选项按钮的选中状态
            if (instance.currentList) {
                instance.updateAnswerSeleted(index);
            }
        }
    };

    /**
     * [_getInstance 根据DOM获取一个组件实例，如果没有则初始化一个新的实]
     * @param  {[DOM Element]} element   [试题DOM元素]
     * @return {[FillBlankType]}     [填空题组件实例]
     */
    FillBlankType._getInstance = function _getInstance (element) {
        // 获取组件缓存
        var instance = $(element).data(DATA_KEY);
        if (!instance) {
            // 初始化组件并写入缓存
            var queId = getQueId(element);
            // 获取最外层 ID
            var rootId = getRootId(element);
            instance = new FillBlankType(queId, rootId, element);
            $(element).data(DATA_KEY, instance);
        }
        return instance;
    };

    /**
     * [_getClosestInstanceByElement 获取当前对象对应的填空题组件实例]
     * @param  {[DOM Element]} target   [当前交互对象]
     * @return {[FillBlankType]}    [当前交互对应的试题组件]
     */
    FillBlankType._getClosestInstanceByElement = function _getClosestInstanceByElement (target) {
        // 获取挂载元素
        var rootContainer = getClosestElement(target, Selector.FILL_BLANK_TYPE);
        var instance;
        if (rootContainer) {
            instance = FillBlankType._getInstance(rootContainer);
        }
        return instance;
    };


    /**
     * [_getBlankItemList 获取元素下所有填空组件]
     * @param  {[DOM Element]} element [ DOM 元素]
     */
    FillBlankType._getBlankItemList = function _getBlankItemList (element) {
        return element.querySelectorAll(Selector.FILL_BLANK_ITEM);
    };

    // 是否是单词拼写类型的空
    FillBlankType.isSpellBlankType = function isSpellBlankType (target) {
        var type = target.getAttribute(ATTRS.BLANK_TYPE);
        return type && type === 'spell';
    };

    // 获取单词拼写类型下的所有输入框
    FillBlankType.getAlphaInputList = function getAlphaInputList (target) {
        return target && target.querySelectorAll(Selector.BLANK_POPUP_TRIGGER);
    };

    // 将页面滚动到可视区域，避免被键盘遮挡
    FillBlankType.scrollInputIntoView = function scrollInputIntoView (input, show) {
        var APP_HEIGHT = window.innerHeight;
        var offsetTop = cumulativeOffset(input).top;
        var KEYPAD_HEIGHT = 300;
        // 查看题干加键盘高度是否会超出，导致滑动(数学键盘和系统键盘高度不一致，目前暂时定了300)
        var isOverflow = offsetTop + KEYPAD_HEIGHT > APP_HEIGHT;
        if (!isOverflow) { return; }
        var instance = FillBlankType._getClosestInstanceByElement(input);
        var element = instance._element;

        var container = getClosestElement(element, Selector.ROOT_QS_CONTAINER); //.querySelector(Selector.MAIN_CONTENT);
        var contentContainer = container.querySelector(Selector.MAIN_CONTENT);
        // 获取空白元素
        var blankEle = contentContainer.querySelector(("#" + KEYPAD_BLANK));
        // 创建一个空白的垫片
        if (!blankEle && show) {
            blankEle = document.createElement('div');
            blankEle.id = KEYPAD_BLANK;
            contentContainer.appendChild(blankEle);
            blankEle.style.height = KEYPAD_HEIGHT + "px";
        }
        // 滚动内容容器
        if (blankEle) {
            blankEle.style.display = show ? 'block' : 'none';
            var top = (show || offsetTop > APP_HEIGHT) ? Math.max(offsetTop - 50, 0) : 0;
            // const container = document.querySelector(Selector.ROOT_QS_CONTAINER);
            window.requestAnimationFrame(function () {
                contentContainer.scrollTop = top;
            });
            // setTimeout(function() {
            // if (contentContainer.scrollTop != top) {
            //     contentContainer.scrollTop = top
            // }
            // }, 100);
        }
    };

    /**
     * [isDisable 获取元素是否禁用交互]
     * @param  {[DOM Element]}  target [输入框]
     * @return {Boolean}           [是否禁用]
     */
    FillBlankType.isDisable = function isDisable (target) {
        return !TalqsInteraction.isInteractive || (target.disabled || (target.getAttribute && target.getAttribute('disabled')));
    };

    // -------------------------- 系统键盘逻辑处理 ----------------------------------------------------

    // 输入框焦点事件处理，滚动到可见区域
    FillBlankType._focusInputHandler = function _focusInputHandler () {
        FillBlankType.scrollInputIntoView(this, true);
    };

    // 输入框失去焦点处理
    FillBlankType._blurInputHandler = function _blurInputHandler (evt) {
        console.log(evt);
        FillBlankType.scrollInputIntoView(this, false);
        FillBlankType._dataApiInputHandler(evt);
    };

    // 填空输入事件处理
    /**
     * [_dataApiInputHandler 动态输入监听，判断是否是非直接输入]
     * 在 iOS 中，input 事件会截断非直接输入，什么是非直接输入呢，
     * 在我们输入汉字的时候，比如说「喜茶」，
     * 中间过程中会输入拼音，每次输入一个字母都会触发 input 事件，
     * 然而在没有点选候选字或者点击「选定」按钮前，都属于非直接输入。
     */
    FillBlankType._dataApiInputHandler = function _dataApiInputHandler (evt) {
        var instance = FillBlankType._getClosestInstanceByElement(evt.target);
        if (!instance.inputLock) {
            FillBlankType._updateInputData(evt.target);
            evt.returnValue = false;
        }
    };

    /**
     * [_compositionstartHandler description]
     * compositionstart 事件在用户开始进行非直接输入的时候触发，而在非直接输入结束，
     * 也即用户点选候选词或者点击「选定」按钮之后，会触发 compositionend 事件。
     */
    FillBlankType._compositionstartHandler = function _compositionstartHandler (evt) {
        var instance = FillBlankType._getClosestInstanceByElement(evt.target);
        instance.inputLock = true;
    };

    FillBlankType._compositionendHandler = function _compositionendHandler (evt) {
        var instance = FillBlankType._getClosestInstanceByElement(evt.target);
        instance.inputLock = false;
        // FillBlankType._updateInputData(evt.target);
    };

    // ----------------------------------------------------------------------------------------------


    // -------------------------- 数学键盘逻辑处理 ----------------------------------------------------

    // 创建一个数学输入框实例
    FillBlankType._initMathInput = function _initMathInput (item, value, needToSetFocus) {
        var blankIndex = item.getAttribute(ATTRS.FILL_BLANK_ITEM);
        var instance = FillBlankType._getClosestInstanceByElement(item);
        var typeIndex = 1;
        var theme = 'pale'; //预设主题
        // 避免在除了填空题中进行调用时报错
        if (InputAndKeyboard && !manager) {
            var keyPadContainer = TalqsInteraction.keyPadContainer || document.body;
            var scrollContainer = TalqsInteraction.scrollContainer || document.body;
            manager = new InputAndKeyboard.default(scrollContainer, keyPadContainer, {
                typeIndex: typeIndex,
                themeColor: theme,
                device: InputAndKeyboard.default.iphone
            });
        }
        if (!item.haveKeyBoard) {
            var inputbox = manager.createText({
                className: '',
                index: {
                    index: blankIndex,
                    queId: instance._queId
                },
                value: value
            }, item);
            // 重新渲染时，不需要得到焦点
            if (needToSetFocus) {
                manager.setTextFocus(inputbox);                  
            }
            item.haveKeyBoard = true;
            FillBlankType._keyboardToDisabled(item);
        }
    };

    FillBlankType._keyboardToDisabled = function _keyboardToDisabled (item) {
        if (item) {
          var inputBox = getClosestElement(item, Selector.MATH_INPUT_ITEM);
          inputBox && FillBlankType.isDisable(inputBox) && manager && manager.setTextEnabled && manager.setTextEnabled(inputBox, false);
        }
    };

    // 点击数学输入框事件监听
    FillBlankType._mathInputHandler = function _mathInputHandler (evt) {
        FillBlankType._keyboardToDisabled(this);
        var isDisable = FillBlankType.isDisable(this);
        if (isDisable) { return; }

        // 还未初始化，先创建一个实例
        if (!this.mathInput) {
            FillBlankType._initMathInput(this, '', true);
        }
    };

    // -----------------------------------------------------------------------------------------------

    // ------------------------- 选择型填空键盘交互逻辑处理 ----------------------------------------------
    // 获取单词拼写的当前作答空
    FillBlankType.prototype.getCurrentAlphaInputItem = function getCurrentAlphaInputItem (alphaInputList, type) {
        var alphaLen = alphaInputList.length;

        // 计算下一个输入的位置
        var emptyIndex = -1;
        for (var i = 0, len = alphaLen; i < len; i++) {
            if (!alphaInputList[i].value) {
                emptyIndex = i;
                break;
            }
        }

        // 所有的空都填了，
        // 删除就从最后一个开始删除
        // 添加就直接更新最后一个空的值
        var currentIndex;
        if (emptyIndex === -1) {
            currentIndex = alphaLen - 1;
        } else {
            if (type === 'delete') { // 删除
                emptyIndex -= 1;
                if (emptyIndex < 0) {
                    emptyIndex = 0;
                }
            }
            currentIndex = emptyIndex;
        }

        return alphaInputList[currentIndex];
    };

    /**
     * [updateAnswerSeleted 根据答案更新选择型填空选项列表的选中状态]
     * @param  {[Number]} blankIndex [空的索引]
     */
    FillBlankType.prototype.updateAnswerSeleted = function updateAnswerSeleted (blankIndex) {
        // 获取答案
        var blankResponse = this._blankData[blankIndex] || DEFAULT_VALUE;
        var optionList = this.currentList.querySelectorAll(Selector.BLANK_OPTION);
        var blankResponseList = blankResponse.split(DEFAULT_SEPARATOR);
        [].forEach.call(optionList, function (option) {
            var optionContent = option.getAttribute(ATTRS.BLANK_OPTION);
            var contain = blankResponseList.indexOf(optionContent) >= 0;
            toggleClass(option, STYLE.ACTIVE, contain);
        });
    };
    /**
     * [resetFocus 移除输入框高亮边框颜色]
     * @return {[type]} [description]
     */
    FillBlankType.prototype.resetFocus = function resetFocus () {
        resetListActive(this._blankInputList, STYLE.ACTIVE);
    };

    // 显示或者关闭弹层
    FillBlankType.prototype.togglePopup = function togglePopup (show) {
        if (this.focusTarget) {
            FillBlankType.scrollInputIntoView(this.focusTarget, show);
            if (!show) {
                this.resetFocus();
                this.focusTarget.blur();
                this.focusTarget = null;
                this.currentList = null;
            }
        }
        FillBlankType.toggleCustomKeyBoard(this.blankOptionKeypad, show);
    };
    // 切换自定义键盘的显示和隐藏
    FillBlankType.toggleCustomKeyBoard = function toggleCustomKeyBoard (element, show) {
        if (element) {
            element.style.transform = element.style.webkitTransform = "translate3d(0, " + (show ? '0': '100%') + ", 0)";
        }
    };

    // 点击有弹窗功能的输入框，显示弹窗
    FillBlankType._blankOptionPopupTrigger = function _blankOptionPopupTrigger (evt) {
        // 禁用交互则直接返回
        var isDisable = FillBlankType.isDisable(this);
        if (isDisable) { return; }

        var target = this;
        var instance = FillBlankType._getClosestInstanceByElement(target);
        if (!instance) { return; }
        instance.focusTarget = target;

        // 获取弹窗的类型
        var popupType = target.getAttribute(ATTRS.BLANK_POPUP_TYPE);

        // 初始化弹窗面板并且弹出
        if (!instance.popup) {
            instance.popup = instance._element.querySelector(Selector.BLANK_POPOVER);
            var blankOptionKeypad = document.querySelector(Selector.BLANK_OPTION_KEYPAD);
            if (!blankOptionKeypad) {
                blankOptionKeypad = document.createElement('div');
                blankOptionKeypad.className = 'blankOptionKeypad';
                var keyPadContainer = TalqsInteraction.keyPadContainer || document.body;
                keyPadContainer.appendChild(blankOptionKeypad);
            }
            instance.blankOptionKeypad = blankOptionKeypad;
            instance.optionList = instance.popup.querySelectorAll(("[" + (ATTRS.BLANK_OPTION_LIST) + "]"));
            window.addEventListener('touchstart', function (evt) {
                if (instance.focusTarget && instance.focusTarget !== evt.target && !instance.blankOptionKeypad.contains(evt.target)) {
                    if (instance.focusTarget && instance.focusTarget !== evt.target && !instance.focusTarget.contains(evt.target) && !instance.blankOptionKeypad.contains(evt.target)) {
                        instance.togglePopup(false, 'popup');
                    }
                }
            });
        }

        // 获取空号
        var focusIndex = target.getAttribute(ATTRS.BLANK_POPUP_INDEX);
        instance.currentList = null;
        // 显示当前空的选择选项列表
        [].forEach.call(instance.optionList, function (item) {
            var itemBlankIndex = item.getAttribute(("" + (ATTRS.BLANK_OPTION_LIST)));
            if (itemBlankIndex == focusIndex) {
                instance.blankOptionKeypad.innerHTML = '';
                instance.blankOptionKeypad.appendChild(item);
                instance.currentList = item;
            }
        });

        instance.resetFocus();
        instance.togglePopup(true);

        // 非拼写单词类型填空，需要根据答案高亮选项
        if (popupType !== 'alpha') {
            var blankIndex = parseInt(target.getAttribute(ATTRS.FILL_BLANK_ITEM), 10);
            instance.updateAnswerSeleted(blankIndex);
            instance.focusTarget.classList.add(STYLE.ACTIVE);
        }

    };

    // 点击单选型或者多选型填空选项事件处理
    FillBlankType._blankOptionClickHandler = function _blankOptionClickHandler (evt) {
        // 获取选项对应的试题ID
        var queId = this.getAttribute('data-id');
        // 根据试题ID去获取交互试题实例
        var realTarget = document.querySelector(("[" + (ATTRS.QUE_ID) + "=\"" + queId + "\"]"));
        var instance = FillBlankType._getClosestInstanceByElement(realTarget);
        if (!instance) { return; }
        var focusTarget = instance.focusTarget;
        if (!focusTarget) { return; }
        var type = this.getAttribute('type');
        var value = this.getAttribute(ATTRS.BLANK_OPTION);
        // 获取当前按钮对应的空
        var currntBlankIndex = focusTarget.getAttribute(ATTRS.BLANK_POPUP_INDEX);

        // 字母拼写类型
        var isAlphaSpellType = type === 'alpha' || type === 'delete';
        if (isAlphaSpellType) {
            // 字母作答空input列表
            var alphaInputList = instance._element.querySelectorAll(("[" + (ATTRS.BLANK_POPUP_INDEX) + "=\"" + currntBlankIndex + "\"]"));
            // 当前作答空
            var currentBlank = instance.getCurrentAlphaInputItem(alphaInputList, type);
            // 删除操作
            if (!value) { // 无干扰项单词拼写需要把选项显示出来
                if (currentBlank.getAttribute('data-ispure') == '1') {
                    var currentAlphaIndex = currentBlank.alphaIndex;
                    var wordSelector = currentAlphaIndex ? ("[data-index=\"" + currentAlphaIndex + "\"]") : ("[data-blank-option=\"" + (currentBlank.value) + "\"].hidden-alpha");
                    var btn = instance.currentList.querySelector(wordSelector);
                    btn && btn.classList.remove('hidden-alpha');
                    currentBlank.alphaIndex = '';
                }
            } else {
                var alphaIndex = this.getAttribute('data-index');
                if (alphaIndex) {
                    this.classList.add('hidden-alpha');
                    currentBlank.alphaIndex = alphaIndex;
                }
            }

            // 更新单词作答空的值
            currentBlank.value = value;
            // 拼接答案
            var currentAnswer = [].reduce.call(alphaInputList, function (total, item) {
                return total + (item.value || '');
            }, '');

            // 更新答案
            instance.updateBlankValueByIndex(currntBlankIndex, currentAnswer);
        } else {
            // 填空题类型（单选或者多选）
            var blankType = focusTarget && focusTarget.getAttribute(ATTRS.BLANK_TYPE);
            var isSingleChoiceType = blankType === 'single';
            // 填空题选项内容类型（svg或者为空）
            var dataType = focusTarget && focusTarget.getAttribute(ATTRS.BLANK_CONTENT_TYPE);
            var isSVGContentType = dataType === 'svg';

            var blankValue = '';
            // 单选型填空
            if (isSingleChoiceType) {
                blankValue = value;
                if (isSVGContentType) {
                    focusTarget.innerHTML = '';
                    focusTarget.appendChild(this.children[0].cloneNode(true));
                }
            } else { // 多选型填空
                var currentValue = instance._blankData[currntBlankIndex] || '';
                var currentList = currentValue ? currentValue.split(DEFAULT_SEPARATOR) : [];
                var currentIndex = currentList.indexOf(value);
                // 当前未添加，就添加，如果已在当前列表就移除
                if (currentIndex >= 0) {
                    currentList.splice(currentIndex, 1);
                    if (isSVGContentType) { // SVG 类型需要移除子元素
                        focusTarget.removeChild(focusTarget.children[currentIndex]);
                    }
                } else {
                    currentList.push(value);
                    if (isSVGContentType) { // SVG 类型需要显示渲染过后的LaTeX
                        focusTarget.appendChild(this.children[0].cloneNode(true));
                    }
                }
                blankValue = currentList.join(DEFAULT_SEPARATOR);
            }

            if (isSVGContentType) {
                FillBlankType._updateInputDataHandler(focusTarget, blankValue);
            } else {
                focusTarget.value = blankValue;
                FillBlankType._updateInputData(focusTarget);
            }
        }
    };

    FillBlankType.toggleInteractionForItem = function toggleInteractionForItem (inputItem, disabled) {
        // 更新DOM属性
        if (disabled) {
            // 数学输入框
            // manager&&manager.setAllTextEnabled(false)
            FillBlankType._keyboardToDisabled(inputItem);
            inputItem.setAttribute('disabled', true);
        } else {
            manager&&manager.setAllTextEnabled(true);
            inputItem.removeAttribute('disabled');
        }

        // 小低键盘需要收起
    };

    /**
     * 切换交互
     * 1 表示开启交互
     * 0 表示关闭交互
     */
    FillBlankType._toggleInteractionHandler = function _toggleInteractionHandler (evt) {
        var list = evt.data || [];
        list.forEach(function (item) {
            var element = getQuestionEleByQueId(Selector.FILL_BLANK_TYPE, item.queId);
            if (element) {
                var blankList = FillBlankType._getBlankItemList(element);
                [].forEach.call(blankList, function (subItem, index) {
                    var toDisableList = [subItem];
                    // 单词拼写特殊处理
                    if (FillBlankType.isSpellBlankType(subItem)) {
                        toDisableList = FillBlankType.getAlphaInputList(subItem);
                    }
                    // 是否关闭交互的标示
                    var disabled = item.rectifyState[index] === 0;
                    [].forEach.call(toDisableList, function (toDisableItem) {
                        FillBlankType.toggleInteractionForItem(toDisableItem, disabled);
                    });
                });
            }
        });
    };


    // ----------------------------------------------------------------------------------------------

    // -------------------------------数据回写--------------------------------------------------------
    /**
     * [_dataInitialHandler 从外部更新缓存数据监听处理]
     */
    FillBlankType._dataInitialHandler = function _dataInitialHandler () {
        // 获取所有带填空题组件标示的容器元素
        var blankTypeList = document.querySelectorAll(Selector.FILL_BLANK_TYPE);
        [].forEach.call(blankTypeList, function (item) {
            var queId = getQueId(item);
            // 缓存中对应该试题的作答数据
            var initialData = queId && talqsStorageData.cache[queId];
            if (initialData) {
                var instance = FillBlankType._getInstance(item);
                instance.fillDataIntoComponent(initialData);
            }
        });
    };
    FillBlankType._updateBlankValueByIndex = function _updateBlankValueByIndex (index, data, queId) {
        var element = document.querySelector(((Selector.FILL_BLANK_TYPE) + "[" + (ATTRS.QUE_ID) + "=\"" + queId + "\"]"));
        var instance = FillBlankType._getInstance(element);
        instance.updateBlankValueByIndex(index, data);
    };

    // 收起自定义键盘
    FillBlankType._hideKeyboard = function _hideKeyboard () {
        manager && manager.hideBoard();
        manager && manager.setAllTextBlur && manager.setAllTextBlur();
        // 收起自定义键盘
        var blankOptionKeypad = TalqsInteraction.keyPadContainer &&
        $(TalqsInteraction.keyPadContainer).find(Selector.BLANK_OPTION_KEYPAD) &&
         $(TalqsInteraction.keyPadContainer).find(Selector.BLANK_OPTION_KEYPAD)[0] ||
         $(document.body).find(Selector.BLANK_OPTION_KEYPAD) && 
            $(document.body).find(Selector.BLANK_OPTION_KEYPAD)[0];
        blankOptionKeypad && FillBlankType.toggleCustomKeyBoard(blankOptionKeypad, false);
    };
    // 重置键盘状态
    FillBlankType._resetKeyboardState = function _resetKeyboardState () {
        manager = undefined;
    };

    // ------------------- native 键盘 ------------------------------------------------------------------------------------------------
    // 得到焦点监听
    $(document).on(Event.FOCUS_DATA_API, ((Selector.FILL_BLANK_TYPE) + " " + (Selector.FILL_BLANK_ITEM)), FillBlankType._focusInputHandler);
    // 失去焦点处理
    $(document).on(Event.BLUR_DATA_API, ((Selector.FILL_BLANK_TYPE) + " " + (Selector.FILL_BLANK_ITEM)), FillBlankType._blurInputHandler);
    // 输入监听
    $(document).on(Event.INPUT_DATA_API, ((Selector.FILL_BLANK_TYPE) + " " + (Selector.FILL_BLANK_ITEM)), FillBlankType._dataApiInputHandler);
    // https://github.com/julytian/issues-blog/issues/15
    // compositionstart 事件在用户开始进行非直接输入的时候触发，而在非直接输入结束，也即用户点选候选词或者点击「选定」按钮之后，会触发 compositionend 事件。
    $(document).on(Event.COMPOSITION_START, ((Selector.FILL_BLANK_TYPE) + " " + (Selector.FILL_BLANK_ITEM)), FillBlankType._compositionstartHandler);
    $(document).on(Event.COMPOSITION_END, ((Selector.FILL_BLANK_TYPE) + " " + (Selector.FILL_BLANK_ITEM)), FillBlankType._compositionendHandler);

    // --------------------数学键盘------------------------------------------------------------------------------------------------------

    // 初始化数学键盘的监听
    $(document).on(Event.CLICK_API, ((Selector.FILL_BLANK_TYPE) + " " + (Selector.MATH_INPUT_ITEM)), FillBlankType._mathInputHandler);

    // -------------------弹层式 ------------------------------------------------------------------------------------------------

    // 弹层式填空点击事件
    $(document).on(Event.CLICK_API, ((Selector.FILL_BLANK_TYPE) + " " + (Selector.BLANK_POPUP_TRIGGER)), FillBlankType._blankOptionPopupTrigger);
    // 弹层选项点击事件
    $(document).on(Event.CLICK_API, ("" + (Selector.BLANK_OPTION)), FillBlankType._blankOptionClickHandler);

    // ------------------- 全局 ------------------------------------------------------------------------------------------------
    // 交互开关监听
    document.addEventListener(TALQS_EVENT.TOGGLE_INTEACTION, FillBlankType._toggleInteractionHandler);
    // 数据回写
    $(document).on(TALQS_EVENT.CHANGE, FillBlankType._dataInitialHandler);

    // 收起键盘
    $(document).on(TALQS_EVENT.HIDE_KEYBOARD, FillBlankType._hideKeyboard);
    // 重置键盘状态
    $(document).on(TALQS_EVENT.RESET_KEYBOARD_STATE, FillBlankType._resetKeyboardState);

    document.addEventListener('input_broadcast', function (evt) {
        console.log(evt);
        var data = JSON.parse(evt.value);
        FillBlankType._updateBlankValueByIndex(data.index.index, data.latex, data.index.queId);
    });
})(jQuery);

/**
 * 连词成句类型交互
 * 适用题型： 排序 data-logic-type='13'
 * 适用学科： 英语
 */
var DragSortTypeQuestion = (function ($) {

    var NAME = 'dragSort';
    var DATA_KEY = "talqs." + NAME;
    var EVENT_KEY = "." + DATA_KEY;

    var Events = {
        CLICK_DATA_API: ("click" + EVENT_KEY + DATA_API_KEY),
    };

    // 连词成句常用 DOM 选择符
    var Selector = {
        DRAG_SORT_TYPE: ("[" + (attr.type) + "=" + NAME + "]"), // 连词成句交互
        SORT_LINE_CONT: ("[" + (attr.sortLineContainer) + "]"), // 下划线容器（是否可以移除）
        SORT_LINE: ("[" + (attr.sortLine) + "]"), // 下划线
        SORT_WORD: ("[" + (attr.sortWord) + "]"), // 下划线上的单词

        SORT_OPTION_LIST: ("[" + (attr.optionList) + "]"), // 选项列表
        SORT_OPTION_ITEM: ("[" + (attr.sortItem) + "]"), // 选项（可点击，点击添加到下划线）
    };

    var ATTRS = {
        SORT_LINE: attr.sortLine, // 下划线属性
        SORT_WORD: attr.sortWord, // 下划线上单词
        SORT_OPTION_ITEM: attr.sortItem, // 
    };

    var ClassName = {
        SORT_LINE: style$1.sortLine,
        SORT_WORD: style$1.sortWord,
        HIDDEN: style$1.hidden,
    };

    var DragSortType = function DragSortType(queId, rootId, element, data) {
        this._queId = queId;
        this._rootId = rootId;
        this._element = element;
        this._sortData = data || []; // 排序的答案
        this._rows = 0; // 行数
        this._logicType = getLogicType(element);

        this._lineContainer = this._element.querySelector(Selector.SORT_LINE_CONT);
    };

    /**
     * [fillDataIntoComponent 将作答数据还原，添加到下划线上]
     * @param  {[Object]} userData [作答数据]
     */

    DragSortType.prototype.fillDataIntoComponent = function fillDataIntoComponent (userData) {
            var this$1 = this;

        var data = userData.data || [];
        this._result = userData.result || [];
        this._sortData = data;
        var sortLineList = DragSortType._getSortLineList(this._element);
        [].forEach.call(sortLineList, function (line) {
            line.innerHTML = '';
        });
        var len = data.length;
        if (len > 0) {
            for (var i = 0, value = (void 0), item = (void 0); i < len; i++) {
                value = data[i];
                if (value) {
                    var escapeVal = JSON.stringify(value);
                    var selector = "[" + (ATTRS.SORT_OPTION_ITEM) + "=" + escapeVal + "]";

                    // 根据答案去获取对应的选项容器
                    item = this$1._element.querySelector(selector);
                    if (!item) { continue; }
                    // 获取答案对应的选项内容
                    var word = this$1._getItem({
                        content: value
                    });
                    // 添加到下划线
                    sortLineList[this$1._rows].appendChild(word);
                    // 布局
                    this$1._layoutItem();
                    // 从列表中移除选项
                    item.classList.add(ClassName.HIDDEN);
                }
            }
            this._initEventForEle();
        } else {
            var optionList = this._element.querySelectorAll(("[" + (ATTRS.SORT_OPTION_ITEM)));
            [].forEach.call(optionList, function (item) {
                item.classList.remove(ClassName.HIDDEN);
            });
        }

        var result = this._result[0];
        toggleClass(this._lineContainer, STYLE.WRONG, result === 0);
        toggleClass(this._lineContainer, STYLE.RIGHT, result === 1);

    };

    /**
     * [_getItem 创建一个新的拖拽对象]
     */
    DragSortType.prototype._getItem = function _getItem (data) {
        var item = document.createElement('li');
        item.classList.add(ClassName.SORT_WORD);
        item.setAttribute(ATTRS.SORT_WORD, data.content);
        item.innerText = data.content;
        return item;
    };

    /**
     * [_layoutItem 对排序的单词进行布局，使之排列到对应的横线上]
     */
    DragSortType.prototype._layoutItem = function _layoutItem () {
            var this$1 = this;

        // 横线上的所有单词列表
        var wordList = this._element.querySelectorAll(Selector.SORT_WORD);
        // 横线列表
        var sortLineList = DragSortType._getSortLineList(this._element);
        // 下划线容器
        var lineContainer = this._lineContainer;
        // 下划线容器的宽度
        var containerWidth = lineContainer.offsetWidth;

        // --------------------------------------------------------------------------------
        var sortList = []; // 最新的排序数据

        var start = 0; // 起始坐标 
        var rows = 0; // 起始行数
        var itemWidth; // 单词选项宽度
        var rowsList = {};

        // 遍历所有单词，按期宽度对其进行布局
        [].forEach.call(wordList, function (item, index) {
            itemWidth = item.offsetWidth + 20;
            start += itemWidth;
            // 超出行的处理，行数累加，并将起始坐标置为当前按钮的宽度
            if (start >= containerWidth) {
                rows += 1;
                start = itemWidth;
            }
            if (!rowsList[rows]) {
                rowsList[rows] = [];
            }
            rowsList[rows].push(index);
            // 更新答案列表
            sortList.push(item.getAttribute(ATTRS.SORT_WORD));
        });
        // todo， 需要优化
        var loop = function ( row ) {
            // 判断下一行是否存在，默认只有两行，超出两行之后就需要先创建行再添加单词
            var line = sortLineList[row];
            if (!line) { // 添加一行
                line = document.createElement('ul');
                line.setAttribute(ATTRS.SORT_LINE, '');
                line.classList.add(ClassName.SORT_LINE);
                lineContainer.appendChild(line);
                this$1._initEventForEle();
            }
            line.innerHTML = '';
            var list = rowsList[row];
            if (list.length) {
                list.forEach(function (index) {
                    line.appendChild(wordList[index]);
                });
            }
        };

            for (var row in rowsList) loop( row );

        //----------------------------------------------------------------------------
        //
        // 更新最新的行数，记录已经添加到第几行
        this._rows = rows;

        // 更新答案数据
        this._sortData = sortList;
    };

    /**
     * [_notify 排序数据变动通知]
     */
    DragSortType.prototype._notify = function _notify () {
        var inputData = {
            queId: this._queId,
            rootId: this._rootId,
            data: this._sortData,
            type: this._logicType,
        };
        talqsStorageData.set(this._queId, inputData);
        // 派发事件
        dispatchUpdateEvent(inputData);
    };

    /**
     * [_initEventForEle 为下划线添加可排序的功能]
     */
    DragSortType.prototype._initEventForEle = function _initEventForEle (list) {
            var this$1 = this;

        var sortLineList = list ? list : DragSortType._getSortLineList(this._element);
        var group = "sort-" + (this._queId);
        var bounds = [10, window.innerWidth - 10, 10, window.innerHeight - 10];
        [].forEach.call(sortLineList, function (item) {
            if (!item.talqsSortableInstance) {
                item.talqsSortableInstance = Sortable.create(item, {
                    group: group,
                    top: 40,
                    bounds: bounds,
                    onSort: function () {
                        this$1._layoutItem();
                        this$1._notify();
                    }
                });
            }
        });
    };

    /**
     * [updateSortIndex 更新排序列表]
     */
    DragSortType.prototype.updateSortIndex = function updateSortIndex (data) {
        // 添加到对应行， this._rows 会记录下次添加时的起始行
        var sortLineList = DragSortType._getSortLineList(this._element);
        sortLineList[this._rows].appendChild(this._getItem(data));
        // 添加拖拽功能
        if (this._sortData.length === 0) {
            this._initEventForEle(sortLineList);
        }
        // 添加到数据列表
        this._sortData.push(data.content);
        // 进行布局
        this._layoutItem();
        // 通知数据变动
        this._notify();
    };

    /**
     * [_getInstance 获取一个组件实例，如果没有则初始化一个新的实例]
     * @param  {[type]}   element [挂载元素]
     * @return {[DragSortType]}   [组件实例]
     */

    DragSortType._getInstance = function _getInstance (element) {
        // 获取组件缓存
        var instance = $(element).data(DATA_KEY);
        if (!instance) {
            // 初始化组件并写入缓存
            var queId = getQueId(element);
            var rootId = getRootId(element);
            instance = new DragSortType(queId, rootId, element, []);
            $(element).data(DATA_KEY, instance);
        }
        return instance;
    };


    /**
     * [_getSortLineList 获取下划线列表]
     * @return {[type]} [description]
     */
    DragSortType._getSortLineList = function _getSortLineList (element) {
        return element.querySelectorAll(Selector.SORT_LINE);
    };


    /**
     * [_dataApiClickHandler 点击选项事件监听,添加单词到可排序的下划线中]
     */
    DragSortType._dataApiClickHandler = function _dataApiClickHandler () {
        if (!TalqsInteraction.isInteractive) { return; }
        var classList = [].slice.call(this.classList);
        if (classList.indexOf(STYLE.DISABLE) >= 0) { return; }
        // 获取连词成句试题容器
        var containerElement = getClosestElement(this, Selector.DRAG_SORT_TYPE);
        var instance = DragSortType._getInstance(containerElement);
        if (instance) {
            var data = {
                content: this.textContent
            };
            // 从选项列表中移除此项
            this.classList.add(ClassName.HIDDEN);
            instance.updateSortIndex(data);
        }
    };

    /**
     * [_dataInitialHandler 作答数据回写]
     */
    DragSortType._dataInitialHandler = function _dataInitialHandler () {
        // 获取所有连词成句的题型
        var dragSortTypeList = document.querySelectorAll(Selector.DRAG_SORT_TYPE);
        [].forEach.call(dragSortTypeList, function (element) {
            var queId = getQueId(element);
            // 缓存中对应该试题的作答数据
            var initialData = queId && talqsStorageData.cache[queId];
            if (initialData) {
                DragSortType._getInstance(element).fillDataIntoComponent(initialData);
            }
        });
    };

    /**
     * [_toggleInteractionHandler 切换交互开关监听]
     * 通过 evt.data 的值来启用或关闭交互
     * @param  {[Event]} evt [携带交互开关参数的事件]
     */
    DragSortType._toggleInteractionHandler = function _toggleInteractionHandler (evt) {
        var list = evt.data || [];
        list.forEach(function (item) {
            var element = getQuestionEleByQueId(Selector.DRAG_SORT_TYPE, item.queId);
            if (element) {
                var disable = item.rectifyState[0] === 0;
                var sortLineList = DragSortType._getSortLineList(element);
                // 开启或关闭线的拖拽功能
                [].forEach.call(sortLineList, function (sortableItem) {
                    if (sortableItem.talqsSortableInstance) {
                        sortableItem.talqsSortableInstance.option("disabled", disable);
                    }
                });

                // 禁用可点击的单词选项
                var optionList = element.querySelector(Selector.SORT_OPTION_LIST);
                [].forEach.call(optionList.children, function (subItem) {
                    subItem.classList.toggle(STYLE.DISABLE, disable);
                });
            }
        });
    };

    // -------------------------------------------------------------------
    // 连词成句单词选项点击事件监听
    $(document).on(Events.CLICK_DATA_API, ((Selector.DRAG_SORT_TYPE) + " " + (Selector.SORT_OPTION_ITEM)), DragSortType._dataApiClickHandler);
    // 作答数据回写事件监听
    $(document).on(TALQS_EVENT.CHANGE, DragSortType._dataInitialHandler);
    // 交互开关事件监听
    document.addEventListener(TALQS_EVENT.TOGGLE_INTEACTION, DragSortType._toggleInteractionHandler);
})(jQuery);

/**
 * 排序题交互
 * 适用题型： 排序 data-logic-type='7'
 * 适用学科： 英语
 */
var sortTypeCopy = null;

var SortTypeQuestion = (function ($) {

    var NAME = 'sort';
    var DATA_KEY = "talqs." + NAME;
    var EVENT_KEY = "." + DATA_KEY;

    var Selector = {
        SORT_TYPE: ("[" + (attr.type) + "=\"" + NAME + "\"]"),
        OPTION_ROOT: ("[" + (attr.optionList) + "]"),
    };

    var ATTRS = {
        OPTION_ITEM: attr.optionItem,
    };

    var SortType = function SortType(element) {
        // 试题元素挂载DOM
        this._element = element;
        // 获取试题ID
        this._queId = getQueId(element);
        // 获取最外层 ID
        this._rootId = getRootId(element);
        this._optionList = element.querySelector(Selector.OPTION_ROOT);
        this._logicType = getLogicType(element);
        // 初始化标记
        this._init = false;
        // 作答数据存储
        this._data = [];
    };

    var prototypeAccessors = { init: {} };

    prototypeAccessors.init.get = function () {
        return this._init;
    };

    SortType.prototype.reStore = function reStore (userData) {
        // 作答数据赋值
        this._data = userData.data || [];
        // 判题结果
        var resultList = userData.result || [];
        this._result = resultList;
        // 根据作答结果排序
        this.sortableInstance.sort(this._data);
        // 更新对错
        var list = this._optionList.children;
        [].forEach.call(list, function (item, index) {
            var element = list[index];
            var result = resultList[index];
            toggleClass(element, STYLE.WRONG, result === 0);
            toggleClass(element, STYLE.RIGHT, result === 1);
        });
    };

    // 更新排序
    SortType.prototype.updateSort = function updateSort (data) {
        this._data = data;
        var inputData = {
            queId: this._queId,
            rootId: this._rootId,
            data: this._data,
            type: this._logicType,
        };
        talqsStorageData.set(this._queId, inputData);
        // 派发事件
        dispatchUpdateEvent(inputData);
    };

    /**
     * [initHandler 初始化监听，创建sortable实例]
     */
    SortType.prototype.initHandler = function initHandler () {
        var instance = this;
        instance._init = true;
        var group = "sort-" + (instance._queId);
        var bounds = [10, window.innerWidth - 10, 10, window.innerHeight - 10];
        var sortable = Sortable.create(instance._optionList, {
            group: group,
            top: 40,
            bounds: bounds,
            dataIdAttr: ATTRS.OPTION_ITEM,
            onSort: function () {
                instance.updateSort(sortable.toArray());
            }
        });
        instance.sortableInstance = sortable;
    };

    // -----------------------------------------------------------------------------------------


    /**
     * [getSortTypeList 获取所有排序交互类型]
     */
    SortType.getSortTypeList = function getSortTypeList () {
        return document.querySelectorAll(Selector.SORT_TYPE);
    };

    /**
     * [getInstanceByElement 根据DOM获取实例对象]
     * @param  {[DOM Element]} target [DOM对象]
     * @return {[DragClozeType]}      [组件实例]
     */
    SortType.getInstanceByElement = function getInstanceByElement (element) {
        // 获取组件缓存
        var instance = $(element).data(DATA_KEY);
        if (!instance) {
            // 初始化组件并写入缓存
            instance = new SortType(element);
            $(element).data(DATA_KEY, instance);
        }
        return instance;
    };


    /**
     * [_instanceInitHandler 初始化]
     */
    SortType._instanceInitHandler = function _instanceInitHandler () {
        var sortTypeList = SortType.getSortTypeList();
        [].forEach.call(sortTypeList, function (element) {
            var instance = SortType.getInstanceByElement(element);
            if (instance && !instance.init) {
                instance.initHandler();
            }
        });
    };

    /**
     * [_dataInitialHandler 数据回写监听处理]
     */
    SortType._dataInitialHandler = function _dataInitialHandler () {
        var sortTypeList = SortType.getSortTypeList();
        [].forEach.call(sortTypeList, function (item) {
            var queId = getQueId(item);
            // 缓存中对应该试题的数据
            var initialData = queId && talqsStorageData.cache[queId];
            if (initialData) {
                SortType.getInstanceByElement(item).reStore(initialData);
            }
        });
    };


    /**
     * [_toggleInteractionHandler 切换交互开关监听]
     * 通过 evt.data 的值来启用或关闭交互
     * @param  {[Event]} evt [携带交互开关参数的事件]
     */
    SortType._toggleInteractionHandler = function _toggleInteractionHandler (evt) {
        var list = evt.data || [];
        list.forEach(function (item) {
            var element = getQuestionEleByQueId(Selector.SORT_TYPE, item.queId);
            if (element) {
                var disable = item.rectifyState[0] === 0;
                var instance = SortType.getInstanceByElement(element);
                if (instance && instance.sortableInstance) {
                    instance.sortableInstance.option("disabled", disable);
                }
            }
        });
    };

    Object.defineProperties( SortType.prototype, prototypeAccessors );
    sortTypeCopy = SortType;
    
    // 数据回写监听
    $(document).on(TALQS_EVENT.CHANGE, SortType._dataInitialHandler);
    MutationObserverEventListener(sortTypeCopy._instanceInitHandler);
    sortTypeCopy._instanceInitHandler();
    // 交互开关监听
    document.addEventListener(TALQS_EVENT.TOGGLE_INTEACTION, SortType._toggleInteractionHandler);
})(jQuery);

window.initSortType = function() {
// 使用 MutationObserver 检测 DOM 变化，从而判断是否有需要进行拖拽类型的监听
    sortTypeCopy._instanceInitHandler();
    MutationObserverEventListener(sortTypeCopy._instanceInitHandler);
};

// 判断逻辑类型的相关逻辑
var logicType$1 = 'data.logicQuesTypeId';



var isDragCloze = logicType$1 + " == 3";

var isBlank = logicType$1 + " == 4";

var isTrueOrFalse = logicType$1 + " == 5";

var isMatch = logicType$1 + " == 6";

var isSort = logicType$1 + " == 7";

var isScanImg = logicType$1 + " == 8";







var isSentences = logicType$1 + " == 13";

/**
 * 试题题干容器组件 
 */

// // 样式配置
var styleConfig = {
    '2': 'talqs_multiple',
    '3': 'talqs_multi_match',
    '5': 'talqs_main_tf', // 判断题
    '6': 'talqs_match',
    '7': 'talqs_sort',
    '9': 'talqs_complex',
    '13': 'talqs_word_sentence'
};


// 交互类型配置
var typeConfig = {
    '1': 'choice', //   单选题：点选
    '2': 'choice', //   多选题：点选
    '3': 'choice', // 多选多
    '4': 'fillblank', //   普通填空：键盘输入
    '5': 'choice', //   判断题
    '6': 'choice', //   判断题
    '7': 'sort',
    '8': 'capture',
    '9': 'complex',
    '10': 'choice', //   完型填空： 点选
    '11': 'capture',
    '12': 'capture',
    '13': 'dragSort'

};

var getConfig = function (config) {
    return JSON.stringify(config);
};

var main$2 = 'stemsWrapper';

var question$1 = ("\n<div  class=\"" + (style$1.stems) + " " + (style$1.clear) + " {{ index == 1 ? 'current' : ''}} {{" + (getConfig(styleConfig)) + "[" + logicType$1 + "]}}\"  \n      data-talqs-type=\"{{" + (getConfig(typeConfig)) + "[" + logicType$1 + "]}}\" \n      data-addition = \"{{dataAddition(data.subjectId, " + logicType$1 + ", data.answerOptionList)}}\"\n      data-que-id=\"{{data.queId}}\" \n      data-index=\"{{index-1}}\"\n      data-all-objective = \"{{ (data.childList && isAllObjective(data.childList)) ? '1' : 0}}\"\n      data-logic-type=\"{{" + logicType$1 + "}}\">\n   {{each config.templates['" + main$2 + "']}}\n      {{include $value}}\n   {{/each}}\n</div>\n");

/**
 * 复合题
 */
var ComplexTypeQuestion = (function ($) {
    var NAME = 'complex';
    var DATA_KEY = "talqs." + NAME;
    var EVENT_KEY = "." + DATA_KEY;

    var Events = {
        CLICK: ("click" + EVENT_KEY + DATA_API_KEY),
    };

    var ATTRS = {
        TARGET_INDEX: attr.targetIndex,
        LOGIC_TYPE: attr.logicType,
        DATA_INDEX: attr.dataIndex,
        QUE_ID: attr.queId,
        DRAG_MAIN: attr.dragMain,
        QUESTION_INDEX_MAIN: attr.questionIndexMain
    };

    var Selector = {
        COMPLEX_TYPE: ("[" + (attr.type) + "=\"" + NAME + "\"]"), // 选择类型交互
        TARGET_INDEX: ("[" + (attr.targetIndex) + "]"),
        QUESTION: ("[" + (attr.type) + "]"),
        DATA_INDEX: ("[" + (attr.dataIndex) + "]") // 复合题子题索引
    };

    var ComplexType = function ComplexType(element) {
        this._childQuestionList = element.querySelectorAll(Selector.QUESTION);
        this._childIndexList = element.querySelectorAll(Selector.TARGET_INDEX);
    };

    ComplexType._getInstance = function _getInstance (element) {
        // 获取组件缓存
        var instance = $(element).data(DATA_KEY);
        if (!instance) {
            instance = new ComplexType(element);
            $(element).data(DATA_KEY, instance);
        }
        return instance;
    };

    ComplexType.prototype.toggleCurrent = function toggleCurrent (list, currentIndex) {
        [].forEach.call(list, function (item, index) {
            toggleClass(item, 'current', index == currentIndex);
        });
    };

    // 切换试题
    ComplexType._changeQuestion = function _changeQuestion () {
        var childIndex = this.getAttribute(ATTRS.TARGET_INDEX);
        // 获取试题 DOM 容器
        var containerElement = getClosestElement(this, Selector.COMPLEX_TYPE);
        // 创建实例
        var instance = ComplexType._getInstance(containerElement);
        instance.toggleCurrent(instance._childIndexList, childIndex);
        instance.toggleCurrent(instance._childQuestionList, childIndex);
    };
    // 判断是否已经把本题做完
    ComplexType._isAllAnswer = function _isAllAnswer (indexList, childQuestionData) {
        var question = talqsStorageData.cache[childQuestionData.queId];
        var isAllAnswer = question.data && question.data.length > 0 ? true : false;
        question.data && Array.isArray(question.data) && question.data.map( function (data) {
            if (!data) {
                isAllAnswer = false;
            }
        });
        // 做过了本题
        if (isAllAnswer) {
            toggleClass(indexList[childQuestionData.index], style$1.answered, true);
            toggleClass(indexList[childQuestionData.index], style$1.failAnswer, false);                                                     
        } else {
            toggleClass(indexList[childQuestionData.index], style$1.failAnswer, true);
            toggleClass(indexList[childQuestionData.index], style$1.answered, false);
        }
    };
    // 判断是否全部做对
    ComplexType._isAllTure = function _isAllTure (indexList, childQuestionData) {
        var question = talqsStorageData.cache[childQuestionData.queId];
        if (question.result && question.result.length > 0) {
            var isAllTure =  true;
            question.result && Array.isArray(question.result) && question.result.map( function (data) {
                if (data === 0) {
                    isAllTure = false;
                }
                if (data === -2 && isAllTure !== false) {
                    isAllTure = -1;
                }
            });
            // 做dui了本题
            if (isAllTure === true) {
                toggleClass(indexList[childQuestionData.index], style$1.right, true);
                toggleClass(indexList[childQuestionData.index], style$1.wrong, false);                                                     
            } else if (isAllTure === false) {
                toggleClass(indexList[childQuestionData.index], style$1.wrong, true);
                toggleClass(indexList[childQuestionData.index], style$1.right, false);
            }
        } else {
            toggleClass(indexList[childQuestionData.index], style$1.wrong, false);
            toggleClass(indexList[childQuestionData.index], style$1.right, false);
        }
            
    };
    // 刷新页面样式
    ComplexType._updateStyleState = function _updateStyleState (childQuestion, complexQueId, elementParent) {
        // 复合题下面的选题控件 防止捕获到子题中的切换试题按钮
        var dragMain = $(elementParent).children(("." + (ATTRS.DRAG_MAIN)))[0];
        if (!dragMain) { return }
        var questionIndexMain = $(dragMain).children(("." + (ATTRS.QUESTION_INDEX_MAIN)))[0];
        if (!questionIndexMain) { return }
        var indexList = $(questionIndexMain).find(("[" + (ATTRS.TARGET_INDEX) + "]"));
        [].forEach.call(childQuestion, function (childQuestionData) {
            if (talqsStorageData.cache[childQuestionData.queId]) {
                ComplexType._isAllAnswer(indexList, childQuestionData);
                ComplexType._isAllTure(indexList, childQuestionData);
            } else {
                toggleClass(indexList[childQuestionData.index], style$1.failAnswer, true);
                toggleClass(indexList[childQuestionData.index], style$1.answered, false);
            }
        });
    };
    // 初始化复合题数据
    ComplexType._dataInitialHandler = function _dataInitialHandler (event) {
        var queId = event.detail;
        // 判断是否是复合题型
        var element = document.querySelector(("[" + (ATTRS.QUE_ID) + "=\"" + queId + "\"]"));
        // 复合题顶级dom
        var elementParent = element && $(element).closest(("[" + (ATTRS.LOGIC_TYPE) + "=\"9\"]"))[0];
        console.log('是否是复合题', !!elementParent);
        if (!!!elementParent) {
            return
        }
        // 复合题下面的小题
        var childList = $(elementParent).find(("[" + (ATTRS.LOGIC_TYPE) + "]"));
        if (!childList[0]) {
            return
        }            
        // 子题数据
        var childQuestion = [];
        [].forEach.call(childList ,function (item){
            childQuestion.push({
                queId: item.getAttribute(ATTRS.QUE_ID),
                index: parseInt(item.getAttribute(ATTRS.DATA_INDEX), 10)
            });
        });
        // 刷新页面样式
        ComplexType._updateStyleState(childQuestion, queId, elementParent);
    };

    // 题号点击事件监听
    $(document).on(Events.CLICK, ((Selector.COMPLEX_TYPE) + " " + (Selector.TARGET_INDEX)), ComplexType._changeQuestion);
    $(document).on(TALQS_EVENT.COMPLEX_CHANGE, ComplexType._dataInitialHandler);
    $(document).on(TALQS_EVENT.CHANGE, ComplexType._dataInitialHandler);    
    
})(jQuery);

/**
 * 排序题交互
 * 适用题型： 排序 data-logic-type='7'
 * 适用学科： 英语
 */
var ResponseTypeQuestion = (function ($) {

    var NAME = 'box';
    var DATA_KEY = "talqs." + NAME;
    var EVENT_KEY = "." + DATA_KEY;

    var Events = {
        CLICK_DATA_API: ("click" + EVENT_KEY),
    };
    var Selector = {
        CAMERA: ("[" + (attr.camera) + "]")
    };

    var ATTRS = {
        OPTION_ITEM: attr.optionItem,
    };

    var ResponseType = function ResponseType(element) {
        // 试题元素挂载DOM
        this._element = element;
        // 获取试题ID
        this._queId = getQueId(element);
        // 获取最外层 ID
        this._rootId = getRootId(element);
        this._optionList = element.querySelector(Selector.OPTION_ROOT);
        this._logicType = getLogicType(element);
        // 初始化标记
        this._init = false;
        // 作答数据存储
        this._data = [];
    };

    var prototypeAccessors = { init: {} };

    prototypeAccessors.init.get = function () {
        return this._init;
    };


    ResponseType._camera = function _camera () {
        console.log(222);
    };

    Object.defineProperties( ResponseType.prototype, prototypeAccessors );

    $(document).on(Events.CLICK_DATA_API, ("" + (Selector.CAMERA)), ResponseType._camera);

})(jQuery);

var getLine = function (num) {
  var ouput = '';
  for (var i = 0; i < num; i++) {
    ouput += '<span class="drag-button-line"></span>';
  }
  return ouput;
};

/**
 * 交互版试题选项组件
 */

// 选项数据字段
var optionsList = 'data.answerOptionList';
// 是否是完型填空
var isCloze = 'data.isCloze';
// 是否有选项解析
var hasChildAnalyze = "" + isDragCloze;

// 生成取值对象模板
var getValue = function(key, num) {
    return ("{{#$value" + (num == void 0 ? '': '['+num+']') + "['" + key + "']}}")
};

// 获取判断题选项
var getTrueTypeItem = function(value) {
    return ("<button " + (attr.optionItem) + "=\"" + value + "\">{{#getTFText(data.subjectId, '" + value + "')}}</button>")
};

// 选项组件模板
var getOptionItem = function(num) {
    var aoVal = getValue('aoVal', num);
    var content = getValue('content', num);
    return ("\n      <li class=\"" + (style$1.optionsItem) + " " + (style$1.clear) + "\"\n          {{if !(" + isTrueOrFalse + ") && " + num + " !== 0 }}\n              " + (attr.optionItem) + "=\"" + aoVal + "\"\n          {{/if}}\n\n          {{if " + num + " === 0 }}\n              " + (attr.matchItem) + "=\"" + aoVal + "\"\n          {{/if}}>\n\n          <span class=\"" + (style$1.optionsLabel) + "\" >" + aoVal + "</span>\n          <div class=\"" + (style$1.optionsContent) + "\" " + (attr.optionContent) + ">" + content + "</div>\n\n          {{if " + isTrueOrFalse + " }}\n            <!--判断题-->\n            <div class=\"" + (style$1.tfText) + "\">\n              " + (getTrueTypeItem('T')) + "\n              " + (getTrueTypeItem('F')) + "\n            </div>\n          {{/if}}\n\n          {{if " + num + " === 0 }}\n            <!--排序题第一列-->\n            <div class=\"matchfill\"></div>\n          {{/if}}\n      </li>\n    ")
};

// todo 多选多模板重写
// 排序题模板特殊。插件bug导致

// 选项列表模板
var getList = function(num) {
    return ("\n      <ul class=\"" + (style$1.optionsList) + "\" " + (num !== 0 ? attr.optionList : '') + ">\n        {{each " + optionsList + " }}\n          {{if " + isSort + " }}\n              {{each $value}}\n                " + (getOptionItem()) + "\n              {{/each}}\n          {{else}}\n            <li class=\"" + (style$1.optionsRows) + " " + (style$1.clear) + " {{$index == 0 ? 'current' : ''}}\" >\n              <ul class=\"" + (style$1.optionsColumns) + "_1 " + (style$1.clear) + "\" \n                  " + (attr.optionGroup) + "=\"{{$index}}\"\n                  " + (attr.optionAnalyze) + "=\"{{" + isCloze + " || " + isTrueOrFalse + " || (" + isMatch + " && " + (num == 0) + ") ? 1 : 0}}\">\n                  {{if " + isMatch + " }}\n                      " + (getOptionItem(num||0)) + "\n                  {{else}}\n                    {{each $value}}\n                      " + (getOptionItem()) + "\n                    {{/each}}\n                  {{/if}}\n              </ul>\n            </li>\n          {{/if}}\n        {{/each}}\n      </ul>\n    ");
};

var getDragList = function(num) {
    return ("\n      <div class=\"drag-main\">\n        <button class=\"drag-button\">" + (getLine(3)) + "</button>\n        {{#getBlankIndex(" + isMatch + " ? " + optionsList + " : data.content)}}\n        <div class=\"" + (style$1.optionWrapper) + " {{" + isCloze + " ? 'cloze_wrapper' : ''}}\">\n          <div class=\"" + (style$1.options) + " " + (style$1.clear) + "\">\n            " + (getList(num)) + "\n            <div class=\"" + (style$1.analyzeContainer) + "\"></div>\n          </div>\n        </div>\n      </div>")
};


var getOptionWrapper = function(num) {
    return ("\n    <div class=\"" + (style$1.optionWrapper) + "\">\n          <div class=\"" + (style$1.options) + " " + (style$1.clear) + "\">\n            " + (getList(num)) + "\n           {{if " + hasChildAnalyze + " }}\n             <div class=\"" + (style$1.analyzeContainer) + "\"></div>\n           {{/if}}\n          </div>\n      </div>\n  ")
};

var questionOptions$1 = ("\n{{ if " + optionsList + " }}\n    {{if " + isDragCloze + " || (" + isCloze + ")}}\n        " + (getDragList()) + "\n    {{else if " + isMatch + " }}\n        " + (getDragList(1)) + "\n    {{else}}\n        " + (getOptionWrapper()) + "\n    {{/if}}\n{{/if}}");

/**
 * 连词成句下划线组件（排序题专用）
 */
var defaultLineNum = 2;

var separator = '"   "';

var itemTemplate = "'<button class=\"" + (style$1.optionsContent) + "\" " + (attr.sortItem) + "=\"$[value]\">$[value]</button>'";

var line = " <ul class=\"" + (style$1.sortLine) + "\" " + (attr.sortLine) + "></ul> ";

var getLineByNum = function(num) {
  num = parseInt(num, 10) || 0;
  var result = '';
  for (var i = 0; i < num; i++) {
    result += line;
  }
  return result;
};

var questionLineCont = ("\n  <div>{{data.queDesc}}</div>\n  <div class=\"" + (style$1.sortLineContainer) + "\" " + (attr.sortLineContainer) + ">\n    " + (getLineByNum(defaultLineNum)) + "\n  </div>\n  <div " + (attr.optionList) + ">\n    {{#data.content | transContentToList:" + separator + " | renderList:" + itemTemplate + "}}\n  </div>\n");

/**
 * 交互版试题题干组件
 * 根据逻辑类型区分不同的交互方式
 * logicQuesTypeId:  3    多选多     拖拽选词(dragCloze)
 * logicQuesTypeId:  4    填空题     输入框(blank)
 * logicQuesTypeId: 10    完型填空   下拉选择(dropdown)
 */

var questionContent$1 = ("\n  {{if data.content && !data.hideContent}}\n\n    {{ if getNotice(" + logicType$1 + ")}}\n      <div class=\"talqs_notice\">{{getNotice(" + logicType$1 + ")}}</div>\n    {{/if}}\n\n    {{if " + isSentences + " }}\n        " + questionLineCont + "\n    {{else}}\n        <div class=\"" + (style$1.content) + " " + (style$1.clear) + "\">\n        {{#data.content | transfromBlankContent:data | wrapperTable }}\n        {{if " + isMatch + "}}\n            " + (getOptionWrapper(0)) + "\n        {{/if}}\n    </div>\n    {{/if}}\n    \n  {{/if}}\n");

/**
 * 复合题子题模板，递归显示子题
 * 
 * data:    子题数据
 * config:  插件配置
 * index:   子题题号
 * isSub:   子题标记
 */

// 子题数据
var childData$1 = '{data:$value,config:config,index:$index+1,isSub:true}';

var childTemplate = "\n  <div class=\"" + (style$1.subqs) + "\">\n    {{each data.childList}}\n      {{include 'stemsWrapper' " + childData$1 + " ''}}\n    {{/each}}\n  </div>\n";

var questionChildList$1 = ("\n{{ if data.childList }}\n  {{ if isAllObjective(data.childList) && !isSub}}\n      <div class=\"drag-main\">\n        <button class=\"drag-button\">\n          " + (getLine(3)) + "\n        </button>\n        {{#getIndexTemplate(data.childList)}}\n        " + childTemplate + "\n      </div>\n  {{else}}\n      " + childTemplate + "\n  {{/if}}\n{{/if}}\n");

/**
 * 图片作答
 */

var questionImgAnswer = ("\n  <div class=\"" + (style$1.panel) + " " + (style$1.imgsContainer) + "\">\n    {{if data.stuImage}}\n      <p>我的作答</p>\n      {{each data.stuImage}}\n        <image src=\"{{$value.url}}\">\n      {{/each}}\n    {{/if}}\n  </div>\n");

/**
 * 批改
 */
var questionCorrect = ("\n  <div class=\"" + (style$1.panel) + " " + (style$1.correctContainer) + "\">\n  </div>\n");

/**
 * 交互版试题题干组件
 * todo 模板待优化
 */

var hasBlankAnswer = "data.blankInteraction && data.blankInteraction.length";

var getDeleteBtn = function () {
  return (" <span class=\"word-delete\" \n            " + (attr.blankOption) + "=\"\" \n            type=\"delete\" \n            data-id=\"{{data.queId}}\">\n          <span>删除</span>");
};


var getWordBtn = function (needIndex) {
  return ("<span class=\"word-btn\" \n              " + (attr.blankOption) + "=\"{{$value}}\" \n              type=\"alpha\" \n              " + (needIndex ? 'data-index="{{$index}}"' : '') + "\n              data-id=\"{{data.queId}}\">\n              <span>{{$value}}</span>\n          </span>");
};

var getAlphaList = function (needIndex, num, autoFix) {
  return ("\n    <div class=\"blank-option-list\" " + (attr.blankOptionList) + "=\"{{$index}}\">\n      <div class=\"word-keyboard-container\">\n        <div class=\"word-spell-list {{$value.blankLength > 8 ? 'overflow' : ''}}\">\n          {{each $value.content}}\n            {{if $index % " + num + " == 0 }}\n              <div>\n            {{/if}}\n            " + (getWordBtn(needIndex)) + "\n            {{if ($index + 1) % " + num + " == 0 }}\n                {{ if $index < " + num + " }}\n                  " + (getDeleteBtn()) + "\n                {{/if}}\n              </div>\n            {{/if}}\n          {{/each}}\n\n          {{if " + autoFix + " && $value.blankLength < " + num + " }}\n            " + (getDeleteBtn()) + "\n            </div>\n          {{/if}}\n        </div>\n      </div>\n    </div>");
};

var questionBlankOption = ("\n  {{if " + isBlank + " && " + hasBlankAnswer + " }}\n    <div class=\"blank-popover\">\n      {{each data.blankInteraction}}\n        {{if isChoiceType($value) }}\n          <div class=\"blank-option-list\" " + (attr.blankOptionList) + "=\"{{$index}}\">\n            <div class=\"blank-choice\">\n              {{#getBlankOptionTemplate($value, data.queId) }}\n            </div>\n          </div>\n        {{/if}}\n\n        {{if isWordSpelling($value) }}\n          " + (getAlphaList(false, 5)) + "\n        {{/if}}\n\n        {{if isPureWordSpellingType($value) }}\n          " + (getAlphaList(true, 5, true)) + "\n        {{/if}}\n      {{/each}}\n    </div>\n  {{/if}}\n");

/**
 * 图片作答
 */

var questionResponse = ("\n  {{if " + isScanImg + " && !isSub && !config.hideCamera }}\n    <div class=\"" + (style$1.panel) + " " + (style$1.imgsContainer) + "\">\n      <div class=\"box\">\n          <input type=\"file\" accept=\"image/*\" capture id=\"camera{{data.queId}}\">\n          <label " + (attr.cameraButton) + "\" for=\"camera{{data.queId}}\">\n              拍照上传\n          </label>\n      </div>\n    </div>\n  {{/if}}\n");

/**
 * 交互版模板定义
 * questionContent  试题题干
 * questionOptions  试题选项
 */
var templates = {
  questionContent: questionContent$1,
  questionOptions: questionOptions$1,
  questionChildList: questionChildList$1,
  questionImgAnswer: questionImgAnswer,
  questionCorrect: questionCorrect,
  questionBlankOption: questionBlankOption,
  questionResponse: questionResponse,
  question: question$1,

};

/**
 * [dataAddition 根据学科配置多选多的交互类型]
 * @param  {[String, Number]} subjectId        [学科id]
 * @param  {[String, Number]} logicQuesTypeId  [试题逻辑类型id]
 * @param  {[Array]}          answerOptionList [试题选项列表]
 * @return {[String]}                 [配置信息]
 * 英语多选多交互方式为从选项列表拖拽选项句子填充到下划线，不互斥
 * 非英语学科多选多交互方式为复制选项字母（A, B, C...）填充到下划线，不互斥
 */

var isContainImage = function(content) {
    if ( content === void 0 ) content = '';

    return IMG_REGEX.test(content);
};

var checkContainImageForOptionItem = function(item) {
    if (Array.isArray(item)) {
        return item.some(function(option) {
            return isContainImage(option.content);
        });
    } else {
        return isContainImage(item.content);
    }
    return false;
};

var isEnglishSubject = function(subjectId) {
    return subjectId == 3
};


var dataAddition = function(subjectId, logicQuesTypeId, answerOptionList) {
    var output;
    if (logicQuesTypeId == 3) { // 多选多
        // 多选多查看选项中是否包含图片，如果包含图片就只允许拖拽选项字母到填充的下划线
        var containImage = answerOptionList && answerOptionList.some(checkContainImageForOptionItem);
        output = (isEnglishSubject(subjectId) && !containImage) ? 'copy content' : 'copy option';
    } else if (logicQuesTypeId == 6 || logicQuesTypeId == 10) {
        output = 'copy content';
    }
    return output;
};

/**
 * [isWordSpelling 判断是否是单词拼写]
 * @param  {[Object]}  blank  [空的数据]
 * @return {Boolean}          [返回单词拼写状态值]
 */
var isWordSpelling = function(blank) {
    return blank && blank.typeId === '1' && blank.childTypeId === '10006';
};

/**
 * [isChoiceType 是否是选择型填空]
 * @param  {[Object]}  blank [空的数据]
 * @return {Boolean}         [是否是选择型填空题标示]
 */
var isChoiceType = function(blank) {
    return blank && (blank.typeId === '4' || blank.typeId === '5');
};

/**
 * [getBlankType 获取填空类型]
 * @param  {[Object]} blank [作答空数据]
 * @return {[String]}       [作答空类型]
 */
var getBlankType = function(blank) {
    var type = blank && blank.typeId === '5' ? 'multi' : 'single';
    return ("data-blank-type=\"" + type + "\"");
};

/**
 * [isSimpleNumberType 是不是简单类型填空题]
 * @param  {[Object]}  blank  [空的数据]
 * @return {Boolean}          [返回简单类型填空题状态值]
 */



var isPureWordSpellingType = function(blank) {
    return blank && blank.typeId === '1' && blank.childTypeId === '10032';
};

var TextInput = "<talqs-blank type=\"text\" autocomplete=\"off\"  autocapitalize=\"none\">";

var NumberInput = '<talqs-blank type="number">';

/**
 * [getAlphaSpellTemplate 获取字母拼写输入框模板]
 * @param  {[Number]} blankIndex [当前空号]
 * @param  {[Number]} blankLen   [单词数量]
 * @param  {[Boolean]} pure      [是否有干扰项]
 * @return {[String]}            [模板字符串]
 */
var getAlphaSpellTemplate = function(blankIndex, blankLen, pure) {
    var template = '';
    for (var i = 0; i < blankLen; i++) {
        template += "<input class=\"" + (style$1.input) + "\" \n                            " + (attr.blankPopupTrigger) + "=\"" + blankIndex + "\" \n                            data-popup-type=\"alpha\" \n                            data-ispure=\"" + pure + "\" \n                            data-alpha-sort=\"" + i + "\" \n                            readonly>";
    }
    return ("<span class=\"word-spell-container\" \n                  data-blank-type=\"spell\" \n                  " + (attr.blankItem) + "=\"" + blankIndex + "\" >\n                " + template + "\n            </span>")
};

// 把 nbsp 转换为input
var transToInput = function(content, isMath, readonly, blankInteraction) {
    // 普通填空作答空替换
    content = content.replace(BLANK_REGEX, TextInput);
    // 竖式作答空替换
    content = content.replace(VERTICAL_MATH_REGEX, ("$1" + NumberInput + "$2"));

    var index = -1;
    content = content.replace(TALQS_INPUT_REGEX, function(match, customAttr) {
        index++;
        var popup = '';
        var isSpell = false;

        var template = '';
        //
        var item = blankInteraction && blankInteraction[index];
        // 选择型填空标示
        var isChoiceTypeBlank = false;

        // 空号
        var blankIndex = (attr.blankItem) + "=\"" + index + "\"";

        var isPureSpell = false;

        // 新版本
        if (item) {
            // 是否是单词拼写空
            isSpell = isWordSpelling(item);

            isChoiceTypeBlank = isChoiceType(item);
            // 单词拼写（无干扰项）
            isPureSpell = isPureWordSpellingType(item);

            var popupType = getBlankType(item) || '';

            // 单选和多选型填空需要弹层显示
            popup = isSpell || isChoiceTypeBlank ? ((attr.blankPopupTrigger) + "=\"" + index + "\" " + popupType + " readonly") : '';

            // 单词拼写(有干扰项或者无干扰项)
            if (isSpell || isPureSpell) {
                return getAlphaSpellTemplate(index, item.blankLength, isPureSpell ? 1 : 0);
            }

            // 数学选择型填空
            if (isChoiceTypeBlank) {
                return (" <span class=\"" + (style$1.inputContainer) + "\" " + popup + " " + blankIndex + " " + (attr.blankContentType) + "=\"svg\"> </span>");
            }
        }

        var readonlyAttr = readonly ? 'readonly' : '';

        // 数学键盘(排除选择型填空)
        if (isMath && !isChoiceTypeBlank) {
            template = "<span class=\"" + (style$1.mathInput) + "\" " + blankIndex + "></span>";
        } else {
            template = " <input class=\"" + (style$1.input) + "\" " + customAttr + "  " + popup + " " + blankIndex + " " + readonlyAttr + "> ";
        }

        return template;
    });

    return content;
};

var transBlankContainer = function(content) {
    var index = -1;
    content = content.replace(BLANK_REGEX, function(match) {
        index++;
        return ("<a  href=\"javascript:void(0);\" class=\"" + (style$1.input) + "\" " + (attr.blankItem) + "=\"" + index + "\"></a>")
    });

    return content;
};



/**
 * [transfromBlankContent 将下划线替换成可交互的空]
 * @param  {[String]} content [题干]
 * @param  {[Object]} data    [试题数据]
 * @return {[String]}         [替换后的字符串]
 */
var transfromBlankContent = function(content, data) {
    var isDecidable = data.isDecidable;
    if (!isDecidable) { return content; }
    var type = parseInt(data.logicQuesTypeId, 10);
    var output = content;
    switch (type) {
        case 3: //  多选多
        case 10: // 完型填空
        case 6: // 配对
            output = transBlankContainer(content);
            break;
        case 4: // 填空
            var isMathInput = [2,4,5,6].indexOf(parseInt(data.subjectId)) > -1 && data.isDecidable == 1;
            output = transToInput(content, isMathInput, false, data.blankInteraction);
            break;
        default:
            break;
    }
    return output;
};

// 判断题svg图标
var right$1 = "\n<svg  width=\"15\" height=\"10\" version=\"1\"><path fill-rule=\"evenodd\" d=\"M5 10L0 5a1 1 0 1 1 1-1l4 4 8-8a1 1 0 0 1 1 1l-8 9H5z\"/></svg>\n";

var error = "\n<svg width=\"12\" height=\"12\" version=\"1\"><path fill-rule=\"evenodd\" d=\"M7 6l5 5v1h-1L6 7l-5 5H0v-1l5-5-5-5V0h1l5 5 5-5h1v1L7 6z\"/></svg>\n";

/**
 * [getTFText 根据学科获取判断题文本]
 * @param  {[String, Number]} subjectId [学科id]
 * @param  {[String]} text      [值]
 * @return {[String]}           [返回字符]
 */
var getTFText = function (subjectId, text) {
    var isEnglish = subjectId == 3;
    var output;
    if (text === 'T') {
        output = isEnglish ? 'T' : right$1;
    } else {
        output = isEnglish ? 'F' : error;
    }
    return output;
};


/**
 * [wrapperTable 把内容中表格封装成带外层容器的元素]
 * @param  {[String]} content [内容]
 * @return {[String]}         [替换后的内容]
 */
var wrapperTable = function (content) {
    var isLongDivision = false; // 是否是竖式标记
    var replaceCont = (content || '').replace(TABLE_START_REGEX, function (cont) {
        isLongDivision = cont.indexOf('vertical-table') !== -1;
        return isLongDivision ? ("" + cont) : ("<div class=\"" + (style$1.tableContaier) + "\">" + cont);
    });
    if (!isLongDivision) {
        replaceCont = replaceCont.replace(TABLE_END_REGEX, "$1</div>");
    }
    return replaceCont;
};


/**
 * [isAllObjective 判断复合题子题是否都是单选和多选]
 * @param  {[Array]}  childList [子题列表]
 * @return {Boolean}            [是否是客观题标示]
 */
var isAllObjective = function (childList) {
    return childList.every(function (item) {
        return (item.logicQuesTypeId == 1 || item.logicQuesTypeId == 2)
    });
};


var notice = {
    '2': '提示：本题有一个或多个正确答案',
    '7': '提示：通过拖拽调整选项到合适的顺序完成作答',
    '13': '提示：可以通过长按横线上的单词来拖动调整单词顺序'
};

var getNotice = function (logicQuesTypeId) {
    return notice[logicQuesTypeId];
};

/*!
 * escape-html
 * Copyright(c) 2012-2013 TJ Holowaychuk
 * Copyright(c) 2015 Andreas Lubbe
 * Copyright(c) 2015 Tiancheng "Timothy" Gu
 * MIT Licensed
 */

/**
 * Module variables.
 * @private
 */

var matchHtmlRegExp = /["'&<>]/;



/**
 * Escape special characters in the given string of html.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

function escapeHtml(string) {
    var str = '' + string;
    var match = matchHtmlRegExp.exec(str);

    if (!match) {
        return str;
    }

    var escape;
    var html = '';
    var index = 0;
    var lastIndex = 0;

    for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
            case 34: // "
                escape = '&quot;';
                break;
            case 38: // &
                escape = '&amp;';
                break;
            case 39: // '
                escape = '&#39;';
                break;
            case 60: // <
                escape = '&lt;';
                break;
            case 62: // >
                escape = '&gt;';
                break;
            default:
                continue;
        }

        if (lastIndex !== index) {
            html += str.substring(lastIndex, index);
        }

        lastIndex = index + 1;
        html += escape;
    }

    return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}

/**
 * [transContentToList 将字符串用分隔符拆分成数组]
 * 连词成句
 * @param  {[String]} content   [内容]
 * @param  {[String]} separator [分隔符]
 * @return {[Array]}            [分拆后的数组]
 */
var transContentToList = function(content, separator) {
    return content && content.split(separator);
};

var renderList = function(list, template) {
    var outList = list.map(function(value, index) {
        return template.replace(/\$\[value\]/g, escapeHtml(value));
    });
    return outList.join(' ');
};

var getBtn = function(item, index) {
    return (" <button class=\"" + (index == 0 ? 'current' : '') + "\" " + (attr.targetIndex) + "=\"" + index + "\">\n              " + (index + 1) + " \n             </button>");
};

var getIndexTemplate = function(list) {
    var templateList = list.map(getBtn);
    return ("<div class=\"question-index-main\">\n              " + (templateList.join(' ')) + "\n            </div>");
};


/**
 * [getBlankIndex 根据内容获取试题中下划线空的个数结构]
 * @param  {[String]} content [题干]
 * @return {[String]}         [输出结构]
 * 多选多题型
 */
var getBlankIndex = function(inputData) {
    var blankList;
    if (Array.isArray(inputData)) {
        blankList = inputData;
    } else {
        blankList = inputData.match(BLANK_REGEX);
    }
    return getIndexTemplate(blankList);
};


var getBlankOptionTemplate = function(blank, queId) {
    var target = blank.svgContent || blank.content;
    var template = '';
    target.forEach(function(item, index) {
        template += "<span class=\"word-btn\" type=\"option\" data-id=\"" + queId + "\" " + (attr.blankOption) + "=\"" + (blank.content[index]) + "\">\n                         <span>" + item + "</span>\n                    </span>";
    });
    return template;
};

var helper$1 = {
    isWordSpelling: isWordSpelling,
    isChoiceType: isChoiceType,
    isPureWordSpellingType: isPureWordSpellingType,
    dataAddition: dataAddition,
    transContentToList: transContentToList,
    renderList: renderList,
    getTFText: getTFText,
    wrapperTable: wrapperTable,
    isAllObjective: isAllObjective,
    transfromBlankContent: transfromBlankContent,
    getIndexTemplate: getIndexTemplate,
    getBlankIndex: getBlankIndex,
    getBlankOptionTemplate: getBlankOptionTemplate,
    getNotice: getNotice,
};

var ClassName = {
    analyzeGroup: 'talqs_analyze_group',
    analyzeLayer: 'talqs_analyze_layer',
    analyzeIndex: 'talqs_analyze_index',
};

var Selector = {
    optionAnalyze: '[data-option-analyze="1"]',
    answer: '.talqs_answer',
    analysis: '.talqs_analyze',
    analyzeContainer: '.talqs_analysis_container',
    optionList: '.talqs_options_list',
    imageContainer: '.talqs_img_container',
    correctContainer: '.talqs_correct_container'
};

var analyzeWrapperConfig = {
    answer: {
        component: 'questionAnswer',
        key: 'answer',
    },
    analyze: {
        component: 'questionAnalyze',
        key: 'analysis',
        isAnalysis: true,
    }
};

/**
 * [createDiv 创建 div 的封装，类名可有可无]
 * @param  {[String]} className [div 类名]
 * @return {[HTMLDivElement]}   [div]
 */
var createDiv = function(className) {
    if ( className === void 0 ) className = '';

    var ele = document.createElement('div');
    ele.className = className;
    return ele;
};

/**
 * [toggleAnalyzeWrapper 切换答案和解析的显示]
 * @param  {[Object]} config        [答案和解析模板和字段配置]
 * @param  {[Element]} mainCotainer [试题DOM元素]
 * @param  {[Object]} data          [答案或者解析数据封装]
 * @param  {[Number]} state         [显示状态]
 */
var toggleAnalyzeWrapper = function(config, mainCotainer, data, state) {

    var container = mainCotainer.querySelector('.' + ClassName.analyzeLayer);

    var switchState = parseInt(state, 10);

    if (switchState) { // 显示
        if (!container) {
            // 添加到试题面板
            var analyzeContainer = createDiv(ClassName.analyzeGroup);
            mainCotainer.appendChild(analyzeContainer);

            // 可滚动的容器
            container = createDiv(ClassName.analyzeLayer);
            analyzeContainer.appendChild(container);
        }
        container.insertAdjacentHTML('beforeend', TalqsTemplate$1.renderPartialComponent(config.component, data));

        // addLoadingForImages(document.images);
    } else { // 隐藏
        if (container) {
            var current = container.querySelector(Selector[config.key]);
            // 删除对应的元素
            if (current) {
                container.removeChild(current);
            }
            // 如果答案和解析都被隐藏，则直接删除父元素
            if (!container.children.length) {
                mainCotainer.removeChild(container.parentNode);
            }
        }
    }
};
/**
 * [getContainerByQueId 根据ID获取试题元素DOM]
 * @param  {[String]} queId  [试题ID]
 * @return {[Element]}       [试题DOM]
 */
var getContainerByQueId = function(queId) {
    var qsSelector = '[data-que-id="' + queId + '"]';
    return document.querySelector(qsSelector);
};

// 获取选项内容
var getOptionContent = function(aoval, element) {
    var optionSelector = '[data-option-item="' + aoval + '"] [data-option-content]';
    var optionItem = element.querySelector(optionSelector);
    if (!optionItem) {
        optionSelector = '[data-current-option="' + aoval + '"]';
        optionItem = element.querySelector(optionSelector);
    }
    if (!optionItem) { return ''; }
    var firstChild = optionItem.children[0] || optionItem;
    return firstChild.innerHTML;
};

var analyzeDataWrapper = function(config, data) {
    // 试题 DOM 元素
    var mainCotainer = getContainerByQueId(data.queId);
    if (!mainCotainer) { return; }
    // 查找所有带解析的选项组件（完型填空、判断...）
    var optionAnalyzeList = mainCotainer.querySelectorAll(Selector.optionAnalyze);
    // 显示或者隐藏标示
    var state = data.state;

    // 答案解析对应到子题（子题指的是完型填空和判断题小题）
    var hasOptionAnalyze = optionAnalyzeList.length > 0;
    // 答案解析对应到空(多选多)
    var blankAnalyzeContainer = mainCotainer.querySelector(Selector.analyzeContainer);


    if (hasOptionAnalyze || blankAnalyzeContainer) {
        var key = config.key;
        var list = [];
        if (config.isAnalysis) {
            list = data.analysis.map(function(item) {
                return [item];
            });
        } else {
            if (blankAnalyzeContainer) {
                list = data.answer.map(function(item) {
                    var answer = item[0];
                    var content = getOptionContent(answer, mainCotainer);
                    var wraperContent = answer + '（' + content + '）';
                    return [wraperContent];
                });
            } else {
                list = data.answer;
            }
        }

        // 调用切换开关
        var togglefn = function(index, node) {
            var option = {};
            option[key] = list[index];
            option.subjectId = data.subjectId;
            option.logicQuesTypeId = data.logicQuesTypeId;
            toggleAnalyzeWrapper(config, node, option, state);
        };

        if (hasOptionAnalyze) { // 答案解析对应到子题（子题指的是完型填空和判断题小题）
            [].forEach.call(optionAnalyzeList, function(item, index) {
                togglefn(index, item.parentNode);
            });
        } else { // 答案解析对应到子空
            var optionList = mainCotainer.querySelectorAll(Selector.optionList);
            var last = optionList.length - 1;
            blankAnalyzeContainer.style.display = 'block';
            var currentIndexEle = mainCotainer.querySelector('.current[data-traget-index]');
            var currentIndex = currentIndexEle && parseInt(currentIndexEle.getAttribute('data-traget-index'), 10) || 0;
            list.forEach(function(item, index) {
                var node = blankAnalyzeContainer.children[index];
                if (!node) {
                    node = createDiv();
                    var indexEle = document.createElement('span');
                    indexEle.className = ClassName.analyzeIndex;
                    indexEle.innerText = (index + 1) + '.';
                    node.appendChild(indexEle);
                    blankAnalyzeContainer.appendChild(node);
                }
                if (index == currentIndex) {
                    node.className = "current";
                }
                togglefn(index, node);
            });
            if (!blankAnalyzeContainer.querySelector(Selector.answer) &&
                !blankAnalyzeContainer.querySelector(Selector.analysis)) {
                blankAnalyzeContainer.innerHTML = '';
                blankAnalyzeContainer.style.display = 'none';
            }
        }
    } else {
        toggleAnalyzeWrapper(config, mainCotainer, data, state);
    }
};


var toggleAnalyze = function(data) {
    if (Array.isArray(data)) {
        data.forEach(function(item) {
            analyzeDataWrapper(analyzeWrapperConfig.analyze, item);
        });
    }
};

var toggleAnswer = function(data) {
    if (Array.isArray(data)) {
        data.forEach(function(item) {
            analyzeDataWrapper(analyzeWrapperConfig.answer, item);
        });
    }
};

// -----------------------------------------------------
var insertNode = function(data, selector, componentName) {
    // 试题 DOM 元素
    var mainCotainer = getContainerByQueId(data.queId);
    if (!mainCotainer) { return; }

    var componentSelector = "[data-que-id=\"" + (data.queId) + "\"] > " + selector;
    var componentContainer = mainCotainer.querySelector(componentSelector);
    if (!componentContainer) { return; }
    componentContainer.innerHTML = TalqsTemplate$1.renderPartialComponent(componentName, data);
};

var setResponse = function(data, selector, componentName) {
    if ( data === void 0 ) data = {};
    if ( selector === void 0 ) selector = Selector.imageContainer;
    if ( componentName === void 0 ) componentName = "questionImgAnswer";

    var userResponse = data.data;
    if (Array.isArray(userResponse)) {
        userResponse.forEach(function(item) {
            insertNode(item, selector, componentName);
        });
    }
};

// 初始化排序
var initTqiQs = function() {
    // 初始化排序
    window.initSortType();
};


/**
 * latex代码转为html标签
 * 
 * @param {any} el 
 * @param {Sting, Array} latex 
 * @param {any} config 配置 (当latex参数为数组时，config才生效)
 * config -> className {string} 需要配置的class名称
 * config -> symbol {string} 符号
 * config -> lastSymbol {bool} 最后一个位置是否显示分割符号 默认false
 * config -> nodeName {string} 每一个dom节点名称
 * config -> replaceHtml {string} 当文本为空时。默认填充的文本
 */
var latexToHtml = function (el, latex, config) {
    if ( config === void 0 ) config = {};

    var ref = 
          [config.nodeName, config.className, config.symbol, config.lastSymbol, config.replaceHtml];
    var nodeName = ref[0]; if ( nodeName === void 0 ) nodeName = '';
    var className = ref[1]; if ( className === void 0 ) className = '';
    var symbol = ref[2]; if ( symbol === void 0 ) symbol = '';
    var lastSymbol = ref[3]; if ( lastSymbol === void 0 ) lastSymbol = false;
    var replaceHtml = ref[4]; if ( replaceHtml === void 0 ) replaceHtml = '';
    if (Array.isArray(latex)) {
        var latexLength = latex.length;
        latex.forEach(function (item, index) {
            var last = index + 1 === latexLength;
            var DOM = document.createElement((nodeName && nodeName.toUpperCase()) || 'SPAN');
            className && DOM.classList.add(className);
            if (item) {
                var MQ = MathQuill && MathQuill.getInterface(2);
                var mathField = el && MQ && MQ.StaticMath && MQ.StaticMath(DOM);
                mathField && mathField.latex(("" + item + (last ? lastSymbol && symbol || '' : symbol)));
            } else {
                DOM.innerHTML = "" + replaceHtml + (last ? lastSymbol && symbol || '' : symbol);
            }
            el.appendChild(DOM);
        });
    } else {
        var MQ = MathQuill && MathQuill.getInterface(2);
        var mathField = el && MQ && MQ.StaticMath && MQ.StaticMath(el);
        mathField && mathField.latex(latex);
    }
};

// 试题渲染模板引擎
// 判题
// 存储实例
// 选择型
// 填空型
// 下拉选择型
// 下拉选择型
// 解答题型
// 交互模板
// 模板辅助函数
// 注册交互版本的组件和辅助函数
(function registerInteractiveTemplate(TalqsTemplate) {
    // 注册 helper
    for (var key in helper$1) {
        TalqsTemplate.registerHelper(key, helper$1[key]);
    }

    // 注册交互版组件
    var components = TalqsTemplate.components;
    TalqsTemplate.updateTemplateList(( obj = {}, obj[components.StemsWrapper] = {
            template: templates.question,
            components: [{
                name: components.Content,
                template: templates.questionContent
            }, {
                name: components.Options,
                template: templates.questionOptions
            }, {
                name: components.ChildList,
                template: templates.questionChildList,
            }, {
                name: 'questionBlankOption',
                template: templates.questionBlankOption,
            }, {
                name: 'questionResponse',
                template: templates.questionResponse,
            }, {
                name: 'questionImgAnswer',
                template: templates.questionImgAnswer,
            }, {
                name: 'questionCorrect',
                template: templates.questionCorrect,
            }]
        }, obj ));
    var obj;
}(TalqsTemplate));

(function() {
    var dragMain;
    var winHeight;
    var dragBtn = ".drag-button";

    var onTouchEnd = function () {
        dragMain = null;
        $(document).off('touchmove', onTouchMove);
        $(document).off('touchend', onTouchEnd);
        $(document).off('mousemove', onTouchMove);
        $(document).off('mouseup', onTouchEnd);
    };

    var onTouchMove = function (evt) {
        evt.preventDefault();
        evt.stopImmediatePropagation();
        var touch = (evt.touches && evt.touches[0]) || 
        (evt.originalEvent && evt.originalEvent.touches && evt.originalEvent.touches[0]);
        var lastY = (touch || evt).clientY;
        var height = Math.max(winHeight - lastY, 0);
        var fixedHeight = Math.floor(Math.min(winHeight - 40, height));
        dragMain.style.height = fixedHeight + "px";
    };

    var onDragStart = function (evt) {
        dragMain = $(evt.target).closest('.drag-main')[0];
        if (!dragMain) { return; }
        winHeight = window.innerHeight;
        $(document).on('touchmove', onTouchMove);
        $(document).on('mousemove', onTouchMove);
        $(document).on('touchend', onTouchEnd);
        $(document).on('mouseup', onTouchEnd);
    };

    $(document).on('touchstart', dragBtn, onDragStart);
    $(document).on('mousedown', dragBtn, onDragStart);
}());

// ------------------------------------------------------------------





// -----------------------------------------------------------------


var TalqsInteraction = {
    /**
     * @param {[Array/Object]} data [内置数据列表]
     * 给插件设置内置填充数据
     * data: [
     *   {
     *     queId: 'xxx',  // 试题 ID
     *     data: ["A", "B"] // 默认试题作答数据
     *   }
     * ]
     * data: {
     *   试题ID: {
     *     data: ['A']
     *   }
     * }
     */
    setData: function setData(data) {
        if (Array.isArray(data)) {
            data.forEach(function (item) {
                talqsStorageData.set(item.queId, item);
            });
        } else {
            for (var key in data) {
                talqsStorageData.set(key, data[key]);
            }
        }
        document.dispatchEvent(new Event(TALQS_EVENT.CHANGE));
    },
    /**
     * 获取作答数据，可以指定 ID 获取对应的作答数据
     * @param  {[String]} id [试题ID]
     */
    getData: function getData(id) {
        return talqsStorageData.get(id);
    },
    /**
     * 隐藏键盘
     * 
     */
    hideKeyboard: function hideKeyboard() {
        var event = new Event(TALQS_EVENT.HIDE_KEYBOARD);
        document.dispatchEvent(event);
    },
    /**
     * 重置键盘状态
     *
     */
    resetKeyboardState: function resetKeyboardState() {
        var event = new Event(TALQS_EVENT.RESET_KEYBOARD_STATE);
        document.dispatchEvent(event);
    },

    /**
     * [isInteractive 是否开启交互标示]
     * @type {Boolean}
     */
    isInteractive: true,
    /**
     * [keyPadContainer 键盘渲染dom容器]
     * @type {dom}
     */
    keyPadContainer: null,
    /**
     * [ScrollContainer 自动滚动dom容器]
     * @type {dom}
     */
    scrollContainer: null,

    isUndefined: function isUndefined(value) {
        return value === void 0;
    },

    toggleValue: function toggleValue(value, raw) {
        return this.isUndefined(value) ? !raw : Boolean(value);
    },
    /**
     * [toggleInteraction 交互标示开关]
     * @param  {[Boolean]} value [description]
     */
    toggleInteraction: function toggleInteraction(value) {
        // this.isInteractive = this.toggleValue(value, this.isInteractive);
        var event = new Event(TALQS_EVENT.TOGGLE_INTEACTION);
        event.data = value;
        document.dispatchEvent(event);
    },
    /**
     * 插件交互数据变更通知回调
     */
    onChange: null,
    toggleAnalyze: toggleAnalyze,
    toggleAnswer: toggleAnswer,
    setResponse: setResponse,
    initTqiQs: initTqiQs,
    latexToHtml: latexToHtml
};

return TalqsInteraction;

})));
