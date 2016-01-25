Excel.run(function (ctx) {
	ctx.workbook.worksheets.add("Sheet" + Math.floor(Math.random()*100000).toString());
	return ctx.sync().then(function () {
	    console.log("Success! Worksheet created with a random name.");
	});
}).catch(function (error) {
	console.log(error);
});