/*!-----------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.1.0(6c0fe2014e7a7d596ac1af21f25bf2fc17da8a75)
 * Released under the MIT license
 * https://github.com/Microsoft/vscode/blob/master/LICENSE.txt
 *-----------------------------------------------------------*/
define("vs/languages/handlebars/common/handlebarsTokenTypes",["require","exports"],function(e,t){"use strict";t.EMBED="punctuation.expression.unescaped.handlebars",t.EMBED_UNESCAPED="punctuation.expression.handlebars",t.KEYWORD="keyword.helper.handlebars",t.VARIABLE="variable.parameter.handlebars"});var __extends=this&&this.__extends||function(e,t){function n(){this.constructor=e}for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)},__decorate=this&&this.__decorate||function(e,t,n,r){var a,s=arguments.length,i=3>s?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,n,r);else for(var o=e.length-1;o>=0;o--)(a=e[o])&&(i=(3>s?a(i):s>3?a(t,n,i):a(t,n))||i);return s>3&&i&&Object.defineProperty(t,n,i),i},__param=this&&this.__param||function(e,t){return function(n,r){t(n,r,e)}};define("vs/languages/handlebars/common/handlebars",["require","exports","vs/editor/common/modes","vs/languages/html/common/html","vs/languages/handlebars/common/handlebarsTokenTypes","vs/platform/instantiation/common/instantiation","vs/editor/common/services/modeService","vs/editor/common/modes/supports/richEditSupport","vs/editor/common/modes/abstractMode"],function(e,t,n,r,a,s,i,o,c){"use strict";!function(e){e[e.HTML=0]="HTML",e[e.Expression=1]="Expression",e[e.UnescapedExpression=2]="UnescapedExpression"}(t.States||(t.States={}));var d=t.States,p=function(e){function t(t,n,r,a,s,i,o,c){e.call(this,t,n,a,s,i,o,c),this.kind=n,this.handlebarsKind=r,this.lastTagName=a,this.lastAttributeName=s,this.embeddedContentType=i,this.attributeValueQuote=o,this.attributeValue=c}return __extends(t,e),t.prototype.makeClone=function(){return new t(this.getMode(),this.kind,this.handlebarsKind,this.lastTagName,this.lastAttributeName,this.embeddedContentType,this.attributeValueQuote,this.attributeValue)},t.prototype.equals=function(n){return n instanceof t?e.prototype.equals.call(this,n):!1},t.prototype.tokenize=function(t){switch(this.handlebarsKind){case d.HTML:if(t.advanceIfString("{{{").length>0)return this.handlebarsKind=d.UnescapedExpression,{type:a.EMBED_UNESCAPED};if(t.advanceIfString("{{").length>0)return this.handlebarsKind=d.Expression,{type:a.EMBED};break;case d.Expression:case d.UnescapedExpression:if(this.handlebarsKind===d.Expression&&t.advanceIfString("}}").length>0)return this.handlebarsKind=d.HTML,{type:a.EMBED};if(this.handlebarsKind===d.UnescapedExpression&&t.advanceIfString("}}}").length>0)return this.handlebarsKind=d.HTML,{type:a.EMBED_UNESCAPED};if(t.skipWhitespace().length>0)return{type:""};if("#"===t.peek())return t.advanceWhile(/^[^\s}]/),{type:a.KEYWORD};if("/"===t.peek())return t.advanceWhile(/^[^\s}]/),{type:a.KEYWORD};if(t.advanceIfString("else")){var n=t.peek();if(" "===n||"	"===n||"}"===n)return{type:a.KEYWORD};t.goBack(4)}if(t.advanceWhile(/^[^\s}]/).length>0)return{type:a.VARIABLE}}return e.prototype.tokenize.call(this,t)},t}(r.State);t.HandlebarsState=p;var l=function(e){function t(t,n,r){e.call(this,t,n,r),this.formattingSupport=null}return __extends(t,e),t.prototype._createRichEditSupport=function(){return new o.RichEditSupport(this.getId(),null,{wordPattern:c.createWordRegExp("#-?%"),comments:{blockComment:["<!--","-->"]},brackets:[["<!--","-->"],["{{","}}"]],__electricCharacterSupport:{caseInsensitive:!0,embeddedElectricCharacters:["*","}","]",")"]},__characterPairSupport:{autoClosingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:'"',close:'"'},{open:"'",close:"'"}],surroundingPairs:[{open:"<",close:">"},{open:'"',close:'"'},{open:"'",close:"'"}]},onEnterRules:[{beforeText:new RegExp("<(?!(?:"+r.EMPTY_ELEMENTS.join("|")+"))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$","i"),afterText:/^<\/(\w[\w\d]*)\s*>$/i,action:{indentAction:n.IndentAction.IndentOutdent}},{beforeText:new RegExp("<(?!(?:"+r.EMPTY_ELEMENTS.join("|")+"))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$","i"),action:{indentAction:n.IndentAction.Indent}}]})},t.prototype.getInitialState=function(){return new p(this,r.States.Content,d.HTML,"","","","","")},t.prototype.getLeavingNestedModeData=function(t,n){var a=e.prototype.getLeavingNestedModeData.call(this,t,n);return a&&(a.stateAfterNestedMode=new p(this,r.States.Content,d.HTML,"","","","","")),a},t=__decorate([__param(1,s.IInstantiationService),__param(2,i.IModeService)],t)}(r.HTMLMode);t.HandlebarsMode=l});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/6c0fe2014e7a7d596ac1af21f25bf2fc17da8a75/vs\languages\handlebars\common\handlebars.js.map
