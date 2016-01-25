// // Please run Create a table first in order to run this example
Excel.run(function (ctx) {
	ctx.workbook.tables.getItem('Table1').rows.getItemAt(3).delete();
	return ctx.sync().then(function () {
	    console.log("Success! Deleted the 4th row from 'MyTable' and shifts cells up.");
	});;
}).catch(function (error) {
	console.log(error);
});