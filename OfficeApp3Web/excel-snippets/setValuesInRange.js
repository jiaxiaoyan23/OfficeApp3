Excel.run(function (ctx) {
    var range = ctx.workbook.worksheets.getActiveWorksheet().getRange("A1:C3");
	range.values = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
	return ctx.sync().then(function () {
	    console.log("Success! Set multiple values in range A1:C3.");
	});
}).catch(function (error) {
	console.log(error);
});