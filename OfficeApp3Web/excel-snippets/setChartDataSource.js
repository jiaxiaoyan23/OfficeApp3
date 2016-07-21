// Please make sure your working sheet has a chart
Excel.run(function (ctx) {
    var chart = ctx.workbook.worksheets.getActiveWorksheet().charts.getItemAt(0);
	chart.setData("A1:B4", Excel.ChartSeriesBy.columns);
	return ctx.sync().then(function () {
	    console.log("Success!");
	});
}).catch(function (error) {
	console.log(error);
});