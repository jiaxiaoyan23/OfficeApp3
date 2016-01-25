Excel.run(function (ctx) {
	ctx.workbook.tables.getItem("Table1").getDataBodyRange().clear(Excel.ClearApplyTo.formats);
	return ctx.sync().then(function () {
	    console.log("Success! Formatting cleared for all data rows in 'Table1'.");
	});
}).catch(function (error) {
	console.log(error);
});