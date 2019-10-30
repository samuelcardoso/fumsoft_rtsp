const app = require('express')(),
  server = require('http').Server(app),
  io = require('socket.io')(server),
  rtsp = require('rtsp-ffmpeg');
server.listen(6147);
var uri = 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
  stream = new rtsp.FFMpeg({
    input: uri // stream uri
    , rate: 30 // output framerate (optional)
    , resolution: '640x480' // output resolution in WxH format (optional)
    , quality: 3 // JPEG compression quality level (optional)
  });
console.debug('initializing socket...');
io.on('connection', function(socket) {
  console.debug('socket ok!');
  var pipeStream = function(data) {
    console.debug(data);
    socket.emit('data', data.toString('base64'));
  };
  stream.on('data', pipeStream);
  socket.on('disconnect', function() {
    stream.removeListener('data', pipeStream);
  });
});
console.debug('initializing client...');
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});