Excel.run(function (ctx) {
	ctx.workbook.worksheets.getActiveWorksheet().getRange("A1:C1").clear(Excel.ClearApplyTo.contents);	
	return ctx.sync().then(function () {
	    console.log("Success! Cleared content in range A1:C3.");
	});
}).catch(function (error) {
	console.log(error);
});