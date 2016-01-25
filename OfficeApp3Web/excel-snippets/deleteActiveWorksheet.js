Excel.run(function (ctx) {
	ctx.workbook.worksheets.getActiveWorksheet().delete();
	return ctx.sync().then(function () {
	    console.log("Success! Active worksheet deleted.");
	});
}).catch(function (error) {
	console.log(error);
});