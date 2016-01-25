Excel.run(function (ctx) {
    var activeWorksheet = ctx.workbook.worksheets.getActiveWorksheet();
	activeWorksheet.getRange("A1:C3").values = 7;
	return ctx.sync().then(function () {
	    console.log("Success! Set single value in range A1:C3.");
	});
}).catch(function (error) {
	console.log(error);
});