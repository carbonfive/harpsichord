var tessel = require('tessel');
var infraredlib = require('ir-attx4');
var infrared = infraredlib.use(tessel.port.B);

infrared.on('data', function(data) {
  console.log("Received RX Data: ", data);
});
