/* ============================================================
   Customer Twin PRO 拡張 v1（CTW.extend 経由で合流 / window.CTWPRO）
   仮想企業ダッシュボード・稟議・予算・購買ファネル・事業戦略・
   仮想実績比較/補正・制作エージェント模擬・デモシナリオ・デモモード
   全データ架空（DEMO）。模擬エンジンはルールベース。
   ============================================================ */
(function(){
"use strict";
if(!window.CTW||!window.CTW.extend){console.warn('[CTWPRO] CTW未検出');return;}
var H=CTW._helpers;var esc=H.esc,badge=H.badge,card=H.card,load=H.load,save=H.save,uid=H.uid,nowISO=H.nowISO;
var DB=window.CTWDB;
function yen(n){return '¥'+Number(Math.round(n||0)).toLocaleString();}
function man(n){return Math.round(n/10000).toLocaleString()+'万';}
function oku(n){return (n>=1e8)?(Math.round(n/1e7)/10).toLocaleString()+'億円':Math.round(n/1e4).toLocaleString()+'万円';}
function pct(n,d){return d>0?Math.round(n/d*1000)/10:null;}
function rerun(){var el=document.getElementById('ctwMain');if(el&&window.__ctwView)el.innerHTML=window.__ctwView();}
/* CTW.go だけでは __ctwView を知らないので、各screenは自分を再描画する軽量ラッパ */
function screen(fn){return function(){window.__ctwView=fn;return fn();};}

/* ============ 仮想企業ダッシュボード ============ */
var coSel=null;
function vCompanies(){
 var cos=DB.companies();
 if(coSel){return companyDetail(coSel);}
 var rows=cos.map(function(c){var opps=DB.oppsOf(c.id).length;return '<tr><td><b>'+esc(c.id)+'</b><br><span class="ct-lab">'+esc(c.name)+'</span></td><td>'+esc(c.industry)+'</td><td>'+oku(c.revenue*1e8)+'</td><td>'+badge('Lv.'+c.dxLevel,c.dxLevel>=4?'b-green':c.dxLevel>=3?'b-teal':c.dxLevel>=2?'b-amber':'b-red')+'</td><td class="ct-lab">'+esc(c.issue)+'</td><td>'+badge(c.stage,'b-blue')+'</td><td>'+opps+'件</td><td><button class="ct-btn sm" onclick="CTWPRO.openCo(\''+c.id+'\')">詳細</button></td></tr>';}).join('');
 return '<div class="ct-sech">仮想企業マスター <span class="ct-muted" style="font-size:12px;font-weight:400">'+cos.length+'社（架空・DEMO）</span></div>'+
  card('<div class="ct-tblwrap"><table class="ct-tbl"><thead><tr><th>企業</th><th>業種</th><th>年商</th><th>DX成熟度</th><th>主要課題</th><th>購買ステージ</th><th>商談</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div>')+
  '<div class="ct-notice">数値はすべてデモ用の架空設定です（実在企業・実売上とは無関係）。企業IDは DEMO-xx で架空名称。</div>';
}
function companyDetail(cid){
 var c=DB.company(cid);if(!c)return vCompanies();
 var conts=DB.contactsOf(cid);var opps=DB.oppsOf(cid);var leads=DB.leadsOf(cid);var sites=DB.sitesOf(cid);
 var kpi='<div class="ct-grid g4">'+[[oku(c.revenue*1e8),'年商'],[c.sites+'拠点','物流拠点'],[c.employees.toLocaleString()+'名','従業員'],[oku(c.dxBudget*1e8),'年間DX予算'],[oku(c.budgetRemain*1e8),'予算残高'],['Lv.'+c.dxLevel,'DX成熟度'],[opps.length+'件','商談'],[leads.length+'件','リード']].map(function(k){return card('<div class="ct-lab">'+k[1]+'</div><div class="ct-num" style="font-size:22px">'+k[0]+'</div>');}).join('')+'</div>';
 /* 課題 */
 var issues=[['コスト',c.issue.indexOf('コスト')>=0?5:3],['人手',c.issue.indexOf('人手')>=0?5:3],['現場負荷',c.issue.indexOf('仕分')>=0||c.issue.indexOf('配送')>=0?4:2],['品質',c.issue.indexOf('品質')>=0||c.issue.indexOf('温度')>=0?5:2],['投資',c.dxLevel<=2?4:2],['連携',c.issue.indexOf('連携')>=0||c.issue.indexOf('多拠点')>=0?5:3]];
 var issueCard=card('<h3>経営・現場課題の優先度</h3>'+issues.sort(function(a,b){return b[1]-a[1];}).map(function(x){return '<div class="ct-metric"><span>'+x[0]+'</span><span>'+x[1]+'/5</span></div><div class="ct-bar"><i style="width:'+(x[1]/5*100)+'%;background:'+(x[1]>=5?'#b3331f':x[1]>=4?'#b96a12':'#137e73')+'"></i></div>';}).join(''));
 /* 組織・意思決定 */
 var org='<div class="ct-grid g3">'+conts.map(function(ct){return card('<div style="float:right">'+badge(ct.opinion,ct.opinion==='賛成'?'b-green':ct.opinion==='反対'?'b-red':'b-amber')+'</div><h3 style="font-size:14px;margin:0">'+esc(ct.role)+'</h3><div class="ct-lab">'+esc(ct.name)+'</div><div style="font-size:12px;margin-top:6px">'+esc(ct.concern)+'</div><div class="ct-lab" style="margin-top:6px">決裁:'+esc(ct.decision)+' / 影響力:'+ct.influence+' / '+badge(ct.dx,H.DXC[ct.dx]||"b-grey")+'</div>');}).join('')+'</div>';
 /* 購買ステージ */
 var si=['未認知','認知','情報収集','課題認識','比較検討','商談','稟議','導入','継続利用'].indexOf(c.stage);
 var funnel='<div class="ct-flow" style="flex-wrap:nowrap;overflow-x:auto">'+['未認知','認知','情報収集','課題認識','比較検討','商談','稟議','導入','継続利用'].map(function(s,i){return '<div class="ct-card" style="min-width:86px;'+(i===si?'border:2px solid #137e73;background:#f3fbf9':'')+'"><div class="ct-lab">'+(i===si?'● 現在':'')+'</div><div style="font-size:11.5px;font-weight:700">'+s+'</div></div>';}).join('')+'</div>';
 /* 商談履歴 */
 var oppTbl=opps.length?'<div class="ct-tblwrap"><table class="ct-tbl"><thead><tr><th>商談ID</th><th>商材</th><th>金額</th><th>ステージ</th><th>確度</th><th>日付</th></tr></thead><tbody>'+opps.map(function(o){return '<tr><td>'+esc(o.id)+'</td><td>'+esc(o.product)+'</td><td>'+yen(o.amount)+'</td><td>'+badge(o.stage,o.stage==='失注'?'b-red':o.stage==='導入'||o.stage==='継続利用'?'b-green':'b-blue')+'</td><td>'+o.probability+'%</td><td class="ct-lab">'+esc(o.at)+'</td></tr>';}).join('')+'</tbody></table></div>':'<p class="ct-muted">商談履歴なし</p>';
 /* ネクストアクション */
 var next=card('<h3>ネクストアクション</h3><p class="ct-muted" style="margin-top:0">購買ステージ「'+esc(c.stage)+'」・主要課題「'+esc(c.issue)+'」に応じた施策候補。</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="ct-btn sm" onclick="CTWPRO.ringiFor(\''+cid+'\')">稟議を検証 →</button><button class="ct-btn sm sec" onclick="CTW.gotoKey(\'interview\')">担当者に1on1 →</button><button class="ct-btn sm sec" onclick="CTW.gotoKey(\'simulation\')">商材を検証 →</button></div>');
 return '<div style="display:flex;justify-content:space-between;align-items:center"><div class="ct-sech" style="border:0;margin:0">'+esc(c.id)+'｜'+esc(c.name)+' '+badge('DEMO','b-amber')+'</div><button class="ct-btn sec sm" onclick="CTWPRO.openCo(null)">← 企業一覧</button></div>'+
  '<div class="ct-lab" style="margin:4px 2px 10px">'+esc(c.industry)+' / '+esc(c.gyotai)+' ・ 取扱:'+esc(c.cargo)+' ・ 利用中:'+c.systems.join('・')+' ・ 競合:'+esc(c.competitor)+' ・ 契約更新:'+esc(c.contractRenew)+'</div>'+
  kpi+'<div class="ct-sech">経営・現場課題</div>'+issueCard+'<div class="ct-sech">組織・意思決定構造</div>'+org+'<div class="ct-sech">購買ステージ</div>'+funnel+'<div class="ct-sech">商談・接触履歴</div>'+card(oppTbl)+next;
}

/* ============ 稟議シミュレーター ============ */
var ringi={cid:null,product:'Core Time',price:'中',payback:'中',poc:true,ref:false,integ:'要調整'};
function vRingi(){
 var cos=DB.companies();if(!ringi.cid)ringi.cid=cos[0].id;
 var c=DB.company(ringi.cid);var conts=DB.contactsOf(ringi.cid);
 var ctrl=card('<h3>提案条件</h3><div class="ct-grid g3">'+
  '<div><label class="ct-field">対象企業</label><select onchange="CTWPRO.setRingi(\'cid\',this.value)">'+cos.map(function(x){return '<option value="'+x.id+'"'+(x.id===ringi.cid?' selected':'')+'>'+esc(x.id)+' '+esc(x.name)+'</option>';}).join('')+'</select></div>'+
  '<div><label class="ct-field">商材</label><select onchange="CTWPRO.setRingi(\'product\',this.value)">'+DB.products().map(function(p){return '<option'+(ringi.product===p.name?' selected':'')+'>'+esc(p.name)+'</option>';}).join('')+'</select></div>'+
  '<div><label class="ct-field">価格水準（デモ）</label><select onchange="CTWPRO.setRingi(\'price\',this.value)">'+['低','中','高'].map(function(x){return '<option'+(ringi.price===x?' selected':'')+'>'+x+'</option>';}).join('')+'</select></div>'+
  '<div><label class="ct-field">投資回収期間</label><select onchange="CTWPRO.setRingi(\'payback\',this.value)">'+['短','中','長'].map(function(x){return '<option'+(ringi.payback===x?' selected':'')+'>'+x+'</option>';}).join('')+'</select></div>'+
  '<div><label class="ct-field">PoC提案</label><select onchange="CTWPRO.setRingi(\'poc\',this.value)"><option value="true"'+(ringi.poc?' selected':'')+'>有</option><option value="false"'+(!ringi.poc?' selected':'')+'>無</option></select></div>'+
  '<div><label class="ct-field">導入実績の提示</label><select onchange="CTWPRO.setRingi(\'ref\',this.value)"><option value="true"'+(ringi.ref?' selected':'')+'>有</option><option value="false"'+(!ringi.ref?' selected':'')+'>無</option></select></div>'+
  '<div><label class="ct-field">既存システム連携</label><select onchange="CTWPRO.setRingi(\'integ\',this.value)">'+['容易','要調整'].map(function(x){return '<option'+(ringi.integ===x?' selected':'')+'>'+x+'</option>';}).join('')+'</select></div>'+
  '</div>');
 /* 各担当の意見ロジック */
 function opinionOf(ct){
  var s=0;var role=ct.role;
  if(role==='経営者'){s+= (ringi.payback==='短'?2:ringi.payback==='中'?0:-2)+(ringi.ref?1:-1)+(ringi.price==='高'?-1:1);}
  else if(role==='CLO・物流責任者'){s+= 2+(ringi.poc?1:0)+(ringi.integ==='容易'?1:0);}
  else if(role==='センター長'){s+= (ringi.poc?1:-1)+(c.fieldIssue?1:0)-(ringi.price==='高'?1:0);}
  else if(role==='購買・調達'){s+= (ringi.price==='低'?2:ringi.price==='中'?0:-2)+(ringi.ref?1:0);}
  else if(role==='情報システム'){s+= (ringi.integ==='容易'?2:-2)+(ringi.poc?1:0);}
  else if(role==='現場リーダー'){s+= (ringi.integ==='容易'?1:-1)+(ringi.poc?1:0)-1;}
  if(ct.dx==='推進')s+=1;if(ct.dx==='反発'||ct.dx==='懐疑')s-=1;
  return s>=2?'賛成':s>=1?'条件付き賛成':s>=-0?'保留':'反対';
 }
 var results=conts.map(function(ct){return {ct:ct,op:opinionOf(ct)};});
 var cards='<div class="ct-grid g3">'+results.map(function(r){var cls={'賛成':'b-green','条件付き賛成':'b-teal','保留':'b-amber','反対':'b-red'}[r.op];return card('<div style="float:right">'+badge(r.op,cls)+'</div><h3 style="font-size:14px;margin:0">'+esc(r.ct.role)+'</h3><div class="ct-lab">'+esc(r.ct.name)+' / 決裁:'+esc(r.ct.decision)+'</div><div style="font-size:12px;margin-top:6px">'+esc(r.ct.concern)+'</div>');}).join('')+'</div>';
 /* 企業判定：経営者=決裁、情シス=技術拒否権、購買=予算、反対者数 */
 var exec=results.filter(function(r){return r.ct.role==='経営者';})[0];
 var sys=results.filter(function(r){return r.ct.role==='情報システム';})[0];
 var oppose=results.filter(function(r){return r.op==='反対';}).length;
 var verdict,vc;
 if(sys&&sys.op==='反対'){verdict='技術要件で保留（情シスの連携懸念を解消要）';vc='b-amber';}
 else if(exec&&exec.op==='反対'){verdict='非承認（投資回収の根拠不足）';vc='b-red';}
 else if(oppose>=2){verdict='追加情報を待って再検討';vc='b-amber';}
 else if(exec&&(exec.op==='賛成')&&oppose===0){verdict='稟議承認の見込み（PoCから開始）';vc='b-green';}
 else {verdict='条件付き承認（現場懸念の対応を条件に）';vc='b-teal';}
 var box='<div style="background:#eaf4f2;border:1px solid #b9ddd5;border-radius:10px;padding:16px;margin:14px 0;text-align:center"><div class="ct-lab">導入検討会議 / '+esc(ringi.product)+' @ '+esc(c.name)+'</div><div style="font-size:20px;font-weight:800;color:#0f6b61">'+verdict+'</div><div class="ct-lab">反対 '+oppose+'名 / 決裁:経営者・技術拒否権:情シス・予算:購買</div></div>';
 return '<div class="ct-sech">仮想企業 稟議シミュレーター <span class="ct-muted" style="font-size:12px;font-weight:400">条件を変えると担当者の賛否と企業判断が変化</span></div>'+ctrl+badge(verdict,vc)+box+cards+
  '<div class="ct-notice">賛否は役割別の重み付けルール（決裁権・拒否権・予算・価格感度）による例示です。単純多数決ではありません。全てデモ・架空。</div>';
}

/* ============ 予算シミュレーター ============ */
var budget={total:12000000,alloc:null,scenario:'基準',assume:null};
var CH_EFF={'Google広告':0.0034,'Microsoft広告':0.004,'その他広告':0.0028,'LP制作・改善':0.006,'コラム':0.009,'メルマガ':0.02,'SNS':0.007,'YouTube・動画':0.005,'DL資料':0.008,'セミナー':0.003,'調査・分析':0,'その他':0.004};
var PRESETS_B={'A:広告重視':{'Google広告':40,'Microsoft広告':15,'その他広告':10,'LP制作・改善':10,'コラム':5,'メルマガ':5,'SNS':5,'YouTube・動画':5,'DL資料':3,'セミナー':0,'調査・分析':2},
 'B:コンテンツ重視':{'Google広告':10,'Microsoft広告':5,'その他広告':3,'LP制作・改善':15,'コラム':20,'メルマガ':12,'SNS':10,'YouTube・動画':13,'DL資料':10,'セミナー':0,'調査・分析':2},
 'C:統合型':{'Google広告':22,'Microsoft広告':8,'その他広告':5,'LP制作・改善':13,'コラム':12,'メルマガ':10,'SNS':8,'YouTube・動画':9,'DL資料':8,'セミナー':3,'調査・分析':2}};
function vBudget(){
 var a=window.CTWDB.db().assumptions;
 if(!budget.alloc)budget.alloc=Object.assign({},PRESETS_B['C:統合型']);
 if(!budget.assume)budget.assume={cvr:a.cvr,leadRate:a.leadRate,dealRate:a.dealRate,winRate:a.winRate,avgDeal:a.avgDeal,grossMargin:0.4};
 var sf={'悲観':0.7,'基準':1,'楽観':1.35}[budget.scenario];
 var chans=Object.keys(budget.alloc);
 var sumPct=chans.reduce(function(s,k){return s+(+budget.alloc[k]||0);},0);
 var rows=chans.map(function(ch){var p=+budget.alloc[ch]||0;var spend=budget.total*p/100;var sess=Math.round(spend*(CH_EFF[ch]||0)*1000/1000*1000);sess=Math.round(spend*(CH_EFF[ch]||0));return {ch:ch,p:p,spend:spend,sess:sess};});
 var totSpend=rows.reduce(function(s,r){return s+r.spend;},0);
 var totSess=rows.reduce(function(s,r){return s+r.sess;},0);
 var cv=Math.round(totSess*budget.assume.cvr*sf);
 var leads=Math.round(cv*budget.assume.leadRate)+Math.round(cv*0.8);
 var mql=Math.round(leads*0.4);
 var deals=Math.round(mql*budget.assume.dealRate*sf);
 var wins=Math.round(deals*budget.assume.winRate*sf);
 var sales=wins*budget.assume.avgDeal;
 var roas=totSpend>0?(sales/totSpend):null;
 var roi=totSpend>0?((sales*budget.assume.grossMargin-totSpend)/totSpend*100):null;
 var cpa=cv>0?totSpend/cv:null;
 var alloc='<div class="ct-tblwrap"><table class="ct-tbl"><thead><tr><th>配分先</th><th>比率%</th><th>金額</th><th>参考セッション</th></tr></thead><tbody>'+rows.map(function(r){return '<tr><td>'+esc(r.ch)+'</td><td><input type="number" min="0" max="100" value="'+r.p+'" style="width:70px" oninput="CTWPRO.setAlloc(\''+r.ch+'\',this.value)"></td><td>'+yen(r.spend)+'</td><td>'+r.sess.toLocaleString()+'</td></tr>';}).join('')+'</tbody><tfoot><tr><th>合計</th><th>'+sumPct+'%</th><th>'+yen(totSpend)+'</th><th>'+totSess.toLocaleString()+'</th></tr></tfoot></table></div>';
 var warn=sumPct!==100?'<div class="ct-notice">配分比率の合計が '+sumPct+'% です（100%に調整してください）。</div>':'';
 var kpis='<div class="ct-grid g4">'+[['参考CV',cv+'件'],['参考リード',leads+'件'],['参考MQL',mql+'件'],['参考商談',deals+'件'],['参考受注',wins+'件'],['参考売上',yen(sales)],['参考CPA',cpa?yen(cpa):'算出不可'],['参考ROAS',roas?roas.toFixed(2)+'x':'算出不可'],['参考ROI('+budget.assume.grossMargin*100+'%粗利)',roi!=null?roi.toFixed(0)+'%':'算出不可']].map(function(k){return card('<div class="ct-lab">'+k[0]+'</div><div class="ct-num" style="font-size:20px">'+k[1]+'</div>');}).join('')+'</div>';
 var presets='<div style="display:flex;gap:8px;flex-wrap:wrap;margin:6px 0">'+Object.keys(PRESETS_B).map(function(k){return '<button class="ct-btn sm sec" onclick="CTWPRO.loadBudget(\''+k+'\')">'+esc(k)+'</button>';}).join('')+'<span style="margin-left:auto"></span>'+['悲観','基準','楽観'].map(function(s){return '<button class="ct-btn sm '+(budget.scenario===s?'':'sec')+'" onclick="CTWPRO.setScenario(\''+s+'\')">'+s+'</button>';}).join('')+'</div>';
 var assume=card('<h3>仮定条件（編集可）</h3><div class="ct-grid g3">'+[['cvr','CVR',budget.assume.cvr,'0.001'],['leadRate','リード率',budget.assume.leadRate,'0.01'],['dealRate','商談化率',budget.assume.dealRate,'0.01'],['winRate','受注率',budget.assume.winRate,'0.01'],['avgDeal','平均受注額',budget.assume.avgDeal,'100000'],['grossMargin','粗利率',budget.assume.grossMargin,'0.05']].map(function(x){return '<div><label class="ct-field">'+x[1]+'</label><input type="number" step="'+x[3]+'" value="'+x[2]+'" oninput="CTWPRO.setAssume(\''+x[0]+'\',this.value)"></div>';}).join('')+'</div>');
 return '<div class="ct-sech">マーケティング予算シミュレーター <span class="ct-muted" style="font-size:12px;font-weight:400">年間 '+yen(budget.total)+'（デモ・架空）</span></div>'+
  '<label class="ct-field">総予算（年間）</label><input type="number" step="100000" value="'+budget.total+'" style="max-width:260px" oninput="CTWPRO.setTotal(this.value)">'+presets+warn+
  '<div class="ct-grid g2" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">'+card('<h3>配分（'+esc(budget.scenario)+'シナリオ）</h3>'+alloc)+assume+'</div>'+
  '<div class="ct-sech">参考試算（'+esc(budget.scenario)+'）</div>'+kpis+
  '<div class="ct-notice">仮想データによる参考試算です。CV/CPA/ROAS/ROIは件数・費用・売上から計算（分母0は算出不可）。ROIは売上ベース（粗利率を明示）。関心指数だけで売上を算出していません。</div>';
}

/* ============ 購買ファネル / 仮想実績 ============ */
var funnelFilter={by:'all',val:'all'};
function vFunnel(){
 var camps=DB.campaignsOf();var opps=DB.oppsOf();
 var filtered=camps;
 if(funnelFilter.by==='channel'&&funnelFilter.val!=='all')filtered=camps.filter(function(c){return c.channel===funnelFilter.val;});
 if(funnelFilter.by==='product'&&funnelFilter.val!=='all')filtered=camps.filter(function(c){return c.product===funnelFilter.val;});
 if(funnelFilter.by==='company'&&funnelFilter.val!=='all')filtered=camps.filter(function(c){return c.companyId===funnelFilter.val;});
 var sum=function(f){return filtered.reduce(function(s,c){return s+c[f];},0);};
 var imp=sum('imp'),sess=sum('sessions'),clk=sum('clicks'),cv=sum('cv'),dl=sum('dl'),leads=sum('leads'),mql=sum('mql');
 var deals=opps.length,wins=opps.filter(function(o){return o.stage==='導入'||o.stage==='継続利用';}).length;
 var steps=[['インプレッション',imp],['セッション',sess],['クリック',clk],['CV',cv],['資料DL',dl],['リード',leads],['MQL',mql],['商談',deals],['受注',wins]];
 var mx=imp||1;
 var funnelViz=card('<h3>購買ファネル（模擬行動の集計）</h3>'+steps.map(function(s){return '<div class="ct-metric"><span>'+s[0]+'</span><span>'+s[1].toLocaleString()+'</span></div><div class="ct-bar"><i style="width:'+Math.max(s[1]/mx*100,2)+'%"></i></div>';}).join(''));
 var rates='<div class="ct-grid g4">'+[['CTR',pct(clk,imp)],['CVR',pct(cv,sess)],['MQL率',pct(mql,leads)],['商談化率',pct(deals,mql)]].map(function(k){return card('<div class="ct-lab">'+k[0]+'</div><div class="ct-num" style="font-size:22px">'+(k[1]!=null?k[1]+'%':'算出不可')+'</div>');}).join('')+'</div>';
 var cos=DB.companies();
 var ctrl=card('<div class="ct-grid g3"><div><label class="ct-field">切替軸</label><select onchange="CTWPRO.setFF(\'by\',this.value)"><option value="all"'+(funnelFilter.by==='all'?' selected':'')+'>全体</option><option value="channel"'+(funnelFilter.by==='channel'?' selected':'')+'>施策別</option><option value="product"'+(funnelFilter.by==='product'?' selected':'')+'>商材別</option><option value="company"'+(funnelFilter.by==='company'?' selected':'')+'>企業別</option></select></div>'+
  (funnelFilter.by!=='all'?'<div><label class="ct-field">対象</label><select onchange="CTWPRO.setFF(\'val\',this.value)"><option value="all">すべて</option>'+(funnelFilter.by==='channel'?[].concat.apply([],camps.map(function(c){return c.channel;})).filter(function(v,i,a){return a.indexOf(v)===i;}).map(function(v){return '<option'+(funnelFilter.val===v?' selected':'')+'>'+esc(v)+'</option>';}).join(''):funnelFilter.by==='product'?DB.products().map(function(p){return '<option'+(funnelFilter.val===p.name?' selected':'')+'>'+esc(p.name)+'</option>';}).join(''):cos.map(function(c){return '<option value="'+c.id+'"'+(funnelFilter.val===c.id?' selected':'')+'>'+esc(c.name)+'</option>';}).join(''))+'</select></div>':'')+'</div>');
 return '<div class="ct-sech">購買ファネル / 仮想実績 <span class="ct-muted" style="font-size:12px;font-weight:400">'+filtered.length+'施策の模擬行動を集計</span></div>'+ctrl+rates+funnelViz+
  '<div class="ct-notice">実データではなく、模擬行動モデルで生成した結果です。各指標は件数から計算し整合（分母0は算出不可）。</div>';
}

/* ============ 事業戦略・市場機会 ============ */
function vStrategy(){
 var inds=['加工食品','EC・通販','自動車部品','飲料','医薬品','日用品','アパレル','建材'];
 var r=0;
 var bubbles=inds.map(function(ind,i){var demand=((i*7+3)%5)+1;var fit=((i*5+2)%5)+1;var barrier=((i*3+1)%5)+1;var rev=demand*fit*18;return {ind:ind,demand:demand,fit:fit,barrier:barrier,rev:rev};});
 var svgW=620,svgH=320;
 var bubbleSvg='<svg viewBox="0 0 '+svgW+' '+svgH+'" style="background:#fbfdfe;border:1px solid #e0e6ed;border-radius:10px"><line x1="50" y1="'+(svgH-40)+'" x2="'+(svgW-20)+'" y2="'+(svgH-40)+'" stroke="#cfd9e3"/><line x1="50" y1="20" x2="50" y2="'+(svgH-40)+'" stroke="#cfd9e3"/><text x="'+(svgW/2)+'" y="'+(svgH-12)+'" font-size="11" fill="#64768b" text-anchor="middle">課題の深刻度 →</text><text x="16" y="'+(svgH/2)+'" font-size="11" fill="#64768b" transform="rotate(-90 16 '+(svgH/2)+')">PAL適合性 →</text>'+
  bubbles.map(function(b){var x=50+b.demand/5*(svgW-90);var y=(svgH-40)-b.fit/5*(svgH-80);var rad=8+b.rev/10;var col=b.barrier>=4?'#b96a12':b.fit>=4?'#137e73':'#2d5e9e';return '<g><circle cx="'+x+'" cy="'+y+'" r="'+rad+'" fill="'+col+'" opacity="0.65"/><text x="'+x+'" y="'+(y+3)+'" font-size="9" fill="#fff" text-anchor="middle">'+esc(b.ind)+'</text></g>';}).join('')+'</svg>';
 var tbl='<div class="ct-tblwrap"><table class="ct-tbl"><thead><tr><th>業種</th><th>課題深刻度</th><th>仮想需要</th><th>PAL適合性</th><th>導入障壁</th><th>参考収益性</th><th></th></tr></thead><tbody>'+bubbles.sort(function(a,b){return b.rev-a.rev;}).map(function(b){return '<tr><td>'+esc(b.ind)+'</td><td>'+b.demand+'/5</td><td>'+badge('指数'+(b.demand*b.fit),'b-teal')+'</td><td>'+b.fit+'/5</td><td>'+b.barrier+'/5</td><td>'+man(b.rev*1e7)+'円(参考)</td><td><button class="ct-btn sm sec" onclick="CTW.gotoKey(\'simulation\')">検証 →</button></td></tr>';}).join('')+'</tbody></table></div>';
 return '<div class="ct-sech">事業戦略・新規サービスシミュレーター</div>'+
  card('<p class="ct-muted" style="margin-top:0">戦略室・事業開発向け。業種別の事業機会を仮想市場モデルの参考指数で可視化します。</p>')+
  '<div class="ct-sech">市場機会マップ（課題深刻度 × PAL適合性・バブル=参考収益性）</div>'+card(bubbleSvg)+
  '<div class="ct-sech">事業ポートフォリオ比較</div>'+card(tbl)+
  '<div class="ct-notice">市場機会・収益性はすべて仮想市場モデルの参考指数・試算です（実需要・実収益ではありません）。</div>';
}

/* ============ 仮想実績比較・モデル補正 ============ */
function vCompare(){
 var pred={cv:40,deal:8,win:3};var act={cv:32,deal:5,win:2};
 var diff=function(a,b){return (b-a>=0?'+':'')+(b-a);};
 var rows=[['CV',pred.cv,act.cv],['商談',pred.deal,act.deal],['受注',pred.win,act.win]];
 var tbl='<div class="ct-tblwrap"><table class="ct-tbl"><thead><tr><th>指標</th><th>施策前 予測</th><th>模擬実績</th><th>差分</th><th>判定</th></tr></thead><tbody>'+rows.map(function(x){var d=x[2]-x[1];return '<tr><td>'+x[0]+'</td><td>'+x[1]+'件</td><td>'+x[2]+'件</td><td>'+diff(x[1],x[2])+'件</td><td>'+badge(Math.abs(d)<=1?'ほぼ一致':d<0?'過大予測':'過小予測',Math.abs(d)<=1?'b-green':'b-amber')+'</td></tr>';}).join('')+'</tbody></table></div>';
 var cal=load('pal_mhub_twin_v1_calib_live',{price:50,interest:60,barrier:55});
 var sliders=['price','interest','barrier'].map(function(k){var lab={price:'価格感度',interest:'購買関心',barrier:'導入障壁'}[k];return '<div><label class="ct-field">'+lab+' ('+cal[k]+')</label><input type="range" min="0" max="100" value="'+cal[k]+'" style="width:100%" oninput="CTWPRO.setCal(\''+k+'\',this.value)"></div>';}).join('');
 var vers=load('pal_mhub_twin_v1_calib_versions',[]);
 return '<div class="ct-sech">仮想実績との比較・モデル補正</div>'+
  card('<h3>予測 vs 模擬実績（デモ例）</h3>'+tbl+'<p class="ct-lab">※予測時の設定と模擬市場側の行動条件は分離。同一式での自己評価はしていません。</p>')+
  '<div class="ct-sech">モデル補正</div>'+card('<p class="ct-muted" style="margin-top:0">仮説と実績の差から係数を補正します。補正理由・対象・変更・承認者・日時・バージョンを保存。</p><div class="ct-grid g3">'+sliders+'</div><div style="margin-top:12px"><button class="ct-btn sm" onclick="CTWPRO.saveCal()">補正を保存（バージョン発行）</button> <button class="ct-btn sm sec" onclick="CTW.gotoKey(\'simulation\')">補正後に再シミュレーション →</button></div>')+
  (vers.length?card('<h3>補正履歴（'+vers.length+'版）</h3>'+vers.slice(0,8).map(function(v){return '<div class="ct-metric"><span>v'+v.version+' '+esc(v.at.slice(0,16).replace('T',' '))+'</span><span class="ct-lab">価格'+v.price+'/関心'+v.interest+'/障壁'+v.barrier+'</span></div>';}).join('')):'')+
  '<div class="ct-notice">デモ上の補正は実際の顧客予測精度を証明するものではありません。</div>';
}

/* ============ 制作・開発エージェント 模擬実行 ============ */
var AGENTS=['市場分析','顧客分析','ペルソナ生成','インタビュー','討議司会','プロダクト企画','サービス開発','LP制作','メルマガ制作','SNS制作','コラム制作','資料制作','営業提案','予算分析','開発','品質検証'];
var agentSel='LP制作';var agentInput='Core Time / 食品物流センター長向け';
function vAgents(){
 var out=load('pal_mhub_twin_v1_artifact','');
 var list='<div style="display:flex;gap:6px;flex-wrap:wrap">'+AGENTS.map(function(a){return '<button class="ct-btn sm '+(agentSel===a?'':'sec')+'" onclick="CTWPRO.setAgent(\''+a+'\')">'+esc(a)+'</button>';}).join('')+'</div>';
 return '<div class="ct-sech">開発・制作エージェント 模擬実行 <span class="ct-muted" style="font-size:12px;font-weight:400">16種・ルールベース模擬生成</span></div>'+
  card('<label class="ct-field">エージェントを選択</label>'+list+'<label class="ct-field">入力（商材 / 対象）</label><input type="text" value="'+esc(agentInput)+'" oninput="CTWPRO.setAgentInput(this.value)"><div style="margin-top:10px"><button class="ct-btn" onclick="CTWPRO.runAgent()">'+esc(agentSel)+'エージェントを模擬実行 →</button></div>')+
  '<div class="ct-sech">模擬成果物 '+badge('模擬生成','b-amber')+'</div>'+card('<textarea id="ctwArtifact" style="min-height:320px;font-family:monospace;font-size:12px">'+esc(out)+'</textarea><div style="margin-top:8px"><button class="ct-btn sm sec" onclick="CTWPRO.exportArtifact()">成果物を保存(.md)</button> <button class="ct-btn sm sec" onclick="CTW.gotoKey(\'dev\')">承認フローへ →</button></div>')+
  '<div class="ct-notice">テンプレート/ルールによる模擬生成です。外部サービスへの送信・実配信・実開発・実デプロイは行いません。</div>';
}
function genArtifact(){
 var inp=agentInput;
 var T={
  'LP制作':'# LP改善構成案（模擬）\n対象: '+inp+'\n\n## ファーストビュー\n- 見出しA案: 「現場の工数、見えていますか？」\n- 見出しB案: 「勤怠と工数を1画面で」\n- 見出しC案: 「人員配置を“勘”から“データ”へ」\n## 構成\n1. 課題提起 2. 解決(機能) 3. 導入事例(デモ) 4. 費用対効果 5. CTA(資料DL/問合せ)\n## CTA\n- 主: 無料資料DL / 副: 導入相談',
  'メルマガ制作':'# メルマガ案（模擬）\n対象: '+inp+'\n\n## 件名A/B/C\n- A: 現場を止めずに工数を可視化する方法\n- B: 人員配置、まだ勘で決めていませんか\n- C: 【事例】仕分け現場の工数を20%削減（デモ）\n## 本文骨子\n課題→共感→解決(機能)→デモ事例→CTA(コラム/資料DL)',
  'コラム制作':'# コラム構成案（模擬）\n対象: '+inp+'\n\n## 想定検索意図\n工数管理 / 人員配置 / 物流DX 始め方\n## 見出し構成(H2)\n1. なぜ工数が見えないのか 2. 可視化の3ステップ 3. 現場定着のコツ 4. まとめ+資料DL',
  '営業提案':'# 営業提案構成（模擬）\n対象: '+inp+'\n\n1. 現状の課題仮説 2. あるべき姿 3. 提案(商材) 4. 導入効果(デモ試算) 5. 導入ステップ(PoC) 6. 費用・契約 7. 想定反論への回答',
  '資料制作':'# DL資料 改善案（模擬）\n対象: '+inp+'\n\n不足情報: 投資回収の具体例 / 既存システム連携図 / 導入スケジュール\n追加スライド案: 事例(デモ) / 料金体系(デモ価格) / FAQ',
  'プロダクト企画':'# 新機能仕様（模擬）\n対象: '+inp+'\n\n課題: 現場の入力負担 / 解決: ハンディ連携の自動取得\n受入条件: 既存WMSとAPI連携 / 優先度: 高(仮)',
 };
 return T[agentSel]||('# '+agentSel+'エージェント 出力（模擬）\n対象: '+inp+'\n\n- 入力に基づくルールベースの模擬成果物です。\n- 主要論点/推奨アクション/次工程を整理。\n- デモ用途。実制作・実開発は行いません。');
}

/* ============ 必須デモシナリオ ============ */
var SCENARIOS=[
 ['S1','Core Timeのメルマガ改善','食品物流のセンター長・経営者・人事・情シスで勤怠/人員配置/費用対効果を比較→件名修正→制作模擬→模擬配信→補正',function(){CTW.verifyFrom&&CTW.verifyFrom({theme:'Core Time メルマガ改善',angle:'勤怠・工数管理',cat:'MARKETING'});}],
 ['S2','仮想企業へ新規プロダクト提案','Coreシリーズを仮想3PLへ提案→稟議討議→条件変更で判断変化→要件→開発模擬',function(){ringi.cid='DEMO-02';ringi.product='Core First';CTW.gotoKey('ringi');}],
 ['S3','年末繁忙期の市場変化','通常期→繁忙期へ進行→食品/EC物流の課題変化→訴求案作成',function(){CTW.gotoKey('market');}],
 ['S4','マーケ予算配分','月100万(年1200万)で広告/コンテンツ/統合の3案比較→承認',function(){CTW.gotoKey('budget');}],
 ['S5','物流BPO+DTSのサービス開発','複数荷主へセット提案→委託範囲/価格/不安を討議→改善→再検証',function(){ringi.product='物流BPO';CTW.verifyFrom&&CTW.verifyFrom({theme:'物流BPO+DTS セット提案',angle:'費用対効果・人件費',cat:'SERVICE'});}],
 ['S6','新規サービス・事業開発','市場から課題大の業種選択→新規案→インタビュー→機会/需要/障壁評価→要件',function(){CTW.gotoKey('strategy');}],
 ['S7','LP改善からモデル補正','LP管理→Twin→A/B/C→改善案→制作模擬→模擬公開→差分→補正',function(){CTW.verifyFrom&&CTW.verifyFrom({theme:'LP改善 A/B/C',angle:'導入の手軽さ(工事不要)',cat:'MARKETING'});}]
];
function vScenarios(){
 return '<div class="ct-sech">必須デモシナリオ <span class="ct-muted" style="font-size:12px;font-weight:400">7件・ワンクリックで開始</span></div>'+
  '<div class="ct-grid g2">'+SCENARIOS.map(function(s,i){return card('<div style="display:flex;justify-content:space-between"><b>'+s[0]+'：'+esc(s[1])+'</b>'+badge('DEMO','b-amber')+'</div><div class="ct-muted" style="font-size:12.5px;margin:6px 0">'+esc(s[2])+'</div><button class="ct-btn sm" onclick="CTWPRO.runScenario('+i+')">このシナリオを開始 →</button>');}).join('')+'</div>'+
  '<div class="ct-notice">各シナリオは該当画面を初期設定済みで開きます。開始後は自由操作に切り替えられます。全てデモ・架空データ。</div>';
}

/* ============ デモモード / リセット ============ */
function vDemo(){
 var c=window.CTWDB.counts();
 var steps=['M-HUB全体像','仮想企業','動的仮想顧客','市場変化','施策検証','顧客の反応','グループ討議','要件定義','開発・制作','模擬実績','継続補正'];
 return '<div class="ct-sech">デモモード / プレゼンテーション</div>'+
  card('<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px"><div><b>DEMO MODE / 仮想データ環境</b><div class="ct-lab">実顧客情報なし・実配信なし・実AI接続なし・模擬シミュレーション・仮想KPI</div></div>'+badge('ON','b-amber')+'</div>')+
  '<div class="ct-sech">ガイド付きデモ（順に操作）</div>'+card('<div class="ct-flow" style="flex-wrap:wrap">'+steps.map(function(s,i){return '<div class="ct-card" style="min-width:110px;padding:10px"><div class="ct-lab">STEP '+(i+1)+'</div><div style="font-size:12px;font-weight:700">'+s+'</div></div>';}).join('')+'</div><div style="margin-top:10px"><button class="ct-btn" onclick="CTW.gotoKey(\'scenarios\')">デモシナリオから開始 →</button> <button class="ct-btn sec" onclick="CTW.gotoKey(\'overview\')">全体像から開始 →</button></div>')+
  '<div class="ct-sech">デモデータ</div>'+card('<p class="ct-muted" style="margin-top:0">現在の登録：企業'+c.companies+' / 担当者'+c.contacts+' / 拠点'+c.sites+' / 施策'+c.campaigns+' / リード'+c.leads+' / 商談'+c.opps+' / プロジェクト'+c.projects+' / シミュレーション'+c.runs+' / インタビュー'+c.interviews+'</p><button class="ct-btn sm sec" onclick="CTWPRO.resetDemo()">初期デモデータに戻す</button> <button class="ct-btn sm sec" onclick="CTWPRO.exportDemo()">デモデータをエクスポート(JSON)</button></p>')+
  '<div class="ct-notice">リセット対象はデモデータ領域（pal_mhub_twin_v1_*）のみ。既存M-HUBの保存データは削除しません。</div>';
}

/* ---- 登録 ---- */
CTW.extend('scenarios','デモシナリオ',screen(vScenarios));
CTW.extend('companies','仮想企業',screen(vCompanies));
CTW.extend('ringi','稟議',screen(vRingi));
CTW.extend('budget','予算',screen(vBudget));
CTW.extend('funnel','購買ファネル',screen(vFunnel));
CTW.extend('strategy','事業戦略',screen(vStrategy));
CTW.extend('compare','実績比較・補正',screen(vCompare));
CTW.extend('agents','制作エージェント',screen(vAgents));
CTW.extend('demo','デモモード',screen(vDemo));

/* ---- 公開API ---- */
window.ctwVerifyBar=function(ctx){ctx=ctx||{};var t=(ctx.theme||'この施策').replace(/'/g,'');var a=ctx.angle||'';var c=ctx.cat||'MARKETING';return '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:#f3fbf9;border:1px solid #bfe6df;border-left:4px solid #137e73;border-radius:10px;padding:9px 13px;margin-bottom:12px"><span style="font-size:11px;font-weight:800;letter-spacing:1px;color:#0f6b61">CUSTOMER TWIN</span><span style="font-size:12.5px;color:#14253b">この画面の内容を仮想顧客で事前検証できます</span><button onclick="CTW.verifyFrom({theme:\''+t+'\',angle:\''+a+'\',cat:\''+c+'\'})" style="margin-left:auto;border:0;background:#137e73;color:#fff;border-radius:7px;padding:7px 13px;font-weight:700;font-size:12px;cursor:pointer">仮想顧客で検証 →</button></div>';};
window.CTWPRO={
 openCo:function(id){coSel=id;rerun();},
 ringiFor:function(cid){ringi.cid=cid;CTW.gotoKey('ringi');},
 setRingi:function(k,v){ringi[k]=(v==='true'?true:v==='false'?false:v);rerun();},
 setTotal:function(v){budget.total=Math.max(0,+v||0);rerun();},
 setAlloc:function(ch,v){budget.alloc[ch]=Math.max(0,Math.min(100,+v||0));rerun();},
 setScenario:function(s){budget.scenario=s;rerun();},
 loadBudget:function(k){budget.alloc=Object.assign({},PRESETS_B[k]);rerun();},
 setAssume:function(k,v){budget.assume[k]=+v||0;rerun();},
 setFF:function(k,v){funnelFilter[k]=v;if(k==='by')funnelFilter.val='all';rerun();},
 setCal:function(k,v){var cal=load('pal_mhub_twin_v1_calib_live',{price:50,interest:60,barrier:55});cal[k]=+v;save('pal_mhub_twin_v1_calib_live',cal);},
 saveCal:function(){var cal=load('pal_mhub_twin_v1_calib_live',{price:50,interest:60,barrier:55});var vs=load('pal_mhub_twin_v1_calib_versions',[]);vs.unshift({version:vs.length+1,at:nowISO(),price:cal.price,interest:cal.interest,barrier:cal.barrier,by:'PAL マーケ'});save('pal_mhub_twin_v1_calib_versions',vs);rerun();},
 setAgent:function(a){agentSel=a;rerun();},
 setAgentInput:function(v){agentInput=v;},
 runAgent:function(){var out=genArtifact();save('pal_mhub_twin_v1_artifact',out);rerun();},
 exportArtifact:function(){var ta=document.getElementById('ctwArtifact');var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ta?ta.value:''],{type:'text/markdown;charset=utf-8'}));a.download='ctw-artifact.md';a.click();setTimeout(function(){URL.revokeObjectURL(a.href);},800);},
 runScenario:function(i){try{SCENARIOS[i][3]();}catch(e){console.warn(e);}},
 resetDemo:function(){try{window.CTWDB.reset();['runs','requirements','lastRun','personas_registered','calib_versions','calib_live','artifact','devGate','devVersion'].forEach(function(k){localStorage.removeItem('pal_mhub_twin_v1_'+k);});}catch(e){}coSel=null;CTW.gotoKey('demo');},
 exportDemo:function(){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(window.CTWDB.db(),null,2)],{type:'application/json'}));a.download='ctw-demo-data.json';a.click();setTimeout(function(){URL.revokeObjectURL(a.href);},800);}
};
console.log('[CTWPRO] loaded: 9 screens + engines');
})();
