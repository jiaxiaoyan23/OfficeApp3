Excel.run(function (ctx) {
	ctx.workbook.names.getItem("myData").getRange().select();
	return ctx.sync().then(function () {
	    console.log("Success!");
	});
}).catch(function (error) {
	console.log(error);
});