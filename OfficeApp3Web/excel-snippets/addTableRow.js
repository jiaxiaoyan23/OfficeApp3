// Please run Create a table first in order to run this example
Excel.run(function (ctx) {
	ctx.workbook.tables.getItem('Table1').rows.add(3, [[1,2,3,4,5]]);
	return ctx.sync().then(function () {
	    console.log("Success! Added a new row.");
	});;
}).catch(function (error) {
	console.log(error);
});