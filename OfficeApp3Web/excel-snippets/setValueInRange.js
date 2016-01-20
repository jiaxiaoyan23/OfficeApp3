
Excel.run(function (ctx) {
    var activeWorksheet = ctx.workbook.worksheets.getActiveWorksheet();
	activeWorksheet.getRange("A1:C3").values = 7;
	return ctx.sync();
}).catch(function (error) {
	console.log(error);
});