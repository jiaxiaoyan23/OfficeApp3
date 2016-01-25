// Please make sure your working sheet has a chart
Excel.run(function (ctx) {
	ctx.workbook.worksheets.getActiveWorksheet().charts.getItemAt(0).name = "Chart1";
	return ctx.sync().then(function () {
	    console.log("Success! Renamed first chart in the working sheet as Chart1.");
	});
}).catch(function (error) {
	console.log(error);
});