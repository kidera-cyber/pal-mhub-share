/* ============================================================
   M-HUB 統合ナビゲーション・シェル v1（window.MHUBSHELL）
   業務目的別9領域で既存M-HUB＋Customer Twinを横断。SPA維持・非破壊。
   ============================================================ */
(function(){
"use strict";
function ready(){
 if(!window.go||!window.buildNav||!window.CTW||!CTW.renderStandalone){return setTimeout(ready,60);}
 init();
}
function init(){
 var LABEL={home:'ホーム',ga4:'GA4分析',lp:'LP管理',column:'コラム管理',video:'動画管理',sns:'SNS運用',mail:'メルマガ管理',dl:'資料DL管理',lead:'リード/MQL',report:'月次レポート',adbudget:'広告予算管理',plan3y:'中長期計画',calendar:'コンテンツCal',approval:'承認',todo:'ToDo',agent:'AIエージェント',prompt:'プロンプト',settings:'設定',product:'商品別管理',
  companies:'仮想企業',personas:'仮想顧客',designmap:'設計マップ',market:'市場環境',time:'時間進行',journey:'顧客ジャーニー',simulation:'施策検証',ringi:'稟議',company:'意思決定',budget:'予算試算',strategy:'事業戦略',scenarios:'デモシナリオ',interview:'インタビュー・討議',analysis:'分析・要件定義',agents:'制作エージェント',dev:'開発連携',exec:'模擬実行',funnel:'購買ファネル',compare:'実績比較・補正',calibration:'実データ補正',audit:'整合性監査',inbox:'反映トレイ',history:'検証履歴',roadmap:'ロードマップ',data:'データ管理',present:'プレゼン',demo:'デモモード',wizard:'ペルソナ生成',companyNew:'企業作成',overview:'Twin概要'};
 var AREAS=[
  {label:'ホーム',ic:'🏠',items:['home']},
  {label:'マーケティング',ic:'📣',items:['product','lp','column','video','sns','mail','dl','calendar']},
  {label:'顧客・市場',ic:'🏢',items:['companies','personas','designmap','market','journey']},
  {label:'施策・事業検証',ic:'🧪',items:['simulation','ringi','strategy','company','scenarios']},
  {label:'顧客調査',ic:'💬',items:['interview']},
  {label:'企画・制作・開発',ic:'🛠',items:['analysis','agents','dev','approval','todo']},
  {label:'予算・投資',ic:'💰',items:['adbudget','budget','plan3y']},
  {label:'実績・学習',ic:'📈',items:['ga4','lead','report','exec','funnel','compare','history','inbox']},
  {label:'管理・設定',ic:'⚙️',items:['agent','prompt','audit','data','roadmap','settings']}
 ];
 var TWIN={};CTW.screenKeys().forEach(function(k){TWIN[k]=1;});
 function areaOf(key){for(var i=0;i<AREAS.length;i++){if(AREAS[i].items.indexOf(key)>=0)return i;}return 0;}
 var origGo=window.go;
 window.__cur=localStorage.getItem('pal_mhub_tab')||'home';
 /* ---- ナビ描画 ---- */
 window.buildNav=function(){
  var cur=window.__cur;if(cur==='twin')cur='overview';var act=areaOf(cur);
  var nav=document.getElementById('nav');if(!nav)return;
  nav.innerHTML=AREAS.map(function(a,i){return '<button class="'+(i===act?'active':'')+'" onclick="MHUBSHELL.area('+i+')"><span class="ic">'+a.ic+'</span>'+a.label+'</button>';}).join('');
 };
 function subNav(key){
  var ai=areaOf(key);var a=AREAS[ai];if(!a||a.items.length<=1)return '';
  return '<div class="mh-subnav"><span class="mh-sublabel">'+a.ic+' '+a.label+'</span>'+a.items.map(function(k){return '<button class="'+(k===key?'on':'')+'" onclick="window.go(\''+k+'\')">'+(LABEL[k]||k)+'</button>';}).join('')+'</div>';
 }
 /* ---- 統合ルータ ---- */
 window.go=function(id){
  if(id==='twin')id='overview';
  window.__cur=id;try{localStorage.setItem('pal_mhub_tab',id);}catch(e){}
  window.buildNav();
  var m=document.getElementById('main');if(!m){window.scrollTo(0,0);return;}
  if(TWIN[id]){ m.innerHTML=subNav(id)+CTW.renderStandalone(id); }
  else { try{origGo(id);}catch(e){} m=document.getElementById('main'); if(m)m.insertAdjacentHTML('afterbegin',subNav(id)); }
  window.scrollTo(0,0);
 };
 window.MHUBSHELL={area:function(i){window.go(AREAS[i].items[0]);},go:function(k){window.go(k);},areas:AREAS,twinKeys:TWIN};
 /* ---- スタイル ---- */
 var css='#nav{flex-wrap:wrap}'+
  '.mh-subnav{display:flex;flex-wrap:wrap;gap:6px;align-items:center;background:#fff;border:1px solid #e0e6ed;border-radius:12px;padding:9px 12px;margin:0 0 16px;box-shadow:0 1px 3px rgba(20,37,59,.04)}'+
  '.mh-subnav .mh-sublabel{font-size:11px;font-weight:800;color:#64768b;letter-spacing:.5px;margin-right:6px;white-space:nowrap}'+
  '.mh-subnav button{border:1px solid #e0e6ed;background:#f7f9fc;color:#2b415b;border-radius:8px;padding:6px 12px;font-size:12.5px;font-weight:700;cursor:pointer}'+
  '.mh-subnav button:hover{background:#eef2f7}'+
  '.mh-subnav button.on{background:#137e73;color:#fff;border-color:#137e73}'+'@media(max-width:980px){.mh-hgrid-4{grid-template-columns:repeat(2,1fr)!important}.mh-hgrid-5{grid-template-columns:repeat(3,1fr)!important}}'+'@media(max-width:600px){.mh-hgrid-4,.mh-hgrid-5{grid-template-columns:1fr!important}#nav button{font-size:11px}}';
 var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 /* ---- 初期再描画（旧ナビを置換） ---- */
 window.buildNav();window.go(window.__cur);
 console.log('[MHUBSHELL] 9-area nav active');
}
ready();
})();
