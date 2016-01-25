// Please run Add Chart Data first
Excel.run(function (ctx) {
    var worksheet = ctx.workbook.worksheets.getActiveWorksheet();
    var chartsource = worksheet.getRange("A1:D5");
    worksheet.charts.add("ColumnClustered", chartsource, Excel.ChartSeriesBy.auto);

    return ctx.sync().then(function () {
        console.log("Success! Chart added.");
    });
}).catch(function (error) {
	console.log(error);
});