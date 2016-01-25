Excel.run(function (ctx) {
	ctx.workbook.worksheets.getActiveWorksheet().getRange("A1:C3").formulas = "=RAND()*17";
	return ctx.sync().then(function () {
	    console.log("Success! Set single formula '=RAND()*17' in range A1:C3.");
	});
}).catch(function (error) {
	console.log(error);
});