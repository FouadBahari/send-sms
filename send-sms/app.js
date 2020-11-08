const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

const app = express();

//init nexmon
const nexmo = new Nexmo({
    apiKey: 'beb73691',
    apiSecret: 'j6Aq3cMMtGztVitp'
}, { debug: true });


//Template engine app
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Public Folder Setup
app.use(express.static(__dirname + '/public'));

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//index route
app.get('/', (req, res) => {
    res.render('index');
})

//Catch form submit
app.post('/', (req, res) => {
    // res.send(req.body);
    // console.log(req.body);

    const from = 'Fouad';
    const to = req.body.number;
    const text = req.body.text;

    nexmo.message.sendSms(from, to, text, { type: 'unicode' },
        (err, responseData) => {
            if (err) {
                console.log(err);
            } else {
                console.log(responseData);
                //get data from response 
                const data = {
                    id: responseData.messages[0]['message-id'],
                    number: responseData.messages[0]['to']
                }

                //emit to the client
                io.emit('smsStatus', data);


            }
        }
    );

})

//Define port
const port = 3000;

//Start server
const server = app.listen(port, () => {
    console.log(`Server started to port ${port}`);
});

//connect to socket.io
const io = socketio(server);
io.on('connection', (socket) => {
    console.log('connected');
    io.on('disconnect', () => {
        console.log('Disconnected..');

    });

});