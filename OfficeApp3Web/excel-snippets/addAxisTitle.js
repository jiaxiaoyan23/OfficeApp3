// Please make sure your working sheet has a chart
Excel.run(function (ctx) {
	var chart = ctx.workbook.worksheets.getActiveWorksheet().charts.getItemAt(0);	
	chart.axes.valueAxis.title.text = "Values";

	return ctx.sync().then(function () {
	    console.log("Success! Added Axies title.");
	});
}).catch(function (error) {
	console.log(error);
});