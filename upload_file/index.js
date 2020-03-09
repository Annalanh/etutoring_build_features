var http = require('http');
var formidable = require('formidable');
var fs = require('fs')

http.createServer(function (req, res) {
    if (req.url == '/fileupload') {
        var form = formidable({multiples: true})

        form.parse(req, function (err, fields, files) {
            if(err) console.log(err)
            console.log(files)
            files.filetoupload.forEach(file => {
                let oldPath = file.path;
                let newPath = __dirname + `/uploads/${file.name}`

                fs.renameSync(oldPath, newPath, (err) => {
                    if(err){
                        console.log(err)
                    }else{
                        res.write("File uploaded and saved")
                    }
                })
                res.end()
            });
        });
    } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
      res.write('<input type="file" name="filetoupload" multiple><br>');
      res.write('<input type="submit">');
      res.write('</form>');
      return res.end();
    }
}).listen(8000); 
