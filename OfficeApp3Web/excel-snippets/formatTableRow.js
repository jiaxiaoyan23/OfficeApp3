// Please run Create a table first in order to run this example
Excel.run(function (ctx) {
	var range = ctx.workbook.tables.getItem('Table1').rows.getItemAt(1).getRange();
	range.format.fill.color = "#00AA00";
	return ctx.sync().then(function () {
	    console.log("Success! Changed background color of the 4th row of 'MyTable' to green.");
	});
}).catch(function (error) {
	console.log(error);
});