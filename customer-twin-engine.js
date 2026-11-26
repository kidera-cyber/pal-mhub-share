/* ============================================================
   Customer Twin ENGINE 拡張 v1（CTW.extend 経由 / window.CTWENG）
   ペルソナ生成ウィザード／企業作成／時間進行／顧客ジャーニー／
   模擬マーケ実行／整合性監査。全データ架空(DEMO)・サイクル接続。
   ============================================================ */
(function(){
"use strict";
if(!window.CTW||!window.CTW.extend||!window.CTWDB){console.warn('[CTWENG] 依存未検出');return;}
var H=CTW._helpers;var esc=H.esc,badge=H.badge,card=H.card,load=H.load,save=H.save,uid=H.uid,nowISO=H.nowISO;
var DB=window.CTWDB;
function rerun(){var el=document.getElementById('ctwMain');if(el&&window.__ctwView)el.innerHTML=window.__ctwView();}
function screen(fn){return function(){window.__ctwView=fn;return fn();};}

/* ============ ペルソナ生成ウィザード ============ */
var wz={step:1,data:{companyId:'',industry:'加工食品(常温)',gyotai:'発荷主',tier:'元請',scale:'中堅',region:'首都圏',
 mode:'幹線',sect:'幹線',yaku:'パレット',cargo:'ケース',temp:'常温',siteType:'通過型センター(TC)',process:'ピッキング',
 name:'',role:'センター長',title:'課長',exp:'10年',employ:'正社員',value:'現場重視',decision:'中',
 dxLv:2,dxStance:'前向き',systems:'パッケージWMS',dxIssue:'データ連携',pastDx:'部分導入',
 concern:'人員配置・工数',severity:4,buy:3,price:3,risk:3,timing:'来期',budget:'中',cond:'現場負荷の軽減'}};
var WZ_OPT={industry:['加工食品(常温)','チルド・冷凍食品','EC・通販','飲料・酒類','日用品・化粧品','医薬品・医療機器','自動車・部品','建材・住宅設備','アパレル・雑貨'],
 gyotai:['発荷主','着荷主','3PL','物流子会社','倉庫事業者','実運送の事業者'],tier:['元請','一次下請','荷主直'],scale:['零細','小','中堅','大手','グループ'],region:['首都圏','関西','中部','九州','東北','港湾'],
 mode:['幹線','地場','ラストマイル','海上コンテナ'],yaku:['パレット','ケース','ピース','バラ'],temp:['常温','チルド','冷凍','定温'],siteType:['通過型センター(TC)','在庫型センター(DC)','冷凍冷蔵倉庫','プロセスセンター(PC)'],process:['入荷・検品','格納','保管','ピッキング','流通加工','出荷'],
 role:['経営者','CLO・物流責任者','センター長','購買・調達','情報システム','現場リーダー','人事・労務'],employ:['正社員','パート','派遣','委託'],value:['現場重視','数値重視','安全重視','コスト重視'],decision:['高','中','低'],
 dxStance:['推進','前向き','様子見','懐疑','反発','現場前向き'],systems:['自社WMS','パッケージWMS','手配系TMS','Excel配車','基幹ERP','なし'],timing:['今期','来期','再来期','未定'],budget:['大','中','小','なし']};
function wzSel(k,label,opts){return '<div><label class="ct-field">'+label+'</label><select onchange="CTWENG.wz(\''+k+'\',this.value)">'+(opts||WZ_OPT[k]).map(function(o){return '<option'+(String(wz.data[k])===String(o)?' selected':'')+'>'+esc(o)+'</option>';}).join('')+'</select></div>';}
function wzNum(k,label,min,max){return '<div><label class="ct-field">'+label+'（'+wz.data[k]+'）</label><input type="range" min="'+min+'" max="'+max+'" value="'+wz.data[k]+'" style="width:100%" oninput="CTWENG.wz(\''+k+'\',+this.value)"></div>';}
function vWizard(){
 var cos=DB.companies();
 var steps=['企業・業種','物流特性','人物特性','DX特性','動的状態','生成・登録'];
 var nav='<div class="ct-flow" style="flex-wrap:wrap">'+steps.map(function(s,i){return '<div class="ct-card" style="min-width:96px;padding:9px;'+(wz.step===i+1?'border:2px solid #137e73;background:#f3fbf9':'')+'"><div class="ct-lab">STEP '+(i+1)+(i+1<wz.step?' ✓':'')+'</div><div style="font-size:12px;font-weight:700">'+s+'</div></div>';}).join('')+'</div>';
 var body='';
 if(wz.step===1)body='<div class="ct-grid g3"><div><label class="ct-field">既存企業に所属（任意）</label><select onchange="CTWENG.wz(\'companyId\',this.value)"><option value="">新規・未所属</option>'+cos.map(function(c){return '<option value="'+c.id+'"'+(wz.data.companyId===c.id?' selected':'')+'>'+esc(c.id)+' '+esc(c.name)+'</option>';}).join('')+'</select></div>'+wzSel('industry','荷主の業種')+wzSel('gyotai','業態')+wzSel('tier','取引階層')+wzSel('scale','規模')+wzSel('region','地域')+'</div>';
 else if(wz.step===2)body='<div class="ct-grid g3">'+wzSel('mode','輸送モード')+wzSel('yaku','荷姿')+wzSel('temp','温度帯')+wzSel('siteType','拠点タイプ')+wzSel('process','庫内工程')+'</div>';
 else if(wz.step===3)body='<div class="ct-grid g3"><div><label class="ct-field">担当者名（架空）</label><input type="text" value="'+esc(wz.data.name)+'" placeholder="自動生成可" oninput="CTWENG.wz(\'name\',this.value)"></div>'+wzSel('role','職種・役職')+wzSel('employ','雇用形態')+wzSel('value','価値観')+wzSel('decision','決裁への関与')+'<div><label class="ct-field">経験</label><input type="text" value="'+esc(wz.data.exp)+'" oninput="CTWENG.wz(\'exp\',this.value)"></div></div>';
 else if(wz.step===4)body='<div class="ct-grid g3">'+wzNum('dxLv','DX成熟度(1-5)',1,5)+wzSel('dxStance','DX導入姿勢')+wzSel('systems','利用中システム')+'<div><label class="ct-field">デジタル化の課題</label><input type="text" value="'+esc(wz.data.dxIssue)+'" oninput="CTWENG.wz(\'dxIssue\',this.value)"></div><div><label class="ct-field">過去の導入経験</label><input type="text" value="'+esc(wz.data.pastDx)+'" oninput="CTWENG.wz(\'pastDx\',this.value)"></div></div>';
 else if(wz.step===5)body='<div class="ct-grid g3"><div><label class="ct-field">現在の課題</label><input type="text" value="'+esc(wz.data.concern)+'" oninput="CTWENG.wz(\'concern\',this.value)"></div>'+wzNum('severity','課題の深刻度',1,5)+wzNum('buy','購買意欲',1,5)+wzNum('price','価格感度',1,5)+wzNum('risk','リスク許容度',1,5)+wzSel('timing','導入時期')+wzSel('budget','予算')+'<div><label class="ct-field">意思決定条件</label><input type="text" value="'+esc(wz.data.cond)+'" oninput="CTWENG.wz(\'cond\',this.value)"></div></div>';
 else if(wz.step===6){
  var warn=checkCombo();
  var preview=buildPersonaPreview();
  body='<div class="ct-grid g2"><div class="ct-card"><h3>生成プレビュー</h3><div class="ct-persona"><div class="ct-av">★</div><div><b>'+esc(preview.name)+'</b><div>'+badge(preview.groupName,'b-teal')+' '+badge(preview.dx,H.DXC[preview.dx]||'b-grey')+' '+badge('決裁'+preview.decision,'b-grey')+'</div></div></div>'+
   '<div class="ct-lab" style="margin-top:8px">所属</div><div style="font-size:12.5px">'+esc(preview.setting)+'</div>'+
   '<div class="ct-lab" style="margin-top:6px">主要課題</div><div style="font-size:12.5px">'+esc(preview.concern)+'</div>'+
   '<div class="ct-lab" style="margin-top:6px">動的状態</div><div style="font-size:12px">深刻度'+wz.data.severity+' / 購買意欲'+wz.data.buy+' / 価格感度'+wz.data.price+' / 導入'+esc(wz.data.timing)+'</div></div>'+
   '<div>'+(warn?'<div class="ct-notice"><b>組合せ警告：</b>'+esc(warn)+'<br><label class="ct-field">例外登録の理由（入力すると登録可）</label><input type="text" id="wzReason" placeholder="例外を許容する理由"></div>':'<div class="ct-card"><p class="ct-muted">標準的な組合せです。そのまま登録できます。</p></div>')+
   '<button class="ct-btn" style="width:100%;margin-top:10px" onclick="CTWENG.wzGenerate()">仮想顧客を生成・登録 →</button></div></div>';
 }
 var btns='<div style="display:flex;gap:8px;margin-top:14px">'+(wz.step>1?'<button class="ct-btn sec sm" onclick="CTWENG.wzStep('+(wz.step-1)+')">← 戻る</button>':'')+(wz.step<6?'<button class="ct-btn sm" style="margin-left:auto" onclick="CTWENG.wzStep('+(wz.step+1)+')">次へ →</button>':'')+'</div>';
 var vcs=DB.virtualCustomers();
 var reg=vcs.length?'<div class="ct-sech">生成済み仮想顧客（'+vcs.length+'）</div><div class="ct-grid g3">'+vcs.slice(0,9).map(function(v){return card('<div class="ct-persona"><div class="ct-av">★</div><div><b>'+esc(v.name)+'</b><div>'+badge(v.dx,H.DXC[v.dx]||'b-grey')+'</div></div></div><div class="ct-lab" style="margin-top:6px">'+esc(v.concern)+'</div><div style="margin-top:8px;display:flex;gap:6px"><button class="ct-btn sm sec" onclick="CTWENG.journeyOf(\''+v.id+'\')">ジャーニー</button><button class="ct-btn sm sec" onclick="CTWENG.delVC(\''+v.id+'\')">削除</button></div>');}).join('')+'</div>':'';
 return '<div class="ct-sech">ペルソナ生成ウィザード <span class="ct-muted" style="font-size:12px;font-weight:400">6ステップ・ルールベース生成・72名と同構造で保存</span></div>'+nav+card(body+btns)+reg;
}
function checkCombo(){
 var d=wz.data;
 if(d.temp==='冷凍'&&d.siteType==='通過型センター(TC)')return '冷凍温度帯と通過型センターは一般的でない組合せです。';
 if(d.role==='経営者'&&d.decision==='低')return '経営者で決裁関与「低」は稀な組合せです。';
 if(d.gyotai==='発荷主'&&d.mode==='海上コンテナ'&&d.tier==='荷主直')return '発荷主×海上コンテナ×荷主直は要確認の組合せです。';
 return '';
}
function groupFromRole(role){return {'経営者':'keie','CLO・物流責任者':'keie','センター長':'kanri','購買・調達':'ninushi','情報システム':'sasaeru','現場リーダー':'hakobu','人事・労務':'kanri'}[role]||'kanri';}
function buildPersonaPreview(){var d=wz.data;var g=groupFromRole(d.role);return {name:d.name||('担当（'+d.role+'・'+d.industry.slice(0,2)+'）'),groupName:H.groupName(g),group:g,dx:d.dxStance,decision:d.decision,setting:d.industry+' / '+d.gyotai+' / '+d.scale+'（'+d.siteType+'・'+d.temp+'）',concern:d.concern};}

/* ============ 企業作成 ============ */
var coForm={name:'新規物流モデル',industry:'3PL',gyotai:'3PL',revenue:120,employees:800,sites:4,dxBudget:4,logiCost:9,closeMonth:3,peak:'年末',budgetMonth:1,issue:'多拠点管理',systems:'パッケージWMS',dxLevel:3,interest:'Core First',contractRenew:'2027-06'};
function vCompanyNew(){
 var f=coForm;
 var fld=function(k,label,type){type=type||'text';return '<div><label class="ct-field">'+label+'</label><input type="'+type+'" value="'+esc(f[k])+'" oninput="CTWENG.coForm(\''+k+'\',this.value)"></div>';};
 var sel=function(k,label,opts){return '<div><label class="ct-field">'+label+'</label><select onchange="CTWENG.coForm(\''+k+'\',this.value)">'+opts.map(function(o){return '<option'+(String(f[k])===String(o)?' selected':'')+'>'+esc(o)+'</option>';}).join('')+'</select></div>';};
 return '<div class="ct-sech">仮想企業の作成 <span class="ct-muted" style="font-size:12px;font-weight:400">業種・規模に応じ担当6名を自動生成</span></div>'+
  card('<div class="ct-grid g3">'+fld('name','企業名')+sel('industry','業種',['3PL','食品製造・物流','EC物流','発荷主','倉庫事業者','物流子会社','製造業','医薬品物流','中小運送'])+sel('gyotai','業態',['3PL','発荷主','倉庫事業者','物流子会社','実運送の事業者'])+
   fld('revenue','年商（億円）','number')+fld('employees','従業員数','number')+fld('sites','物流拠点数','number')+fld('dxBudget','年間DX予算（億円）','number')+fld('logiCost','物流コスト（億円）','number')+sel('dxLevel','DX成熟度',[1,2,3,4,5])+
   sel('closeMonth','決算月',[3,12,9,6])+fld('peak','繁忙期')+sel('budgetMonth','予算策定月',[1,2,10,11])+fld('issue','主要課題')+fld('systems','既存システム')+sel('interest','関心商材',DB.products().map(function(p){return p.name;}))+fld('contractRenew','契約更新時期')+
   '</div><button class="ct-btn" style="width:100%;margin-top:12px" onclick="CTWENG.createCo()">企業を作成（担当6名を自動生成）→</button>')+
  '<div class="ct-notice">作成した企業・担当者はダッシュボードの件数に自動反映。経営状態や予算の変化は所属担当者の判断にも影響します。全てデモ・架空。</div>';
}

/* ============ 時間進行エンジン ============ */
function vTime(){
 var clock=DB.clock();var events=DB.eventsAll();
 var realNow=new Date().toISOString().slice(0,10);
 var ctl=card('<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px"><div><div class="ct-lab">仮想市場 現在日時</div><div class="ct-num" style="font-size:26px">'+clock+'</div><div class="ct-lab">現実の日付：'+realNow+'（区別）</div></div><div>'+badge('DEMO CLOCK','b-amber')+'</div></div>'+
  '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:12px">'+[['+1日',1],['+1週',7],['+1か月',30],['+3か月',91],['+6か月',182],['+1年',365]].map(function(x){return '<button class="ct-btn sm" onclick="CTWENG.advance('+x[1]+')">'+x[0]+'</button>';}).join('')+'<button class="ct-btn sm sec" onclick="CTWENG.resetClock()">日時リセット</button></div>');
 /* イベントタイムライン */
 var recent=events.filter(function(e){return e.before&&e.after;}).slice(-12).reverse();
 var tl=recent.length?'<div class="ct-tblwrap"><table class="ct-tbl"><thead><tr><th>日付</th><th>企業</th><th>市場イベント</th><th>変化（ステージ/予算残）</th></tr></thead><tbody>'+recent.map(function(e){var co=DB.company(e.companyId);return '<tr><td class="ct-lab">'+esc(e.at)+'</td><td>'+esc(co?co.name:e.companyId)+'</td><td>'+esc(e.event)+'</td><td class="ct-lab">'+esc((e.before&&e.before.stage)||'-')+'→'+esc((e.after&&e.after.stage)||'-')+' / '+((e.before&&e.after&&e.before.remain!==e.after.remain)?('残'+e.after.remain+'億'):'—')+'</td></tr>';}).join('')+'</tbody></table></div>':'<p class="ct-muted">まだイベントがありません。時間を進めると企業ごとの繁忙期・決算・予算・契約更新イベントが発生します。</p>';
 /* 業種別ヒートマップ（現時点の課題緊急度） */
 var inds=['加工食品','EC・通販','飲料','自動車部品','日用品'];var cols=['コスト','人手','現場負荷','投資','制度'];
 var mo=new Date(clock+'T00:00:00').getMonth()+1;
 var heat='<div class="ct-heat" style="grid-template-columns:110px repeat('+cols.length+',1fr)"><div></div>'+cols.map(function(c){return '<div class="ct-lab" style="text-align:center">'+c+'</div>';}).join('')+
  inds.map(function(ind,ri){return '<div style="font-size:12px;font-weight:700;align-self:center">'+ind+'</div>'+cols.map(function(c,ci){var busy=((mo===11||mo===12)&&(ind.indexOf('食品')>=0||ind.indexOf('EC')>=0)&&(c==='人手'||c==='現場負荷'))?4:((mo===3&&c==='コスト')?4:((mo===1||mo===2)&&c==='投資')?3:(ri+ci)%3+1);var col=['#dcf2ee','#a9e2d7','#6bc9b6','#2f9f8a','#137e73'][Math.min(4,busy)];return '<div class="hc" style="background:'+col+'">'+(busy+1)+'</div>';}).join('');}).join('')+'</div>';
 return '<div class="ct-sech">時間進行エンジン</div>'+ctl+'<div class="ct-sech">イベントタイムライン（直近）</div>'+card(tl)+'<div class="ct-sech">業種別 課題緊急度ヒートマップ（'+clock+' 時点）</div>'+card(heat)+
  '<div class="ct-notice">時間を進めると、企業ごとに設定された決算月・予算策定月・繁忙期・契約更新に応じてイベントが発生し、購買ステージ・予算残高・現場課題が変化します（変更前後をスナップショット保存）。全てデモ。</div>';
}

/* ============ 顧客ジャーニー ============ */
var jSel=null;
function vJourney(){
 var conts=DB.db().contacts;var vcs=DB.virtualCustomers();
 var all=conts.concat(vcs);
 if(!jSel)jSel=all[0]?all[0].id:null;
 var c=all.filter(function(x){return x.id===jSel;})[0];
 var picker='<label class="ct-field">仮想顧客を選択</label><select onchange="CTWENG.setJ(this.value)" style="max-width:420px"><optgroup label="企業所属（72名）">'+conts.slice(0,72).map(function(x){var co=DB.company(x.companyId);return '<option value="'+x.id+'"'+(jSel===x.id?' selected':'')+'>'+esc(x.name)+'（'+esc(x.role)+'・'+esc(co?co.name:'')+'）</option>';}).join('')+'</optgroup>'+(vcs.length?'<optgroup label="生成">'+vcs.map(function(v){return '<option value="'+v.id+'"'+(jSel===v.id?' selected':'')+'>'+esc(v.name)+'（生成）</option>';}).join('')+'</optgroup>':'')+'</select>';
 if(!c)return '<div class="ct-sech">顧客ジャーニー</div>'+card(picker+'<p class="ct-muted">顧客を選択してください。</p>');
 var evs=load('cust_events_'+c.id,[]);
 var co=DB.company(c.companyId);
 var mem=memState(c,evs);
 var prof=card('<div class="ct-persona"><div class="ct-av">'+(c.generated?'★':(c.name||'？').slice(0,1))+'</div><div><h3 style="margin:0">'+esc(c.name)+'</h3><div>'+badge(esc(c.role||'生成顧客'),'b-teal')+' '+badge(c.dx,H.DXC[c.dx]||'b-grey')+'</div></div></div><div class="ct-lab" style="margin-top:8px">所属</div><div style="font-size:12.5px">'+esc(co?co.name:'未所属')+'</div><div class="ct-lab" style="margin-top:6px">主要課題</div><div style="font-size:12.5px">'+esc(c.concern)+'</div>'+
  '<div class="ct-lab" style="margin-top:8px">現在の記憶（イベントから算出）</div><div class="ct-grid g2" style="margin-top:4px">'+[['製品認知',mem.awareness],['購買意欲',mem.buy],['信頼',mem.trust],['導入障壁',mem.barrier]].map(function(m){return '<div><div class="ct-lab">'+m[0]+'</div><div class="ct-bar"><i style="width:'+m[1]+'%"></i></div></div>';}).join('')+'</div>'+
  '<div class="ct-lab" style="margin-top:8px">購買ステージ</div><div>'+badge(mem.stage,'b-blue')+'</div>');
 var addBtns='<div style="margin-top:10px"><label class="ct-field">イベントを発生させる（手動デモ）</label><div style="display:flex;gap:5px;flex-wrap:wrap">'+['メルマガ開封','CTAクリック','LP閲覧','資料DL','商談','提案','受注'].map(function(ev){return '<button class="ct-btn sm sec" onclick="CTWENG.custEvent(\''+c.id+'\',\''+ev+'\')">'+ev+'</button>';}).join('')+'</div></div>';
 var tl=evs.length?'<div class="ct-tblwrap"><table class="ct-tbl"><thead><tr><th>日時</th><th>イベント</th><th>商材</th><th>施策</th></tr></thead><tbody>'+evs.slice().reverse().map(function(e){return '<tr><td class="ct-lab">'+esc(e.at)+'</td><td>'+badge(e.type,'b-teal')+'</td><td class="ct-lab">'+esc(e.product||'-')+'</td><td class="ct-lab">'+esc(e.campaign||'-')+'</td></tr>';}).join('')+'</tbody></table></div>':'<p class="ct-muted">接触履歴なし。上のボタンか「模擬マーケ実行」でイベントが発生します。</p>';
 var next=card('<h3>次のアクション候補</h3><p class="ct-muted" style="margin-top:0">ステージ「'+mem.stage+'」。'+(mem.stage==='商談'||mem.stage==='稟議'?'稟議シミュレーションで決裁条件を検証。':mem.awareness<40?'認知向上の施策（コラム・メルマガ）を検証。':'資料DL・提案で課題認識を深める。')+'</p><div style="display:flex;gap:6px;flex-wrap:wrap"><button class="ct-btn sm" onclick="CTW.gotoKey(\'interview\')">1on1 →</button><button class="ct-btn sm sec" onclick="CTW.gotoKey(\'exec\')">施策を模擬実行 →</button></div>');
 return '<div class="ct-sech">顧客ジャーニー</div>'+card(picker+addBtns)+'<div class="ct-grid g2" style="grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr)">'+prof+card('<h3>接触履歴・行動イベント</h3>'+tl)+'</div>'+next+
  '<div class="ct-notice">集計値（購買ファネル）は個別イベントから算出され、両者は一致します。全てデモ・模擬行動。</div>';
}
function memState(c,evs){
 var aware=20,buy=(c.buy?c.buy*18:35),trust=25,barrier=60;
 var W={'広告接触':[8,2,1,0],'メルマガ開封':[7,3,2,-1],'CTAクリック':[5,6,3,-2],'LP閲覧':[6,5,3,-2],'資料DL':[9,8,6,-5],'商談':[4,12,10,-8],'提案':[2,10,8,-6],'受注':[0,15,20,-20]};
 evs.forEach(function(e){var w=W[e.type]||[3,3,2,-1];aware+=w[0];buy+=w[1];trust+=w[2];barrier+=w[3];});
 function cl(n){return Math.max(0,Math.min(100,Math.round(n)));}
 var stageIx=Math.min(8,Math.floor((aware+buy+trust)/(300)*9));
 var stage=['未認知','認知','情報収集','課題認識','比較検討','商談','稟議','導入','継続利用'][Math.max(1,stageIx)];
 var hasDeal=evs.some(function(e){return e.type==='商談'||e.type==='提案';});if(hasDeal&&['認知','情報収集','課題認識','比較検討'].indexOf(stage)>=0)stage='商談';
 var hasWin=evs.some(function(e){return e.type==='受注';});if(hasWin)stage='導入';
 return {awareness:cl(aware),buy:cl(buy),trust:cl(trust),barrier:cl(barrier),stage:stage};
}

/* ============ 模擬マーケ実行エンジン ============ */
var ex={channel:'メルマガ',product:'Core Time',companyId:'',angle:'勤怠・工数管理',budget:500000};
function vExec(){
 var cos=DB.companies();if(!ex.companyId)ex.companyId='all';
 var last=load('exec_last',null);
 var form=card('<h3>模擬実行の設定</h3><div class="ct-grid g3">'+
  '<div><label class="ct-field">施策</label><select onchange="CTWENG.ex(\'channel\',this.value)">'+['Google広告','Microsoft広告','LP','メルマガ','SNS','YouTube','コラム','DL資料','セミナー','営業提案'].map(function(c){return '<option'+(ex.channel===c?' selected':'')+'>'+c+'</option>';}).join('')+'</select></div>'+
  '<div><label class="ct-field">商材</label><select onchange="CTWENG.ex(\'product\',this.value)">'+DB.products().map(function(p){return '<option'+(ex.product===p.name?' selected':'')+'>'+esc(p.name)+'</option>';}).join('')+'</select></div>'+
  '<div><label class="ct-field">対象企業</label><select onchange="CTWENG.ex(\'companyId\',this.value)"><option value="all"'+(ex.companyId==='all'?' selected':'')+'>全社（仮想オーディエンス）</option>'+cos.map(function(c){return '<option value="'+c.id+'"'+(ex.companyId===c.id?' selected':'')+'>'+esc(c.name)+'</option>';}).join('')+'</select></div>'+
  '<div><label class="ct-field">訴求軸</label><select onchange="CTWENG.ex(\'angle\',this.value)">'+['勤怠・工数管理','人員配置・現場改善','費用対効果・人件費','システム連携','法対応・コンプライアンス','導入の手軽さ(工事不要)'].map(function(a){return '<option'+(ex.angle===a?' selected':'')+'>'+a+'</option>';}).join('')+'</select></div>'+
  '<div><label class="ct-field">予算（配信費）</label><input type="number" step="10000" value="'+ex.budget+'" oninput="CTWENG.ex(\'budget\',+this.value)"></div>'+
  '</div><button class="ct-btn" style="width:100%;margin-top:12px" onclick="CTWENG.runExec()">模擬実行（仮想顧客の行動を生成）→</button>');
 var out=last?renderExecResult(last):card('<h3>模擬実績 '+badge('未実行','b-grey')+'</h3><p class="ct-muted">「模擬実行」で、仮想顧客の属性・課題・接触履歴・施策適合性に基づき行動イベントと実績を生成します。</p>');
 return '<div class="ct-sech">模擬マーケティング実行</div>'+form+'<div class="ct-sech">実行結果</div><div id="ctwExecOut">'+out+'</div>'+
  '<div class="ct-notice">数値は元イベント・集計と整合（ユニーク顧客と延べ接触を区別）。反映先：購買ファネル・リード・商談・検証履歴・顧客の記憶。既存M-HUB実データとは混在しません。</div>';
}
function renderExecResult(res){
 var m=res.metrics;
 var kpis='<div class="ct-grid g4">'+[['配信/IMP',m.imp.toLocaleString()],['開封/クリック',m.open+' / '+m.clicks],['セッション',m.sessions],['資料DL',m.dl],['CV',m.cv],['リード',m.leads],['MQL',m.mql],['商談',m.deals],['受注',m.wins],['売上','¥'+m.sales.toLocaleString()],['CTR',m.ctr!=null?m.ctr+'%':'—'],['CVR',m.cvr!=null?m.cvr+'%':'—'],['CPA',m.cpa!=null?'¥'+m.cpa.toLocaleString():'算出不可'],['ROAS',m.roas!=null?m.roas+'x':'算出不可'],['ユニーク顧客',m.unique],['延べ接触',m.touches]].map(function(k){return card('<div class="ct-lab">'+k[0]+'</div><div class="ct-num" style="font-size:18px">'+k[1]+'</div>');}).join('')+'</div>';
 return card('<div style="display:flex;justify-content:space-between;align-items:center"><h3 style="margin:0">模擬実績 '+esc(res.channel)+' / '+esc(res.product)+'</h3>'+badge('模擬生成','b-amber')+'</div><div class="ct-lab">対象:'+esc(res.companyName)+' / 訴求:'+esc(res.angle)+' / '+esc(res.at)+'</div>'+kpis+'<p class="ct-lab" style="margin-top:8px">反映：購買ファネル＋リード'+res.addedLeads+'件＋商談'+res.addedOpps+'件＋顧客イベント'+res.events+'件 を追加しました。</p>')+'<div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap"><button class="ct-btn sm sec" onclick="CTW.gotoKey(\'funnel\')">購買ファネルで確認 →</button><button class="ct-btn sm sec" onclick="CTW.gotoKey(\'compare\')">予測と比較 →</button></div>';
}

/* ============ 整合性監査 ============ */
function vAudit(){
 var a=DB.audit();var c=a.checks;
 var ok='<div class="ct-grid g4">'+[['企業',c.companies],['担当者',c.contacts+'（'+c.contactsPerCo+'/社）'],['拠点',c.sites],['リード(企業紐付)',c.leadsLinked],['商談',c.opps],['受注',c.wins],['受注売上','¥'+c.winSales.toLocaleString()],['イベント',c.events]].map(function(k){return card('<div class="ct-lab">'+k[0]+'</div><div class="ct-num" style="font-size:20px">'+k[1]+'</div>');}).join('')+'</div>';
 var issues=a.issues.length?'<div class="ct-notice"><b>検出された不整合（'+a.issues.length+'）：</b><br>'+a.issues.slice(0,10).map(esc).join('<br>')+'</div>':card('<div style="display:flex;align-items:center;gap:10px"><span class="ct-badge b-green">整合OK</span><span>孤立レコード・不正参照・存在しないID参照は検出されませんでした。</span></div>');
 return '<div class="ct-sech">デモデータ整合性監査</div>'+issues+'<div class="ct-sech">主要件数（元データから算出）</div>'+ok+
  card('<h3>検証項目</h3><p>'+['企業⇄顧客の所属','拠点⇄企業','施策⇄商材','リード⇄顧客/企業','商談⇄企業','商談⇄商材','受注⇄売上','イベント⇄顧客'].map(function(x){return '<span class="ct-tag">✓ '+x+'</span>';}).join('')+'</p><p class="ct-lab">集計値は固定表示せず元データから算出。ROIは売上ベース（粗利率を明示）、ROASと区別。</p>')+
  '<div class="ct-notice">架空データであっても数値整合を厳格に保っています。重複・孤立・不正ID・存在しない参照を検知します。</div>';
}

/* ---- 登録（Customer & Market 領域へ） ---- */
CTW.extend('wizard','ペルソナ生成',screen(vWizard),'designmap');
CTW.extend('companyNew','企業作成',screen(vCompanyNew),'companies');
CTW.extend('time','時間進行',screen(vTime),'market');
CTW.extend('journey','顧客ジャーニー',screen(vJourney),'time');
CTW.extend('exec','模擬マーケ実行',screen(vExec),'funnel');
CTW.extend('audit','整合性監査',screen(vAudit),'compare');

/* ---- 公開API ---- */
window.CTWENG={
 wz:function(k,v){wz.data[k]=v;},
 wzStep:function(n){wz.step=n;rerun();},
 wzGenerate:function(){var pv=buildPersonaPreview();var reason=document.getElementById('wzReason');var vc=DB.addCustomer({name:pv.name,group:pv.group,dx:wz.data.dxStance,decision:wz.data.decision,concern:wz.data.concern,setting:pv.setting,companyId:wz.data.companyId,stage:'認知',price:wz.data.price*20,buy:wz.data.buy,barrier:(6-wz.data.risk)*18,exceptionReason:reason?reason.value:''});wz.step=1;CTW.gotoKey('wizard');},
 journeyOf:function(id){jSel=id;CTW.gotoKey('journey');},
 delVC:function(id){DB.removeCustomer(id);rerun();},
 coForm:function(k,v){coForm[k]=(['revenue','employees','sites','dxBudget','logiCost','dxLevel','closeMonth','budgetMonth'].indexOf(k)>=0?(+v||0):v);},
 createCo:function(){var c=DB.addCompany({name:coForm.name,industry:coForm.industry,gyotai:coForm.gyotai,revenue:coForm.revenue,employees:coForm.employees,sites:coForm.sites,dxBudget:coForm.dxBudget,budgetRemain:Math.round(coForm.dxBudget*0.6*10)/10,logiCost:coForm.logiCost,closeMonth:coForm.closeMonth,peak:coForm.peak,budgetMonth:coForm.budgetMonth,issue:coForm.issue,systems:[coForm.systems],dxLevel:coForm.dxLevel,interest:coForm.interest,contractRenew:coForm.contractRenew});if(window.CTWPRO){CTW.gotoKey('companies');setTimeout(function(){window.CTWPRO.openCo(c.id);var el=document.getElementById('ctwMain');if(el&&window.__ctwView)el.innerHTML=window.__ctwView();},20);}else{CTW.gotoKey('companies');}},
 advance:function(days){var r=DB.advance(days);rerun();},
 resetClock:function(){DB.setClock('2026-11-01');rerun();},
 setJ:function(id){jSel=id;rerun();},
 custEvent:function(cid,type){var evs=load('cust_events_'+cid,[]);evs.push({at:DB.clock()+' '+new Date().toTimeString().slice(0,5),type:type,product:ex.product});save('cust_events_'+cid,evs);DB.addEvent({companyId:'',customerId:cid,event:'接触:'+type});rerun();},
 ex:function(k,v){ex[k]=v;},
 runExec:function(){var res=simulateExec();save('exec_last',res);var el=document.getElementById('ctwExecOut');if(el)el.innerHTML=renderExecResult(res);}
};

function simulateExec(){
 var clock=DB.clock();var co=ex.companyId==='all'?null:DB.company(ex.companyId);
 var a=DB.db().assumptions;
 var targets=ex.companyId==='all'?DB.db().contacts:DB.contactsOf(ex.companyId);
 /* 施策適合性：訴求×担当DX姿勢 */
 var fitMap={'勤怠・工数管理':['前向き','推進'],'人員配置・現場改善':['現場前向き','前向き'],'費用対効果・人件費':['様子見','推進'],'システム連携':['支援側','推進'],'法対応・コンプライアンス':['推進','様子見'],'導入の手軽さ(工事不要)':['現場前向き','様子見']};
 var fit=fitMap[ex.angle]||[];
 var cpc={'Google広告':220,'Microsoft広告':180,'SNS':120,'YouTube':90}[ex.channel]||200;
 var isAd=ex.channel.indexOf('広告')>=0;
 var imp,clicks,sessions,open;
 var touches=0,unique=0,events=0,addedLeads=0,addedOpps=0;
 /* 個別顧客行動生成 */
 targets.forEach(function(ct){
  var p=0.25+(fit.indexOf(ct.dx)>=0?0.4:0)+(ct.interest===ex.product?0.2:0);
  var r=((ct.id.charCodeAt(ct.id.length-1)+clock.charCodeAt(9))%100)/100;
  if(r<p){unique++;var evlist=load('cust_events_'+ct.id,[]);
   var chain=ex.channel==='メルマガ'?['メルマガ開封','CTAクリック','LP閲覧','資料DL']:isAd?['広告接触','LP閲覧','資料DL']:['LP閲覧','資料DL'];
   var depth=Math.ceil((p)*chain.length);
   for(var i=0;i<depth;i++){evlist.push({at:clock,type:chain[i],product:ex.product,campaign:ex.channel});touches++;events++;}
   save('cust_events_'+ct.id,evlist);
   if(depth>=3){addedLeads++;DB.addLead({companyId:ct.companyId,contactId:ct.id,source:ex.channel,product:ex.product,stage:'MQL',score:60+Math.round(p*30)});}
   if(r<p*0.25){addedOpps++;DB.addOpp({companyId:ct.companyId,product:ex.product,amount:a.avgDeal,stage:'商談',probability:30});}
  }
 });
 /* 仮想オーディエンス（72名を超える配信） */
 if(isAd){clicks=ex.budget>0?Math.round(ex.budget/cpc):0;imp=clicks*60;sessions=Math.round(clicks*0.9);open=0;}
 else if(ex.channel==='メルマガ'){imp=2268;open=Math.round(imp*0.21);clicks=touches;sessions=touches;}
 else{imp=Math.round(8000+ex.budget/20);clicks=touches+Math.round(imp*0.02);sessions=clicks;open=0;}
 var dl=Math.round(unique*0.8)+addedLeads;var cv=Math.round(unique*0.5);var leads=addedLeads+cv;var mql=Math.round(leads*0.6);
 var deals=addedOpps;var wins=Math.round(deals*a.winRate);var sales=wins*a.avgDeal;
 var cost=ex.budget;
 var m={imp:imp,open:open,clicks:clicks,sessions:sessions,dl:dl,cv:cv,leads:leads,mql:mql,deals:deals,wins:wins,sales:sales,unique:unique,touches:touches,
  ctr:imp>0?Math.round(clicks/imp*1000)/10:null,cvr:sessions>0?Math.round(cv/sessions*1000)/10:null,cpa:cv>0?Math.round(cost/cv):null,roas:cost>0?Math.round(sales/cost*100)/100:null};
 DB.addCampaign({channel:ex.channel,product:ex.product,companyId:ex.companyId==='all'?DB.companies()[0].id:ex.companyId,cost:cost,imp:imp,sessions:sessions,clicks:clicks,cv:cv,dl:dl,leads:leads,mql:mql});
 return {at:clock,channel:ex.channel,product:ex.product,angle:ex.angle,companyName:co?co.name:'全社（仮想オーディエンス）',metrics:m,addedLeads:addedLeads,addedOpps:addedOpps,events:events};
}
console.log('[CTWENG] loaded: wizard/company/time/journey/exec/audit');
})();
