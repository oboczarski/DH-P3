(function() {
// Manual data source (top 100 FPTS), updated weekly.
// Replace the array below directly; structure mirrors the JSON in .ReferenceFolder/HP-Data-reference.json
const HP_DATA = [{"SZN":2025,"SLPR_ID":4034,"NM":"Christian McCaffrey","POS":"RB","AGE":29.3,"TM":"SF","G":11,"FPTS":283.9,"PPG":25.80909091,"CSTY%":0.9090909091,"CL":36.16666667,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":1439,"IMP/G":7.272727273,"SNP%":0.8319672131,"YPC":3.66,"TGT":96,"MTF/A":1.528497409,"YCO/A":1.528497409,"recYPG":66.54545455,"YPRR":null},{"SZN":2025,"SLPR_ID":6813,"NM":"Jonathan Taylor","POS":"RB","AGE":26.7,"TM":"IND","G":10,"FPTS":273.9,"PPG":27.39,"CSTY%":0.9,"CL":40.4,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":1399,"IMP/G":6.9,"SNP%":0.8290076336,"YPC":6.03,"TGT":32,"MTF/A":3.195767196,"YCO/A":3.195767196,"recYPG":26.0,"YPRR":null},{"SZN":2025,"SLPR_ID":4984,"NM":"Josh Allen","POS":"QB","AGE":29.4,"TM":"BUF","G":10,"FPTS":254.34,"PPG":25.434,"CSTY%":0.9,"CL":37.42,"TS%":null,"paYPG":245.6,"paRTG":105.55,"CMP%":0.6962457338,"TTT":2.972047782,"YDS(t)":2807,"IMP/G":14.5,"SNP%":0.9634703196,"YPC":5.4,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":9226,"NM":"De'Von Achane","POS":"RB","AGE":24.0,"TM":"MIA","G":11,"FPTS":235.0,"PPG":21.36363636,"CSTY%":1.0,"CL":32.56666667,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":1270,"IMP/G":5.181818182,"SNP%":0.7962382445,"YPC":5.49,"TGT":71,"MTF/A":2.81097561,"YCO/A":2.81097561,"recYPG":33.63636364,"YPRR":null},{"SZN":2025,"SLPR_ID":11564,"NM":"Drake Maye","POS":"QB","AGE":23.1,"TM":"NE","G":11,"FPTS":228.14,"PPG":20.74,"CSTY%":0.8181818182,"CL":26.94,"TS%":null,"paYPG":257.8181818,"paRTG":113.23,"CMP%":0.71875,"TTT":2.91378125,"YDS(t)":3123,"IMP/G":13.90909091,"SNP%":0.9773691655,"YPC":4.07,"TGT":1,"MTF/A":null,"YCO/A":null,"recYPG":0.1818181818,"YPRR":null},{"SZN":2025,"SLPR_ID":4046,"NM":"Patrick Mahomes","POS":"QB","AGE":30.0,"TM":"KC","G":10,"FPTS":225.8,"PPG":22.58,"CSTY%":0.7,"CL":28.83333333,"TS%":null,"paYPG":262.5,"paRTG":95.86,"CMP%":0.6454293629,"TTT":2.689473684,"YDS(t)":2913,"IMP/G":15.0,"SNP%":0.9673590504,"YPC":6.0,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":9488,"NM":"Jaxon Smith-Njigba","POS":"WR","AGE":23.6,"TM":"SEA","G":10,"FPTS":217.9,"PPG":21.79,"CSTY%":1.0,"CL":27.9,"TS%":0.351,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":1179,"IMP/G":5.4,"SNP%":0.7296,"YPC":6.6,"TGT":97,"MTF/A":null,"YCO/A":null,"recYPG":114.6,"YPRR":4.390804598},{"SZN":2025,"SLPR_ID":6797,"NM":"Justin Herbert","POS":"QB","AGE":27.6,"TM":"LAC","G":11,"FPTS":215.14,"PPG":19.55818182,"CSTY%":0.5454545455,"CL":28.84,"TS%":null,"paYPG":244.6363636,"paRTG":94.18,"CMP%":0.664893617,"TTT":2.856515957,"YDS(t)":3036,"IMP/G":13.63636364,"SNP%":0.9742547425,"YPC":6.39,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":9509,"NM":"Bijan Robinson","POS":"RB","AGE":23.7,"TM":"ATL","G":10,"FPTS":209.9,"PPG":20.99,"CSTY%":0.8,"CL":31.4,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":1289,"IMP/G":5.5,"SNP%":0.7884914463,"YPC":4.96,"TGT":59,"MTF/A":2.53164557,"YCO/A":2.53164557,"recYPG":50.6,"YPRR":null},{"SZN":2025,"SLPR_ID":11563,"NM":"Bo Nix","POS":"QB","AGE":25.6,"TM":"DEN","G":11,"FPTS":206.14,"PPG":18.74,"CSTY%":0.5454545455,"CL":30.49333333,"TS%":null,"paYPG":220.0909091,"paRTG":86.07,"CMP%":0.6124031008,"TTT":2.780155039,"YDS(t)":2634,"IMP/G":11.90909091,"SNP%":0.9945280438,"YPC":4.26,"TGT":1,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":9221,"NM":"Jahmyr Gibbs","POS":"RB","AGE":23.5,"TM":"DET","G":10,"FPTS":203.6,"PPG":20.36,"CSTY%":0.8,"CL":33.96666667,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":1066,"IMP/G":5.0,"SNP%":0.6148969889,"YPC":5.23,"TGT":43,"MTF/A":1.507142857,"YCO/A":1.507142857,"recYPG":33.4,"YPRR":null},{"SZN":2025,"SLPR_ID":421,"NM":"Matthew Stafford","POS":"QB","AGE":37.6,"TM":"LAR","G":10,"FPTS":203.38,"PPG":20.338,"CSTY%":0.6,"CL":27.22666667,"TS%":null,"paYPG":255.7,"paRTG":112.75,"CMP%":0.6597633136,"TTT":2.734585799,"YDS(t)":2548,"IMP/G":13.2,"SNP%":0.9954058193,"YPC":-0.38,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":6904,"NM":"Jalen Hurts","POS":"QB","AGE":27.1,"TM":"PHI","G":10,"FPTS":201.3,"PPG":20.13,"CSTY%":0.7,"CL":26.22666667,"TS%":null,"paYPG":199.5,"paRTG":107.02,"CMP%":0.6691449814,"TTT":3.015539033,"YDS(t)":2260,"IMP/G":11.6,"SNP%":0.9967051071,"YPC":3.63,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":5870,"NM":"Daniel Jones","POS":"QB","AGE":28.3,"TM":"IND","G":10,"FPTS":199.66,"PPG":19.966,"CSTY%":0.8,"CL":25.38,"TS%":null,"paYPG":265.9,"paRTG":101.6,"CMP%":0.6990595611,"TTT":2.743354232,"YDS(t)":2802,"IMP/G":14.7,"SNP%":0.9694656489,"YPC":3.58,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":3294,"NM":"Dak Prescott","POS":"QB","AGE":32.2,"TM":"DAL","G":10,"FPTS":199.18,"PPG":19.918,"CSTY%":0.7,"CL":27.85333333,"TS%":null,"paYPG":258.7,"paRTG":102.53,"CMP%":0.6988950276,"TTT":2.810856354,"YDS(t)":2704,"IMP/G":13.8,"SNP%":0.972181552,"YPC":3.55,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":11560,"NM":"Caleb Williams","POS":"QB","AGE":23.9,"TM":"CHI","G":10,"FPTS":196.56,"PPG":19.656,"CSTY%":0.6,"CL":30.97333333,"TS%":null,"paYPG":232.9,"paRTG":89.89,"CMP%":0.5969230769,"TTT":3.291661538,"YDS(t)":2623,"IMP/G":12.5,"SNP%":0.9838472834,"YPC":5.23,"TGT":2,"MTF/A":null,"YCO/A":null,"recYPG":2.2,"YPRR":null},{"SZN":2025,"SLPR_ID":7564,"NM":"Ja'Marr Chase","POS":"WR","AGE":25.6,"TM":"CIN","G":10,"FPTS":193.7,"PPG":19.37,"CSTY%":0.6,"CL":34.53333333,"TS%":0.314,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":867,"IMP/G":4.3,"SNP%":0.9516908213,"YPC":3.0,"TGT":117,"MTF/A":null,"YCO/A":null,"recYPG":86.1,"YPRR":2.265789474},{"SZN":2025,"SLPR_ID":9493,"NM":"Puka Nacua","POS":"WR","AGE":24.3,"TM":"LAR","G":9,"FPTS":193.3,"PPG":21.47777778,"CSTY%":0.8888888889,"CL":29.36666667,"TS%":0.257,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":923,"IMP/G":5.111111111,"SNP%":0.6861063465,"YPC":12.17,"TGT":87,"MTF/A":null,"YCO/A":null,"recYPG":94.44444444,"YPRR":3.526970954},{"SZN":2025,"SLPR_ID":8137,"NM":"George Pickens","POS":"WR","AGE":24.6,"TM":"DAL","G":10,"FPTS":190.8,"PPG":19.08,"CSTY%":0.9,"CL":31.53333333,"TS%":0.224,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":908,"IMP/G":5.0,"SNP%":0.8374816984,"YPC":0.0,"TGT":83,"MTF/A":null,"YCO/A":null,"recYPG":90.8,"YPRR":2.57223796},{"SZN":2025,"SLPR_ID":7547,"NM":"Amon-Ra St. Brown","POS":"WR","AGE":25.9,"TM":"DET","G":10,"FPTS":188.4,"PPG":18.84,"CSTY%":0.8,"CL":28.63333333,"TS%":0.3,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":744,"IMP/G":3.9,"SNP%":0.882725832,"YPC":3.0,"TGT":94,"MTF/A":null,"YCO/A":null,"recYPG":73.5,"YPRR":2.355769231},{"SZN":2025,"SLPR_ID":8130,"NM":"Trey McBride","POS":"TE","AGE":25.8,"TM":"ARI","G":10,"FPTS":184.8,"PPG":18.48,"CSTY%":0.9,"CL":28.2,"TS%":0.264,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":718,"IMP/G":3.8,"SNP%":0.9014492754,"YPC":0.0,"TGT":99,"MTF/A":null,"YCO/A":null,"recYPG":71.8,"YPRR":1.967123288},{"SZN":2025,"SLPR_ID":4892,"NM":"Baker Mayfield","POS":"QB","AGE":30.4,"TM":"TB","G":10,"FPTS":183.3,"PPG":18.33,"CSTY%":0.8,"CL":24.05333333,"TS%":null,"paYPG":236.5,"paRTG":97.0,"CMP%":0.6352941176,"TTT":2.820676471,"YDS(t)":2562,"IMP/G":12.1,"SNP%":0.9939577039,"YPC":7.3,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":8138,"NM":"James Cook","POS":"RB","AGE":26.0,"TM":"BUF","G":10,"FPTS":182.8,"PPG":18.28,"CSTY%":0.7,"CL":27.53333333,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":1158,"IMP/G":5.0,"SNP%":0.599695586,"YPC":5.32,"TGT":23,"MTF/A":2.362637363,"YCO/A":2.362637363,"recYPG":19.0,"YPRR":null},{"SZN":2025,"SLPR_ID":5850,"NM":"Josh Jacobs","POS":"RB","AGE":27.6,"TM":"GB","G":10,"FPTS":180.5,"PPG":18.05,"CSTY%":0.9,"CL":27.4,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":885,"IMP/G":4.8,"SNP%":0.6398104265,"YPC":3.83,"TGT":35,"MTF/A":2.218934911,"YCO/A":2.218934911,"recYPG":23.7,"YPRR":null},{"SZN":2025,"SLPR_ID":3163,"NM":"Jared Goff","POS":"QB","AGE":31.0,"TM":"DET","G":10,"FPTS":177.8,"PPG":17.78,"CSTY%":0.5,"CL":26.29333333,"TS%":null,"paYPG":249.0,"paRTG":110.82,"CMP%":0.6967741935,"TTT":2.733258065,"YDS(t)":2512,"IMP/G":12.6,"SNP%":0.9746434231,"YPC":1.83,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":8112,"NM":"Drake London","POS":"WR","AGE":24.2,"TM":"ATL","G":9,"FPTS":177.0,"PPG":19.66666667,"CSTY%":0.6666666667,"CL":31.86666667,"TS%":0.287,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":810,"IMP/G":4.333333333,"SNP%":0.9190556492,"YPC":0.0,"TGT":94,"MTF/A":null,"YCO/A":null,"recYPG":90.0,"YPRR":2.736486486},{"SZN":2025,"SLPR_ID":6804,"NM":"Jordan Love","POS":"QB","AGE":26.9,"TM":"GB","G":10,"FPTS":168.34,"PPG":16.834,"CSTY%":0.4,"CL":25.15333333,"TS%":null,"paYPG":242.1,"paRTG":103.17,"CMP%":0.6774193548,"TTT":2.875193548,"YDS(t)":2566,"IMP/G":12.5,"SNP%":0.9889415482,"YPC":4.39,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":8150,"NM":"Kyren Williams","POS":"RB","AGE":25.1,"TM":"LAR","G":10,"FPTS":166.2,"PPG":16.62,"CSTY%":0.7,"CL":24.23333333,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":932,"IMP/G":5.5,"SNP%":0.7151607963,"YPC":4.75,"TGT":31,"MTF/A":1.85443038,"YCO/A":1.85443038,"recYPG":18.2,"YPRR":null},{"SZN":2025,"SLPR_ID":7588,"NM":"Javonte Williams","POS":"RB","AGE":25.4,"TM":"DAL","G":10,"FPTS":166.2,"PPG":16.62,"CSTY%":0.7,"CL":24.1,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":902,"IMP/G":4.9,"SNP%":0.7496339678,"YPC":5.02,"TGT":36,"MTF/A":2.795031056,"YCO/A":2.795031056,"recYPG":9.3,"YPRR":null},{"SZN":2025,"SLPR_ID":7523,"NM":"Trevor Lawrence","POS":"QB","AGE":26.0,"TM":"JAX","G":10,"FPTS":166.14,"PPG":16.614,"CSTY%":0.6,"CL":23.56,"TS%":null,"paYPG":215.1,"paRTG":79.39,"CMP%":0.5976331361,"TTT":2.799408284,"YDS(t)":2332,"IMP/G":12.4,"SNP%":0.9885550787,"YPC":3.69,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":12508,"NM":"Jaxson Dart","POS":"QB","AGE":22.4,"TM":"NYG","G":9,"FPTS":163.38,"PPG":18.15333333,"CSTY%":0.7777777778,"CL":27.64666667,"TS%":null,"paYPG":157.4444444,"paRTG":93.53,"CMP%":0.6274509804,"TTT":2.893823529,"YDS(t)":1734,"IMP/G":9.777777778,"SNP%":0.6785185185,"YPC":5.56,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":7021,"NM":"Rico Dowdle","POS":"RB","AGE":27.3,"TM":"CAR","G":11,"FPTS":162.0,"PPG":14.72727273,"CSTY%":0.4545454545,"CL":31.46666667,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":1030,"IMP/G":4.727272727,"SNP%":0.5543478261,"YPC":4.96,"TGT":30,"MTF/A":2.172619048,"YCO/A":2.172619048,"recYPG":17.90909091,"YPRR":null},{"SZN":2025,"SLPR_ID":2133,"NM":"Davante Adams","POS":"WR","AGE":32.8,"TM":"LAR","G":10,"FPTS":159.9,"PPG":15.99,"CSTY%":0.7,"CL":24.03333333,"TS%":0.254,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":569,"IMP/G":3.5,"SNP%":0.7503828484,"YPC":0.0,"TGT":86,"MTF/A":null,"YCO/A":null,"recYPG":56.9,"YPRR":1.86557377},{"SZN":2025,"SLPR_ID":4943,"NM":"Sam Darnold","POS":"QB","AGE":28.3,"TM":"SEA","G":10,"FPTS":156.64,"PPG":15.664,"CSTY%":0.6,"CL":25.61333333,"TS%":null,"paYPG":254.1,"paRTG":105.04,"CMP%":0.7022058824,"TTT":2.864338235,"YDS(t)":2591,"IMP/G":11.5,"SNP%":0.9568,"YPC":3.33,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":12514,"NM":"Emeka Egbuka","POS":"WR","AGE":23.0,"TM":"TB","G":10,"FPTS":155.6,"PPG":15.56,"CSTY%":0.6,"CL":26.13333333,"TS%":0.25,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":726,"IMP/G":2.7,"SNP%":0.8277945619,"YPC":4.5,"TGT":85,"MTF/A":null,"YCO/A":null,"recYPG":71.7,"YPRR":2.23364486},{"SZN":2025,"SLPR_ID":12526,"NM":"Tetairoa McMillan","POS":"WR","AGE":22.5,"TM":"CAR","G":11,"FPTS":152.8,"PPG":13.89090909,"CSTY%":0.4545454545,"CL":22.6,"TS%":0.254,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":748,"IMP/G":4.0,"SNP%":0.8858695652,"YPC":0.0,"TGT":89,"MTF/A":null,"YCO/A":null,"recYPG":68.0,"YPRR":2.089385475},{"SZN":2025,"SLPR_ID":96,"NM":"Aaron Rodgers","POS":"QB","AGE":41.8,"TM":"PIT","G":10,"FPTS":152.36,"PPG":15.236,"CSTY%":0.4,"CL":22.57333333,"TS%":null,"paYPG":196.9,"paRTG":97.66,"CMP%":0.6643598616,"TTT":2.639930796,"YDS(t)":1995,"IMP/G":8.6,"SNP%":0.9416809605,"YPC":1.86,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":7526,"NM":"Jaylen Waddle","POS":"WR","AGE":26.8,"TM":"MIA","G":11,"FPTS":151.52,"PPG":13.77454545,"CSTY%":0.6363636364,"CL":21.1,"TS%":0.221,"paYPG":0.7272727273,"paRTG":100.0,"CMP%":1.0,"TTT":null,"YDS(t)":730,"IMP/G":3.181818182,"SNP%":0.8150470219,"YPC":0.0,"TGT":73,"MTF/A":null,"YCO/A":null,"recYPG":65.63636364,"YPRR":2.506944444},{"SZN":2025,"SLPR_ID":4866,"NM":"Saquon Barkley","POS":"RB","AGE":28.6,"TM":"PHI","G":10,"FPTS":150.9,"PPG":15.09,"CSTY%":0.6,"CL":23.2,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":869,"IMP/G":3.4,"SNP%":0.7858319605,"YPC":3.78,"TGT":33,"MTF/A":1.468571429,"YCO/A":1.468571429,"recYPG":20.7,"YPRR":null},{"SZN":2025,"SLPR_ID":6819,"NM":"Michael Pittman","POS":"WR","AGE":28.0,"TM":"IND","G":10,"FPTS":150.0,"PPG":15.0,"CSTY%":0.7,"CL":21.6,"TS%":0.216,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":580,"IMP/G":3.5,"SNP%":0.841221374,"YPC":0.0,"TGT":70,"MTF/A":null,"YCO/A":null,"recYPG":58.0,"YPRR":1.920529801},{"SZN":2025,"SLPR_ID":8144,"NM":"Chris Olave","POS":"WR","AGE":25.2,"TM":"NO","G":10,"FPTS":149.1,"PPG":14.91,"CSTY%":0.7,"CL":21.33333333,"TS%":0.277,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":661,"IMP/G":2.7,"SNP%":0.8341085271,"YPC":-3.0,"TGT":95,"MTF/A":null,"YCO/A":null,"recYPG":66.4,"YPRR":1.976190476},{"SZN":2025,"SLPR_ID":19,"NM":"Joe Flacco","POS":"QB","AGE":40.7,"TM":"CIN","G":9,"FPTS":144.52,"PPG":16.05777778,"CSTY%":0.4444444444,"CL":27.66666667,"TS%":null,"paYPG":252.0,"paRTG":80.81,"CMP%":0.6112600536,"TTT":2.723136729,"YDS(t)":2296,"IMP/G":12.33333333,"SNP%":0.8833819242,"YPC":1.87,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":6768,"NM":"Tua Tagovailoa","POS":"QB","AGE":27.6,"TM":"MIA","G":11,"FPTS":143.72,"PPG":13.06545455,"CSTY%":0.2727272727,"CL":22.18,"TS%":null,"paYPG":193.0,"paRTG":88.13,"CMP%":0.6826923077,"TTT":2.579967949,"YDS(t)":2161,"IMP/G":10.18181818,"SNP%":0.9561128527,"YPC":2.71,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":7591,"NM":"Justin Fields","POS":"QB","AGE":26.6,"TM":"NYJ","G":9,"FPTS":143.66,"PPG":15.96222222,"CSTY%":0.5555555556,"CL":27.52666667,"TS%":null,"paYPG":139.8888889,"paRTG":89.48,"CMP%":0.6274509804,"TTT":2.929411765,"YDS(t)":1642,"IMP/G":9.333333333,"SNP%":0.9076086957,"YPC":5.39,"TGT":1,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":4881,"NM":"Lamar Jackson","POS":"QB","AGE":28.7,"TM":"BAL","G":7,"FPTS":143.28,"PPG":20.46857143,"CSTY%":0.7142857143,"CL":27.56,"TS%":null,"paYPG":206.0,"paRTG":115.5,"CMP%":0.6802325581,"TTT":2.846627907,"YDS(t)":1668,"IMP/G":11.85714286,"SNP%":0.9530864198,"YPC":5.79,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":6794,"NM":"Justin Jefferson","POS":"WR","AGE":26.3,"TM":"MIN","G":10,"FPTS":143.1,"PPG":14.31,"CSTY%":0.7,"CL":19.53333333,"TS%":0.292,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":751,"IMP/G":3.2,"SNP%":0.9619205298,"YPC":4.0,"TGT":93,"MTF/A":null,"YCO/A":null,"recYPG":74.7,"YPRR":2.190615836},{"SZN":2025,"SLPR_ID":7543,"NM":"Travis Etienne","POS":"RB","AGE":26.7,"TM":"JAX","G":10,"FPTS":142.9,"PPG":14.29,"CSTY%":0.6,"CL":19.13333333,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":859,"IMP/G":3.9,"SNP%":0.5793991416,"YPC":4.73,"TGT":33,"MTF/A":2.38961039,"YCO/A":2.38961039,"recYPG":13.0,"YPRR":null},{"SZN":2025,"SLPR_ID":2449,"NM":"Stefon Diggs","POS":"WR","AGE":31.8,"TM":"NE","G":11,"FPTS":142.9,"PPG":12.99090909,"CSTY%":0.5454545455,"CL":20.06666667,"TS%":0.224,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":659,"IMP/G":3.090909091,"SNP%":0.5530410184,"YPC":0.0,"TGT":72,"MTF/A":null,"YCO/A":null,"recYPG":59.90909091,"YPRR":2.678861789},{"SZN":2025,"SLPR_ID":11635,"NM":"Ladd McConkey","POS":"WR","AGE":23.9,"TM":"LAC","G":11,"FPTS":142.4,"PPG":12.94545455,"CSTY%":0.5454545455,"CL":21.5,"TS%":0.216,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":644,"IMP/G":2.636363636,"SNP%":0.7723577236,"YPC":0.0,"TGT":84,"MTF/A":null,"YCO/A":null,"recYPG":58.54545455,"YPRR":1.731182796},{"SZN":2025,"SLPR_ID":5872,"NM":"Deebo Samuel","POS":"WR","AGE":29.7,"TM":"WAS","G":10,"FPTS":141.2,"PPG":14.12,"CSTY%":0.6,"CL":22.3,"TS%":0.221,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":522,"IMP/G":2.2,"SNP%":0.7406807131,"YPC":4.73,"TGT":68,"MTF/A":null,"YCO/A":null,"recYPG":47.0,"YPRR":1.934156379},{"SZN":2025,"SLPR_ID":12527,"NM":"Ashton Jeanty","POS":"RB","AGE":21.8,"TM":"LV","G":10,"FPTS":140.7,"PPG":14.07,"CSTY%":0.6,"CL":23.33333333,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":717,"IMP/G":3.6,"SNP%":0.7312186978,"YPC":3.72,"TGT":38,"MTF/A":2.422818792,"YCO/A":2.422818792,"recYPG":16.3,"YPRR":null},{"SZN":2025,"SLPR_ID":8110,"NM":"Jake Ferguson","POS":"TE","AGE":26.7,"TM":"DAL","G":10,"FPTS":140.0,"PPG":14.0,"CSTY%":0.7,"CL":22.33333333,"TS%":0.191,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":400,"IMP/G":1.9,"SNP%":0.6852122987,"YPC":0.0,"TGT":71,"MTF/A":null,"YCO/A":null,"recYPG":40.0,"YPRR":1.408450704},{"SZN":2025,"SLPR_ID":1479,"NM":"Keenan Allen","POS":"WR","AGE":33.4,"TM":"LAC","G":11,"FPTS":139.2,"PPG":12.65454545,"CSTY%":0.3636363636,"CL":22.73333333,"TS%":0.222,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":592,"IMP/G":3.272727273,"SNP%":0.5636856369,"YPC":0.0,"TGT":86,"MTF/A":null,"YCO/A":null,"recYPG":53.81818182,"YPRR":1.986577181},{"SZN":2025,"SLPR_ID":1466,"NM":"Travis Kelce","POS":"TE","AGE":36.0,"TM":"KC","G":10,"FPTS":139.1,"PPG":13.91,"CSTY%":0.6,"CL":21.7,"TS%":0.183,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":631,"IMP/G":3.3,"SNP%":0.7596439169,"YPC":0.0,"TGT":66,"MTF/A":null,"YCO/A":null,"recYPG":63.1,"YPRR":2.117449664},{"SZN":2025,"SLPR_ID":8155,"NM":"Breece Hall","POS":"RB","AGE":24.3,"TM":"NYJ","G":10,"FPTS":138.96,"PPG":13.896,"CSTY%":0.5,"CL":23.28666667,"TS%":null,"paYPG":0.4,"paRTG":122.92,"CMP%":1.0,"TTT":null,"YDS(t)":952,"IMP/G":4.9,"SNP%":0.6231884058,"YPC":4.75,"TGT":33,"MTF/A":2.203947368,"YCO/A":2.203947368,"recYPG":22.6,"YPRR":null},{"SZN":2025,"SLPR_ID":7569,"NM":"Nico Collins","POS":"WR","AGE":26.5,"TM":"HOU","G":9,"FPTS":138.0,"PPG":15.33333333,"CSTY%":0.6666666667,"CL":23.06666667,"TS%":0.227,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":650,"IMP/G":3.222222222,"SNP%":0.7786885246,"YPC":8.0,"TGT":82,"MTF/A":null,"YCO/A":null,"recYPG":71.33333333,"YPRR":2.244755245},{"SZN":2025,"SLPR_ID":3198,"NM":"Derrick Henry","POS":"RB","AGE":31.7,"TM":"BAL","G":10,"FPTS":137.1,"PPG":13.71,"CSTY%":0.5,"CL":22.83333333,"TS%":null,"paYPG":0.0,"paRTG":39.58,"CMP%":0.0,"TTT":null,"YDS(t)":881,"IMP/G":4.1,"SNP%":0.5612244898,"YPC":4.86,"TGT":15,"MTF/A":1.981927711,"YCO/A":1.981927711,"recYPG":7.4,"YPRR":null},{"SZN":2025,"SLPR_ID":12518,"NM":"Tyler Warren","POS":"TE","AGE":23.4,"TM":"IND","G":10,"FPTS":136.3,"PPG":13.63,"CSTY%":0.7,"CL":18.16666667,"TS%":0.207,"paYPG":0.0,"paRTG":39.58,"CMP%":0.0,"TTT":null,"YDS(t)":623,"IMP/G":3.2,"SNP%":0.8229007634,"YPC":1.5,"TGT":67,"MTF/A":0.5,"YCO/A":0.5,"recYPG":61.7,"YPRR":2.187943262},{"SZN":2025,"SLPR_ID":7527,"NM":"Mac Jones","POS":"QB","AGE":27.1,"TM":"SF","G":9,"FPTS":136.14,"PPG":15.12666667,"CSTY%":0.4444444444,"CL":22.66666667,"TS%":null,"paYPG":239.0,"paRTG":97.4,"CMP%":0.6955017301,"TTT":2.715017301,"YDS(t)":2212,"IMP/G":13.0,"SNP%":0.7363387978,"YPC":1.97,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":5045,"NM":"Courtland Sutton","POS":"WR","AGE":30.0,"TM":"DEN","G":11,"FPTS":135.9,"PPG":12.35454545,"CSTY%":0.4545454545,"CL":20.33333333,"TS%":0.191,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":649,"IMP/G":2.909090909,"SNP%":0.8796169631,"YPC":0.0,"TGT":74,"MTF/A":null,"YCO/A":null,"recYPG":59.0,"YPRR":1.744623656},{"SZN":2025,"SLPR_ID":9228,"NM":"Bryce Young","POS":"QB","AGE":24.2,"TM":"CAR","G":10,"FPTS":135.78,"PPG":13.578,"CSTY%":0.3,"CL":24.53333333,"TS%":null,"paYPG":196.2,"paRTG":85.97,"CMP%":0.627388535,"TTT":2.785636943,"YDS(t)":2045,"IMP/G":11.2,"SNP%":0.9466666667,"YPC":3.61,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":6790,"NM":"D'Andre Swift","POS":"RB","AGE":26.7,"TM":"CHI","G":9,"FPTS":135.4,"PPG":15.04444444,"CSTY%":0.6666666667,"CL":20.76666667,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":844,"IMP/G":5.0,"SNP%":0.6039933444,"YPC":4.73,"TGT":33,"MTF/A":1.873134328,"YCO/A":1.873134328,"recYPG":23.33333333,"YPRR":null},{"SZN":2025,"SLPR_ID":11620,"NM":"Rome Odunze","POS":"WR","AGE":23.3,"TM":"CHI","G":10,"FPTS":135.0,"PPG":13.5,"CSTY%":0.6,"CL":23.6,"TS%":0.227,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":600,"IMP/G":3.3,"SNP%":0.8986784141,"YPC":0.0,"TGT":75,"MTF/A":null,"YCO/A":null,"recYPG":60.0,"YPRR":1.886792453},{"SZN":2025,"SLPR_ID":9224,"NM":"Chase Brown","POS":"RB","AGE":25.5,"TM":"CIN","G":10,"FPTS":133.8,"PPG":13.38,"CSTY%":0.5,"CL":21.13333333,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":748,"IMP/G":3.7,"SNP%":0.6779388084,"YPC":4.12,"TGT":53,"MTF/A":2.261904762,"YCO/A":2.261904762,"recYPG":22.9,"YPRR":null},{"SZN":2025,"SLPR_ID":7525,"NM":"DeVonta Smith","POS":"WR","AGE":26.9,"TM":"PHI","G":10,"FPTS":133.5,"PPG":13.35,"CSTY%":0.5,"CL":24.23333333,"TS%":0.249,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":665,"IMP/G":2.8,"SNP%":0.9176276771,"YPC":0.0,"TGT":67,"MTF/A":null,"YCO/A":null,"recYPG":66.5,"YPRR":2.285223368},{"SZN":2025,"SLPR_ID":6801,"NM":"Tee Higgins","POS":"WR","AGE":26.7,"TM":"CIN","G":10,"FPTS":133.4,"PPG":13.34,"CSTY%":0.4,"CL":23.33333333,"TS%":0.172,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":544,"IMP/G":2.7,"SNP%":0.8599033816,"YPC":0.0,"TGT":64,"MTF/A":null,"YCO/A":null,"recYPG":54.4,"YPRR":1.515320334},{"SZN":2025,"SLPR_ID":8126,"NM":"Wan'Dale Robinson","POS":"WR","AGE":24.7,"TM":"NYG","G":11,"FPTS":133.0,"PPG":12.09090909,"CSTY%":0.4545454545,"CL":21.36666667,"TS%":0.25,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":640,"IMP/G":2.363636364,"SNP%":0.9103078983,"YPC":2.0,"TGT":88,"MTF/A":null,"YCO/A":null,"recYPG":58.0,"YPRR":1.817663818},{"SZN":2025,"SLPR_ID":11627,"NM":"Troy Franklin","POS":"WR","AGE":22.6,"TM":"DEN","G":11,"FPTS":131.8,"PPG":11.98181818,"CSTY%":0.4545454545,"CL":21.96666667,"TS%":0.209,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":518,"IMP/G":2.363636364,"SNP%":0.6648426813,"YPC":2.25,"TGT":81,"MTF/A":null,"YCO/A":null,"recYPG":46.27272727,"YPRR":1.585669782},{"SZN":2025,"SLPR_ID":1373,"NM":"Geno Smith","POS":"QB","AGE":35.0,"TM":"LV","G":10,"FPTS":130.48,"PPG":13.048,"CSTY%":0.3,"CL":23.93333333,"TS%":null,"paYPG":208.2,"paRTG":80.86,"CMP%":0.6634304207,"TTT":2.827799353,"YDS(t)":2184,"IMP/G":11.3,"SNP%":0.9883138564,"YPC":3.0,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":9997,"NM":"Zay Flowers","POS":"WR","AGE":25.0,"TM":"BAL","G":10,"FPTS":130.4,"PPG":13.04,"CSTY%":0.6,"CL":19.13333333,"TS%":0.271,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":734,"IMP/G":2.9,"SNP%":0.869047619,"YPC":5.17,"TGT":71,"MTF/A":null,"YCO/A":null,"recYPG":70.3,"YPRR":2.594095941},{"SZN":2025,"SLPR_ID":12481,"NM":"Cam Skattebo","POS":"RB","AGE":23.6,"TM":"NYG","G":8,"FPTS":127.7,"PPG":15.9625,"CSTY%":0.75,"CL":24.5,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":617,"IMP/G":4.75,"SNP%":0.5412844037,"YPC":4.06,"TGT":32,"MTF/A":1.900990099,"YCO/A":1.900990099,"recYPG":25.875,"YPRR":null},{"SZN":2025,"SLPR_ID":9758,"NM":"C.J. Stroud","POS":"QB","AGE":24.0,"TM":"HOU","G":8,"FPTS":125.98,"PPG":15.7475,"CSTY%":0.375,"CL":23.3,"TS%":null,"paYPG":212.75,"paRTG":93.37,"CMP%":0.6652892562,"TTT":2.742272727,"YDS(t)":1891,"IMP/G":11.375,"SNP%":0.8825688073,"YPC":6.52,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":12529,"NM":"TreVeyon Henderson","POS":"RB","AGE":22.9,"TM":"NE","G":11,"FPTS":125.7,"PPG":11.42727273,"CSTY%":0.3636363636,"CL":24.33333333,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":657,"IMP/G":2.818181818,"SNP%":0.4611032532,"YPC":4.92,"TGT":30,"MTF/A":2.46,"YCO/A":2.46,"recYPG":15.0,"YPRR":null},{"SZN":2025,"SLPR_ID":11559,"NM":"Michael Penix Jr.","POS":"QB","AGE":25.4,"TM":"ATL","G":9,"FPTS":123.28,"PPG":13.69777778,"CSTY%":0.3333333333,"CL":22.16,"TS%":null,"paYPG":220.2222222,"paRTG":88.47,"CMP%":0.6014492754,"TTT":2.789456522,"YDS(t)":2052,"IMP/G":11.55555556,"SNP%":0.9325463744,"YPC":3.33,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":5846,"NM":"DK Metcalf","POS":"WR","AGE":27.8,"TM":"PIT","G":10,"FPTS":122.1,"PPG":12.21,"CSTY%":0.5,"CL":19.86666667,"TS%":0.202,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":551,"IMP/G":2.6,"SNP%":0.8885077187,"YPC":0.0,"TGT":62,"MTF/A":null,"YCO/A":null,"recYPG":55.1,"YPRR":1.794788274},{"SZN":2025,"SLPR_ID":9754,"NM":"Quentin Johnston","POS":"WR","AGE":24.1,"TM":"LAC","G":10,"FPTS":121.9,"PPG":12.19,"CSTY%":0.5,"CL":21.53333333,"TS%":0.168,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":509,"IMP/G":1.8,"SNP%":0.7982195846,"YPC":3.5,"TGT":66,"MTF/A":null,"YCO/A":null,"recYPG":50.2,"YPRR":1.467836257},{"SZN":2025,"SLPR_ID":10213,"NM":"Tre Tucker","POS":"WR","AGE":24.6,"TM":"LV","G":10,"FPTS":121.8,"PPG":12.18,"CSTY%":0.4,"CL":23.0,"TS%":0.173,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":538,"IMP/G":2.3,"SNP%":0.9365609349,"YPC":6.0,"TGT":54,"MTF/A":null,"YCO/A":null,"recYPG":50.2,"YPRR":1.544615385},{"SZN":2025,"SLPR_ID":8228,"NM":"Jaylen Warren","POS":"RB","AGE":26.9,"TM":"PIT","G":9,"FPTS":118.5,"PPG":13.16666667,"CSTY%":0.5555555556,"CL":18.03333333,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":755,"IMP/G":4.444444444,"SNP%":0.5433962264,"YPC":4.36,"TGT":28,"MTF/A":2.739837398,"YCO/A":2.739837398,"recYPG":24.33333333,"YPRR":null},{"SZN":2025,"SLPR_ID":8148,"NM":"Jameson Williams","POS":"WR","AGE":24.5,"TM":"DET","G":10,"FPTS":118.2,"PPG":11.82,"CSTY%":0.5,"CL":20.8,"TS%":0.16,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":572,"IMP/G":2.6,"SNP%":0.8874801902,"YPC":2.5,"TGT":50,"MTF/A":null,"YCO/A":null,"recYPG":56.2,"YPRR":1.784126984},{"SZN":2025,"SLPR_ID":9484,"NM":"Tucker Kraft","POS":"TE","AGE":24.9,"TM":"GB","G":8,"FPTS":117.2,"PPG":14.65,"CSTY%":0.5,"CL":24.83333333,"TS%":0.141,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":492,"IMP/G":2.75,"SNP%":0.8607843137,"YPC":3.0,"TGT":44,"MTF/A":0.0,"YCO/A":0.0,"recYPG":61.125,"YPRR":2.657608696},{"SZN":2025,"SLPR_ID":6806,"NM":"J.K. Dobbins","POS":"RB","AGE":26.8,"TM":"DEN","G":10,"FPTS":115.9,"PPG":11.59,"CSTY%":0.5,"CL":15.4,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":809,"IMP/G":3.7,"SNP%":0.5082212257,"YPC":5.05,"TGT":14,"MTF/A":2.444444444,"YCO/A":2.444444444,"recYPG":3.7,"YPRR":null},{"SZN":2025,"SLPR_ID":8121,"NM":"Romeo Doubs","POS":"WR","AGE":25.5,"TM":"GB","G":10,"FPTS":114.9,"PPG":11.49,"CSTY%":0.3,"CL":19.7,"TS%":0.205,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":499,"IMP/G":3.0,"SNP%":0.8120063191,"YPC":0.0,"TGT":64,"MTF/A":null,"YCO/A":null,"recYPG":49.9,"YPRR":1.883018868},{"SZN":2025,"SLPR_ID":5022,"NM":"Dallas Goedert","POS":"TE","AGE":30.7,"TM":"PHI","G":9,"FPTS":113.6,"PPG":12.62222222,"CSTY%":0.4444444444,"CL":21.16666667,"TS%":0.186,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":356,"IMP/G":2.222222222,"SNP%":0.8409506399,"YPC":0.0,"TGT":50,"MTF/A":null,"YCO/A":null,"recYPG":39.55555556,"YPRR":1.589285714},{"SZN":2025,"SLPR_ID":11566,"NM":"Jayden Daniels","POS":"QB","AGE":24.8,"TM":"WAS","G":6,"FPTS":113.56,"PPG":18.92666667,"CSTY%":1.0,"CL":20.82,"TS%":null,"paYPG":197.3333333,"paRTG":94.44,"CMP%":0.625,"TTT":2.808928571,"YDS(t)":1446,"IMP/G":11.33333333,"SNP%":0.9265822785,"YPC":4.85,"TGT":0,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":12512,"NM":"Quinshon Judkins","POS":"RB","AGE":21.9,"TM":"CLE","G":9,"FPTS":113.0,"PPG":12.55555556,"CSTY%":0.4444444444,"CL":21.46666667,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":690,"IMP/G":4.444444444,"SNP%":0.4907872697,"YPC":3.95,"TGT":20,"MTF/A":2.407643312,"YCO/A":2.407643312,"recYPG":7.777777778,"YPRR":null},{"SZN":2025,"SLPR_ID":8676,"NM":"Rashid Shaheed","POS":"WR","AGE":27.1,"TM":"SEA","G":11,"FPTS":112.6,"PPG":10.23636364,"CSTY%":0.1818181818,"CL":16.13333333,"TS%":0.261,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":556,"IMP/G":2.272727273,"SNP%":0.6804979253,"YPC":5.4,"TGT":72,"MTF/A":null,"YCO/A":null,"recYPG":48.09090909,"YPRR":1.663522013},{"SZN":2025,"SLPR_ID":11628,"NM":"Marvin Harrison Jr.","POS":"WR","AGE":23.1,"TM":"ARI","G":9,"FPTS":112.5,"PPG":12.5,"CSTY%":0.5555555556,"CL":19.76666667,"TS%":0.165,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":525,"IMP/G":2.777777778,"SNP%":0.7846655791,"YPC":0.0,"TGT":62,"MTF/A":null,"YCO/A":null,"recYPG":58.33333333,"YPRR":1.761744966},{"SZN":2025,"SLPR_ID":8151,"NM":"Kenneth Walker III","POS":"RB","AGE":24.9,"TM":"SEA","G":10,"FPTS":111.3,"PPG":11.13,"CSTY%":0.4,"CL":18.96666667,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":733,"IMP/G":3.3,"SNP%":0.4544,"YPC":4.46,"TGT":15,"MTF/A":1.669117647,"YCO/A":1.669117647,"recYPG":12.7,"YPRR":null},{"SZN":2025,"SLPR_ID":5892,"NM":"David Montgomery","POS":"RB","AGE":28.3,"TM":"DET","G":10,"FPTS":110.02,"PPG":11.002,"CSTY%":0.3,"CL":20.24,"TS%":null,"paYPG":0.3,"paRTG":118.75,"CMP%":1.0,"TTT":null,"YDS(t)":612,"IMP/G":3.2,"SNP%":0.4088748019,"YPC":4.48,"TGT":19,"MTF/A":2.190909091,"YCO/A":2.190909091,"recYPG":11.6,"YPRR":null},{"SZN":2025,"SLPR_ID":8134,"NM":"Khalil Shakir","POS":"WR","AGE":25.6,"TM":"BUF","G":10,"FPTS":109.9,"PPG":10.99,"CSTY%":0.5,"CL":17.73333333,"TS%":0.204,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":459,"IMP/G":2.1,"SNP%":0.596651446,"YPC":5.0,"TGT":61,"MTF/A":null,"YCO/A":null,"recYPG":45.4,"YPRR":1.907563025},{"SZN":2025,"SLPR_ID":7567,"NM":"Kenneth Gainwell","POS":"RB","AGE":26.5,"TM":"PIT","G":10,"FPTS":109.8,"PPG":10.98,"CSTY%":0.2,"CL":23.5,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":448,"IMP/G":2.9,"SNP%":0.4596912521,"YPC":4.0,"TGT":42,"MTF/A":1.967213115,"YCO/A":1.967213115,"recYPG":20.4,"YPRR":null},{"SZN":2025,"SLPR_ID":7002,"NM":"Juwan Johnson","POS":"TE","AGE":29.0,"TM":"NO","G":10,"FPTS":108.1,"PPG":10.81,"CSTY%":0.6,"CL":16.9,"TS%":0.175,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":491,"IMP/G":2.4,"SNP%":0.8093023256,"YPC":0.0,"TGT":60,"MTF/A":null,"YCO/A":null,"recYPG":49.1,"YPRR":1.687285223},{"SZN":2025,"SLPR_ID":6786,"NM":"CeeDee Lamb","POS":"WR","AGE":26.5,"TM":"DAL","G":7,"FPTS":107.9,"PPG":15.41428571,"CSTY%":0.8571428571,"CL":20.06666667,"TS%":0.164,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":559,"IMP/G":3.285714286,"SNP%":0.7174348697,"YPC":2.0,"TGT":61,"MTF/A":null,"YCO/A":null,"recYPG":79.57142857,"YPRR":2.543378995},{"SZN":2025,"SLPR_ID":12489,"NM":"RJ Harvey","POS":"RB","AGE":24.6,"TM":"DEN","G":11,"FPTS":107.9,"PPG":9.809090909,"CSTY%":0.2727272727,"CL":20.16666667,"TS%":null,"paYPG":0.0,"paRTG":39.58,"CMP%":0.0,"TTT":null,"YDS(t)":439,"IMP/G":1.636363636,"SNP%":0.3187414501,"YPC":4.0,"TGT":32,"MTF/A":2.06557377,"YCO/A":2.06557377,"recYPG":17.72727273,"YPRR":null},{"SZN":2025,"SLPR_ID":10859,"NM":"Sam LaPorta","POS":"TE","AGE":24.7,"TM":"DET","G":9,"FPTS":106.9,"PPG":11.87777778,"CSTY%":0.4444444444,"CL":19.46666667,"TS%":0.157,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":489,"IMP/G":2.555555556,"SNP%":0.9038461538,"YPC":0.0,"TGT":49,"MTF/A":null,"YCO/A":null,"recYPG":54.33333333,"YPRR":2.020661157},{"SZN":2025,"SLPR_ID":5001,"NM":"Dalton Schultz","POS":"TE","AGE":29.2,"TM":"HOU","G":10,"FPTS":105.9,"PPG":10.59,"CSTY%":0.5,"CL":16.93333333,"TS%":0.188,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":489,"IMP/G":2.6,"SNP%":0.7014492754,"YPC":0.0,"TGT":68,"MTF/A":null,"YCO/A":null,"recYPG":48.9,"YPRR":1.727915194},{"SZN":2025,"SLPR_ID":5848,"NM":"Marquise Brown","POS":"WR","AGE":28.3,"TM":"KC","G":10,"FPTS":104.9,"PPG":10.49,"CSTY%":0.3,"CL":17.73333333,"TS%":0.158,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":429,"IMP/G":2.2,"SNP%":0.5400593472,"YPC":0.0,"TGT":57,"MTF/A":null,"YCO/A":null,"recYPG":42.9,"YPRR":1.95},{"SZN":2025,"SLPR_ID":11604,"NM":"Brock Bowers","POS":"TE","AGE":22.8,"TM":"LV","G":7,"FPTS":104.7,"PPG":14.95714286,"CSTY%":0.4285714286,"CL":24.26666667,"TS%":0.176,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":457,"IMP/G":3.0,"SNP%":0.783908046,"YPC":1.0,"TGT":55,"MTF/A":1.5,"YCO/A":1.5,"recYPG":65.0,"YPRR":2.166666667},{"SZN":2025,"SLPR_ID":11562,"NM":"Spencer Rattler","POS":"QB","AGE":25.0,"TM":"NO","G":8,"FPTS":104.14,"PPG":13.0175,"CSTY%":0.25,"CL":17.24,"TS%":null,"paYPG":198.25,"paRTG":86.82,"CMP%":0.6796875,"TTT":2.676210938,"YDS(t)":1753,"IMP/G":11.375,"SNP%":0.7581395349,"YPC":5.39,"TGT":2,"MTF/A":null,"YCO/A":null,"recYPG":0.0,"YPRR":null},{"SZN":2025,"SLPR_ID":8136,"NM":"Rachaad White","POS":"RB","AGE":26.7,"TM":"TB","G":10,"FPTS":104.0,"PPG":10.4,"CSTY%":0.3,"CL":18.43333333,"TS%":null,"paYPG":0.0,"paRTG":0.0,"CMP%":0.0,"TTT":null,"YDS(t)":520,"IMP/G":3.7,"SNP%":0.5513595166,"YPC":3.88,"TGT":32,"MTF/A":1.360824742,"YCO/A":1.360824742,"recYPG":14.4,"YPRR":null}];

// === State ===
let players = [];
const dashState = { selectedPlayerId: null, filter: 'all' };

// === Helpers ===
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const formatInitialLast = (name = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const firstInitial = parts[0]?.[0] ? `${parts[0][0].toUpperCase()}.` : '';
  const last = parts.slice(1).join(' ');
  return `${firstInitial} ${last}`.trim();
};
const getSelected = () => players.find(p => p.id === dashState.selectedPlayerId) || players[0];

const RADAR_STATS_CONFIG = {
  QB: {
    stats: ['fpts', 'ppg', 'pass_rtg', 'cmp_pct', 'pa_ypg', 'ttt', 'yds_total', 'imp_per_g'],
    labels: ['FPTS', 'PPG', 'paRTG', 'CMP%', 'paYPG', 'TTT', 'YDS(t)', 'IMP/G'],
    maxRank: 36,
    invert: new Set(['ttt'])
  },
  RB: {
    stats: ['fpts', 'ppg', 'yds_total', 'snp_pct', 'ypc', 'rec_tgt', 'mtf_per_att', 'yco_per_att'],
    labels: ['FPTS', 'PPG', 'YDS(t)', 'SNP%', 'YPC', 'TGT', 'MTF/A', 'YCO/A'],
    maxRank: 48,
    invert: new Set()
  },
  WR: {
    stats: ['fpts', 'ppg', 'rec', 'rec_ypg', 'ts_per_rr', 'yprr', 'first_down_rec_rate', 'imp_per_g'],
    labels: ['FPTS', 'PPG', 'REC', 'recYPG', 'TS%', 'YPRR', '1DRR', 'IMP/G'],
    maxRank: 72,
    invert: new Set()
  },
  TE: {
    stats: ['fpts', 'ppg', 'rec', 'rec_ypg', 'ts_per_rr', 'yprr', 'first_down_rec_rate', 'imp_per_g'],
    labels: ['FPTS', 'PPG', 'REC', 'recYPG', 'TS%', 'YPRR', '1DRR', 'IMP/G'],
    maxRank: 24,
    invert: new Set()
  }
};

// Utility helpers
const toNum = (v) => (v === null || v === undefined ? null : Number(v));
const toPct = (v) => {
  const n = toNum(v);
  if (!Number.isFinite(n)) return null;
  return n <= 1 && n >= 0 ? n * 100 : n;
};

function normalizePlayer(row) {
  const pos = (row.POS || '').toUpperCase();
  const snp = toPct(row['SNP%']);
  return {
    id: String(row.SLPR_ID),
    name: row.NM,
    position: pos,
    team: row.TM,
    trend: 'stable',
    stats: {
      fpts: toNum(row.FPTS) || 0,
      ppg: toNum(row.PPG) || 0,
      csty: toPct(row['CSTY%']),
      ts: toPct(row['TS%']),
      ceiling: toNum(row.CL),
      pa_ypg: toNum(row['paYPG']),
      pass_rtg: toNum(row['paRTG']),
      cmp_pct: toPct(row['CMP%']),
      ttt: toNum(row['TTT']),
      yds_total: toNum(row['YDS(t)']),
      imp_per_g: toNum(row['IMP/G']),
      snp_pct: snp,
      ypc: toNum(row['YPC']),
      rec_tgt: toNum(row['TGT']),
      mtf_per_att: toNum(row['MTF/A']),
      yco_per_att: toNum(row['YCO/A']),
      rec: toNum(row['REC']),
      rec_ypg: toNum(row['recYPG']),
      ts_per_rr: toPct(row['TS%']),
      yprr: toNum(row['YPRR']),
      first_down_rec_rate: toNum(row['1DRR']) || null
    },
    ranks: { posRank: null, ppgPosRank: null },
    statRanks: {}
  };
}

function computePositionalRanks(players) {
  const byPos = { QB: [], RB: [], WR: [], TE: [] };
  players.forEach(p => { if (byPos[p.position]) byPos[p.position].push(p); });

  // Common ranks for FPTS/PPG
  ['fpts','ppg'].forEach(stat => {
    Object.values(byPos).forEach(list => {
      const eligible = list.filter(p => Number.isFinite(p.stats[stat]) && p.stats[stat] > 0)
        .sort((a,b) => b.stats[stat] - a.stats[stat]);
      eligible.forEach((p, idx) => {
        if (stat === 'fpts') p.ranks.posRank = idx + 1;
        else p.ranks.ppgPosRank = idx + 1;
      });
    });
  });

  const EFF_THRESH = 40; // 40% snap share
  const statConfig = {
    QB: [ ['pass_rtg', false], ['cmp_pct', false], ['pa_ypg', false], ['ttt', true], ['yds_total', false], ['imp_per_g', false] ],
    RB: [ ['yds_total', false], ['snp_pct', false], ['ypc', false], ['rec_tgt', false], ['mtf_per_att', false], ['yco_per_att', false] ],
    WR: [ ['rec', false], ['rec_ypg', false], ['ts_per_rr', false], ['yprr', false], ['first_down_rec_rate', false], ['imp_per_g', false] ],
    TE: [ ['rec', false], ['rec_ypg', false], ['ts_per_rr', false], ['yprr', false], ['first_down_rec_rate', false], ['imp_per_g', false] ]
  };

  Object.entries(statConfig).forEach(([pos, stats]) => {
    const list = byPos[pos] || [];
    stats.forEach(([key, invert]) => {
      const eligible = list.filter(p => {
        const v = p.stats[key];
        if (!Number.isFinite(v)) return false;
        if ((pos === 'RB' || pos === 'WR' || pos === 'TE') && (!Number.isFinite(p.stats.snp_pct) || p.stats.snp_pct < EFF_THRESH)) return false;
        return true;
      });
      eligible.sort((a,b) => invert ? a.stats[key] - b.stats[key] : b.stats[key] - a.stats[key]);
      eligible.forEach((p, idx) => {
        p.statRanks[key] = idx + 1;
      });
    });
  });
}

// Build radar dataset using provided ranks; fill scales to rank (1 = 100%)
function buildRadarDataset(player) {
  const cfg = RADAR_STATS_CONFIG[player.position];
  if (!cfg) return [];
  return cfg.stats.map((statKey, idx) => {
    const label = cfg.labels[idx];
    let rank = null;
    if (statKey === 'fpts') rank = player.ranks?.posRank;
    else if (statKey === 'ppg') rank = player.ranks?.ppgPosRank;
    else rank = player.statRanks?.[statKey] ?? null;
    const maxRank = cfg.maxRank;
    const fill = Number.isFinite(rank)
      ? clamp(((maxRank - rank + 1) / maxRank) * 100, 0, 100)
      : 8;
    return { axis: label, value: fill, rawValue: player.stats?.[statKey], rank };
  });
}

// Charts data builders
function ppgBarData(filter) {
  return [...players]
    .filter(p => Number.isFinite(p.stats?.ppg) && p.stats.ppg > 0)
    .filter(p => filter === 'all' || p.position === filter)
    .sort((a, b) => b.stats.ppg - a.stats.ppg)
    .slice(0, 10)
    .map(p => ({ label: p.name.split(' ').pop() || p.name, value: p.stats.ppg }));
}

// Rendering
function renderSummary() {
  if (!players.length) return;
  const topFpts = players[0];
  const topPPG = [...players].filter(p => Number.isFinite(p.stats.ppg) && p.stats.ppg > 0).sort((a,b)=>b.stats.ppg - a.stats.ppg)[0];
  const topCstyRB = [...players].filter(p => p.position === 'RB' && Number.isFinite(p.stats.csty)).sort((a,b)=>b.stats.csty - a.stats.csty)[0];
  const topTSWR = [...players].filter(p => p.position === 'WR' && Number.isFinite(p.stats.ts)).sort((a,b)=>b.stats.ts - a.stats.ts)[0];

  const projectedMax = Math.max(450, topFpts?.stats.fpts || 0);

  if (topFpts) {
    setText('total-points-value', topFpts.stats.fpts.toFixed(1));
    setText('total-points-name', formatInitialLast(topFpts.name));
    setWidth('total-points-bar', (topFpts.stats.fpts / projectedMax) * 100);
  }
  if (topCstyRB) {
    setText('consistency-value', `${topCstyRB.stats.csty.toFixed(1)}%`);
    setText('consistency-name', formatInitialLast(topCstyRB.name));
    setWidth('consistency-bar', topCstyRB.stats.csty);
  }
  if (topPPG) {
    setText('ppg-value', topPPG.stats.ppg.toFixed(1));
    setText('ppg-name', topPPG.name);
  }
  if (topTSWR) {
    setText('share-value', `${topTSWR.stats.ts.toFixed(1)}%`);
    setText('share-name', topTSWR.name);
  }
}

function renderCustomSelect() {
  const optionsContainer = document.getElementById('player-select-options');
  const label = document.getElementById('player-select-label');
  if (!optionsContainer) return;
  const optionsList = players.slice(0, 100);
  optionsContainer.innerHTML = optionsList
    .map(p => `
      <li class="fc-option ${p.id === dashState.selectedPlayerId ? 'is-selected' : ''}" data-value="${p.id}">
        <span>${p.name}</span>
        <span class="fc-option-team">${p.position} - ${p.team}</span>
      </li>
    `)
    .join('');
  const selected = getSelected();
  if (label && selected) label.textContent = selected.name;
}

function setupCustomSelect() {
  const container = document.getElementById('player-select-container');
  const trigger = document.getElementById('player-select-trigger');
  const dropdown = document.getElementById('player-select-dropdown');
  const searchInput = document.getElementById('player-select-search');
  const optionsContainer = document.getElementById('player-select-options');
  if (!container || !trigger || !dropdown || !searchInput || !optionsContainer) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    container.classList.toggle('is-open');
    trigger.classList.toggle('is-open');
    if (container.classList.contains('is-open')) {
      searchInput.value = '';
      searchInput.focus();
      optionsContainer.querySelectorAll('.fc-option').forEach(opt => opt.style.display = 'flex');
    }
  });

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) closeDropdown();
  });

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    optionsContainer.querySelectorAll('.fc-option').forEach(opt => {
      opt.style.display = opt.textContent.toLowerCase().includes(term) ? 'flex' : 'none';
    });
  });

  optionsContainer.addEventListener('click', (e) => {
    const option = e.target.closest('.fc-option');
    if (!option) return;
    dashState.selectedPlayerId = option.dataset.value;
    renderCustomSelect();
    renderSelectedDetails();
    renderRadar();
    closeDropdown();
  });

  function closeDropdown() {
    container.classList.remove('is-open');
    trigger.classList.remove('is-open');
  }
}

