// Please make sure your working sheet has a chart
Excel.run(function (ctx) {
	ctx.workbook.worksheets.getActiveWorksheet().charts.getItemAt(0).title.text = "New Title";
	return ctx.sync().then(function () {
	    console.log("Success! Set chart title.");
	});
}).catch(function (error) {
	console.log(error);
});