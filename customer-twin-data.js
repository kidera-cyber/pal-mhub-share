/* ============================================================
   Customer Twin デモデータ基盤 v1（window.CTWDB / pal_mhub_twin_v1_db）
   全データは架空（DEMO）。シード乱数で整合性・再現性を担保。リレーション付き。
   実データ・実顧客情報・実売上は一切含みません。
   ============================================================ */
window.CTWDB=(function(){
"use strict";
var KEY='pal_mhub_twin_v1_db';var SCHEMA=3;
/* mulberry32 seeded RNG */
function rng(seed){var a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
function pick(r,arr){return arr[Math.floor(r()*arr.length)];}
function ri(r,a,b){return Math.floor(r()*(b-a+1))+a;}
function round(n,u){u=u||1;return Math.round(n/u)*u;}
function id(p,n){return p+'-'+String(n).padStart(3,'0');}
var FAMILY=['佐藤','鈴木','高橋','田中','渡辺','伊藤','山本','中村','小林','加藤','吉田','山田','佐々木','松本','井上','木村','林','清水','山崎','森'];
var GIVEN_M=['健一','大輔','浩二','誠','拓也','直樹','隆','和也','翔','徹','聡','豊','剛','学','淳'];
var GIVEN_F=['美咲','彩','久美','恵','由美','愛','綾','香織','真由','舞'];
function pname(r){var g=r()<0.72?GIVEN_M:GIVEN_F;return pick(r,FAMILY)+' '+pick(r,g);}

/* --- 12 仮想企業（仕様準拠） --- */
var COMPANY_SEED=[
 ['DEMO-01','食品物流モデル','食品製造・物流','発荷主',180,2,'人手不足・仕分け','加工食品(常温)'],
 ['DEMO-02','広域3PLモデル','3PL','3PL',320,3,'多拠点管理','日用品・化粧品'],
 ['DEMO-03','ECフルフィルメントモデル','EC物流','倉庫事業者',95,4,'繁閑差・出荷品質','EC・通販'],
 ['DEMO-04','日用品メーカー物流モデル','発荷主','発荷主',450,3,'物流コスト','日用品・化粧品'],
 ['DEMO-05','冷凍冷蔵倉庫モデル','倉庫事業者','倉庫事業者',65,2,'温度管理・人員不足','チルド・冷凍食品'],
 ['DEMO-06','小売物流子会社モデル','物流子会社','物流子会社',210,3,'店舗配送・荷待ち','日用品・化粧品'],
 ['DEMO-07','自動車部品物流モデル','製造業','発荷主',280,4,'JIT・データ連携','自動車・部品'],
 ['DEMO-08','飲料メーカー物流モデル','発荷主','発荷主',520,3,'積載率・配送効率','飲料・酒類'],
 ['DEMO-09','医薬品物流モデル','医薬品物流','3PL',140,4,'品質・トレーサビリティ','医薬品・医療機器'],
 ['DEMO-10','地域運送モデル','中小運送','実運送の事業者',28,1,'運賃・人手不足','建材・住宅設備'],
 ['DEMO-11','アパレル物流モデル','物流事業者','3PL',110,3,'返品・波動対応','アパレル・雑貨'],
 ['DEMO-12','食品プロセスセンターモデル','食品加工','倉庫事業者',75,2,'生産性・清掃・仕分け','加工食品(常温)']
];
var ROLES=['経営者','CLO・物流責任者','センター長','購買・調達','情報システム','現場リーダー'];
var ROLE_CONCERN={'経営者':'投資回収・全体最適・経営報告','CLO・物流責任者':'拠点横断の可視化・荷待ち削減','センター長':'人員配置・工数・現場負荷','購買・調達':'価格・契約条件・他社比較','情報システム':'既存システム連携・セキュリティ','現場リーダー':'入力負担・操作性・教育'};
var ROLE_DECIS={'経営者':'決裁','CLO・物流責任者':'強い推薦','センター長':'推薦','購買・調達':'条件審査','情報システム':'拒否権(技術)','現場リーダー':'現場同意'};
var DXSTANCE=['推進','前向き','様子見','懐疑','現場前向き'];
var PRODUCTS_INTEREST=['Core Time','Core AX','Core AX-B','Core GX','Core First','DTS','物流BPO','FDE','食品清掃','Coreメイト'];
var STAGES=['未認知','認知','情報収集','課題認識','比較検討','商談','稟議','導入','継続利用'];
var SYSTEMS=['自社WMS','パッケージWMS','手配系TMS','Excel配車','基幹ERP','クラウド勤怠','なし'];
var CHANNELS=['Google広告','Microsoft広告','その他広告','LP','コラム','メルマガ','SNS','YouTube・動画','DL資料','セミナー'];
var SITE_TYPES=['通過型センター(TC)','在庫型センター(DC)','冷凍冷蔵倉庫','プロセスセンター(PC)','幹線拠点','宅配デポ'];

/* --- 商材マスター（デモ・架空価格/条件） --- */
var PRODUCTS=[
 ['Core Time','勤怠・工数の可視化','提供中'],['Core Asort','仕分け支援','提供中'],['Core AX','AGV・自動搬送','提供中'],
 ['Core AX-B','Bluetooth型仕分け支援(工事不要)','提供中'],['Core GX','GX・環境対応','提供中'],['Core First','データ活用・AI活用基盤','提供中'],
 ['DTS','輸送可視化','提供中'],['Core Vision','現場可視化','開発中'],['Core Trace','トレーサビリティ','開発中'],
 ['CoreBoard','経営ダッシュボード','構想'],['FDE','物流現場改善・導入支援','提供中'],['物流BPO','庫内運営受託','提供中'],
 ['食品清掃','食品製造向け清掃サービス','提供中'],['Coreメイト','現場支援','提供中']
].map(function(p,i){return {id:id('PRD',i+1),name:p[0],desc:p[1],phase:p[2],demoPrice:round(30+i*7,1)*10000,demo:true};});

function gen(){
 var r=rng(20261126);
 var db={schema:SCHEMA,generatedAt:new Date().toISOString(),demo:true,
  companies:[],contacts:[],sites:[],products:PRODUCTS,campaigns:[],leads:[],opportunities:[],
  projects:[],runs:[],interviews:[],discussions:[],calibrations:[],events:[],
  assumptions:{cpc:{Google広告:220,'Microsoft広告':180,'その他広告':260,SNS:120,'YouTube・動画':90},cvr:0.021,leadRate:0.62,mqlRate:0.4,dealRate:0.35,winRate:0.3,avgDeal:2800000,roiBasis:'売上ベース'}};

 /* 企業 + 担当者 + 拠点 */
 COMPANY_SEED.forEach(function(c,ci){
  var cid=c[0];var rev=c[4];var emp=round(rev*ri(r,5,9),10);var sites=Math.max(2,Math.round(rev/40));
  var logiCost=round(rev*(0.06+r()*0.05),1);var dxBudget=round(rev*(0.004+r()*0.006)*100,10)/100;
  var spent=round(dxBudget*(0.3+r()*0.5),1);var remain=round(dxBudget-spent,1);
  var stage=pick(r,STAGES.slice(1,8));
  db.companies.push({id:cid,name:c[1],demo:true,industry:c[2],gyotai:c[3],revenue:rev,employees:emp,sites:sites,
   siteTypes:[pick(r,SITE_TYPES),pick(r,SITE_TYPES)],cargo:c[7],tier:pick(r,['元請','一次下請','荷主直']),
   logiCost:logiCost,itBudget:round(dxBudget*1.4,1),dxBudget:dxBudget,budgetSpent:spent,budgetRemain:remain,
   dxLevel:c[5],systems:[pick(r,SYSTEMS),pick(r,SYSTEMS)],issue:c[6],fieldIssue:pick(r,['誤出荷','荷待ち','教育コスト','温度逸脱','積載率低下','返品処理']),
   peak:pick(r,['年末','年度末','お盆','通年']),closeMonth:pick(r,[3,12,9]),budgetMonth:pick(r,[1,2,10]),
   competitor:pick(r,['他社WMS','内製','現状維持','他社AGV']),contractRenew:ri(r,2027,2028)+'-'+String(ri(r,1,12)).padStart(2,'0'),
   stage:stage,interest:pick(r,PRODUCTS_INTEREST),updatedAt:new Date(Date.now()-ri(r,1,200)*864e5).toISOString()});
  ROLES.forEach(function(role,k){
   var cont=id('CT'+(ci+1),k+1);
   db.contacts.push({id:cont,demo:true,companyId:cid,role:role,name:pname(r),concern:ROLE_CONCERN[role],
    evalBy:ROLE_CONCERN[role].split('・')[0],decision:ROLE_DECIS[role],influence:pick(r,['高','中','低']),
    dx:pick(r,DXSTANCE),interest:pick(r,PRODUCTS_INTEREST),opinion:pick(r,['賛成','条件付き賛成','保留','反対'])});
  });
  for(var s=0;s<sites;s++){db.sites.push({id:id('ST'+(ci+1),s+1),demo:true,companyId:cid,type:pick(r,SITE_TYPES),region:pick(r,['首都圏','関西','中部','九州','東北','港湾']),scale:pick(r,['小','中','大'])});}
 });

 /* 施策（40+）＋整合ファネル */
 var nCamp=44;
 for(var i=0;i<nCamp;i++){
  var ch=pick(r,CHANNELS);var prod=pick(r,PRODUCTS).name;var co=pick(r,db.companies);
  var monthsAgo=ri(r,0,11);var date=new Date();date.setMonth(date.getMonth()-monthsAgo);
  var cost= (ch.indexOf('広告')>=0)?round(ri(r,80000,400000),1000):round(ri(r,0,120000),1000);
  var cpc=db.assumptions.cpc[ch]||200;
  var imp,sess,clicks;
  if(ch.indexOf('広告')>=0){clicks=cost>0?Math.round(cost/cpc):0;imp=clicks*ri(r,40,80);sess=Math.round(clicks*0.9);}
  else{imp=ri(r,1500,24000);clicks=Math.round(imp*(0.02+r()*0.05));sess=Math.round(clicks*0.95);}
  var cv=Math.round(sess*(db.assumptions.cvr*(0.6+r()*0.9)));var dl=Math.round(cv*(1.2+r()));var leads=Math.round(cv*db.assumptions.leadRate*(0.8+r()*0.6))+dl;
  var mql=Math.round(leads*db.assumptions.mqlRate);
  db.campaigns.push({id:id('CMP',i+1),demo:true,channel:ch,product:prod,companyId:co.id,date:date.toISOString().slice(0,10),monthsAgo:monthsAgo,
   cost:cost,imp:imp,sessions:sess,clicks:clicks,cv:cv,dl:dl,leads:leads,mql:mql});
 }
 /* リード（120）＝施策由来 */
 var nLead=124;
 for(var i=0;i<nLead;i++){var co=pick(r,db.companies);var ct=pick(r,db.contacts.filter(function(x){return x.companyId===co.id;}));var cmp=pick(r,db.campaigns);
  db.leads.push({id:id('LD',i+1),demo:true,companyId:co.id,contactId:ct?ct.id:'',source:cmp.channel,product:cmp.product,campaignId:cmp.id,
   stage:pick(r,['リード','育成中','MQL','SQL']),score:ri(r,30,92),at:cmp.date});}
 /* 商談（18）＝MQL/SQL由来・金額整合 */
 var nOpp=19;
 for(var i=0;i<nOpp;i++){var co=pick(r,db.companies);var prod=pick(r,PRODUCTS);var amt=round(db.assumptions.avgDeal*(0.6+r()*1.6),100000);
  var st=pick(r,['商談','稟議','導入','継続利用','失注']);var prob={'商談':30,'稟議':55,'導入':90,'継続利用':100,'失注':0}[st];
  db.opportunities.push({id:id('OPP',i+1),demo:true,companyId:co.id,product:prod.name,amount:amt,stage:st,probability:prob,
   at:new Date(Date.now()-ri(r,10,220)*864e5).toISOString().slice(0,10)});}
 /* 検証プロジェクト（24）＋シミュレーション履歴（30） */
 var THEMES=['Core Timeメルマガ改善','新規プロダクト提案','年末繁忙期の訴求','予算配分比較','BPO+DTSサービス開発','新規サービス需要','LP改善検証','清掃サービス需要'];
 for(var i=0;i<24;i++){var th=pick(r,THEMES);var cos=[pick(r,db.companies).id,pick(r,db.companies).id];
  db.projects.push({id:id('PRJ',i+1),demo:true,title:th,product:pick(r,PRODUCTS).name,companyIds:cos,status:pick(r,['検証中','完了','要件化','再検証待ち']),at:new Date(Date.now()-ri(r,1,180)*864e5).toISOString()});}
 for(var i=0;i<32;i++){var prj=pick(r,db.projects);
  db.runs.push({id:id('RUN',i+1),demo:true,projectId:prj.id,theme:prj.title,cat:pick(r,['PRODUCT','SERVICE','MARKETING','SALES','BUDGET','STRATEGY']),
   state:pick(r,['通常期','繁忙期(年末・物量増)','予算策定期']),count:ri(r,4,8),top:'ペルソナ'+ri(r,1,36),topScore:ri(r,62,94),at:new Date(Date.now()-ri(r,1,150)*864e5).toISOString()});}
 for(var i=0;i<52;i++){db.interviews.push({id:id('IV',i+1),demo:true,personaId:ri(r,1,36),companyId:pick(r,db.companies).id,theme:pick(r,THEMES),at:new Date(Date.now()-ri(r,1,160)*864e5).toISOString()});}
 for(var i=0;i<12;i++){db.discussions.push({id:id('DISC',i+1),demo:true,theme:pick(r,THEMES),members:ri(r,5,8),at:new Date(Date.now()-ri(r,1,140)*864e5).toISOString()});}
 for(var i=0;i<10;i++){db.calibrations.push({id:id('CAL',i+1),demo:true,target:pick(r,['価格感度','購買関心','導入障壁','課題優先度']),before:ri(r,40,80),after:ri(r,40,80),by:'PAL マーケ',at:new Date(Date.now()-ri(r,1,120)*864e5).toISOString(),version:i+1});}
 return db;
}

function loadDB(){try{var raw=localStorage.getItem(KEY);if(raw){var d=JSON.parse(raw);if(d&&d.schema===SCHEMA)return d;}}catch(e){}var db=gen();try{localStorage.setItem(KEY,JSON.stringify(db));}catch(e){}return db;}
var _db=null;
function db(){if(!_db)_db=loadDB();return _db;}
function reset(){_db=gen();try{localStorage.setItem(KEY,JSON.stringify(_db));}catch(e){}return _db;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(_db));}catch(e){}}
return {db:db,reset:reset,save:save,gen:gen,
 companies:function(){return db().companies;},contactsOf:function(cid){return db().contacts.filter(function(x){return x.companyId===cid;});},
 sitesOf:function(cid){return db().sites.filter(function(x){return x.companyId===cid;});},
 campaignsOf:function(cid){return db().campaigns.filter(function(x){return !cid||x.companyId===cid;});},
 oppsOf:function(cid){return db().opportunities.filter(function(x){return !cid||x.companyId===cid;});},
 leadsOf:function(cid){return db().leads.filter(function(x){return !cid||x.companyId===cid;});},
 products:function(){return db().products;},company:function(cid){return db().companies.filter(function(x){return x.id===cid;})[0];},
 counts:function(){var d=db();return {companies:d.companies.length,contacts:d.contacts.length,sites:d.sites.length,campaigns:d.campaigns.length,leads:d.leads.length,opps:d.opportunities.length,projects:d.projects.length,runs:d.runs.length,interviews:d.interviews.length,discussions:d.discussions.length,calibrations:d.calibrations.length,products:d.products.length};}
};
})();