function renderSelectedDetails() {
  const player = getSelected();
  const posRankText = Number.isFinite(player.ranks?.posRank) ? player.ranks.posRank : 'NA';
  setText('rating-label-top', 'FPTS POS•RK');
  setText('rating-value', posRankText);
  setText('rating-meta', '');
}

function renderRadar() {
  const player = getSelected();
  const data = buildRadarDataset(player);
  updateLegendForPosition(player.position);
  drawRadarChart('radar-chart', data);
}

function renderBar() {
  const data = ppgBarData(dashState.filter);
  if (!data.length) return;
  drawBarChart('bar-chart', data);
}

// Update legend labels to match selected position's radar rings
function updateLegendForPosition(pos) {
  const cfg = RADAR_STATS_CONFIG[pos];
  if (!cfg) return;
  const labels = cfg.labels;
  const legendItems = document.querySelectorAll('.fc-legend .fc-legend-item');
  legendItems.forEach((item, idx) => {
    const full = item.querySelector('.fc-legend-full');
    const abbr = item.querySelector('.fc-legend-abbr');
    const label = labels[idx] || '';
    if (full) full.textContent = label;
    if (abbr) abbr.textContent = label;
  });
}

function renderScatter() {
  const topByFpts = [...players]
    .filter(p => Number.isFinite(p.stats?.fpts))
    .sort((a, b) => b.stats.fpts - a.stats.fpts);
  const scatterPool = [];
  for (const p of topByFpts) {
    if (Number.isFinite(p.stats.csty) && Number.isFinite(p.stats.ceiling)) scatterPool.push(p);
    if (scatterPool.length >= 24) break;
  }
  if (!scatterPool.length) return;
  drawScatterChart('scatter-chart', scatterPool);
}

