// Please make sure your working sheet has a chart
Excel.run(function (ctx) {
	var chart = ctx.workbook.worksheets.getActiveWorksheet().charts.getItemAt(0);
	chart.title.format.font.bold = true; 
	chart.title.format.font.color = "#FF0000";
	return ctx.sync().then(function () {
	    console.log("Success! Chart1 table formatted.");
	});
}).catch(function (error) {
	console.log(error);
});