Excel.run(function (ctx) {
    var sheet = ctx.workbook.worksheets.getActiveWorksheet();
    sheet.tables.add('A1:E7', true);
	return ctx.sync().then(function () {
	    console.log("Success! Created table in range A1:E7.");
	});;
}).catch(function (error) {
	console.log(error);
});