// Event wiring
function wireEvents() {
  const filterBtns = document.getElementById('filter-buttons');
  if (filterBtns) {
    filterBtns.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const filter = btn.dataset.filter;
      if (!filter) return;
      dashState.filter = filter;
      updateFilterButtons();
      renderBar();
    });
  }

  window.addEventListener('resize', debounce(() => {
    renderRadar();
    renderBar();
    renderScatter();
  }, 200));
}

function updateFilterButtons() {
  document.querySelectorAll('#filter-buttons button').forEach(btn => {
    const active = btn.dataset.filter === dashState.filter;
    btn.classList.toggle('fc-filter-btn--active', active);
  });
}

// Small utilities
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
function setWidth(id, pct) {
  const el = document.getElementById(id);
  if (el) el.style.width = `${clamp(pct, 0, 100)}%`;
}
function debounce(fn, delay = 150) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}
function trendSvg(trend) {
  if (trend === 'up') return '<span style="color: var(--color-emerald-light); display: flex; justify-content: center;"><svg class="fc-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></span>';
  if (trend === 'down') return '<span style="color: var(--color-red); display: flex; justify-content: center;"><svg class="fc-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg></span>';
  return '<span style="color: var(--text-muted); display: flex; justify-content: center;"><svg class="fc-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"></path></svg></span>';
}

