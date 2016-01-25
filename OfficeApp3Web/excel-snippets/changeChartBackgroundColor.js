// Please make sure your working sheet has a chart
Excel.run(function (ctx) {
	var chart = ctx.workbook.worksheets.getActiveWorksheet().charts.getItemAt(0);	
	chart.format.fill.setSolidColor("#FF0000");	
	return ctx.sync().then(function () {
	    console.log("Success! Chart background color changed.");
	});
}).catch(function (error) {
	console.log(error);
});