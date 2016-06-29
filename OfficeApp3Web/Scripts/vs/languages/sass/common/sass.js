/*!-----------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.1.0(6c0fe2014e7a7d596ac1af21f25bf2fc17da8a75)
 * Released under the MIT license
 * https://github.com/Microsoft/vscode/blob/master/LICENSE.txt
 *-----------------------------------------------------------*/
define("vs/languages/sass/common/sassTokenTypes",["require","exports"],function(e,t){"use strict";t.TOKEN_SELECTOR="entity.name.selector",t.TOKEN_SELECTOR_TAG="entity.name.tag",t.TOKEN_PROPERTY="support.type.property-name",t.TOKEN_VALUE="support.property-value",t.TOKEN_AT_KEYWORD="keyword.control.at-rule"});var __extends=this&&this.__extends||function(e,t){function n(){this.constructor=e}for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o]);e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)},__decorate=this&&this.__decorate||function(e,t,n,o){var r,i=arguments.length,a=3>i?t:null===o?o=Object.getOwnPropertyDescriptor(t,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,o);else for(var c=e.length-1;c>=0;c--)(r=e[c])&&(a=(3>i?r(a):i>3?r(t,n,a):r(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},__param=this&&this.__param||function(e,t){return function(n,o){t(n,o,e)}};define("vs/languages/sass/common/sass",["require","exports","vs/editor/common/modes/monarch/monarch","vs/editor/common/modes/monarch/monarchCompile","vs/languages/sass/common/sassTokenTypes","vs/editor/common/modes/abstractMode","vs/platform/thread/common/threadService","vs/editor/common/services/modeService","vs/platform/instantiation/common/instantiation","vs/platform/thread/common/thread","vs/editor/common/services/modelService","vs/editor/common/modes/supports/declarationSupport","vs/editor/common/modes/supports/referenceSupport","vs/editor/common/modes/supports/suggestSupport","vs/editor/common/services/editorWorkerService"],function(e,t,n,o,r,i,a,c,s,u,p,l,d,m,f){"use strict";t.language={displayName:"Sass",name:"sass",wordDefinition:/(#?-?\d*\.\d\w*%?)|([$@#!.:]?[\w-?]+%?)|[$@#!.]/g,defaultToken:"",lineComment:"//",blockCommentStart:"/*",blockCommentEnd:"*/",ws:"[ 	\n\r\f]*",identifier:"-?-?([a-zA-Z]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))([\\w\\-]|(\\\\(([0-9a-fA-F]{1,6}\\s?)|[^[0-9a-fA-F])))*",brackets:[{open:"{",close:"}",token:"punctuation.curly"},{open:"[",close:"]",token:"punctuation.bracket"},{open:"(",close:")",token:"punctuation.parenthesis"},{open:"<",close:">",token:"punctuation.angle"}],tokenizer:{root:[{include:"@selector"},["[@](charset|namespace)",{token:r.TOKEN_AT_KEYWORD,next:"@declarationbody"}],["[@](function)",{token:r.TOKEN_AT_KEYWORD,next:"@functiondeclaration"}],["[@](mixin)",{token:r.TOKEN_AT_KEYWORD,next:"@mixindeclaration"}]],selector:[{include:"@comments"},{include:"@import"},{include:"@variabledeclaration"},{include:"@warndebug"},["[@](include)",{token:r.TOKEN_AT_KEYWORD,next:"@includedeclaration"}],["[@](keyframes|-webkit-keyframes|-moz-keyframes|-o-keyframes)",{token:r.TOKEN_AT_KEYWORD,next:"@keyframedeclaration"}],["[@](page|content|font-face|-moz-document)",{token:r.TOKEN_AT_KEYWORD}],["url(\\-prefix)?\\(",{token:"support.function.name",bracket:"@open",next:"@urldeclaration"}],{include:"@controlstatement"},{include:"@selectorname"},["[&\\*]",r.TOKEN_SELECTOR_TAG],["[>\\+,]","punctuation"],["\\[",{token:"punctuation.bracket",bracket:"@open",next:"@selectorattribute"}],["{",{token:"punctuation.curly",bracket:"@open",next:"@selectorbody"}]],selectorbody:[["[*_]?@identifier@ws:(?=(\\s|\\d|[^{;}]*[;}]))",r.TOKEN_PROPERTY,"@rulevalue"],{include:"@selector"},["[@](extend)",{token:r.TOKEN_AT_KEYWORD,next:"@extendbody"}],["[@](return)",{token:r.TOKEN_AT_KEYWORD,next:"@declarationbody"}],["}",{token:"punctuation.curly",bracket:"@close",next:"@pop"}]],selectorname:[["#{",{token:"support.function.interpolation",bracket:"@open",next:"@variableinterpolation"}],["(\\.|#(?=[^{])|%|(@identifier)|:)+",r.TOKEN_SELECTOR]],selectorattribute:[{include:"@term"},["]",{token:"punctuation.bracket",bracket:"@close",next:"@pop"}]],term:[{include:"@comments"},["url(\\-prefix)?\\(",{token:"support.function.name",bracket:"@open",next:"@urldeclaration"}],{include:"@functioninvocation"},{include:"@numbers"},{include:"@strings"},{include:"@variablereference"},["(and\\b|or\\b|not\\b)","keyword.operator"],{include:"@name"},["([<>=\\+\\-\\*\\/\\^\\|\\~,])","keyword.operator"],[",","punctuation"],["!default","literal"],["\\(",{token:"punctuation.parenthesis",bracket:"@open",next:"@parenthizedterm"}]],rulevalue:[{include:"@term"},["!important","literal"],[";","punctuation","@pop"],["{",{token:"punctuation.curly",bracket:"@open",switchTo:"@nestedproperty"}],["(?=})",{token:"",next:"@pop"}]],nestedproperty:[["[*_]?@identifier@ws:",r.TOKEN_PROPERTY,"@rulevalue"],{include:"@comments"},["}",{token:"punctuation.curly",bracket:"@close",next:"@pop"}]],warndebug:[["[@](warn|debug)",{token:r.TOKEN_AT_KEYWORD,next:"@declarationbody"}]],"import":[["[@](import)",{token:r.TOKEN_AT_KEYWORD,next:"@declarationbody"}]],variabledeclaration:[["\\$@identifier@ws:","variable.decl","@declarationbody"]],urldeclaration:[{include:"@strings"},["[^)\r\n]+","string"],["\\)",{token:"support.function.name",bracket:"@close",next:"@pop"}]],parenthizedterm:[{include:"@term"},["\\)",{token:"punctuation.parenthesis",bracket:"@close",next:"@pop"}]],declarationbody:[{include:"@term"},[";","punctuation","@pop"],["(?=})",{token:"",next:"@pop"}]],extendbody:[{include:"@selectorname"},["!optional","literal"],[";","punctuation","@pop"],["(?=})",{token:"",next:"@pop"}]],variablereference:[["\\$@identifier","variable.ref"],["\\.\\.\\.","keyword.operator"],["#{",{token:"support.function.interpolation",bracket:"@open",next:"@variableinterpolation"}]],variableinterpolation:[{include:"@variablereference"},["}",{token:"support.function.interpolation",bracket:"@close",next:"@pop"}]],comments:[["\\/\\*","comment","@comment"],["\\/\\/+.*","comment"]],comment:[["\\*\\/","comment","@pop"],[".","comment"]],name:[["@identifier",r.TOKEN_VALUE]],numbers:[["(\\d*\\.)?\\d+([eE][\\-+]?\\d+)?",{token:"constant.numeric",next:"@units"}],["#[0-9a-fA-F_]+(?!\\w)","constant.rgb-value"]],units:[["(em|ex|ch|rem|vw|vh|vm|cm|mm|in|px|pt|pc|deg|grad|rad|turn|s|ms|Hz|kHz|%)?","constant.numeric","@pop"]],functiondeclaration:[["@identifier@ws\\(",{token:"support.function.name",bracket:"@open",next:"@parameterdeclaration"}],["{",{token:"punctuation.curly",bracket:"@open",switchTo:"@functionbody"}]],mixindeclaration:[["@identifier@ws\\(",{token:"support.function.name",bracket:"@open",next:"@parameterdeclaration"}],["@identifier","support.function.name"],["{",{token:"punctuation.curly",bracket:"@open",switchTo:"@selectorbody"}]],parameterdeclaration:[["\\$@identifier@ws:",r.TOKEN_PROPERTY],["\\.\\.\\.","keyword.operator"],[",","punctuation"],{include:"@term"},["\\)",{token:"support.function.name",bracket:"@close",next:"@pop"}]],includedeclaration:[{include:"@functioninvocation"},["@identifier","support.function.name"],[";","punctuation","@pop"],["(?=})",{token:"",next:"@pop"}],["{",{token:"punctuation.curly",bracket:"@open",switchTo:"@selectorbody"}]],keyframedeclaration:[["@identifier","support.function.name"],["{",{token:"punctuation.curly",bracket:"@open",switchTo:"@keyframebody"}]],keyframebody:[{include:"@term"},["{",{token:"punctuation.curly",bracket:"@open",next:"@selectorbody"}],["}",{token:"punctuation.curly",bracket:"@close",next:"@pop"}]],controlstatement:[["[@](if|else|for|while|each|media)",{token:"keyword.flow.control.at-rule",next:"@controlstatementdeclaration"}]],controlstatementdeclaration:[["(in|from|through|if|to)\\b",{token:"keyword.flow.control.at-rule"}],{include:"@term"},["{",{token:"punctuation.curly",bracket:"@open",switchTo:"@selectorbody"}]],functionbody:[["[@](return)",{token:r.TOKEN_AT_KEYWORD}],{include:"@variabledeclaration"},{include:"@term"},{include:"@controlstatement"},[";","punctuation"],["}",{token:"punctuation.curly",bracket:"@close",next:"@pop"}]],functioninvocation:[["@identifier\\(",{token:"support.function.name",bracket:"@open",next:"@functionarguments"}]],functionarguments:[["\\$@identifier@ws:",r.TOKEN_PROPERTY],["[,]","punctuation"],{include:"@term"},["\\)",{token:"support.function.name",bracket:"@close",next:"@pop"}]],strings:[['~?"',{token:"string.punctuation",bracket:"@open",next:"@stringenddoublequote"}],["~?'",{token:"string.punctuation",bracket:"@open",next:"@stringendquote"}]],stringenddoublequote:[["\\\\.","string"],['"',{token:"string.punctuation",next:"@pop",bracket:"@close"}],[".","string"]],stringendquote:[["\\\\.","string"],["'",{token:"string.punctuation",next:"@pop",bracket:"@close"}],[".","string"]]}};var k=function(e){function n(n,a,c,s,u,p){var f=this;e.call(this,n.id,o.compile(t.language),s,u,p),this._modeWorkerManager=new i.ModeWorkerManager(n,"vs/languages/sass/common/sassWorker","SassWorker","vs/languages/css/common/cssWorker",a),this._threadService=c,this.modeService=s,this.extraInfoSupport=this,this.inplaceReplaceSupport=this,this.configSupport=this,this.referenceSupport=new d.ReferenceSupport(this.getId(),{tokens:[r.TOKEN_PROPERTY+".sass",r.TOKEN_VALUE+".sass","variable.decl.sass","variable.ref.sass","support.function.name.sass",r.TOKEN_PROPERTY+".sass",r.TOKEN_SELECTOR+".sass"],findReferences:function(e,t,n){return f.findReferences(e,t)}}),this.logicalSelectionSupport=this,this.declarationSupport=new l.DeclarationSupport(this.getId(),{tokens:["variable.decl.sass","variable.ref.sass","support.function.name.sass",r.TOKEN_PROPERTY+".sass",r.TOKEN_SELECTOR+".sass"],findDeclaration:function(e,t){return f.findDeclaration(e,t)}}),this.outlineSupport=this,this.suggestSupport=new m.SuggestSupport(this.getId(),{triggerCharacters:[],excludeTokens:["comment.sass","string.sass"],suggest:function(e,t){return f.suggest(e,t)}})}return __extends(n,e),n.prototype.creationDone=function(){this._threadService.isInMainThread&&this._pickAWorkerToValidate()},n.prototype._worker=function(e){return this._modeWorkerManager.worker(e)},n.prototype.configure=function(e){return this._threadService.isInMainThread?this._configureWorkers(e):this._worker(function(t){return t._doConfigure(e)})},n.prototype._configureWorkers=function(e){return this._worker(function(t){return t._doConfigure(e)})},n.prototype.navigateValueSet=function(e,t,n){return this._worker(function(o){return o.navigateValueSet(e,t,n)})},n.prototype._pickAWorkerToValidate=function(){return this._worker(function(e){return e.enableValidator()})},n.prototype.findReferences=function(e,t){return this._worker(function(n){return n.findReferences(e,t)})},n.prototype.suggest=function(e,t){return this._worker(function(n){return n.suggest(e,t)})},n.prototype.getRangesToPosition=function(e,t){return this._worker(function(n){return n.getRangesToPosition(e,t)})},n.prototype.computeInfo=function(e,t){return this._worker(function(n){return n.computeInfo(e,t)})},n.prototype.getOutline=function(e){return this._worker(function(t){return t.getOutline(e)})},n.prototype.findDeclaration=function(e,t){return this._worker(function(n){return n.findDeclaration(e,t)})},n.prototype.findColorDeclarations=function(e){return this._worker(function(t){return t.findColorDeclarations(e)})},n.$_configureWorkers=a.AllWorkersAttr(n,n.prototype._configureWorkers),n.$navigateValueSet=a.OneWorkerAttr(n,n.prototype.navigateValueSet),n.$_pickAWorkerToValidate=a.OneWorkerAttr(n,n.prototype._pickAWorkerToValidate,u.ThreadAffinity.Group1),n.$findReferences=a.OneWorkerAttr(n,n.prototype.findReferences),n.$suggest=a.OneWorkerAttr(n,n.prototype.suggest),n.$getRangesToPosition=a.OneWorkerAttr(n,n.prototype.getRangesToPosition),n.$computeInfo=a.OneWorkerAttr(n,n.prototype.computeInfo),n.$getOutline=a.OneWorkerAttr(n,n.prototype.getOutline),n.$findDeclaration=a.OneWorkerAttr(n,n.prototype.findDeclaration),n.$findColorDeclarations=a.OneWorkerAttr(n,n.prototype.findColorDeclarations),n=__decorate([__param(1,s.IInstantiationService),__param(2,u.IThreadService),__param(3,c.IModeService),__param(4,p.IModelService),__param(5,f.IEditorWorkerService)],n)}(n.MonarchMode);t.SASSMode=k});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/6c0fe2014e7a7d596ac1af21f25bf2fc17da8a75/vs\languages\sass\common\sass.js.map