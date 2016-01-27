// Run a batch operation against the Word object model.
Word.run(function (context) {
    
    // Create a proxy object for the document.
    var thisDocument = context.document;
    
    // Queue a command to load content control properties.
    context.load(thisDocument, 'contentControls/id, contentControls/text, contentControls/tag');
    
    // Synchronize the document state by executing the queued-up commands, 
    // and return a promise to indicate task completion.
    return context.sync().then(function () {
        var result = '';
        if (thisDocument.contentControls.items.length !== 0) {
            for (var i = 0; i < thisDocument.contentControls.items.length; i++) {
                result += 'Id: ' + thisDocument.contentControls.items[i].id + ' ';
                result += 'Text: ' + thisDocument.contentControls.items[i].text + ' ';
                result += 'Tag: ' + thisDocument.contentControls.items[i].tag + ' ';
            }
            console.log(result);
        } else {
            console.log('No content controls in this document.');
        }
    });  
})
.catch(function (error) {
    console.log('Error: ' + JSON.stringify(error));
    if (error instanceof OfficeExtension.Error) {
        console.log('Debug info: ' + JSON.stringify(error.debugInfo));
    }
});