Excel.run(function (ctx) {
    var range =ctx.workbook.worksheets.getActiveWorksheet().getRange("A1:B2");
	range.formulas = [["=RAND()*12", "=RAND()*19"], ["=A1*.7", "=B1*.9"]];
	return ctx.sync().then(function () {
	    console.log("Success! Set multiple formulars in range A1:C3.");
	});
}).catch(function (error) {
	console.log(error);
});