// D3 radar, bar, scatter (unchanged visuals)
function drawRadarChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container || !data || !data.length) return;
  container.innerHTML = '';
  const rect = container.getBoundingClientRect();
  const width = rect.width || 360;
  const height = rect.height || 360;
  const size = Math.min(width, height);
  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height).append('g').attr('transform', `translate(${width / 2},${height / 2})`);
  const numRings = data.length;
  const maxRadius = size / 2 * 0.95;
  const innerRadius = size * 0.12;
  const ringWidth = (maxRadius - innerRadius) / numRings;
  const gap = size * 0.01;
  const colors = ['#ef4444', '#f97316', '#eab308', '#22d3ee', '#8b5cf6', '#10b981', '#ec4899', '#a855f7'];
  const fontSize = Math.max(8, size * 0.025);
  const isMobile = window.innerWidth < 768;
  data.forEach((d, i) => {
    const rInner = innerRadius + i * ringWidth + gap;
    const rOuter = innerRadius + (i + 1) * ringWidth;
    const color = colors[i % colors.length];
    const bgArc = d3.arc().innerRadius(rInner).outerRadius(rOuter).startAngle(0).endAngle(2 * Math.PI).cornerRadius(ringWidth / 2);
    svg.append('path').attr('d', bgArc).attr('fill', color).attr('opacity', 0.1);
    const endAngle = (d.value / 100) * 2 * Math.PI;
    const fgArc = d3.arc().innerRadius(rInner).outerRadius(rOuter).startAngle(0).endAngle(endAngle).cornerRadius(ringWidth / 2);
    svg.append('path').attr('fill', color).attr('d', fgArc).transition().duration(1200).ease(d3.easeCubicOut).attrTween('d', function() {
      const interpolate = d3.interpolate(0, endAngle);
      return function(t) {
        return d3.arc().innerRadius(rInner).outerRadius(rOuter).startAngle(0).endAngle(interpolate(t)).cornerRadius(ringWidth / 2)();
      };
    });
    if (!isMobile) {
      svg.append('text')
        .attr('x', 5)
        .attr('y', -(rInner + (ringWidth - gap) / 2))
        .attr('dy', '0.35em')
        .text(d.axis.substring(0, 3).toUpperCase())
        .attr('fill', '#fff')
        .attr('font-size', `${fontSize}px`)
        .attr('font-weight', 'bold')
        .attr('opacity', 0.8)
        .style('pointer-events', 'none');
    }
  });
}

function drawBarChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  const rect = container.getBoundingClientRect();
  const width = rect.width || 640;
  const height = rect.height || 360;
  const margin = { top: height * 0.12, right: width * 0.03, bottom: height * 0.12, left: width * 0.03 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
  const defs = svg.append('defs');
  const filter = defs.append('filter').attr('id', 'neon-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
  filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
  const feMerge = filter.append('feMerge');
  feMerge.append('feMergeNode').attr('in', 'coloredBlur');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
  const x = d3.scaleBand().range([0, innerWidth]).domain(data.map(d => d.label)).paddingInner(0.6).paddingOuter(0.05);
  const maxValue = d3.max(data, d => d.value) || 0;
  const y = d3.scaleLinear().range([innerHeight, 0]).domain([0, maxValue * 1.15]);
  const colorScale = d3.scaleLinear().domain([0, data.length - 1]).range(['#06b6d4', '#a855f7']).interpolate(d3.interpolateRgb);
  const uid = Date.now();
  data.forEach((d, i) => {
    const color = colorScale(i);
    const gradId = `bar-grad-${uid}-${i}`;
    const grad = defs.append('linearGradient').attr('id', gradId).attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.5);
    grad.append('stop').attr('offset', '70%').attr('stop-color', color).attr('stop-opacity', 0.1);
    grad.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0);
  });
  const barGroups = g.selectAll('.bar-group').data(data).enter().append('g').attr('class', 'bar-group');
  const barWidth = x.bandwidth();
  const radius = barWidth / 2;
  const isMobile = window.innerWidth < 768;
  const strokeMain = Math.max(1, width * 0.008);
  const strokeGlow = Math.max(2, width * 0.015);
  const fontSizeVal = Math.max(8, width * 0.02);
  const fontSizeAxis = isMobile ? 5 : Math.max(8, width * 0.015);
  barGroups.append('rect').attr('x', d => x(d.label)).attr('y', innerHeight).attr('width', barWidth).attr('height', 0).attr('rx', radius).attr('ry', radius).attr('fill', 'none').attr('stroke', (d, i) => colorScale(i)).attr('stroke-width', strokeGlow).attr('stroke-opacity', 0.3).style('filter', 'url(#neon-glow)').transition().duration(1000).delay((d, i) => i * 50).ease(d3.easeCubicOut).attr('y', d => y(d.value)).attr('height', d => innerHeight - y(d.value));
  barGroups.append('rect').attr('x', d => x(d.label)).attr('y', innerHeight).attr('width', barWidth).attr('height', 0).attr('rx', radius).attr('ry', radius).attr('fill', (d, i) => `url(#bar-grad-${uid}-${i})`).transition().duration(1000).delay((d, i) => i * 50).ease(d3.easeCubicOut).attr('y', d => y(d.value)).attr('height', d => innerHeight - y(d.value));
  barGroups.append('rect').attr('x', d => x(d.label)).attr('y', innerHeight).attr('width', barWidth).attr('height', 0).attr('rx', radius).attr('ry', radius).attr('fill', 'none').attr('stroke', (d, i) => colorScale(i)).attr('stroke-width', strokeMain).transition().duration(1000).delay((d, i) => i * 50).ease(d3.easeCubicOut).attr('y', d => y(d.value)).attr('height', d => innerHeight - y(d.value));
  barGroups.append('text').text(d => d.value.toFixed(1)).attr('x', d => x(d.label) + barWidth / 2).attr('y', innerHeight).attr('text-anchor', 'middle').attr('fill', (d, i) => colorScale(i)).attr('font-size', `${fontSizeVal}px`).attr('font-weight', '700').style('text-shadow', '0 0 10px rgba(0,0,0,1)').style('opacity', 0).transition().duration(1000).delay((d, i) => i * 50 + 400).attr('y', d => y(d.value) - (isMobile ? height * 0.05 : height * 0.02)).style('opacity', 1);
  g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x).tickSize(0)).selectAll('text').style('text-anchor', 'middle').style('fill', '#94a3b8').style('font-size', `${fontSizeAxis}px`).style('font-weight', '500').attr('dy', '1.5em');
  g.select('.domain').remove();
}

function drawScatterChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container || !data || !data.length) return;
  container.innerHTML = '';
  const rect = container.getBoundingClientRect();
  const width = rect.width || 640;
  const height = rect.height || 360;
  const isMobile = window.innerWidth < 768;
  const margin = { top: isMobile ? 10 : height * 0.02, right: width * 0.05, bottom: isMobile ? 40 : height * 0.1, left: isMobile ? 40 : width * 0.06 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
  const yDomain = [23, 42];
  const xDomain = d3.extent(data, d => d.stats.csty).map((v, i) => (i === 0 ? Math.max(0, v - 5) : Math.min(100, v + 5)));
  const x = d3.scaleLinear().domain(xDomain).range([0, innerWidth]);
  const y = d3.scaleLinear().domain(yDomain).range([innerHeight, 0]);
  const xAxisGrid = d3.axisBottom(x).tickSize(-innerHeight).tickFormat('').ticks(5);
  const yAxisGrid = d3.axisLeft(y).tickValues([25, 30, 35, 40]).tickSize(-innerWidth).tickFormat('');
  g.append('g').attr('class', 'scatter-grid').attr('transform', `translate(0,${innerHeight})`).call(xAxisGrid);
  g.append('g').attr('class', 'scatter-grid').call(yAxisGrid);
  g.append('g').attr('class', 'scatter-axis').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x).ticks(5)).selectAll('text').style('font-size', isMobile ? '8px' : '14px');
  g.append('g').attr('class', 'scatter-axis').call(d3.axisLeft(y).tickValues([25, 30, 35, 40])).selectAll('text').style('font-size', isMobile ? '8px' : '14px');
  g.append('text').attr('x', innerWidth / 2).attr('y', innerHeight + (isMobile ? 35 : margin.bottom - 5)).attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', isMobile ? '8px' : '16px').attr('font-weight', 'bold').attr('letter-spacing', '0.1em').text('CONSISTENCY');
  g.append('text').attr('transform', 'rotate(-90)').attr('x', -innerHeight / 2).attr('y', isMobile ? -30 : -margin.left + 20).attr('text-anchor', 'middle').attr('fill', '#94a3b8').attr('font-size', isMobile ? '8px' : '16px').attr('font-weight', 'bold').attr('letter-spacing', '0.1em').text('CEILING');
  g.selectAll('.scatter-dot').data(data).enter().append('circle').attr('class', d => `scatter-dot scatter-dot-${d.position.toLowerCase()}`).attr('cx', d => x(d.stats.csty)).attr('cy', d => y(d.stats.ceiling)).attr('r', 0).transition().duration(1000).delay((d, i) => i * 30).ease(d3.easeBackOut).attr('r', isMobile ? 3.5 : 7);
  const labels = g.selectAll('.scatter-label').data(data).enter().append('text').attr('class', 'scatter-label').attr('x', d => x(d.stats.csty)).attr('y', d => y(d.stats.ceiling)).text(d => {
    const parts = d.name.split(' '); return `${parts[0][0]}. ${parts[parts.length - 1]}`;
  }).attr('opacity', 0);
  const labelNodes = data.map(d => ({ ...d, fx: x(d.stats.csty), fy: y(d.stats.ceiling), x: x(d.stats.csty), y: y(d.stats.ceiling) }));
  const sim = d3.forceSimulation(labelNodes)
    .force('anchorX', d3.forceX(d => x(d.stats.csty)).strength(3))
    .force('anchorY', d3.forceY(d => y(d.stats.ceiling) - 10).strength(3))
    .force('collide', d3.forceCollide(14))
    .stop();
  for (let i = 0; i < 60; ++i) sim.tick();
  labels.transition().duration(1000).delay((d, i) => i * 30 + 500).attr('x', (d, i) => labelNodes[i].x).attr('y', (d, i) => labelNodes[i].y).attr('opacity', 1);
}

// Initialize
window.initFantasyDashboard = function() {
  players = HP_DATA.map(normalizePlayer);
  // Ensure FPTS order from source stays dominant
  players.sort((a,b) => b.stats.fpts - a.stats.fpts);
  computePositionalRanks(players);
  if (!players.length) return;
  dashState.selectedPlayerId = players[0].id;
  renderSummary();
  renderCustomSelect();
  setupCustomSelect();
  renderSelectedDetails();
  renderRadar();
  renderBar();
  renderScatter();
  updateFilterButtons();
  wireEvents();
};

document.addEventListener('DOMContentLoaded', () => {
  window.initFantasyDashboard();
});
})();
