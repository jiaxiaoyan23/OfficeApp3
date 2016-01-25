Excel.run(function (ctx) {
    var tables = ctx.workbook.tables.load("name");
    var result = '';
	return ctx.sync().then(function() {
		for (var i = 0; i < tables.items.length; i++)
		{
			result += tables.items[i].name + " ";
		}
		console.log(result);
	});
}).catch(function (error) {
	console.log(error);
});