let ejs = require('ejs')
const {readFileSync}=require("fs")
module.exports={
    template:(dataObject={})=>ejs.render(readFileSync("./email_views/model.ejs",{encoding:"utf8"}),dataObject)
}