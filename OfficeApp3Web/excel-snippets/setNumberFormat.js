Excel.run(function (ctx) {
	ctx.workbook.worksheets.getActiveWorksheet().getRange("A1").numberFormat = "d-mmm";
	return ctx.sync().then(function () {
	    console.log("Success! Set number format in A1.");
	});
}).catch(function (error) {
	console.log(error);
});