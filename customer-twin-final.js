/* ============================================================
   Customer Twin FINAL v1（CTW.extend 上書き / window.CTWFIN）
   シナリオ完走ランナー／プレゼンモード／成果物バージョン・再検証／
   補正の復元・比較／双方向反映トレイ／インポートUI。全データ架空(DEMO)。
   ============================================================ */
(function(){
"use strict";
if(!window.CTW||!window.CTW.extend||!window.CTWDB){console.warn('[CTWFIN] 依存未検出');return;}
var H=CTW._helpers;var esc=H.esc,badge=H.badge,card=H.card,load=H.load,save=H.save,uid=H.uid,nowISO=H.nowISO;
var DB=window.CTWDB;
function rerun(){var el=document.getElementById('ctwMain');if(el&&window.__ctwView)el.innerHTML=window.__ctwView();}
function screen(fn){return function(){window.__ctwView=fn;return fn();};}
function topOfLastRun(){var r=load('lastRun',null);return r&&r.rows&&r.rows[0]?r.rows[0]:null;}

/* ============ 成果物ストア（バージョン管理） ============ */
function artifacts(){return load('artifacts',[]);}
function saveArtifact(a){var l=artifacts();a.id=a.id||uid('ART');a.at=nowISO();l.unshift(a);if(l.length>80)l=l.slice(0,80);save('artifacts',l);return a;}

/* ============ 双方向 反映トレイ（デモ専用領域） ============ */
function inbox(){return load('inbox',[]);}
function pushInbox(it){var l=inbox();it.id=uid('INB');it.at=nowISO();it.approved=false;l.unshift(it);save('inbox',l);return it;}

/* ============ シナリオ完走ランナー ============ */
var SCN=[
 {id:'S1',title:'Core Timeのメルマガ改善',company:'DEMO-01',product:'Core Time',angle:'勤怠・工数管理',personas:[4,10,13,32],
  steps:[
   {l:'企画作成',a:function(c){c.project=uid('PRJ');return 'プロジェクト '+c.project+' を作成（対象:食品物流／Core Time）';}},
   {l:'仮想顧客を選択',a:function(c){CTW.setSim('personas',c.personas.slice());CTW.setSim('theme',c.product);CTW.setSim('angle',c.angle);return c.personas.length+'体を選択（経営者・センター長・人事・情シス）';}},
   {l:'A/B/C訴求を比較',a:function(c){CTW.runSim();var t=topOfLastRun();c.before=t?t.best:0;return '比較実行。最高反応: '+(t?t.name+' '+t.best+'点':'—');}},
   {l:'1on1インタビュー',a:function(c){return 'センター長へ質問→「現場の入力負担が増えないかが不安。費用対効果の根拠が要る」';}},
   {l:'改善要件を作成',a:function(c){c.req='要件: 件名に費用対効果を明示／本文に導入事例（デモ）追加／CTAを資料DLへ';return c.req;}},
   {l:'制作（メルマガ）',a:function(c){var art=saveArtifact({projectId:c.project,product:c.product,company:c.company,agent:'メルマガ制作',version:1,reason:c.req,approved:false,score_before:c.before,body:'件名A:費用対効果を可視化／B:現場負担ゼロで工数把握／C:【事例】仕分け工数20%削減(デモ)'});c.artId=art.id;return '成果物 '+art.id+' v1 生成（件名A/B/C）';}},
   {l:'承認',a:function(c){var l=artifacts();l.forEach(function(x){if(x.id===c.artId)x.approved=true;});save('artifacts',l);return '成果物を承認（制作→配信可）';}},
   {l:'模擬配信',a:function(c){window.CTWENG.ex('channel','メルマガ');window.CTWENG.ex('product',c.product);window.CTWENG.ex('companyId',c.company);window.CTWENG.ex('angle',c.angle);window.CTWENG.runExec();var r=load('exec_last',null);c.metrics=r?r.metrics:null;return r?('配信: CV '+r.metrics.cv+' / リード '+r.metrics.leads+' / 商談 '+r.metrics.deals):'配信実行';}},
   {l:'実績取得→モデル補正',a:function(c){var cal=load('calib_live',{price:50,interest:60,barrier:55});cal.interest=Math.min(100,cal.interest+8);save('calib_live',cal);var vs=load('calib_versions',[]);vs.unshift({version:vs.length+1,at:nowISO(),price:cal.price,interest:cal.interest,barrier:cal.barrier,by:'PAL マーケ',reason:'模擬配信の反応から購買関心を上方補正'});save('calib_versions',vs);return '実績を反映し購買関心を補正（v'+vs.length+'）';}},
   {l:'再検証',a:function(c){CTW.setSim('personas',c.personas.slice());CTW.runSim();var t=topOfLastRun();c.after=t?t.best:0;return '補正後に再検証。最高反応: '+(t?t.best+'点':'—')+'（Δ'+((c.after-c.before)>=0?'+':'')+(c.after-c.before)+'）';}}
  ]},
 {id:'S2',title:'新規プロダクト提案・稟議',company:'DEMO-02',product:'Core First',angle:'システム連携',personas:[3,4,10,32],
  steps:[
   {l:'仮想企業を選択',a:function(c){c.project=uid('PRJ');return 'DEMO-02 広域3PL を対象に選択';}},
   {l:'商材を提案',a:function(c){window.CTWPRO.setRingi('cid',c.company);window.CTWPRO.setRingi('product',c.product);return 'Core First を提案（データ活用基盤）';}},
   {l:'担当者で討議',a:function(c){return '情シス「連携が要調整なら保留」／CLO「拠点横断の可視化に期待」';}},
   {l:'導入条件を変更（PoC有・連携容易）',a:function(c){window.CTWPRO.setRingi('poc',true);window.CTWPRO.setRingi('integ','容易');window.CTWPRO.setRingi('ref',true);return 'PoC提案・連携容易・導入実績提示に変更';}},
   {l:'稟議を再判定',a:function(c){return '稟議: 条件付き承認の見込み（PoCから開始）';}},
   {l:'要件定義→試作',a:function(c){var art=saveArtifact({projectId:c.project,product:c.product,company:c.company,agent:'プロダクト企画',version:1,approved:false,body:'新機能: 既存WMSとAPI連携で入力自動取得／受入条件: 連携図とPoC計画'});c.artId=art.id;return '要件→試作 '+art.id+' v1 を生成';}},
   {l:'再提示',a:function(c){var art=saveArtifact({projectId:c.project,product:c.product,company:c.company,agent:'プロダクト企画',version:2,reason:'連携図を追加',approved:false,body:'v2: API連携図・PoC 2拠点・費用(デモ)を明記'});return '修正版 '+art.id+' v2 を同企業へ再提示';}}
  ]},
 {id:'S3',title:'年末繁忙期の市場変化',company:'DEMO-01',product:'Core Asort',angle:'人員配置・現場改善',personas:[4,10,11,27],
  steps:[
   {l:'通常期を起点に',a:function(c){DB.setClock('2026-11-01');return '仮想日時を 2026-11-01 に設定';}},
   {l:'時間を進める（+3か月）',a:function(c){var r=DB.advance(91);c.events=r.log.length;return '→ '+r.date+' まで進行。市場イベント '+r.log.length+' 件発生';}},
   {l:'企業・顧客の変化を確認',a:function(c){return '食品/EC物流で人手不足・物量増。課題優先度が「現場負荷・人手」へ';}},
   {l:'商材関心の変化',a:function(c){return '仕分け支援(Core Asort)への関心が上昇';}},
   {l:'新規施策を企画',a:function(c){CTW.setSim('personas',c.personas.slice());CTW.setSim('theme',c.product);CTW.setSim('angle',c.angle);CTW.runSim();var t=topOfLastRun();return '繁忙期訴求で検証。最高反応: '+(t?t.name+' '+t.best+'点':'—');}}
  ]},
 {id:'S4',title:'マーケティング予算配分',company:'all',product:'-',angle:'費用対効果・人件費',personas:[],
  steps:[
   {l:'総予算を設定',a:function(c){window.CTWPRO.setTotal(12000000);return '年間予算 ¥12,000,000 を設定';}},
   {l:'A:広告重視で試算',a:function(c){window.CTWPRO.loadBudget('A:広告重視');return 'A案（広告重視）を適用';}},
   {l:'C:統合型で試算',a:function(c){window.CTWPRO.loadBudget('C:統合型');return 'C案（統合型）を適用';}},
   {l:'仮定条件を調整',a:function(c){window.CTWPRO.setScenario('楽観');return '楽観シナリオで参考試算';}},
   {l:'優先案を承認→デモ予算登録',a:function(c){pushInbox({type:'広告予算案',target:'広告予算管理',title:'統合型・年1200万 配分案(デモ)',body:'C案を採用。広告/コンテンツ/統合のバランス配分'});return '統合型を承認し、反映トレイ（デモ予算）へ登録';}}
  ]},
 {id:'S5',title:'物流BPO＋DTSのサービス開発',company:'DEMO-04',product:'物流BPO',angle:'費用対効果・人件費',personas:[4,27,28,5],
  steps:[
   {l:'対象荷主を選択',a:function(c){c.project=uid('PRJ');window.CTWPRO.setRingi('cid',c.company);window.CTWPRO.setRingi('product','物流BPO');return 'DEMO-04 日用品メーカー物流 を対象に';}},
   {l:'セット提案',a:function(c){return '庫内運営受託(BPO)＋輸送可視化(DTS)をセット提案';}},
   {l:'1on1・グループ討議',a:function(c){return 'CLO「任せる範囲の線引きが要」／購買「価格以外の判断基準は品質」';}},
   {l:'委託範囲・契約条件を改善',a:function(c){var art=saveArtifact({projectId:c.project,product:'物流BPO',company:c.company,agent:'サービス開発',version:1,approved:false,body:'委託: 入出荷・在庫／自社: 需給計画。段階導入・SLA明記・切替PoC'});c.artId=art.id;return 'サービス条件改善案 '+art.id+' を作成';}},
   {l:'再検証',a:function(c){CTW.setSim('personas',c.personas.slice());CTW.setSim('theme','物流BPO+DTS');CTW.runSim();var t=topOfLastRun();return '改善提案で再検証。最高反応: '+(t?t.best+'点':'—');}}
  ]},
 {id:'S6',title:'新規事業開発',company:'DEMO-12',product:'食品清掃',angle:'法対応・コンプライアンス',personas:[6,12,27],
  steps:[
   {l:'市場機会を分析',a:function(c){return '事業戦略マップ: 食品加工の課題深刻度が高くPAL適合性も高い';}},
   {l:'対象業種・企業を選択',a:function(c){c.project=uid('PRJ');return 'DEMO-12 食品プロセスセンター を対象に';}},
   {l:'顧客調査',a:function(c){return '現場「清掃の抜け漏れと記録が課題」／品質管理「HACCP対応の証跡が要る」';}},
   {l:'サービス案・事業性評価',a:function(c){var art=saveArtifact({projectId:c.project,product:'食品清掃',company:c.company,agent:'サービス開発',version:1,approved:false,body:'食品製造向け清掃＋記録のサービス案。参考収益性(デモ)・導入障壁を評価'});c.artId=art.id;return 'サービス案 '+art.id+' と参考事業性を作成';}},
   {l:'要件定義→開発指示',a:function(c){saveArtifact({projectId:c.project,product:'食品清掃',company:c.company,agent:'開発',version:1,approved:false,body:'要件: 清掃記録アプリ／HACCP帳票出力／開発用プロンプト（デモ）'});return '要件定義と開発指示（模擬）を生成';}}
  ]},
 {id:'S7',title:'LP改善と継続学習',company:'DEMO-03',product:'Core AX-B',angle:'導入の手軽さ(工事不要)',personas:[6,10,11,24],
  steps:[
   {l:'既存LPを選択',a:function(c){c.project=uid('PRJ');return 'LP管理から Core AX-B LP を選択（デモ）';}},
   {l:'A/B/C訴求を比較',a:function(c){CTW.setSim('personas',c.personas.slice());CTW.setSim('theme','Core AX-B LP');CTW.setSim('angle',c.angle);CTW.runSim();var t=topOfLastRun();c.before=t?t.best:0;return '比較。最高反応: '+(t?t.best+'点':'—');}},
   {l:'顧客調査→制作',a:function(c){var art=saveArtifact({projectId:c.project,product:c.product,company:c.company,agent:'LP制作',version:1,approved:false,score_before:c.before,body:'FV: 工事不要を主見出し／構成: 課題→解決→事例→費用対効果→CTA'});c.artId=art.id;return 'LP改善案 '+art.id+' v1 を生成';}},
   {l:'HTML簡易プレビュー',a:function(c){return '<div style="border:1px dashed #cfd9e3;border-radius:8px;padding:12px;background:#fff"><div style="font-weight:800;color:#14253b">配線もWi-Fiも不要。仕分け改善をもっと手軽に。</div><div style="font-size:12px;color:#64768b">Core AX-B｜工事不要で今日から（デモプレビュー）</div><button style="margin-top:8px;border:0;background:#137e73;color:#fff;border-radius:6px;padding:6px 12px">無料資料DL</button></div>';}},
   {l:'模擬公開→仮想実績',a:function(c){window.CTWENG.ex('channel','LP');window.CTWENG.ex('product',c.product);window.CTWENG.ex('companyId',c.company);window.CTWENG.ex('angle',c.angle);window.CTWENG.runExec();var r=load('exec_last',null);return r?('模擬公開: セッション '+r.metrics.sessions+' / CV '+r.metrics.cv):'模擬公開';}},
   {l:'モデル補正→再検証',a:function(c){var cal=load('calib_live',{price:50,interest:60,barrier:55});cal.barrier=Math.max(0,cal.barrier-6);save('calib_live',cal);CTW.setSim('personas',c.personas.slice());CTW.runSim();var t=topOfLastRun();c.after=t?t.best:0;return '導入障壁を下方補正し再検証。Δ'+((c.after-c.before)>=0?'+':'')+(c.after-c.before)+'点';}}
  ]}
];
function scnState(){return load('scn_state',{id:null,step:0,results:[],ctx:{}});}
function vScenarios(){
 var st=scnState();
 if(!st.id){
  return '<div class="ct-sech">デモシナリオ（ガイド付きワークフロー）</div>'+
   '<div class="ct-grid g2">'+SCN.map(function(s){return card('<div style="display:flex;justify-content:space-between"><b>'+s.id+'：'+esc(s.title)+'</b>'+badge(s.steps.length+'工程','b-teal')+'</div><div class="ct-muted" style="font-size:12.5px;margin:6px 0">各工程で模擬エンジンを実行し、結果を次工程へ引き継ぎます。</div><button class="ct-btn sm" onclick="CTWFIN.scnStart(\''+s.id+'\')">開始 →</button>');}).join('')+'</div>'+
   '<div class="ct-notice">各シナリオは開始〜完了まで操作でき、使用した企業・顧客・施策・成果物・差分を完了画面に表示します。全てデモ・架空。</div>';
 }
 var sc=SCN.filter(function(x){return x.id===st.id;})[0];
 var done=st.step>=sc.steps.length;
 var prog=Math.round(st.step/sc.steps.length*100);
 var head=card('<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px"><div><div class="ct-eyebrow" style="color:#137e73">'+sc.id+' / ガイド付きデモ</div><h3 style="margin:2px 0">'+esc(sc.title)+'</h3></div><div>'+badge((done?'完了':'STEP '+(st.step+1)+'/'+sc.steps.length),done?'b-green':'b-teal')+'</div></div><div class="ct-bar" style="margin-top:8px"><i style="width:'+prog+'%"></i></div>');
 var body;
 if(!done){
  var step=sc.steps[st.step];var last=st.results[st.step];
  body=card('<div class="ct-lab">工程 '+(st.step+1)+'</div><h3>'+esc(step.l)+'</h3>'+
   (last?'<div class="ct-chat" style="background:#eaf4f2">'+(/^<div/.test(last)?last:esc(last))+'</div>':'<p class="ct-muted">「この工程を実行」で模擬エンジンが動作し、結果を保存します。</p>')+
   '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">'+(st.step>0?'<button class="ct-btn sm sec" onclick="CTWFIN.scnPrev()">← 戻る</button>':'')+
   (last?'<button class="ct-btn sm" onclick="CTWFIN.scnNext()">次へ →</button>':'<button class="ct-btn sm" onclick="CTWFIN.scnRun()">この工程を実行 ▶</button>')+
   '<button class="ct-btn sm sec" onclick="CTWFIN.scnSave()">途中保存</button><button class="ct-btn sm sec" onclick="CTWFIN.scnFree()">自由操作へ</button><button class="ct-btn sm sec" onclick="CTWFIN.scnReset()">初期化</button></div>');
 } else {
  var arts=artifacts().filter(function(a){return a.projectId===st.ctx.project;});
  body=card('<h3>完了結果 '+badge('COMPLETE','b-green')+'</h3>'+
   '<div class="ct-lab">実行ログ</div><ol style="font-size:12.5px;color:#334;margin:4px 0 10px;padding-left:20px">'+st.results.map(function(r,i){return '<li>'+esc(sc.steps[i].l)+'：'+(/^<div/.test(r)?'(プレビュー生成)':esc(r||''))+'</li>';}).join('')+'</ol>'+
   '<div class="ct-lab">使用した企業・顧客・施策</div><p>'+badge(sc.company==='all'?'全社':sc.company,'b-blue')+' '+(sc.product!=='-'?badge(sc.product,'b-teal'):'')+' '+badge('ペルソナ'+sc.personas.length+'体','b-grey')+'</p>'+
   (arts.length?'<div class="ct-lab">成果物</div><p>'+arts.map(function(a){return '<span class="ct-tag">'+esc(a.agent)+' v'+a.version+'</span>';}).join('')+'</p>':'')+
   ((st.ctx.before!=null&&st.ctx.after!=null)?'<div class="ct-lab">開始→完了の変化（最高反応指数）</div><p>'+st.ctx.before+' → '+st.ctx.after+'（Δ'+((st.ctx.after-st.ctx.before)>=0?'+':'')+(st.ctx.after-st.ctx.before)+'）</p>':'')+
   '<div style="display:flex;gap:8px;margin-top:8px"><button class="ct-btn sm" onclick="CTWFIN.scnReset()">別シナリオを選ぶ</button><button class="ct-btn sm sec" onclick="CTWFIN.scnStart(\''+sc.id+'\')">最初から実行</button><button class="ct-btn sm sec" onclick="CTW.gotoKey(\'agents\')">成果物を確認</button></div>');
 }
 return '<div class="ct-sech">デモシナリオ '+sc.id+'</div>'+head+body+'<div class="ct-notice">各工程は模擬エンジンを実行し結果を保存、次工程へ引き継ぎます。手動（この工程を実行）と自動（下の自動実行）の両対応。全てデモ。</div>'+
  (!done?'<div style="margin-top:8px"><button class="ct-btn sm sec" onclick="CTWFIN.scnAuto()">このシナリオを自動実行 ▶▶</button></div>':'');
}

/* ============ プレゼンテーションモード ============ */
var PRES=[
 ['M-HUBの全体像','過去を知る・現在を理解する・未来を試す。マーケ実績＋Customer Twin＋意思決定支援が循環。','overview'],
 ['仮想市場・仮想企業','DEMO 12社・担当72名。業種/年商/DX成熟度/課題/購買ステージを一画面で。','companies'],
 ['動的仮想顧客','36テンプレ＋生成。状態・価値観・記憶・購買行動で変化。','personas'],
 ['市場環境・時間進行','仮想日時を進めると企業の決算/繁忙/契約更新で顧客ニーズが変化。','time'],
 ['商材・施策の検証','A/B/C訴求を立場の違う顧客で比較。関心と障壁を根拠付きで。','simulation'],
 ['インタビュー・討議','1on1と立場のぶつかるグループ討議で論点を抽出。','interview'],
 ['要件定義・制作・開発','討議→要件→制作エージェント→成果物→承認。','agents'],
 ['模擬実行・顧客行動・実績','施策を模擬実行→個別顧客の行動→ファネル/商談/売上に反映。','exec'],
 ['モデル補正・再検証','予測と模擬実績の差から補正→同条件で再検証。','compare'],
 ['将来の実データ・AI接続','GA4/SFA/AIは接続後に拡張。今日は架空データで全工程を体験。','roadmap']
];
var pres={i:0,auto:false};
function vPresent(){
 var s=PRES[pres.i];var prog=Math.round((pres.i+1)/PRES.length*100);
 var head=card('<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px"><div><div class="ct-eyebrow" style="color:#137e73">PRESENTATION / 5分デモ</div><h2 style="margin:2px 0">DEMO '+String(pres.i+1).padStart(2,'0')+'｜'+esc(s[0])+'</h2></div><div>'+badge((pres.i+1)+' / '+PRES.length,'b-teal')+(pres.auto?' '+badge('自動','b-amber'):'')+'</div></div><div class="ct-bar" style="margin-top:8px"><i style="width:'+prog+'%"></i></div><p style="font-size:14px;color:#334;margin:10px 0 0">'+esc(s[1])+'</p>');
 var ctl='<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">'+(pres.i>0?'<button class="ct-btn sm sec" onclick="CTWFIN.presPrev()">← 戻る</button>':'')+(pres.i<PRES.length-1?'<button class="ct-btn sm" onclick="CTWFIN.presNext()">次へ →</button>':'<button class="ct-btn sm" onclick="CTWFIN.presReset()">最初へ</button>')+'<button class="ct-btn sm sec" onclick="CTWFIN.presOpen(\''+s[2]+'\')">この画面を操作 →</button>'+(pres.auto?'<button class="ct-btn sm sec" onclick="CTWFIN.presPause()">一時停止 ⏸</button>':'<button class="ct-btn sm sec" onclick="CTWFIN.presAuto()">自動デモ ▶</button>')+'<button class="ct-btn sm sec" onclick="CTW.gotoKey(\'overview\')">通常画面へ</button></div>';
 return '<div class="ct-sech">プレゼンテーションモード</div>'+head+card(ctl)+'<div class="ct-notice">各ステップは「この画面を操作」で実機を動かせます。自動デモは数秒ごとに進行、一時停止可。経営層向けに視認性を優先。</div>';
}

/* ============ 制作成果物（バージョン管理・再検証） ============ */
var AGENTS=['市場分析','顧客分析','ペルソナ生成','インタビュー','討議司会','プロダクト企画','サービス開発','LP制作','メルマガ制作','SNS制作','コラム制作','資料制作','営業提案','予算分析','開発','品質検証'];
var agSel='LP制作',agInput='Core Time / 食品物流センター長向け';
function vAgents(){
 var arts=artifacts();
 var list='<div style="display:flex;gap:6px;flex-wrap:wrap">'+AGENTS.map(function(a){return '<button class="ct-btn sm '+(agSel===a?'':'sec')+'" onclick="CTWFIN.setAgent(\''+a+'\')">'+esc(a)+'</button>';}).join('')+'</div>';
 var gen=card('<label class="ct-field">エージェント</label>'+list+'<label class="ct-field">入力（商材 / 対象）</label><input type="text" value="'+esc(agInput)+'" oninput="CTWFIN.setAgentInput(this.value)"><div style="margin-top:10px"><button class="ct-btn" onclick="CTWFIN.runAgent()">'+esc(agSel)+'を模擬実行 →</button></div>');
 var cur=load('agent_out','');
 var out=card('<div style="display:flex;justify-content:space-between;align-items:center"><h3 style="margin:0">模擬成果物 '+badge('模擬生成','b-amber')+'</h3><div><button class="ct-btn sm sec" onclick="CTWFIN.saveVer()">バージョン保存</button> <button class="ct-btn sm sec" onclick="CTWFIN.exportArt()">.md</button> <button class="ct-btn sm sec" onclick="CTWFIN.reflect(\'LP改善案\',\'LP管理\')">既存へ反映</button></div></div><textarea id="ctwArt" style="min-height:260px;font-family:monospace;font-size:12px">'+esc(cur)+'</textarea>');
 var store=arts.length?'<div class="ct-sech">成果物ストア（'+arts.length+'・バージョン管理）</div><div class="ct-tblwrap"><table class="ct-tbl"><thead><tr><th>ID</th><th>エージェント</th><th>版</th><th>商材</th><th>承認</th><th>再検証</th><th></th></tr></thead><tbody>'+arts.slice(0,14).map(function(a){return '<tr><td>'+esc(a.id)+'</td><td>'+esc(a.agent)+'</td><td>v'+a.version+'</td><td>'+esc(a.product||'-')+'</td><td>'+badge(a.approved?'承認済':'未承認',a.approved?'b-green':'b-grey')+'</td><td>'+(a.score_after!=null?('Δ'+((a.score_after-(a.score_before||0))>=0?'+':'')+(a.score_after-(a.score_before||0))):'—')+'</td><td><button class="ct-btn sm sec" onclick="CTWFIN.reverify(\''+a.id+'\')">同顧客へ再提示</button></td></tr>';}).join('')+'</tbody></table></div>':'';
 return '<div class="ct-sech">制作・開発エージェント（16種・成果物管理）</div>'+gen+'<div class="ct-sech">出力</div>'+out+store+
  '<div class="ct-notice">成果物はプロジェクト/商材/顧客/版/承認/再検証を保持。「同顧客へ再提示」で修正前後の評価を比較（評価が下がる場合も再現）。模擬生成・外部送信なし。</div>';
}
function genArt(){
 var T={'LP制作':'# LP改善構成案（模擬）\n対象: '+agInput+'\n## FV\nA:現場の工数、見えていますか？ / B:勤怠と工数を1画面で / C:人員配置を勘からデータへ\n## 構成\n課題→解決→事例(デモ)→費用対効果→CTA(資料DL)',
  'メルマガ制作':'# メルマガ案（模擬）\n対象: '+agInput+'\n件名A:費用対効果を可視化 / B:現場負担ゼロで工数把握 / C:【事例】仕分け20%削減(デモ)\n本文: 課題→共感→解決→デモ事例→CTA',
  'コラム制作':'# コラム構成案（模擬）\n対象: '+agInput+'\n検索意図: 工数管理/人員配置/物流DX\nH2: 1.なぜ見えない 2.可視化3step 3.定着のコツ 4.まとめ+DL',
  '営業提案':'# 営業提案（模擬）\n対象: '+agInput+'\n1.課題仮説 2.あるべき姿 3.提案 4.効果(デモ試算) 5.PoC 6.費用 7.想定反論'};
 return T[agSel]||('# '+agSel+'（模擬出力）\n対象: '+agInput+'\n- ルールベースの模擬成果物。主要論点/推奨/次工程を整理。デモ用途。');
}

/* ============ 実績比較・モデル補正（復元・比較） ============ */
function vCompare(){
 var cal=load('calib_live',{price:50,interest:60,barrier:55});var vs=load('calib_versions',[]);
 var pred={cv:40,deal:8,win:3};var act=load('exec_last',null);var am=act?act.metrics:null;
 var actCv=am?am.cv:32,actDeal=am?am.deals:5,actWin=am?am.wins:2;
 var rows=[['CV',pred.cv,actCv],['商談',pred.deal,actDeal],['受注',pred.win,actWin]];
 var tbl='<div class="ct-tblwrap"><table class="ct-tbl"><thead><tr><th>指標</th><th>施策前 予測</th><th>模擬実績</th><th>差分</th><th>判定</th></tr></thead><tbody>'+rows.map(function(x){var d=x[2]-x[1];return '<tr><td>'+x[0]+'</td><td>'+x[1]+'件</td><td>'+x[2]+'件</td><td>'+(d>=0?'+':'')+d+'件</td><td>'+badge(Math.abs(d)<=1?'ほぼ一致':d<0?'過大予測':'過小予測',Math.abs(d)<=1?'b-green':'b-amber')+'</td></tr>';}).join('')+'</tbody></table></div>';
 var sliders=['price','interest','barrier'].map(function(k){var lab={price:'価格感度',interest:'購買関心',barrier:'導入障壁'}[k];return '<div><label class="ct-field">'+lab+' ('+cal[k]+')</label><input type="range" min="0" max="100" value="'+cal[k]+'" style="width:100%" oninput="CTWFIN.setCal(\''+k+'\',this.value)"></div>';}).join('');
 var verTbl=vs.length?'<div class="ct-tblwrap"><table class="ct-tbl"><thead><tr><th>版</th><th>日時</th><th>価格/関心/障壁</th><th>理由</th><th></th></tr></thead><tbody>'+vs.slice(0,8).map(function(v){return '<tr><td>v'+v.version+'</td><td class="ct-lab">'+esc((v.at||'').slice(0,16).replace('T',' '))+'</td><td>'+v.price+'/'+v.interest+'/'+v.barrier+'</td><td class="ct-lab">'+esc(v.reason||'-')+'</td><td><button class="ct-btn sm sec" onclick="CTWFIN.restoreCal('+v.version+')">このモデルに復元</button></td></tr>';}).join('')+'</tbody></table></div>':'<p class="ct-muted">補正版はまだありません。</p>';
 return '<div class="ct-sech">仮想実績との比較・モデル補正（バージョン管理）</div>'+
  card('<h3>予測 vs 模擬実績</h3>'+tbl+'<p class="ct-lab">※予測時の設定と模擬市場側の行動条件は分離。同一式での自己評価はしていません。</p>')+
  '<div class="ct-sech">補正（係数）</div>'+card('<div class="ct-grid g3">'+sliders+'</div><div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button class="ct-btn sm" onclick="CTWFIN.saveCalV()">補正を保存（新バージョン）</button><button class="ct-btn sm sec" onclick="CTWFIN.resimCompare()">旧モデル・新モデルで再検証して比較</button><button class="ct-btn sm sec" onclick="CTW.gotoKey(\'simulation\')">補正後に再シミュレーション →</button></div><div id="ctwResim"></div>')+
  '<div class="ct-sech">補正履歴・復元</div>'+card(verTbl)+
  '<div class="ct-notice">補正済みモデルは実際の再シミュレーションに反映されます。過去モデルへ復元可。デモ上の改善は実顧客の予測精度向上を証明しません。</div>';
}

/* ============ 反映トレイ（双方向・デモ専用） ============ */
function vInbox(){
 var l=inbox();
 var tbl=l.length?'<div class="ct-tblwrap"><table class="ct-tbl"><thead><tr><th>日時</th><th>種別</th><th>反映先(デモ)</th><th>内容</th><th>状態</th><th></th></tr></thead><tbody>'+l.map(function(it){return '<tr><td class="ct-lab">'+esc((it.at||'').slice(0,16).replace('T',' '))+'</td><td>'+badge(it.type,'b-teal')+'</td><td>'+esc(it.target)+'</td><td style="max-width:260px">'+esc(it.title)+'</td><td>'+badge(it.approved?'反映済(デモ)':'確認待ち',it.approved?'b-green':'b-amber')+'</td><td>'+(it.approved?'':'<button class="ct-btn sm" onclick="CTWFIN.approveInbox(\''+it.id+'\')">内容確認→反映</button>')+'</td></tr>';}).join('')+'</tbody></table></div>':'<p class="ct-muted">反映トレイは空です。シミュレーション結果・成果物の「既存へ反映」から登録されます。</p>';
 return '<div class="ct-sech">既存M-HUBへの反映トレイ（双方向・デモ専用領域）</div>'+card(tbl)+
  '<div class="ct-sech">反映を作成（デモ）</div>'+card('<div style="display:flex;gap:8px;flex-wrap:wrap">'+[['LP改善案','LP管理'],['メルマガ修正版','メルマガ管理'],['コラム企画','コラム管理'],['SNS投稿案','SNS管理'],['動画企画','動画管理'],['資料改善案','資料DL管理'],['広告予算案','広告予算管理'],['営業提案','リード/MQL'],['ToDo','ToDo・承認'],['承認依頼','ToDo・承認'],['プロンプト','プロンプト管理']].map(function(x){return '<button class="ct-btn sm sec" onclick="CTWFIN.reflect(\''+x[0]+'\',\''+x[1]+'\')">'+x[0]+'→'+x[1]+'</button>';}).join('')+'</div>')+
  '<div class="ct-notice">反映前に内容確認画面を表示。書き込みは「デモ専用領域」に限定し、既存M-HUBの実運用データは上書きしません。</div>';
}

/* ============ データ管理（import/export/backup/reset） ============ */
function vData(){
 var c=DB.counts();
 return '<div class="ct-sech">デモデータ管理</div>'+
  card('<h3>エクスポート / バックアップ</h3><p class="ct-muted" style="margin-top:0">現在：企業'+c.companies+' / 顧客'+c.contacts+' / 施策'+c.campaigns+' / 商談'+c.opps+'</p><button class="ct-btn sm sec" onclick="CTWFIN.exportDemo()">JSONエクスポート</button> <button class="ct-btn sm sec" onclick="CTWFIN.backup()">バックアップ作成</button> <button class="ct-btn sm sec" onclick="CTWFIN.restore()">バックアップから復元</button>')+
  card('<h3>インポート</h3><p class="ct-muted" style="margin-top:0">JSONを貼り付け→検証→確認後に反映（不正データは既存を破壊せずエラー表示）。</p><textarea id="ctwImport" style="min-height:120px;font-family:monospace;font-size:12px" placeholder="エクスポートしたJSONを貼り付け"></textarea><div style="margin-top:8px"><button class="ct-btn sm" onclick="CTWFIN.validateImport()">検証</button> <button class="ct-btn sm sec" onclick="CTWFIN.doImport()">確認して反映</button></div><div id="ctwImpMsg"></div>')+
  card('<h3>初期化</h3><p class="ct-muted" style="margin-top:0">デモ専用領域のみ初期化。既存M-HUBデータは削除しません。</p><button class="ct-btn sm sec" onclick="CTWFIN.resetDemo()">初期デモデータに戻す</button>')+
  '<div class="ct-notice">対象は pal_mhub_twin_v1_* のみ。既存M-HUBの保存領域は保護されます。</div>';
}

/* ---- 登録（上書き含む） ---- */
CTW.extend('scenarios','デモシナリオ',screen(vScenarios));
CTW.extend('present','プレゼン',screen(vPresent),'demo');
CTW.extend('agents','制作エージェント',screen(vAgents));
CTW.extend('compare','実績比較・補正',screen(vCompare));
CTW.extend('inbox','反映トレイ',screen(vInbox),'audit');
CTW.extend('data','データ管理',screen(vData),'inbox');

/* ---- API ---- */
window.CTWFIN={
 /* scenario */
 scnStart:function(id){var sc=SCN.filter(function(x){return x.id===id;})[0];save('scn_state',{id:id,step:0,results:[],ctx:{personas:sc.personas,company:sc.company,product:sc.product}});CTW.gotoKey('scenarios');},
 scnRun:function(){var st=scnState();var sc=SCN.filter(function(x){return x.id===st.id;})[0];var res=sc.steps[st.step].a(st.ctx)||'実行';st.results[st.step]=res;save('scn_state',st);rerun();},
 scnNext:function(){var st=scnState();if(st.results[st.step]==null)return;st.step++;save('scn_state',st);rerun();},
 scnPrev:function(){var st=scnState();if(st.step>0)st.step--;save('scn_state',st);rerun();},
 scnAuto:function(){var st=scnState();var sc=SCN.filter(function(x){return x.id===st.id;})[0];while(st.step<sc.steps.length){st.results[st.step]=sc.steps[st.step].a(st.ctx)||'実行';st.step++;}save('scn_state',st);rerun();},
 scnSave:function(){rerun();},
 scnFree:function(){var st=scnState();var sc=SCN.filter(function(x){return x.id===st.id;})[0];CTW.gotoKey(sc.id==='S4'?'budget':sc.id==='S3'?'time':sc.id==='S2'?'ringi':sc.id==='S6'?'strategy':'simulation');},
 scnReset:function(){save('scn_state',{id:null,step:0,results:[],ctx:{}});CTW.gotoKey('scenarios');},
 /* presentation */
 presNext:function(){pres.i=Math.min(PRES.length-1,pres.i+1);rerun();},
 presPrev:function(){pres.i=Math.max(0,pres.i-1);rerun();},
 presReset:function(){pres.i=0;rerun();},
 presOpen:function(k){CTW.gotoKey(k);},
 presAuto:function(){pres.auto=true;if(window.__presT)clearInterval(window.__presT);window.__presT=setInterval(function(){if(pres.i<PRES.length-1){pres.i++;rerun();}else{clearInterval(window.__presT);pres.auto=false;rerun();}},3500);rerun();},
 presPause:function(){pres.auto=false;if(window.__presT)clearInterval(window.__presT);rerun();},
 /* agents */
 setAgent:function(a){agSel=a;rerun();},setAgentInput:function(v){agInput=v;},
 runAgent:function(){save('agent_out',genArt());rerun();},
 saveVer:function(){var ta=document.getElementById('ctwArt');var body=ta?ta.value:'';var exist=artifacts().filter(function(a){return a.agent===agSel;});var v=exist.length+1;saveArtifact({agent:agSel,version:v,product:agInput.split('/')[0].trim(),approved:false,body:body});rerun();},
 exportArt:function(){var ta=document.getElementById('ctwArt');var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ta?ta.value:''],{type:'text/markdown;charset=utf-8'}));a.download='ctw-artifact.md';a.click();setTimeout(function(){URL.revokeObjectURL(a.href);},800);},
 reverify:function(id){var a=artifacts().filter(function(x){return x.id===id;})[0];if(!a)return;CTW.setSim('theme',(a.product||'')+'（改善版）');CTW.setSim('personas',(SCN[0].personas));CTW.runSim();var t=topOfLastRun();var before=a.score_before!=null?a.score_before:(t?t.best-((id.charCodeAt(5)%10)-4):t.best);var after=t?t.best:before;var l=artifacts();l.forEach(function(x){if(x.id===id){x.score_before=before;x.score_after=after;}});save('artifacts',l);var el=document.getElementById('ctwMain');alert('再提示・再検証：改善前 '+before+' → 改善後 '+after+'（Δ'+((after-before)>=0?'+':'')+(after-before)+'）※下がる場合も再現');rerun();},
 reflect:function(type,target){var ta=document.getElementById('ctwArt');var body=ta?ta.value:'（成果物）';if(!confirm('「'+type+'」を既存「'+target+'」のデモ専用領域へ反映します。\\n実運用データは上書きしません。よろしいですか？'))return;pushInbox({type:type,target:target,title:type+'（'+agSel+'）',body:body});CTW.gotoKey('inbox');},
 approveInbox:function(id){var l=inbox();l.forEach(function(x){if(x.id===id){if(confirm('内容を確認し、デモ専用領域へ反映します。\\n'+x.title))x.approved=true;}});save('inbox',l);rerun();},
 /* calibration */
 setCal:function(k,v){var cal=load('calib_live',{price:50,interest:60,barrier:55});cal[k]=+v;save('calib_live',cal);},
 saveCalV:function(){var cal=load('calib_live',{price:50,interest:60,barrier:55});var vs=load('calib_versions',[]);vs.unshift({version:vs.length+1,at:nowISO(),price:cal.price,interest:cal.interest,barrier:cal.barrier,by:'PAL マーケ',reason:'手動補正'});save('calib_versions',vs);rerun();},
 restoreCal:function(ver){var vs=load('calib_versions',[]);var v=vs.filter(function(x){return x.version===ver;})[0];if(v){save('calib_live',{price:v.price,interest:v.interest,barrier:v.barrier});alert('モデル v'+ver+' に復元しました。再シミュレーションに反映されます。');rerun();}},
 resimCompare:function(){var cur=load('calib_live',{price:50,interest:60,barrier:55});
  save('calib_live',{price:50,interest:60,barrier:55});CTW.setSim('personas',SCN[0].personas);CTW.runSim();var oldT=topOfLastRun();var oldS=oldT?oldT.best:0;
  save('calib_live',cur);CTW.runSim();var newT=topOfLastRun();var newS=newT?newT.best:0;
  var el=document.getElementById('ctwResim');if(el)el.innerHTML='<div class="ct-chat" style="background:#eaf4f2;margin-top:10px">旧モデル 最高反応 '+oldS+' → 新モデル '+newS+'（Δ'+((newS-oldS)>=0?'+':'')+(newS-oldS)+'）同一条件で比較</div>';},
 /* data mgmt */
 exportDemo:function(){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(DB.db(),null,2)],{type:'application/json'}));a.download='ctw-demo-data.json';a.click();setTimeout(function(){URL.revokeObjectURL(a.href);},800);},
 backup:function(){try{localStorage.setItem('pal_mhub_twin_v1_backup',JSON.stringify(DB.db()));alert('バックアップを作成しました。');}catch(e){alert('バックアップ失敗');}},
 restore:function(){try{var b=localStorage.getItem('pal_mhub_twin_v1_backup');if(b&&DB.importDB(b)){alert('バックアップから復元しました。');rerun();}else alert('バックアップがありません。');}catch(e){alert('復元失敗');}},
 validateImport:function(){var ta=document.getElementById('ctwImport');var msg=document.getElementById('ctwImpMsg');try{var d=JSON.parse(ta.value);var ok=d&&Array.isArray(d.companies)&&Array.isArray(d.contacts);var ids={};var dup=0;(d.companies||[]).forEach(function(c){if(ids[c.id])dup++;ids[c.id]=1;});msg.innerHTML='<div class="ct-'+(ok?'chat':'notice')+'" style="margin-top:8px">'+(ok?('検証OK：企業'+d.companies.length+'/顧客'+d.contacts.length+' / 重複ID '+dup+' / schema '+(d.schema||'?')):'不正な形式です（companies/contactsが必要）')+'</div>';}catch(e){msg.innerHTML='<div class="ct-notice" style="margin-top:8px">JSON解析エラー：'+esc(String(e))+'（既存データは変更していません）</div>';}},
 doImport:function(){var ta=document.getElementById('ctwImport');var msg=document.getElementById('ctwImpMsg');try{var d=JSON.parse(ta.value);if(!(d&&Array.isArray(d.companies))){msg.innerHTML='<div class="ct-notice">不正な形式。反映しません。</div>';return;}if(!confirm('インポート内容でデモデータを置き換えます。既存M-HUBデータには影響しません。よろしいですか？'))return;if(DB.importDB(ta.value)){alert('インポートしました。');rerun();}}catch(e){msg.innerHTML='<div class="ct-notice">エラー：既存データは保持されています。</div>';}},
 resetDemo:function(){if(!confirm('デモ専用領域を初期化します（既存M-HUBは保護）。よろしいですか？'))return;DB.reset();['runs','requirements','lastRun','personas_registered','calib_versions','calib_live','artifact','agent_out','artifacts','inbox','devGate','devVersion','scn_state','exec_last'].forEach(function(k){try{localStorage.removeItem('pal_mhub_twin_v1_'+k);}catch(e){}});CTW.gotoKey('data');}
};
console.log('[CTWFIN] loaded: scenarios/present/agents/compare/inbox/data');
})();
