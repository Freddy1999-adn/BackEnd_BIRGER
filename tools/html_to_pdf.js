var fs = require('fs')
var conversion = require("phantom-html-to-pdf")();
module.exports={
  htmltoPdf:(html,output)=>conversion({html}, function(err, pdf) {
    var out = fs.createWriteStream(output)
    pdf.stream.pipe(out);
  })
}
