const { htmltoPdf } = require("./html_to_pdf");
const {template} = require("./template");
var moment = require('moment');
moment.locale('fr'); // 'fr'

module.exports = {
    printToPDF:(data={
        garantie:[],
        maintenance:[],
        garantie_gab:[],
        maintenance_gab:[]
    },output="email_views/file.pdf")=>htmltoPdf(template({...data,moment}),output)
}