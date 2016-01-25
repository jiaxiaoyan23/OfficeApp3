// Please make sure your working sheet has a chart
Excel.run(function (ctx) {
    var chart = ctx.workbook.worksheets.getActiveWorksheet().charts.getItemAt(0);
	chart.height = 200;
	chart.width = 200;
	return ctx.sync().then(function () {
	    console.log("Success! Resized chart weight and height.");
	});
}).catch(function (error) {
	console.log(error);
});