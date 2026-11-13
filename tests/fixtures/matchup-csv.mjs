export const positions = ['QB', 'RB', 'WR', 'TE', 'ALL'];
export const schedule = 'TM,1,2,3,4,5,6,7,18\nARI,vs BAL,@ BAL,BYE,vs BAL,@ BAL,vs BAL,BYE,vs BAL\nBAL,@ ARI,vs ARI,BYE,@ ARI,vs ARI,@ ARI,BYE,@ ARI';
export const weekly = 'WK,SLPR_ID,PLAYER NAME,POS,TM,FPT_PPR,GM_P,VS,paYDS,CAR,recYDS,PROJ\n' + [
  '1,1,"Quarter, One",QB,ARI,10.25,1,vs BAL,234,4,0,19',
  '1,2,Runner,RB,ARI,0,1,vs BAL,0,5,-2,12',
  '1,3,Receiver,WR,ARI,-2,1,vs BAL,0,0,-3,12',
  '1,4,Tight End,TE,ARI,3.5,1,vs BAL,0,0,10,8',
  '1,5,Other Quarter,QB,BAL,20.5,1,@ ARI,300,2,0,21',
  '1,6,Other Runner,RB,BAL,8,1,@ ARI,0,10,12,10',
  '1,7,Other Receiver,WR,BAL,9,1,@ ARI,0,0,50,11',
  '1,8,Other Tight End,TE,BAL,1,1,@ ARI,0,0,0,7',
  '2,1,"Quarter, One",QB,ARI,14.75,1,@ BAL,200,3,0,19',
  '2,2,Runner,RB,ARI,6,1,@ BAL,0,7,3,12',
  '2,3,Receiver,WR,ARI,10,1,@ BAL,0,0,60,12',
  '2,4,Tight End,TE,ARI,4,1,@ BAL,0,0,20,8',
  '2,5,Other Quarter,QB,BAL,22.5,1,vs ARI,301,1,0,21',
  '2,6,Other Runner,RB,BAL,0,1,vs ARI,0,0,0,10',
  '2,7,Other Receiver,WR,BAL,5,1,vs ARI,0,0,20,11',
  '2,8,Other Tight End,TE,BAL,2,1,vs ARI,0,0,5,7',
].join('\n');
export const response = (csv, status = 200) => ({ ok: status === 200, status, text: async () => csv });
export const fixtureFetch = (csv = weekly, scheduleCsv = schedule) => async (url, options) => {
  if (options?.cache !== 'no-store') throw new Error('Local results must bypass HTTP cache.');
  const parsed = new URL(url);
  if (parsed.hostname === 'docs.google.com') throw new Error('Unexpected Sheets dependency.');
  return response(parsed.pathname.endsWith('Schedule2026.csv') ? scheduleCsv : csv);
};
