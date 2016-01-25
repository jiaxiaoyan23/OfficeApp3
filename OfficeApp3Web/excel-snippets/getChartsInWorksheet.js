Excel.run(function (ctx) {
    var charts = ctx.workbook.worksheets.getActiveWorksheet().charts.load("name");
    var result = '';
	return ctx.sync().then(function () {
		for (var i = 0; i < charts.items.length; i++) {
		    result += charts.items[i].name + ', ';
		}
		console.log(result);
	});
}).catch(function (error) {
	console.log(error);
});