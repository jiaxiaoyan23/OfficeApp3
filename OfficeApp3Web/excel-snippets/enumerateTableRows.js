Excel.run(function (ctx) {
    var tableRows = ctx.workbook.tables.getItemAt(0).rows.load("values");
    var result = '';
	return ctx.sync().then(function () {
		for (var i = 0; i < tableRows.items.length; i++) {
			result = tableRows.items[i].values + ", ";
		}
		console.log(result);		
	});
}).catch(function (error) {
	console.log(error);
});