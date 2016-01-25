Excel.run(function (ctx) {
	ctx.workbook.worksheets.getActiveWorksheet().getRange("A1:C3").insert("right");
	return ctx.sync().then(function () {
	    console.log("Success! Insert range in A1:C3.");
	});;
}).catch(function (error) {
	console.log(error);
});