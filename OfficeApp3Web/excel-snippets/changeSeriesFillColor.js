// Please make sure your working sheet has a chart
Excel.run(function (ctx) {
	var chart = ctx.workbook.worksheets.getActiveWorksheet().charts.getItemAt(0);	
	chart.series.getItemAt(0).format.fill.setSolidColor("#FF0000");
	return ctx.sync().then(function () {
	    console.log("Success! Changed the fill color of Series1 to be red");
	});
}).catch(function (error) {
	console.log(error);
});