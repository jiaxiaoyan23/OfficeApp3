// Please make sure your working sheet has a chart
Excel.run(function (ctx) {
	ctx.workbook.worksheets.getActiveWorksheet().charts.getItemAt(0).title.visible = false; 
	return ctx.sync().then(function () {
	    console.log("Success! Chart title deleted.");
	});
}).catch(function (error) {
	console.log(error);
});