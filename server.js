var five = require("johnny-five")
var cpuStat = require('cpu-stat')
var si = require('systeminformation')
var board = new five.Board()

var os = require('os')


board.on("ready", function() {
  var i = 0;
  var iface = "";
  var lcd = new five.LCD({
    controller: "PCF8574T"
  });

  setInterval(() => {
    cpuStat.usagePercent(function(err, percent, seconds) {
      if (err) {
        lcd.cursor(0, 0).print('Erro:' + err)
      }
      lcd.cursor(0, 0).print('CPU: ' + (percent).toFixed(2))
    })
    si.mem(function(data) {
      lcd.cursor(1, 0).print('Mem: ' + ((1 - (data.available / data.total)) * 100).toFixed(2));
    })
    si.battery(function(data) {
      lcd.cursor(1, 12).print('Bat:' + (data.percent).toFixed(0));
      if (data.ischarging)
        lcd.cursor(1, 19).print('<');
      else
        lcd.cursor(1, 19).print('>');
    })
    si.processes(function(data) {
      lcd.cursor(0, 12).print(data.running)
      lcd.cursor(0, 16).print(data.all)
    })
    si.networkInterfaceDefault(function(data) {
      iface = data
    })
    si.networkStats(iface, function(data) {
      lcd.cursor(3, 0).print('Tx:' + (data.tx_sec / 1048576).toFixed(2))
      lcd.cursor(3, 11).print('Rx:' + (data.rx_sec / 1048576).toFixed(2))
    })
  }, 500)
});
