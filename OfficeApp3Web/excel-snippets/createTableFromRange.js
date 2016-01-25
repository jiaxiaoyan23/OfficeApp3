Excel.run(function (ctx) {
	ctx.workbook.tables.add('Sheet1!A1:E7', true);
	return ctx.sync().then(function () {
	    console.log("Success! Created table in range A1:E7.");
	});;
}).catch(function (error) {
	console.log(error);
});