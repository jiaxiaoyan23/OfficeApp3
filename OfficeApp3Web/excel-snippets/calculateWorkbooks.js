Excel.run(function (ctx) {
	ctx.workbook.application.calculate(Excel.CalculationType.full);
	return ctx.sync().then(function () {
	    console.log("Success!");
	});
}).catch(function (error) {
	console.log(error);
});