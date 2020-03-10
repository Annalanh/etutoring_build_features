const express = require('express');
const nodemailer = require('nodemailer');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mg = require('nodemailer-mailgun-transport');
const app = express();
const config = require('config');
const fs = require('fs');
const handlebars = require('handlebars');

//view engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('test');
});

app.post('/send', (req, res) => {
    const emailConfig = config.get('Admin.emailService');
    const auth = {
        auth: {
            api_key: emailConfig.get('apiKey'),
            domain: emailConfig.get('domain'),
        }
    }

    const nodemailerMailgun = nodemailer.createTransport(mg(auth));
    const emailTemplateSource = fs.readFileSync(path.join(__dirname, "views/templates/notification.handlebars"), "utf8");
    const template = handlebars.compile(emailTemplateSource);
    const htmlToSend = template({
        student: req.body.student,
        tutor: req.body.tutor,
    })
    const mailOptions = {
        from: "asdfgh6296@gmail.com",
        to: "ptuananh196@gmail.com",
        subject: 'notification',
        html: htmlToSend
    }
    nodemailerMailgun.sendMail(mailOptions, (err, response) => {
        if (err){
            console.log(err);
            res.render('test', {msg: 'smt went wrong'});
        } else {
            console.log('ye');
            res.render('test', {msg: 'Successfully sent email'});
        }
    })
})

app.listen(3000, () => console.log("server run at 3000"))


