// Please make sure your working sheet has a chart
Excel.run(function (ctx) {
	var chart = ctx.workbook.worksheets.getActiveWorksheet().charts.getItemAt(0);	
	chart.dataLabels.showSeriesName = true;
	return ctx.sync().then(function () {
	    console.log("Success! Make Series Name shown in Datalabels.");
	});;
}).catch(function (error) {
	console.log(error);
});