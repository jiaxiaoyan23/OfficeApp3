// Please make sure your working sheet has a chart
Excel.run(function (ctx) {
	ctx.workbook.worksheets.getActiveWorksheet().charts.getItemAt(0).delete();
	return ctx.sync().then(function () {
	    console.log("Success! First chart deleted.");
	});
}).catch(function (error) {
	console.log(error);
});