!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.gemWalletApi=t():e.gemWalletApi=t()}(self,(function(){return(()=>{"use strict";var e={728:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{s(r.next(e))}catch(e){i(e)}}function u(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,u)}s((r=r.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}},i=n(626),a=n(151);e.exports=function(){return r(void 0,void 0,void 0,(function(){var e,t,n,r,u;return o(this,(function(o){switch(o.label){case 0:e={network:null,error:""},o.label=1;case 1:return o.trys.push([1,3,,4]),t={app:i.GEM_WALLET,type:i.REQUEST_NETWORK},[4,(0,a.sendMessageToContentScript)(t)];case 2:return e=o.sent(),[3,4];case 3:return n=o.sent(),console.error(n),[3,4];case 4:if(r=e.network,u=e.error)throw u;return[2,r]}}))}))}},151:function(e,t,n){var r=this&&this.__assign||function(){return r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},r.apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0}),t.sendMessageToContentScript=void 0;var o=n(626);t.sendMessageToContentScript=function(e){var t=Date.now()+Math.random();return window.postMessage(r({source:o.MSG_REQUEST,messageId:t},e),window.location.origin),new Promise((function(n,r){window.gemWallet||"REQUEST_CONNECTION"===e.type||r(new Error("Please check if Gem Wallet is connected \n Gem Wallet needs to be installed: https://gemwallet.app"));var i=function(e){var r,a;e.source===window&&(null===(r=null==e?void 0:e.data)||void 0===r?void 0:r.source)===o.MSG_RESPONSE&&(null===(a=null==e?void 0:e.data)||void 0===a?void 0:a.messagedId)===t&&(n(e.data),window.removeEventListener("message",i))};window.addEventListener("message",i,!1)}))}},607:function(e,t,n){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.transactionRequest=t.getNetwork=t.isConnected=void 0;var o=r(n(935));t.isConnected=o.default;var i=r(n(728));t.getNetwork=i.default;var a=r(n(645));t.transactionRequest=a.default},935:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{s(r.next(e))}catch(e){i(e)}}function u(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,u)}s((r=r.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}},i=n(626),a=n(151);e.exports=function(){if(window.gemWallet)return new Promise((function(e){return e(!0)}));var e,t=new Promise((function(t){e=setTimeout((function(){t(!1)}),1e3)})),n=new Promise((function(e,t){return r(void 0,void 0,void 0,(function(){var n,r,u;return o(this,(function(o){switch(o.label){case 0:n={isConnected:!1},o.label=1;case 1:return o.trys.push([1,3,,4]),r={app:i.GEM_WALLET,type:i.REQUEST_CONNECTION},[4,(0,a.sendMessageToContentScript)(r)];case 2:return n=o.sent(),e(n.isConnected),[3,4];case 3:return u=o.sent(),t(u),[3,4];case 4:return[2]}}))}))}));return Promise.race([t,n]).then((function(t){return clearTimeout(e),!0===t&&(window.gemWallet=!0),t}))}},645:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{s(r.next(e))}catch(e){i(e)}}function u(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,u)}s((r=r.apply(e,t||[])).next())}))},o=this&&this.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}},i=n(626),a=n(151);e.exports=function(e){return r(void 0,void 0,void 0,(function(){var t,n,r,u,s;return o(this,(function(o){switch(o.label){case 0:t={status:"waiting",error:""},o.label=1;case 1:return o.trys.push([1,3,,4]),n={app:i.GEM_WALLET,type:i.REQUEST_TRANSACTION,payload:e},[4,(0,a.sendMessageToContentScript)(n)];case 2:return t=o.sent(),[3,4];case 3:return r=o.sent(),console.error(r),[3,4];case 4:if(u=t.status,s=t.error)throw s;return[2,u]}}))}))}},626:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.MSG_RESPONSE=t.MSG_REQUEST=t.REQUEST_TRANSACTION=t.REQUEST_TRANSACTION_STATUS=t.REQUEST_CONNECTION=t.REQUEST_NETWORK=t.GEM_WALLET=void 0,t.GEM_WALLET="gem-wallet",t.REQUEST_NETWORK="REQUEST_NETWORK",t.REQUEST_CONNECTION="REQUEST_CONNECTION",t.REQUEST_TRANSACTION_STATUS="REQUEST_TRANSACTION_STATUS",t.REQUEST_TRANSACTION="REQUEST_TRANSACTION",t.MSG_REQUEST="GEM_WALLET_MSG_REQUEST",t.MSG_RESPONSE="GEM_WALLET_MSG_RESPONSE"}},t={};return function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r].call(i.exports,i,i.exports,n),i.exports}(607)})()}));