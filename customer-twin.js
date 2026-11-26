/* ============================================================
   Customer Twin 統合モジュール v1（名前空間 CTW / pal_mhub_twin_v1_*）
   物流業界向け動的仮想顧客・仮想企業・市場シミュレーション基盤
   既存M-HUBへ非破壊統合。全データは架空（デモ）。AI/実データ未接続。
   出典：物流業界向けペルソナ設計マップ(2026-11-25)・物流AIペルソナ・シミュレータ構想
   ============================================================ */
window.CTW=(function(){
"use strict";
var NS='pal_mhub_twin_v1_';
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function load(k,d){try{var r=localStorage.getItem(NS+k);return r?JSON.parse(r):d;}catch(e){return d;}}
function save(k,v){try{localStorage.setItem(NS+k,JSON.stringify(v));}catch(e){}}
function uid(p){return (p||'id')+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6);}
function nowISO(){return new Date().toISOString();}

/* ---------- 代表36ペルソナ（設計マップ準拠） ---------- */
/* [id,name,group,setting,dxLabel,dxClass,concern,decision(決裁関与)] */
var GROUPS=[['keie','経営・決裁','b-red'],['kanri','管理・計画','b-blue'],['hakobu','運ぶ現場','b-teal'],['konai','庫内の現場','b-purple'],['ninushi','荷主・着荷主','b-amber'],['sasaeru','支える側','b-green']];
var DXC={'推進':'b-green','前向き':'b-teal','現場前向き':'b-teal','様子見':'b-amber','懐疑':'b-amber','反発':'b-red','無関心':'b-grey','支援側':'b-blue','依存':'b-blue'};
var P=[
[1,'中小運送会社の社長（2代目）','keie','車両30台・地場貸切・加工食品・2次下請','前向き','運賃交渉、投資判断、事業承継','高'],
[2,'零細運送会社の社長兼ドライバー','keie','車両7台・建材のスポット中心','無関心','再委託制限・許可更新制への不安、廃業の判断','高'],
[3,'中堅3PLの役員','keie','車両200台と倉庫・日用品・元請','推進','特定事業者対応、荷主への提案、投資回収','高'],
[4,'メーカーのCLO','keie','飲料・取扱9万トン超の特定荷主','推進','中長期計画、荷待ち削減、販売部門との調整','高'],
[5,'物流子会社の社長','keie','親会社は家電・外販を増やしたい','様子見','親会社依存、外販、再編','高'],
[6,'倉庫会社の経営者','keie','地方港の冷凍冷蔵倉庫','前向き','電気代、老朽化、人手','高'],
[7,'運行管理者','kanri','中小・生鮮の長距離幹線','懐疑','労働時間の管理、点呼、中継輸送','中'],
[8,'ベテランの配車担当','kanri','中堅・鉄鋼の貸切と協力会社手配','反発','配車の属人化、AI配車への不信、引き継ぎ','中'],
[9,'若手の配車担当','kanri','3PL・日用品の共同配送','推進','電話とFAXの負担、協力会社探し、求荷求車','中'],
[10,'センター長','kanri','小売の通過型センター・チルド','前向き','バース予約、荷待ち、パートの確保','中'],
[11,'現場リーダー','kanri','EC向け出荷センター・派遣とスポット','現場前向き','波動対応、教育、誤出荷、WMSの使い勝手','中'],
[12,'安全・品質管理の担当','kanri','化学品のタンクローリー輸送','推進','事故防止、ドラレコ活用、教育記録','中'],
[13,'人事・労務の担当','kanri','中堅運送・ドライバー採用','前向き','採用難、離職、外国人材、勤怠','中'],
[14,'経理・請求の担当','kanri','中小運送・紙の受領書','様子見','運賃計算、付帯作業料の請求、書面交付','中'],
[15,'長距離ドライバー（50代）','hakobu','大型・生鮮の幹線・車中泊','無関心','収入減、荷待ち、手積み、休息','低'],
[16,'地場ドライバー（30代）','hakobu','4tクレーン付き・建材の現場配送','様子見','現場での待機、荷降ろし','低'],
[17,'ルート配送ドライバー','hakobu','コンビニの店舗','現場前向き','納品時間、店舗での棚入れ、カゴ台車','低'],
[18,'宅配ドライバー（正社員）','hakobu','宅配大手・住宅地','現場前向き','再配達、物量の波、端末とアプリ','低'],
[19,'軽貨物の委託ドライバー','hakobu','EC宅配・個人事業主','依存','単価、稼働時間、事故と保険、契約','低'],
[20,'トレーラードライバー','hakobu','海上コンテナの陸送','懐疑','港での待機、搬出入の予約制','低'],
[21,'タンクローリードライバー','hakobu','石油・危険物の資格者','様子見','荷卸しの立会い、冬の負荷、資格','低'],
[22,'未経験から転職した女性ドライバー','hakobu','中小・地場の2t','現場前向き','働き方、設備、教育、荷役の負担','低'],
[23,'フォークリフトオペレーター','konai','飲料の在庫型センター・パレット','反発','安全、自動フォークリフト、作業負荷','低'],
[24,'パートのピッキング作業者','konai','日用品の在庫型センター','現場前向き','シフト、ハンディ端末、歩く距離','低'],
[25,'スポットワーカー','konai','EC倉庫・繁忙期だけ','無関心','初日の分かりやすさ、続けない理由','低'],
[26,'外国人の作業者（特定技能）','konai','食品センター','現場前向き','言語、マニュアル、キャリア','低'],
[27,'発荷主の物流担当','ninushi','加工食品メーカー・特定荷主','推進','出荷の波、積載率、パレット化、運賃改定','中'],
[28,'発荷主の購買・調達担当','ninushi','自動車部品・ジャストインタイム納入','様子見','値上げ要請への反応、取適法への対応','中'],
[29,'着荷主の受け入れ担当','ninushi','スーパーの物流センター','様子見','納品時間、検品、バース、改正物流特殊指定','中'],
[30,'建設現場の受け入れ担当','ninushi','建材の現場納品','無関心','搬入時間、荷降ろし、待機場所','中'],
[31,'EC事業者の運営担当','ninushi','中小EC・出荷は外部センターに委託','前向き','送料、配送品質、返品、在庫','中'],
[32,'情シス・DX推進の担当','sasaeru','中堅3PL・システムが乱立','推進','現場への定着、データ連携、ベンダー選定','中'],
[33,'営業','sasaeru','3PL・荷主開拓','推進','提案競争、価格、荷主の要求','中'],
[34,'ベンダーの導入担当','sasaeru','倉庫管理・配車システム、マテハン','支援側','導入の壁、現場の反発、投資対効果','低'],
[35,'通関士・貿易事務','sasaeru','フォワーダー・港湾地区','前向き','書類、リードタイムの変動、顧客対応','低'],
[36,'求荷求車サービスの運営担当','sasaeru','マッチング事業者','支援側','成約率、信頼、運賃相場','低']
].map(function(r){return {id:r[0],name:r[1],group:r[2],setting:r[3],dx:r[4],dxcls:DXC[r[4]]||'b-grey',concern:r[5],decision:r[6]};});
function groupName(g){var x=GROUPS.filter(function(y){return y[0]===g;})[0];return x?x[1]:g;}
function groupCls(g){var x=GROUPS.filter(function(y){return y[0]===g;})[0];return x?x[2]:'b-grey';}

/* ---------- ペルソナ設計マップ：7レイヤー・27軸・302項目 ---------- */
var INDUSTRIES=['加工食品(常温)','チルド・冷凍食品','生鮮(青果・水産・畜産)','飲料・酒類','日用品・化粧品','医薬品・医療機器','アパレル・雑貨','EC・通販','家電・精密機器','半導体・電子部品','自動車・部品','機械・重量物','建材・住宅設備','鉄鋼・金属','化学品・危険物','石油・エネルギー','紙・印刷物','農業資材・飼料・穀物','引越・家財','廃棄物・リサイクル','郵便・宅配','輸出入貨物'];
var GYOTAI=['発荷主','着荷主','物流子会社','3PL','元請の運送事業者','実運送の事業者','軽貨物の個人事業主','倉庫事業者','庫内作業の請負・人材派遣','フォワーダー・通関業者','港湾・海運・鉄道・航空貨物','求荷求車・マッチング','機器・車両・システムのベンダー','物流施設の開発・運営'];
var LAYERS=[
 {n:1,name:'荷主の業種・貨物',axes:1,items:22,sub:'何を運ぶかで温度帯・荷姿・規制・繁閑が決まる',detail:INDUSTRIES},
 {n:2,name:'業態・取引階層・規模',axes:4,items:30,sub:'同じ荷物でも立場で利害が逆になる（業態14/取引階層5/規模5/地域6）',detail:GYOTAI.concat(['【取引階層】元請/一次下請/二次下請/庫内請負/個人委託','【規模】零細/小/中堅/大手/グループ','【地域】都市圏/地方中核/港湾/工業団地/幹線沿い/山間・離島'])},
 {n:3,name:'運送',axes:7,items:61,sub:'車種・区間・勤務・積合せ・運賃・付帯作業・安全の7軸',detail:['車種・車格','輸送区間(幹線/地場/ラストマイル)','勤務パターン','積合せ・求荷求車','運賃・料金体系','荷待ち・付帯作業','安全・コンプライアンス']},
 {n:4,name:'荷役・拠点',axes:6,items:59,sub:'入荷→格納→保管→ピッキング→流通加工→出荷の庫内6軸',detail:['入荷・検品','格納','保管・在庫管理','ピッキング','流通加工','出荷・バース運用']},
 {n:5,name:'DX',axes:4,items:61,sub:'システム・自動化・データ・導入体制の4軸（WMS/TMS/配車/AGV/RFID等）',detail:['基幹システム(WMS/TMS/配車)','自動化(AGV・AMR/自動倉庫/仕分け)','データ・連携(EDI/API/可視化)','導入体制・成熟度']},
 {n:6,name:'人',axes:4,items:52,sub:'職種・雇用形態・採用育成・就業環境の4軸',detail:['職種(ドライバー/庫内5職種/管理/営業/情シス)','雇用形態(正社員/パート/派遣/スポット/委託)','採用・育成・定着','就業環境・多様性(女性/外国人/高齢)']},
 {n:7,name:'外部環境・経営課題',axes:1,items:17,sub:'制度・市況・経営を貫く環境（2024年問題/標準的運賃/取適法等）',detail:['2024年問題(時間外960h)','標準的運賃制度','物流総合効率化法','改正物流特殊指定','燃料・電気代','人手不足・採用難','荷主との取引適正化','カーボンニュートラル']}
];

/* ---------- 市場環境シナリオ ---------- */
var MARKET_STATES=['通常期','繁忙期(年末・物量増)','閑散期','予算策定期','決算前','法改正対応期','人手不足の深刻化'];
/* 状態→課題優先テーマの重み（例示ルール） */
var STATE_FOCUS={
 '通常期':{'コスト':2,'現場負荷':2,'投資':1,'連携':2,'制度':1},
 '繁忙期(年末・物量増)':{'現場負荷':4,'人手':4,'コスト':1,'投資':0,'連携':2},
 '閑散期':{'コスト':3,'投資':2,'連携':2,'現場負荷':1,'制度':1},
 '予算策定期':{'投資':4,'コスト':3,'制度':2,'連携':1,'現場負荷':1},
 '決算前':{'コスト':4,'投資':1,'現場負荷':1,'連携':1,'制度':2},
 '法改正対応期':{'制度':4,'投資':2,'連携':2,'現場負荷':2,'コスト':1},
 '人手不足の深刻化':{'人手':4,'現場負荷':3,'投資':2,'コスト':1,'連携':1}
};

/* ---------- 検証カテゴリ / 訴求軸 ---------- */
var CATEGORIES=[['PRODUCT','プロダクト開発','b-teal'],['SERVICE','サービス開発','b-blue'],['MARKETING','マーケティング','b-amber'],['SALES','営業','b-green'],['BUDGET','予算・戦略','b-purple']];
var ANGLES=['勤怠・工数管理','人員配置・現場改善','費用対効果・人件費','システム連携','法対応・コンプライアンス','導入の手軽さ(工事不要)'];
/* 訴求軸→刺さりやすいDX姿勢/決裁関与の相性（例示） */
var ANGLE_FIT={
 '勤怠・工数管理':{dx:['前向き','推進'],role:['中','高']},
 '人員配置・現場改善':{dx:['現場前向き','前向き'],role:['中','低']},
 '費用対効果・人件費':{dx:['様子見','推進'],role:['高','中']},
 'システム連携':{dx:['支援側','推進'],role:['中']},
 '法対応・コンプライアンス':{dx:['推進','様子見'],role:['高','中']},
 '導入の手軽さ(工事不要)':{dx:['現場前向き','様子見','無関心'],role:['低','中']}
};

/* ---------- 調査プリセット（シミュレータ構想 5-7p 準拠） ---------- */
var PRESETS=[
 {key:'A',cat:'PRODUCT',title:'商材開発：Core AX（Bluetooth）',personas:[6,10,11,24,32],angle:'導入の手軽さ(工事不要)',brief:'配線・Wi-Fi不要の仕分け支援。工事不要が導入の決め手になるか、現場の操作性、稟議が止まる理由、既存の紙・端末から切り替える理由を確認する。'},
 {key:'B',cat:'SERVICE',title:'サービス開発：BPO運営＋DTS',personas:[4,27,28,5,29],angle:'費用対効果・人件費',brief:'庫内運営の受託と輸送の可視化を組み合わせた提案。委託する範囲、自社に残す業務、切替時の不安、社内の反対意見、価格以外の判断基準を確認する。'},
 {key:'C',cat:'MARKETING',title:'マーケ：特定荷主向け訴求',personas:[4,27,28,10],angle:'法対応・コンプライアンス',brief:'法対応・コスト改善・現場負担軽減の3訴求を比較し、読まれる理由と問い合わせ条件を確認する。'},
 {key:'D',cat:'MARKETING',title:'Core Time：訴求軸の比較',personas:[4,10,13,32],angle:'勤怠・工数管理',brief:'勤怠・労働時間管理／工数可視化／人員配置・現場改善／人件費・費用対効果／既存システム連携の訴求を比較する。'}
];

/* ---------- サブナビ ---------- */
var SUBNAV=[['overview','Overview'],['personas','仮想顧客'],['designmap','ペルソナ設計マップ'],['company','仮想企業'],['market','市場環境'],['simulation','シミュレーション'],['interview','インタビュー・討議'],['analysis','分析・要件定義'],['dev','開発・制作連携'],['calibration','実データ補正'],['history','検証履歴'],['roadmap','ロードマップ']];
var cur='overview';

/* ---------- 共通UI ---------- */
function demoNote(t){return '<div class="ct-notice">'+esc(t)+'</div>';}
function badge(t,c){return '<span class="ct-badge '+(c||'b-grey')+'">'+esc(t)+'</span>';}
function card(inner,cls){return '<div class="ct-card '+(cls||'')+'">'+inner+'</div>';}

/* ============ Overview ============ */
function vOverview(){
 var reg=load('personas_registered',[]);var comp=load('companies',[]);var runs=load('runs',[]);var reqs=load('requirements',[]);
 var cyc='<svg viewBox="0 0 360 240" aria-label="Customer Twin 循環構造"><g fill="none" stroke="#6ed8ca" stroke-width="1.6"><circle cx="180" cy="120" r="92" stroke-dasharray="4 7"/></g>'+
  [['実顧客・市場',180,22],['M-HUB蓄積',300,70],['仮想顧客・企業',300,170],['施策を検証',180,218],['討議・分析',60,170],['開発・実行',60,70]].map(function(s,i){return '<g><circle cx="'+s[1]+'" cy="'+s[2]+'" r="26" fill="#183b50" stroke="#79d4c6"/><text x="'+s[1]+'" y="'+(s[2]+3)+'" fill="#d7f7f1" font-size="8.5" text-anchor="middle">'+s[0]+'</text></g>';}).join('')+
  '<g fill="#245975" text-anchor="middle"><circle cx="180" cy="120" r="40" fill="#13463f" stroke="#6ed8ca"/><text x="180" y="116" fill="#d7f7f1" font-size="11" font-weight="bold">CUSTOMER</text><text x="180" y="130" fill="#d7f7f1" font-size="11" font-weight="bold">TWIN</text></g></svg>';
 var hero='<div class="ct-hero"><div><div class="ct-eyebrow">CUSTOMER & MARKET TWIN / PHASE 1</div><h1>顧客を知るから、<br>顧客の変化を試すへ。</h1><p>物流業界特化の動的仮想顧客・仮想企業・市場シミュレーション。施策を実行する前に、立場の違う顧客の反応と組織の意思決定を検証する。</p><button class="ct-btn" style="background:#82dfce;color:#123b39" onclick="CTW.go(\'simulation\')">シミュレーションを試す →</button></div>'+cyc+'</div>';
 function stat(n,l,s){return card('<div class="ct-lab">'+l+'</div><div class="ct-num">'+n+'</div>'+(s?'<div class="ct-lab">'+s+'</div>':''));}
 var fixed='<div class="ct-sech">設計基盤（固定値）</div><div class="ct-grid g4">'+
  stat('36','代表ペルソナ','設計マップ準拠')+stat('7','設計レイヤー','27軸・302項目')+stat('133','設計上の立場','組合せの母数')+stat('6','ペルソナ分類','経営〜支える側')+'</div>';
 var live='<div class="ct-sech">登録・稼働状況（実数）</div><div class="ct-grid g4">'+
  stat(reg.length,'登録済み仮想顧客','36体から追加')+stat(comp.length,'登録済み仮想企業','意思決定検証用')+stat(runs.length,'検証プロジェクト','シミュレーション実行')+stat(reqs.length,'要件定義書','分析から生成')+'</div>';
 var qa='<div class="ct-sech">クイックアクション</div><div class="ct-grid g3">'+
  [['新規シミュレーション','simulation'],['仮想顧客ライブラリ','personas'],['1on1・グループ討議','interview'],['仮想企業で稟議検証','company'],['要件定義書を作成','analysis'],['市場環境を変える','market']].map(function(a){return '<button class="ct-btn sec" style="text-align:left;padding:14px" onclick="CTW.go(\''+a[1]+'\')">→ '+a[0]+'</button>';}).join('')+'</div>';
 var flow='<div class="ct-sech">意思決定を変える5ステップ</div><div class="ct-flow">'+
  [['可視化','何が起きたか / GA4・CV'],['分析','なぜ起きたか / 商談・失注'],['シミュレーション','次に何が起こり得るか'],['仮説検証','施策・製品・予算を比較'],['継続学習','実績との差で補正']].map(function(s,i){return card('<div style="color:#137e73;font-weight:800;font-size:12px">0'+(i+1)+'</div><h3 style="font-size:13px">'+s[0]+'</h3><div class="ct-lab">'+s[1]+'</div>');}).join('<div class="ar">→</div>')+'</div>';
 var link='<div class="ct-sech">既存M-HUBとの連携</div>'+card('<p class="ct-muted" style="margin-top:0">各管理画面の「仮想顧客で検証」から、対象商材・記事・施策を引き継いでシミュレーションできます（取得できない情報は推測で補完しません）。</p><div>'+['商品別→需要仮説','LP→構成・CTA評価','コラム→検索意図評価','メルマガ→件名・配信時期','資料DL→不足情報','広告予算→配分シナリオ','中長期計画→市場機会'].map(function(x){return '<span class="ct-tag">'+x+'</span>';}).join('')+'</div>');
 return hero+fixed+live+qa+flow+link+demoNote('本画面は構想を体験するためのデモです。表示する反応・スコアは例示ルールによる架空の結果で、AI予測や実績ではありません。');
}

/* ============ 仮想顧客ライブラリ ============ */
var pFilter={group:'all',dx:'all',decision:'all',kw:''};
function vPersonas(){
 var reg=load('personas_registered',[]);
 var ctrl='<div class="ct-card"><div class="ct-grid g4">'+
  '<div><label class="ct-field">分類</label><select onchange="CTW.setPF(\'group\',this.value)"><option value="all">すべて</option>'+GROUPS.map(function(g){return '<option value="'+g[0]+'"'+(pFilter.group===g[0]?' selected':'')+'>'+g[1]+'</option>';}).join('')+'</select></div>'+
  '<div><label class="ct-field">DXへの姿勢</label><select onchange="CTW.setPF(\'dx\',this.value)"><option value="all">すべて</option>'+Object.keys(DXC).map(function(d){return '<option'+(pFilter.dx===d?' selected':'')+'>'+d+'</option>';}).join('')+'</select></div>'+
  '<div><label class="ct-field">決裁関与</label><select onchange="CTW.setPF(\'decision\',this.value)"><option value="all">すべて</option><option'+(pFilter.decision==='高'?' selected':'')+'>高</option><option'+(pFilter.decision==='中'?' selected':'')+'>中</option><option'+(pFilter.decision==='低'?' selected':'')+'>低</option></select></div>'+
  '<div><label class="ct-field">検索（職種・業態）</label><input type="text" value="'+esc(pFilter.kw)+'" oninput="CTW.setPF(\'kw\',this.value)" placeholder="例：センター長 / 3PL"></div>'+
  '</div></div>';
 var list=P.filter(function(p){
  if(pFilter.group!=='all'&&p.group!==pFilter.group)return false;
  if(pFilter.dx!=='all'&&p.dx!==pFilter.dx)return false;
  if(pFilter.decision!=='all'&&p.decision!==pFilter.decision)return false;
  if(pFilter.kw){var s=(p.name+p.setting+p.concern+groupName(p.group)).toLowerCase();if(s.indexOf(pFilter.kw.toLowerCase())<0)return false;}
  return true;
 });
 var cards='<div class="ct-grid g2">'+list.map(function(p){
  var isReg=reg.indexOf(p.id)>=0;
  return card('<div class="ct-persona"><div class="ct-av">'+String(p.id).padStart(2,'0')+'</div><div style="min-width:0"><h3 style="margin:0">'+esc(p.name)+'</h3><div>'+badge(groupName(p.group),groupCls(p.group))+' '+badge(p.dx,p.dxcls)+' <span class="ct-badge b-grey">決裁'+p.decision+'</span></div></div></div>'+
   '<div class="ct-lab" style="margin:8px 0 2px">職場の前提</div><div style="font-size:12.5px">'+esc(p.setting)+'</div>'+
   '<div class="ct-lab" style="margin:8px 0 2px">主要課題（聞けること）</div><div style="font-size:12.5px">'+esc(p.concern)+'</div>'+
   '<div style="margin-top:11px;display:flex;gap:7px"><button class="ct-btn sm" onclick="CTW.persona('+p.id+')">詳細を見る</button><button class="ct-btn sm sec" onclick="CTW.verifyPersona('+p.id+')">この顧客で検証</button>'+
   '<button class="ct-btn sm '+(isReg?'':'sec')+'" style="margin-left:auto" onclick="CTW.togReg('+p.id+')">'+(isReg?'✓ 登録済':'＋ 登録')+'</button></div>');
 }).join('')+'</div>';
 return '<div class="ct-sech">仮想顧客ライブラリ <span class="ct-muted" style="font-size:12px;font-weight:400">代表36体（'+list.length+'件表示 / 登録'+reg.length+'体）</span></div>'+ctrl+cards+
  '<div class="ct-sech">動的顧客を構成する5層</div><div class="ct-grid g2">'+
  [['BASE PROFILE','基本属性・物流業界特性'],['DYNAMIC STATE','経営状況・予算・繁忙期・課題の緊急性'],['DECISION MODEL','決裁権・判断基準・導入障壁・リスク許容度'],['CUSTOMER MEMORY','施策接触・資料DL・商談・導入経験・検証履歴'],['DATA CALIBRATION','出典・実データ照合・モデル更新・未検証の仮説']].map(function(x){return card('<h3>'+x[0]+'</h3><div class="ct-muted" style="font-size:12.5px">'+x[1]+'</div>');}).join('')+'</div>';
}
/* ペルソナ詳細ドロワー（5タブ） */
var drwTab='base';
function personaDrawer(id){
 var p=P.filter(function(x){return x.id===id;})[0];if(!p)return;
 var reg=load('personas_registered',[]);var isReg=reg.indexOf(id)>=0;
 var tabs=[['base','BASE PROFILE'],['state','DYNAMIC STATE'],['decision','DECISION MODEL'],['memory','CUSTOMER MEMORY'],['calib','DATA CALIBRATION']];
 var body={
  base:'<div class="ct-lab">分類</div><p>'+badge(groupName(p.group),groupCls(p.group))+'</p><div class="ct-lab">職場の前提（業態・業種・規模）</div><p>'+esc(p.setting)+'</p><div class="ct-lab">DXへの姿勢</div><p>'+badge(p.dx,p.dxcls)+'</p><div class="ct-lab">設計マップ上の位置</div><p class="ct-muted">レイヤー2(業態)×レイヤー6(職種)で特定。レイヤー1(業種)・5(DX)の前提が紐づく。</p>',
  state:'<div class="ct-lab">主要課題（現在）</div><p>'+esc(p.concern)+'</p><div class="ct-lab">顧客状態による変化（例示）</div><p class="ct-muted">市場環境シナリオで「繁忙期／予算策定期／法改正対応期」を切り替えると、この顧客の課題優先度と導入判断が変化します。</p><p>'+MARKET_STATES.map(function(m){return '<span class="ct-tag">'+m+'</span>';}).join('')+'</p>',
  decision:'<div class="ct-lab">決裁への関与</div><p>'+badge('関与度 '+p.decision,'b-blue')+'</p><div class="ct-lab">判断基準・導入障壁（例示）</div><p class="ct-muted">'+(p.decision==='高'?'投資回収・全体最適・経営報告への接続を重視。':p.decision==='中'?'現場負荷と既存運用との整合、部門間調整を重視。':'操作性・初日からの使いやすさ・自分の負担増の有無を重視。')+'</p>',
  memory:'<div class="ct-lab">施策接触・商談・導入経験（検証履歴に蓄積）</div><p class="ct-muted">このペルソナを含む検証を実行すると、下に履歴が蓄積されます（検証履歴タブ参照）。実顧客の行動履歴は実データ補正で接続予定。</p>',
  calib:'<div class="ct-lab">情報の出典</div><p>物流業界向けペルソナ設計マップ(2026-11-25) p.11-15</p><div class="ct-lab">実データとの照合状況</div><p>'+badge('未検証','b-amber')+'</p><div class="ct-lab">未検証の仮説</div><p class="ct-muted">価格感度・実際の決裁フロー・既存システム依存度は実顧客インタビューで確認が必要。</p>'
 };
 return '<div style="display:flex;justify-content:space-between;align-items:flex-start"><div><div class="ct-eyebrow">PERSONA #'+String(p.id).padStart(2,'0')+'</div><h2 style="margin:4px 0">'+esc(p.name)+'</h2></div><button class="ct-btn sec sm" onclick="CTW.closeDrawer()">閉じる ✕</button></div>'+
  '<div class="ct-tabs">'+tabs.map(function(t){return '<button class="'+(drwTab===t[0]?'on':'')+'" onclick="CTW.drwTab(\''+t[0]+'\','+id+')">'+t[1]+'</button>';}).join('')+'</div>'+
  '<div class="ct-card">'+body[drwTab]+'</div>'+
  '<div style="margin-top:14px;display:flex;gap:8px"><button class="ct-btn" onclick="CTW.verifyPersona('+id+')">この顧客で検証 →</button><button class="ct-btn '+(isReg?'sec':'')+'" onclick="CTW.togReg('+id+');CTW.persona('+id+')">'+(isReg?'✓ 登録済（解除）':'＋ ライブラリに登録')+'</button></div>';
}

/* ============ ペルソナ設計マップ ============ */
function vDesignmap(){
 var totAxes=LAYERS.reduce(function(a,l){return a+l.axes;},0),totItems=LAYERS.reduce(function(a,l){return a+l.items;},0);
 var head='<div class="ct-sech">ペルソナ設計マップ <span class="ct-muted" style="font-size:12px;font-weight:400">7レイヤー・'+totAxes+'軸・'+totItems+'項目（この分類は本設計資料独自の整理）</span></div>';
 var bars=card('<h3>レイヤー別の項目数</h3>'+LAYERS.map(function(l){var w=Math.round(l.items/61*100);return '<div class="ct-metric"><span>L'+l.n+' '+esc(l.name)+'</span><span>'+l.axes+'軸 / '+l.items+'項目</span></div><div class="ct-bar"><i style="width:'+w+'%"></i></div>';}).join(''));
 var acc=LAYERS.map(function(l){return '<details class="ct-acc"'+(l.n===1?' open':'')+'><summary>レイヤー'+l.n+'　'+esc(l.name)+' <span class="ct-muted" style="font-weight:400;font-size:12px">'+l.axes+'軸・'+l.items+'項目</span></summary><div class="ct-acc-b"><p class="ct-muted" style="margin-top:0">'+esc(l.sub)+'</p><div>'+l.detail.map(function(d){return '<span class="ct-tag">'+esc(d)+'</span>';}).join('')+'</div></div></details>';}).join('');
 /* 業態×職種マトリクス（代表例） */
 var roleGroups=GROUPS.map(function(g){return g[1];});
 var mtx='<div class="ct-sech">業態 × 職種グループ マトリクス（代表ペルソナの分布）</div><div class="ct-tblwrap">'+
  '<table class="ct-tbl"><thead><tr><th>職種グループ</th><th>該当ペルソナ数</th><th>代表例</th></tr></thead><tbody>'+
  GROUPS.map(function(g){var ps=P.filter(function(p){return p.group===g[0];});return '<tr><td>'+badge(g[1],g[2])+'</td><td>'+ps.length+'体</td><td class="ct-muted">'+ps.slice(0,3).map(function(p){return esc(p.name);}).join(' / ')+' …</td></tr>';}).join('')+'</tbody></table></div>';
 /* DX姿勢マップ */
 var dxMap='<div class="ct-sech">DX導入姿勢の分布</div><div class="ct-grid g3">'+Object.keys(DXC).map(function(d){var c=P.filter(function(p){return p.dx===d;}).length;return card('<div>'+badge(d,DXC[d])+'</div><div class="ct-num" style="font-size:22px">'+c+'<small>体</small></div>');}).join('')+'</div>';
 return head+bars+'<div class="ct-sech">7レイヤーの選択項目</div>'+acc+mtx+dxMap+
  demoNote('上記の分類・項目数は添付設計資料独自の整理であり、業界標準の分類ではありません。標準組合せは推奨初期値として扱い、現実の例外を許容します。');
}

/* ============ 仮想企業・意思決定 ============ */
var corpState='通常期';
function vCompany(){
 var roles=[['経営者','高',corpState==='予算策定期'?'条件付き賛成':'保留','費用対効果と予算の裏付け','b-amber'],
  ['CLO・物流責任者','高','賛成','工数把握と全体最適','b-green'],
  ['センター長','中',corpState==='繁忙期(年末・物量増)'?'保留':'賛成','導入作業と現場の負荷','b-green'],
  ['購買・調達担当','中','保留','価格・契約・他社比較','b-amber'],
  ['情報システム担当','中','保留','データ連携と安全性','b-amber'],
  ['現場作業者','低',corpState==='繁忙期(年末・物量増)'?'反対':'条件付き賛成','入力負担と操作性',corpState==='繁忙期(年末・物量増)'?'b-red':'b-amber']];
 var verdict=corpState==='繁忙期(年末・物量増)'?'導入時期の再検討':corpState==='予算策定期'?'来期予算への計上を検討':'追加情報を待って判断';
 var committee='<div class="ct-grid g3">'+roles.map(function(r){return card('<div style="float:right">'+badge(r[2],r[4])+'</div><h3 style="margin:0">'+r[0]+'</h3><div class="ct-lab">決裁影響度 '+r[1]+'</div><div style="font-size:12.5px;margin-top:6px">'+r[3]+'</div>');}).join('')+'</div>';
 var block=roles.filter(function(r){return r[2]==='保留'||r[2]==='反対';}).length;
 return '<div class="ct-sech">仮想企業・意思決定会議 <span class="ct-muted" style="font-size:12px;font-weight:400">BtoB購買を個人の関心から組織の合意形成へ</span></div>'+
  card('<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px"><h3 style="margin:0">架空企業A｜食品物流センター（中堅3PL）</h3>'+badge('仮想企業','b-teal')+'</div>'+
   '<label class="ct-field">経営状況</label><select onchange="CTW.setCorp(this.value)" style="max-width:280px">'+['通常期','繁忙期(年末・物量増)','予算策定期','決算前'].map(function(m){return '<option'+(corpState===m?' selected':'')+'>'+m+'</option>';}).join('')+'</select>'+
   '<div style="background:#eaf4f2;border:1px solid #b9ddd5;border-radius:10px;padding:16px;margin:14px 0;text-align:center"><div class="ct-lab">導入検討会議 / Core Time</div><div style="font-size:21px;font-weight:800;color:#0f6b61">'+verdict+'</div><div class="ct-lab">合意を止めている関与者：'+block+'名</div></div>'+committee)+
  '<div class="ct-sech">合意形成に必要な情報</div>'+card('<p class="ct-muted" style="margin-top:0">投資回収の根拠、既存システム連携、現場負荷、契約条件を整理。'+(corpState==='繁忙期(年末・物量増)'?'繁忙期後に検証するシナリオを比較。':'小規模な導入検証から始める仮説。')+'</p><p>'+['投資回収根拠','既存システム連携','現場負荷の軽減策','契約・価格条件'].map(function(x){return '<span class="ct-tag">'+x+'</span>';}).join('')+'</p>')+
  demoNote('各担当者の賛否・判断理由は役割に応じた例示ルールによる想定です。単純な多数決では判定せず、決裁影響度の高い関与者の懸念を可視化します。');
}

/* ============ 市場環境シミュレーター ============ */
var mktState='繁忙期(年末・物量増)';
function vMarket(){
 var f=STATE_FOCUS[mktState]||{};
 var themes=[['コスト','物流コスト・運賃'],['現場負荷','庫内・輸送の現場負荷'],['人手','採用・人手不足'],['投資','DX投資・予算'],['連携','システム連携'],['制度','法改正・制度対応']];
 var ranked=themes.map(function(t){return {name:t[1],key:t[0],w:(f[t[0]]!=null?f[t[0]]:1)};}).sort(function(a,b){return b.w-a.w;});
 var tl='<div class="ct-flow">'+MARKET_STATES.map(function(m){return card('<div class="ct-lab">'+(m===mktState?'● 選択中':'')+'</div><div style="font-size:12.5px;font-weight:700">'+esc(m)+'</div>',m===mktState?'':'');}).join('')+'</div>';
 var pri=card('<h3>顧客課題の優先順位（'+esc(mktState)+'）</h3>'+ranked.map(function(r){var w=Math.round(r.w/4*100);return '<div class="ct-metric"><span>'+esc(r.name)+'</span><span>重要度 '+r.w+'/4</span></div><div class="ct-bar"><i style="width:'+Math.max(w,6)+'%;background:'+(r.w>=4?'#b3331f':r.w>=3?'#b96a12':'#137e73')+'"></i></div>';}).join(''));
 /* 業種別 課題ヒートマップ（例示） */
 var inds=['加工食品','EC・通販','自動車部品','建材','化学品'];var cols=['コスト','現場負荷','人手','投資','制度'];
 var heat='<div class="ct-sech">業種別 課題ヒートマップ（'+esc(mktState)+'・例示）</div>'+card('<div class="ct-heat" style="grid-template-columns:120px repeat('+cols.length+',1fr)"><div></div>'+cols.map(function(c){return '<div class="ct-lab" style="text-align:center">'+c+'</div>';}).join('')+
  inds.map(function(ind,ri){return '<div style="font-size:12px;font-weight:700;align-self:center">'+ind+'</div>'+cols.map(function(c,ci){var v=((f[c]||1)+((ri+ci)%3))%5;var col=['#dcf2ee','#a9e2d7','#6bc9b6','#2f9f8a','#137e73'][Math.min(4,v)];return '<div class="hc" style="background:'+col+'">'+(v+1)+'</div>';}).join('');}).join('')+'</div>');
 return '<div class="ct-sech">動的市場環境シミュレーター <span class="ct-muted" style="font-size:12px;font-weight:400">時間・外部環境で顧客ニーズと意思決定が変化する</span></div>'+
  card('<label class="ct-field">市場環境シナリオ</label><select onchange="CTW.setMkt(this.value)" style="max-width:320px">'+MARKET_STATES.map(function(m){return '<option'+(mktState===m?' selected':'')+'>'+m+'</option>';}).join('')+'</select><p class="ct-muted" style="margin-bottom:0">同じ顧客でも、通常期と繁忙期では課題の優先順位や導入判断が変わります。</p>')+
  '<div class="ct-sech">市場環境のタイムライン</div>'+tl+'<div class="ct-sech">課題優先順位の変化</div>'+pri+heat+
  demoNote('法制度は出典・対象・適用時期・最終確認日を管理する前提です。予測精度を検証するまでは、シナリオ上の変化として表示します。');
}

/* ============ シミュレーションスタジオ ============ */
var sim={cat:'PRODUCT',angle:ANGLES[0],state:'通常期',personas:[6,10,11,24],plans:['A案','B案','C案'],theme:'Core Time',copy:'物流現場の勤怠・工数を可視化し、管理業務の改善を支援。'};
function vSimulation(){
 var catCards='<div class="ct-grid g3" style="margin-bottom:6px">'+CATEGORIES.map(function(c){return '<button class="ct-btn '+(sim.cat===c[0]?'':'sec')+'" style="text-align:left" onclick="CTW.setSim(\'cat\',\''+c[0]+'\')">'+badge(c[0],c[2])+'<div style="margin-top:4px">'+c[1]+'</div></button>';}).join('')+'</div>';
 var checks=P.map(function(p){return '<label class="ct-chip"><input type="checkbox" value="'+p.id+'" '+(sim.personas.indexOf(p.id)>=0?'checked':'')+' onchange="CTW.simTog('+p.id+')"><span class="ct-tag">'+String(p.id).padStart(2,'0')+'</span>'+esc(p.name)+' '+badge(p.dx,p.dxcls)+'</label>';}).join('');
 var left=card('<h3>検証条件</h3>'+catCards+
  '<label class="ct-field">検証テーマ / 対象商材</label><input type="text" value="'+esc(sim.theme)+'" oninput="CTW.setSim(\'theme\',this.value)">'+
  '<label class="ct-field">訴求軸</label><select onchange="CTW.setSim(\'angle\',this.value)">'+ANGLES.map(function(a){return '<option'+(sim.angle===a?' selected':'')+'>'+a+'</option>';}).join('')+'</select>'+
  '<label class="ct-field">顧客の状況（市場環境）</label><select onchange="CTW.setSim(\'state\',this.value)">'+MARKET_STATES.map(function(m){return '<option'+(sim.state===m?' selected':'')+'>'+m+'</option>';}).join('')+'</select>'+
  '<label class="ct-field">施策内容（メモ・意味解析はしません）</label><textarea oninput="CTW.setSim(\'copy\',this.value)">'+esc(sim.copy)+'</textarea>'+
  '<label class="ct-field">対象ペルソナ（'+sim.personas.length+'体）</label><div style="max-height:220px;overflow:auto;border:1px solid #e0e6ed;border-radius:8px;padding:8px">'+checks+'</div>'+
  '<button class="ct-btn" style="width:100%;margin-top:12px" onclick="CTW.runSim()">デモシミュレーション実行 →</button>');
 var presetBtns=card('<h3>調査プリセット</h3><p class="ct-muted" style="margin-top:0;font-size:12.5px">構想資料の検証例をワンクリックで。</p>'+PRESETS.map(function(pr){return '<button class="ct-btn sec sm" style="display:block;width:100%;text-align:left;margin:6px 0" onclick="CTW.loadPreset(\''+pr.key+'\')">プリセット'+pr.key+'：'+esc(pr.title)+'</button>';}).join(''));
 var out=load('lastRun',null);
 var right='<div id="ctwSimOut">'+(out?renderRun(out):card('<h3>反応プレビュー '+badge('架空データ','b-amber')+'</h3><p class="ct-muted">条件を設定して「実行」すると、ペルソナ別の関心指数（例示）とA/B/C比較が表示されます。</p>'))+'</div>';
 return '<div class="ct-sech">シミュレーションスタジオ <span class="ct-muted" style="font-size:12px;font-weight:400">同じ施策でも、立場と状況が変われば反応は変わる</span></div>'+
  '<div class="ct-grid g2" style="grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr)">'+left+'<div>'+presetBtns+right+'</div></div>'+
  demoNote('スコアは比較体験用の固定ルールによる関心指数であり、購入確率・CVRではありません。自由入力はメモとして表示し、意味解析は行いません。');
}
function scoreOf(p,plan){
 var base=46+((p.id*7+plan.charCodeAt(0))%14);
 var fit=ANGLE_FIT[sim.angle]||{dx:[],role:[]};
 if(fit.dx.indexOf(p.dx)>=0)base+=22;
 if(fit.role.indexOf(p.decision)>=0)base+=8;
 var f=STATE_FOCUS[sim.state]||{};
 if((sim.state.indexOf('繁忙')>=0)&&p.group==='hakobu')base-=10;
 if((sim.state.indexOf('予算')>=0)&&p.decision==='高')base+=10;
 if((sim.state.indexOf('法改正')>=0)&&sim.angle.indexOf('法対応')>=0)base+=12;
 if(p.dx==='反発'||p.dx==='無関心')base-=12;
 if(plan==='B案')base+=3;if(plan==='C案')base-=4;
 return Math.max(8,Math.min(97,Math.round(base)));
}
function runSim(){
 if(!sim.personas.length){return;}
 var rows=sim.personas.map(function(id){var p=P.filter(function(x){return x.id===id;})[0];var scores=sim.plans.map(function(pl){return scoreOf(p,pl);});return {id:id,name:p.name,p:p,scores:scores,best:Math.max.apply(null,scores)};});
 rows.sort(function(a,b){return b.best-a.best;});
 var run={id:uid('run'),at:nowISO(),cat:sim.cat,theme:sim.theme,angle:sim.angle,state:sim.state,plans:sim.plans.slice(),rows:rows,personaIds:sim.personas.slice()};
 save('lastRun',run);
 var runs=load('runs',[]);runs.unshift({id:run.id,at:run.at,cat:run.cat,theme:run.theme,angle:run.angle,state:run.state,count:rows.length,top:rows[0].name,topScore:rows[0].best});if(runs.length>50)runs=runs.slice(0,50);save('runs',runs);
 save('run_'+run.id,run);
 var el=document.getElementById('ctwSimOut');if(el)el.innerHTML=renderRun(run);
}
function reasonFor(p,up){
 if(up)return p.dx==='推進'||p.dx==='前向き'?'推進役として費用対効果と全体最適に関心。':p.dx==='現場前向き'?'現場で使う立場として操作性・負荷軽減に関心。':'条件が合えば前向き。';
 return p.dx==='反発'?'自動化・監視への不安が先に立つ。':p.dx==='無関心'?'自分の業務への直接効果が見えない。':'価格・導入負荷・既存運用との重複が懸念。';
}
function renderRun(run){
 var maxAll=97;
 var head='<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px"><h3 style="margin:0">反応プレビュー</h3>'+badge('架空データ','b-amber')+'</div><p class="ct-lab">'+esc(run.cat)+' / '+esc(run.theme)+' / '+esc(run.angle)+' / '+esc(run.state)+'</p>';
 /* A/B/C 比較表 */
 var abc='<div class="ct-tblwrap"><table class="ct-tbl"><thead><tr><th>ペルソナ</th>'+run.plans.map(function(pl){return '<th>'+esc(pl)+'</th>';}).join('')+'<th>最高案</th></tr></thead><tbody>'+
  run.rows.map(function(r){var bi=r.scores.indexOf(r.best);return '<tr><td>'+esc(r.name)+'</td>'+r.scores.map(function(s,i){return '<td'+(i===bi?' style="font-weight:800;color:#0f6b61"':'')+'>'+s+'</td>';}).join('')+'<td>'+badge(run.plans[bi],'b-teal')+'</td></tr>';}).join('')+'</tbody></table></div>';
 /* 反応カード */
 var cards=run.rows.map(function(r){var p=r.p;var bi=r.scores.indexOf(r.best);var s=r.best;return card('<div class="ct-persona"><div class="ct-av">'+String(p.id).padStart(2,'0')+'</div><div><b>'+esc(p.name)+'</b> '+badge(p.dx,p.dxcls)+'</div></div><div class="ct-metric" style="margin-top:8px"><span>関心指数（例示・最高案'+run.plans[bi]+'）</span><b>'+s+'/100</b></div><div class="ct-bar"><i style="width:'+s+'%"></i></div><div style="font-size:12px"><span class="b-green ct-badge">関心</span> '+esc(reasonFor(p,true))+'</div><div style="font-size:12px;margin-top:4px"><span class="b-red ct-badge">障壁</span> '+esc(reasonFor(p,false))+'</div><div class="ct-lab" style="margin-top:6px">追加で必要な情報：'+esc(p.concern)+'</div>');}).join('');
 var top=run.rows[0];
 var rec=card('<h3>次のアクション候補</h3><p>'+esc(top.name)+'の関心が相対的に高い想定です。<b>'+esc(run.plans[top.scores.indexOf(top.best)])+'</b>を軸に、'+esc(top.p.concern)+'を確認する仮説を立て、実際の顧客で検証してください。</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="ct-btn sm" onclick="CTW.go(\'interview\')">1on1で深掘り →</button><button class="ct-btn sm sec" onclick="CTW.go(\'analysis\')">分析・要件定義へ →</button><button class="ct-btn sm sec" onclick="CTW.go(\'history\')">検証履歴に保存済み</button></div>');
 return card(head+'<div class="ct-sech" style="margin-top:12px">A/B/C案の比較</div>'+abc)+'<div class="ct-sech">顧客別の反応</div><div class="ct-grid g2">'+cards+'</div>'+rec;
}

/* ============ インタビュー・討議 ============ */
var ivPersona=10;
function vInterview(){
 var p=P.filter(function(x){return x.id===ivPersona;})[0];
 var qs=['現在最も困っていることは何ですか。','このサービスに魅力を感じますか。','導入に踏み切れない理由は何ですか。','社内で誰の承認が必要ですか。','どのような資料があれば検討できますか。','既存サービスから切り替える条件は何ですか。'];
 var ans=function(q){var base=p.concern;if(q.indexOf('困って')>=0)return base+'が一番の悩みです。'+(sim.state&&sim.state.indexOf('繁忙')>=0?'特に今は現場を止めないことが最優先です。':'');if(q.indexOf('承認')>=0)return p.decision==='高'?'私の判断で進められますが、投資回収の根拠は社内に示す必要があります。':p.decision==='中'?'経営者と、現場のセンター長の納得が要ります。':'上長と情シスの確認が必要です。';if(q.indexOf('資料')>=0)return '導入前後の数値と、既存システムとの連携方法が分かる資料が欲しいです。';if(q.indexOf('切り替え')>=0)return '現場の負担が増えないこと、初日から使えることが条件です。';if(q.indexOf('魅力')>=0)return (p.dx==='推進'||p.dx==='前向き')?'方向性には共感します。あとは費用対効果次第です。':'正直まだ様子見です。現場が本当に楽になるかを見たいです。';return '導入に踏み切るには'+base+'の解消が見える必要があります。';};
 var prof=card('<div class="ct-persona"><div class="ct-av">'+String(p.id).padStart(2,'0')+'</div><div><h3 style="margin:0">'+esc(p.name)+'</h3><div>'+badge(groupName(p.group),groupCls(p.group))+' '+badge(p.dx,p.dxcls)+'</div></div></div><div class="ct-lab" style="margin-top:10px">職場の前提</div><div style="font-size:12.5px">'+esc(p.setting)+'</div><div class="ct-lab" style="margin-top:8px">主要課題</div><div style="font-size:12.5px">'+esc(p.concern)+'</div><label class="ct-field">対象を変更</label><select onchange="CTW.setIv(this.value)">'+P.map(function(x){return '<option value="'+x.id+'"'+(x.id===ivPersona?' selected':'')+'>'+String(x.id).padStart(2,'0')+' '+esc(x.name)+'</option>';}).join('')+'</select>');
 var chat=card('<div style="display:flex;justify-content:space-between;align-items:center"><h3 style="margin:0">1on1 インタビュー</h3>'+badge('サンプル回答','b-amber')+'</div>'+qs.map(function(q){return '<div class="ct-chat"><b>質問</b>：'+esc(q)+'</div><div class="ct-chat" style="background:#eaf4f2"><b>'+esc(p.name)+'</b>：'+esc(ans(q))+'</div>';}).join('')+'<p class="ct-lab">※AI未接続のため、観点に基づくサンプル回答を表示しています。自由入力への生成応答は未実装です。</p>');
 /* グループ討議 */
 var disc=load('lastRun',null);
 var members=disc?disc.personaIds.slice(0,6):[4,10,11,28,32];
 var discHtml='<div class="ct-sech">グループ討議（マルチエージェント想定）</div>'+card('<p class="ct-muted" style="margin-top:0">司会AIが立場の違いを深掘りする想定。推奨は立場がぶつかる6〜8体。</p><div class="ct-chat"><b>司会AI（模擬）</b>：導入効果と現場負担の両立について、何を先に確認すべきでしょうか。</div>'+members.map(function(id){var mp=P.filter(function(x){return x.id===id;})[0];if(!mp)return '';return '<div class="ct-chat"><b>'+esc(mp.name)+'</b>（'+esc(mp.dx)+'）：'+esc(mp.concern)+'を先に確認したいです。</div>';}).join('')+'<div class="ct-notice">論点：導入効果・現場負荷・連携・価格の優先順位を、実顧客に確認する。</div><button class="ct-btn sec sm" onclick="CTW.go(\'analysis\')">討議を分析・要件へ →</button>');
 return '<div class="ct-sech">インタビュー・討議</div><div class="ct-grid g2" style="grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr)">'+prof+chat+'</div>'+discHtml;
}

/* ============ 分析・要件定義 ============ */
function vAnalysis(){
 var run=load('lastRun',null);
 var reqText=buildRequirement(run);
 var insight=run?card('<h3>示唆と根拠</h3><p>対象 '+esc(run.theme)+'（'+esc(run.angle)+'）に対し、'+esc(run.rows[0].name)+'の関心が相対的に高い想定。</p><div class="ct-lab">意見が分かれた点</div><p class="ct-muted">'+run.rows.slice(0,4).map(function(r){return esc(r.name)+'：'+r.best+'点';}).join(' / ')+'</p><div class="ct-lab">実在顧客で確かめる点</div><p class="ct-muted">価格・契約・実機操作・投資効果。模擬発言は実証根拠ではありません。</p>'):card('<p class="ct-muted">先にシミュレーションを実行すると、その結果から分析と要件案が生成されます。</p><button class="ct-btn sm" onclick="CTW.go(\'simulation\')">シミュレーションへ →</button>');
 var reqCard=card('<div style="display:flex;justify-content:space-between;align-items:center"><h3 style="margin:0">要件定義書（10項目）</h3><div><button class="ct-btn sm sec" onclick="CTW.exportReq(\'md\')">Markdown保存</button> <button class="ct-btn sm sec" onclick="CTW.exportReq(\'json\')">JSON保存</button></div></div>'+
  '<textarea id="ctwReq" style="min-height:300px;font-family:monospace;font-size:12px">'+esc(reqText)+'</textarea>'+
  '<button class="ct-btn sm" style="margin-top:8px" onclick="CTW.saveReq()">この要件書を保存（検証履歴へ）</button>');
 var saved=load('requirements',[]);
 var savedList=saved.length?card('<h3>保存済み要件書（'+saved.length+'）</h3>'+saved.map(function(r){return '<div class="ct-metric"><span>'+esc(r.title)+'</span><span class="ct-lab">'+esc((r.at||'').slice(0,10))+'</span></div>';}).join('')):'';
 return '<div class="ct-sech">分析・要件定義</div><div class="ct-grid g2">'+insight+reqCard+'</div>'+savedList+
  demoNote('要件定義書は開発・制作エージェントへそのまま渡せる構成（Markdown/JSON）。架空の回答に基づく仮説であり、実在顧客での検証事項を明記します。');
}
function buildRequirement(run){
 var L=[];
 L.push('# 要件定義書：'+(run?run.theme:'(テーマ未設定)'));
 L.push('版: v1 / 生成: '+nowISO().slice(0,16).replace('T',' '));
 L.push('データ種別: デモ（架空ペルソナによる仮説・AI未接続）');
 L.push('');
 L.push('## 1. 概要');L.push(run?(run.cat+'カテゴリ。訴求軸「'+run.angle+'」、市場環境「'+run.state+'」で検証。'):'シミュレーション未実行。');
 L.push('## 2. 利用者・利用場面');L.push(run?run.rows.map(function(r){return r.name;}).join('、'):'(未設定)');
 L.push('## 3. 解決する課題');L.push(run?run.rows.slice(0,3).map(function(r){return r.p.concern;}).join(' / '):'導入判断に必要な情報の不足');
 L.push('## 4. 主要機能／制作要件');L.push('導入条件・運用負荷・費用対効果を説明できること。既存システム連携方式の明示。');
 L.push('## 5. 成功基準');L.push('対象者が導入条件を理解し、実顧客で確認すべき論点が明確になること。');
 L.push('## 6. 対象外');L.push('未検証の効果保証、実在顧客の個人情報を含む処理。');
 L.push('## 7. 制約・前提');L.push('架空ペルソナによる仮説。スコアは関心指数（例示）でCVR・受注率ではない。');
 L.push('## 8. 優先度');L.push('高（仮）');
 L.push('## 9. 受け入れ条件');L.push('実顧客インタビューで価格・契約・実機操作・投資効果を確認できること。');
 L.push('## 10. 未決事項');L.push('実際の価格、連携仕様、契約条件、決裁フロー。');
 if(run){L.push('');L.push('## 参考（シミュレーション結果・例示）');run.rows.forEach(function(r){L.push('- '+r.name+'：最高 '+r.best+'/100');});}
 return L.join('\n');
}

/* ============ 開発・制作連携 ============ */
function vDev(){
 var gate=load('devGate',0);var version=load('devVersion',1);
 var steps=['要件定義・設計','実装・制作','テスト','試作・修正版'];
 var gates='<div class="ct-grid g4">'+steps.map(function(s,i){return card('<div>'+badge(i<gate?'承認済（デモ）':i===gate?'確認待ち':'未着手',i<gate?'b-green':i===gate?'b-amber':'b-grey')+'</div><h3 style="margin:6px 0 0;font-size:14px">'+s+'</h3>');}).join('')+'</div>';
 var flow='<div class="ct-flow">'+['検証結果','改善要件','人による承認','開発・制作エージェント','設計','実装・制作','テスト','試作・修正版','仮想顧客で再検証','最終承認','実施策へ反映'].map(function(s){return card('<div style="font-size:11.5px;font-weight:700">'+s+'</div>');}).join('<div class="ar">→</div>')+'</div>';
 return '<div class="ct-sech">開発・制作エージェント連携</div>'+
  card('<p class="ct-muted" style="margin-top:0">「聞く」と「作る」を一つの流れに。要件書と実行用プロンプトの生成、承認ステータス管理、ファイル受け渡しまでを対象（実際の外部エージェント実行は接続後）。</p>'+gates+'<p class="ct-lab" style="margin-top:10px">Version '+version+' / '+gate+' of 4 approvals</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="ct-btn sm" onclick="CTW.advGate()">現在の工程を承認（デモ）</button><button class="ct-btn sm sec" onclick="CTW.retest()">修正版を再検証</button><button class="ct-btn sm sec" onclick="CTW.go(\'analysis\')">要件書を確認</button></div>')+
  '<div class="ct-sech">連携フロー</div>'+flow+
  card('<h3>既存M-HUBとの連携</h3><p>'+['AIエージェント管理','プロンプト管理','ToDo','承認ワークフロー'].map(function(x){return '<span class="ct-tag">'+x+'</span>';}).join('')+'</p><p class="ct-muted" style="font-size:12.5px">改善提案のタスク化は確認画面を経て既存ToDoへ登録する想定。</p>')+
  demoNote('各工程は人が確認・承認します。実際の開発・テストや外部エージェント実行は未実装です（AI/権限の接続後に対応）。');
}

/* ============ 実データ補正 ============ */
function vCalibration(){
 var sources=[['M-HUB / GA4','アクセス・行動・CV','接続予定'],['SFA / 商談','課題・反論・検討段階','接続予定'],['受注・失注','決裁条件・選定理由','接続予定'],['顧客インタビュー','現場の声・導入障壁','手動入力'],['市場・外部環境','季節性・制度・経営状況','接続予定'],['施策ログ','接触履歴・配信条件','接続予定']];
 var src='<div class="ct-grid g3">'+sources.map(function(s){return card('<h3 style="font-size:14px">'+s[0]+'</h3><div class="ct-lab">'+s[1]+'</div><div style="margin-top:6px">'+badge(s[2],s[2]==='手動入力'?'b-blue':'b-amber')+'</div>');}).join('')+'</div>';
 var loop='<div class="ct-flow">'+[['仮想顧客で検証','施策実行前の仮説'],['リアルで実行','配信・公開・営業'],['実績取得','CV・商談・受注'],['モデル補正','差分と原因を検討']].map(function(s){return card('<h3 style="font-size:13px;margin:0">'+s[0]+'</h3><div class="ct-lab">'+s[1]+'</div>');}).join('<div class="ar">→</div>')+'</div>';
 var cmp=[['センター長',78,62],['経営者',65,55],['人事・労務',70,75]];
 var compare=card('<h3>予測と実績の比較イメージ</h3><p class="ct-lab">架空の関心指数と実測アンケート指数の例（同一尺度に正規化した想定）</p>'+cmp.map(function(c){var judge=Math.abs(c[1]-c[2])<=8?['一致','b-green']:c[1]>c[2]?['過大','b-amber']:['過小','b-amber'];return '<div style="margin:10px 0"><b>'+c[0]+'</b> '+badge(judge[0],judge[1])+'<div class="ct-metric"><span>仮想</span><span>'+c[1]+'</span></div><div class="ct-bar"><i style="width:'+c[1]+'%"></i></div><div class="ct-metric"><span>実測（架空）</span><span>'+c[2]+'</span></div><div class="ct-bar"><i style="width:'+c[2]+'%;background:#7d91ae"></i></div></div>';}).join(''));
 return '<div class="ct-sech">実データによる補正</div>'+
  card('<p class="ct-muted" style="margin-top:0">仮想顧客の反応と実際の行動を比較して、モデルの妥当性を検証する。</p>')+
  '<div class="ct-sech">接続を想定するデータソース</div>'+src+
  '<div class="ct-sech">補正ループ</div>'+loop+
  '<div class="ct-sech">仮想 vs 実測</div>'+compare+
  demoNote('実装時は匿名化・アクセス制御・利用目的の管理・検証用データの分離・偏りの検証が必要。実データ接続・自動学習・外部AI送信は未実装。公開環境に実顧客の機密データは掲載しません。');
}

/* ============ 検証履歴 ============ */
function vHistory(){
 var runs=load('runs',[]);var reqs=load('requirements',[]);
 var rtbl=runs.length?'<div class="ct-tblwrap"><table class="ct-tbl"><thead><tr><th>日時</th><th>カテゴリ</th><th>テーマ</th><th>訴求</th><th>市場環境</th><th>対象</th><th>最高反応</th><th></th></tr></thead><tbody>'+
  runs.map(function(r){return '<tr><td class="ct-lab">'+esc((r.at||'').slice(0,16).replace('T',' '))+'</td><td>'+badge(r.cat,'b-teal')+'</td><td>'+esc(r.theme)+'</td><td class="ct-lab">'+esc(r.angle)+'</td><td class="ct-lab">'+esc(r.state)+'</td><td>'+r.count+'体</td><td>'+esc(r.top)+' '+r.topScore+'</td><td><button class="ct-btn sm sec" onclick="CTW.openRun(\''+r.id+'\')">開く</button></td></tr>';}).join('')+'</tbody></table></div>':'<p class="ct-muted">まだ検証履歴がありません。シミュレーションを実行すると蓄積されます。</p>';
 var reqList=reqs.length?card('<h3>保存済み要件書（'+reqs.length+'）</h3>'+reqs.map(function(r){return '<div class="ct-metric"><span>'+esc(r.title)+'</span><span class="ct-lab">'+esc((r.at||'').slice(0,10))+'</span></div>';}).join('')):'';
 return '<div class="ct-sech">検証履歴 <span class="ct-muted" style="font-size:12px;font-weight:400">'+runs.length+'件（ブラウザに保存）</span></div>'+
  card(rtbl)+(runs.length?'<div style="margin-top:10px"><button class="ct-btn sec sm" onclick="CTW.clearRuns()">履歴をクリア</button></div>':'')+reqList;
}

/* ============ ロードマップ ============ */
function vRoadmap(){
 var cmp=[['顧客属性','固定','状況に応じ更新'],['顧客課題','作成時の仮説','市場・経営環境で変化'],['購買意欲','固定想定','時期・予算・課題で変化'],['意思決定','担当者単位','複数部門の関係性'],['施策評価','公開後','公開前にも仮説検証'],['データ','調査時点','実データで補正'],['活用範囲','マーケ','戦略・事業開発・営業・マーケ']];
 var phases=[['Phase 1','統合型UIプロトタイプ','36ペルソナ・設計マップ・市場環境・仮想企業・A/B/C比較・討議・要件定義・検証履歴・既存連携','実装中(本画面)','b-teal'],
  ['Phase 2','AI接続','ペルソナ生成・自由質問応答・マルチエージェント討議・資料解析・要件生成','構想','b-grey'],
  ['Phase 3','実データ連携','M-HUB/GA4/SFA/受注失注/インタビューでモデル補正','構想','b-grey'],
  ['Phase 4','開発・制作連携','LP/メルマガ/コラム/資料/試作の制作と再シミュレーション','構想','b-grey'],
  ['Phase 5','予測・意思決定支援','市場変化・購買行動・予算配分シナリオ・予測精度評価','構想','b-grey']];
 var pc='<div class="ct-grid g2">'+phases.map(function(p){return card('<div style="display:flex;justify-content:space-between"><b>'+p[0]+'</b>'+badge(p[3],p[4])+'</div><h3 style="margin:6px 0 4px;font-size:14px">'+p[1]+'</h3><div class="ct-muted" style="font-size:12.5px">'+p[2]+'</div>');}).join('')+'</div>';
 var tbl=card('<h3>従来のペルソナとの違い</h3><div class="ct-tblwrap"><table class="ct-tbl"><thead><tr><th>項目</th><th>従来</th><th>動的仮想顧客</th></tr></thead><tbody>'+cmp.map(function(r){return '<tr><td>'+esc(r[0])+'</td><td class="ct-muted">'+esc(r[1])+'</td><td>'+esc(r[2])+'</td></tr>';}).join('')+'</tbody></table></div>');
 var roadmap='<div class="ct-grid g3">'+[['小規模モデル','6〜8体を作成。Core Time・Coreシリーズを対象に設計。','PHASE 01'],['施策事前評価','LP・メルマガ・資料を評価し、実際の反応と比較。','PHASE 02'],['補正と拡張','検証結果を蓄積し、仮想企業・製品・予算へ拡張。','PHASE 03']].map(function(x){return card('<div class="ct-eyebrow" style="color:#137e73">'+x[2]+'</div><h3 style="font-size:14px;margin:4px 0">'+x[0]+'</h3><div class="ct-muted" style="font-size:12.5px">'+x[1]+'</div>');}).join('')+'</div>';
 return '<div class="ct-sech">構想・導入ロードマップ</div>'+tbl+'<div class="ct-sech">段階的な実装計画</div>'+pc+'<div class="ct-sech">初期PoCの進め方</div>'+roadmap+
  card('<h3>構想のゴール</h3><p>物流現場・顧客・商談で得た知見を蓄積し、プロダクト・サービス・マーケ・営業・戦略室が共通の顧客仮説で検証する。仮想顧客は実顧客の代替ではなく、実行前に仮説を絞り込む仕組み。予算・売上予測は実績と比較検証できるまで参考シナリオとして扱う。</p>')+
  demoNote('将来フェーズは構想です。未実装機能を稼働中のように表示しません。本番公開ブランチへのマージは承認後に行います。');
}

/* ---------- ルーティング ---------- */
var VIEWS={overview:vOverview,personas:vPersonas,designmap:vDesignmap,company:vCompany,market:vMarket,simulation:vSimulation,interview:vInterview,analysis:vAnalysis,dev:vDev,calibration:vCalibration,history:vHistory,roadmap:vRoadmap};
function renderCurrent(){
 var subnav='<div class="ct-subnav">'+SUBNAV.map(function(s){return '<button class="'+(cur===s[0]?'on':'')+'" onclick="CTW.go(\''+s[0]+'\')">'+s[1]+'</button>';}).join('')+'</div>';
 var body=(VIEWS[cur]||vOverview)();
 return subnav+'<div id="ctwMain">'+body+'</div><div class="ct-drawer-bg" onclick="CTW.closeDrawer()"></div><div class="ct-drawer" id="ctwDrawer"></div>';
}
function shell(){
 return '<div class="section-title" style="font-size:16px">🧪 Customer Twin <span class="ct-demo-ribbon">コンセプト試作・架空データ</span></div><div id="ctwRoot">'+renderCurrent()+'</div>';
}
function rerenderMain(){var el=document.getElementById('ctwMain');if(el){el.innerHTML=(VIEWS[cur]||vOverview)();}else{var r=document.getElementById('ctwRoot');if(r)r.innerHTML=renderCurrent();}
 /* update subnav active */
 var btns=document.querySelectorAll('#ctwRoot .ct-subnav button');btns.forEach&&btns.forEach(function(b){});}
function go(sub){cur=sub;var r=document.getElementById('ctwRoot');if(r){r.innerHTML=renderCurrent();}try{window.scrollTo(0,0);}catch(e){}}

/* ---------- 公開API（既存M-HUBから呼ぶ / 本モジュール内onclick） ---------- */
return {
 shell:shell, renderCurrent:renderCurrent,
 go:go,
 setPF:function(k,v){pFilter[k]=v;rerenderMain();},
 persona:function(id){drwTab='base';var d=document.getElementById('ctwDrawer');if(d){d.innerHTML=personaDrawer(id);document.getElementById('ctwRoot').classList.add('ct-open');}},
 drwTab:function(t,id){drwTab=t;var d=document.getElementById('ctwDrawer');if(d)d.innerHTML=personaDrawer(id);},
 closeDrawer:function(){var r=document.getElementById('ctwRoot');if(r)r.classList.remove('ct-open');},
 togReg:function(id){var reg=load('personas_registered',[]);var i=reg.indexOf(id);if(i>=0)reg.splice(i,1);else reg.push(id);save('personas_registered',reg);rerenderMain();},
 verifyPersona:function(id){sim.personas=[id];cur='simulation';go('simulation');},
 setCorp:function(v){corpState=v;rerenderMain();},
 setMkt:function(v){mktState=v;rerenderMain();},
 setSim:function(k,v){sim[k]=v;},
 simTog:function(id){var i=sim.personas.indexOf(id);if(i>=0)sim.personas.splice(i,1);else sim.personas.push(id);},
 runSim:runSim,
 loadPreset:function(key){var pr=PRESETS.filter(function(x){return x.key===key;})[0];if(!pr)return;sim.cat=pr.cat;sim.angle=pr.angle;sim.personas=pr.personas.slice();sim.theme=pr.title.split('：').pop();sim.copy=pr.brief;rerenderMain();},
 setIv:function(v){ivPersona=+v;rerenderMain();},
 saveReq:function(){var run=load('lastRun',null);var ta=document.getElementById('ctwReq');var reqs=load('requirements',[]);reqs.unshift({id:uid('req'),at:nowISO(),title:(run?run.theme:'要件書')+' v1',body:ta?ta.value:''});if(reqs.length>50)reqs=reqs.slice(0,50);save('requirements',reqs);rerenderMain();},
 exportReq:function(fmt){var ta=document.getElementById('ctwReq');var run=load('lastRun',null);var txt,ext,mime;if(fmt==='json'){txt=JSON.stringify({theme:run?run.theme:'',at:nowISO(),dataType:'demo',requirement:ta?ta.value:''},null,2);ext='json';mime='application/json';}else{txt=ta?ta.value:'';ext='md';mime='text/markdown';}var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:mime+';charset=utf-8'}));a.download='customer-twin-requirements.'+ext;a.click();setTimeout(function(){URL.revokeObjectURL(a.href);},1000);},
 advGate:function(){var reqs=load('requirements',[]);var g=load('devGate',0);g=Math.min(4,g+1);save('devGate',g);rerenderMain();},
 retest:function(){if(load('devGate',0)!==4){rerenderMain();return;}save('devVersion',load('devVersion',1)+1);save('devGate',0);rerenderMain();},
 openRun:function(id){var run=load('run_'+id,null);if(run){save('lastRun',run);cur='simulation';go('simulation');}},
 clearRuns:function(){save('runs',[]);rerenderMain();},
 /* 既存画面からの引き継ぎ：{theme,angle,cat} */
 homeBanner:function(){return '<div class="card" style="border-left:4px solid #137e73;background:linear-gradient(135deg,#f3fbf9,#ffffff)"><div class="card-b" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px"><div><div style="font-size:11px;letter-spacing:1.5px;font-weight:800;color:#137e73">NEW / CUSTOMER & MARKET TWIN</div><div style="font-weight:800;color:#14253b;font-size:15px">施策を実行する前に、仮想顧客の反応を試す</div><div style="font-size:12px;color:#64768b">物流36ペルソナ・仮想企業・市場シミュレーション（コンセプト試作・架空データ）</div></div><button onclick="go(\'twin\')" style="border:0;background:#137e73;color:#fff;border-radius:8px;padding:10px 16px;font-weight:700;cursor:pointer">Customer Twin を開く →</button></div></div>';},
 verifyFrom:function(ctx){ctx=ctx||{};if(ctx.theme)sim.theme=ctx.theme;if(ctx.angle)sim.angle=ctx.angle;if(ctx.cat)sim.cat=ctx.cat;if(typeof go==='function'){if(window.go)window.go('twin');}cur='simulation';setTimeout(function(){var r=document.getElementById('ctwRoot');if(r)r.innerHTML=renderCurrent();},30);}
};
})();
