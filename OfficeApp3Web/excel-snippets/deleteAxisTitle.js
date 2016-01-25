// Please make sure your working sheet has a chart
Excel.run(function (ctx) {
	var chart = ctx.workbook.worksheets.getActiveWorksheet().charts.getItemAt(0);	
	chart.axes.valueAxis.title.visible = false;
	return ctx.sync().then(function () {
	    console.log("Success!");
	});
}).catch(function (error) {
	console.log(error);
});