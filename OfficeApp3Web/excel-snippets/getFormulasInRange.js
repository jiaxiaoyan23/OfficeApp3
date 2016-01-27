// If you don't have any formular in the sheet yet, create one
Excel.run(function (ctx) {
    var range = ctx.workbook.worksheets.getActiveWorksheet().getRange("A1:C3").load("formulas");
    var result = '';
	return ctx.sync().then(function() {
		for (var i = 0; i < range.formulas.length; i++) {
			for (var j = 0; j < range.formulas[i].length; j++) {
				result += range.formulas[i][j] + " ";
			}
		}
		console.log(result);	
	});
}).catch(function (error) {
	console.log(error);
});