const express = require('express')
const app = express()
const {n1, n2} = require('./export_one.js')
//import { function_export_default_1, function_export_default_2,  ClassExport } from './export_one'

app.get("/", (req, res) => {
    console.log(n1, n2)
    // export_one.function_module_export();
    // function_export_default_1();
    // function_export_default_2();
    // export_one();
    //new export_one().login();
    //console.log(export_one)
    //new ClassExport().login()
    // res.send(export_one.name+":"+export_one.age)
})
app.listen(8000)