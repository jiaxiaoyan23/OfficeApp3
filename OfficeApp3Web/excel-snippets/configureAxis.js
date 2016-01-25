// Please make sure your working sheet has a chart
Excel.run(function (ctx) {
	var chart = ctx.workbook.worksheets.getActiveWorksheet().charts.getItemAt(0);	
	
	chart.axes.valueAxis.maximum = 5;
	chart.axes.valueAxis.minimum = 0;
	chart.axes.valueAxis.majorUnit = 1;
	chart.axes.valueAxis.minorUnit = 0.2;

	return ctx.sync().then(function () {
	    console.log("Success! Set value Axis maximum to be 5, minimum to be 0, major unit to be 1 and minor unit to be 0.2");
	});
}).catch(function (error) {
	console.log(error);
});