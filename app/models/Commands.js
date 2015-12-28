// An singleton that contains and manages the sending of picpilot commands
var picpilot_config=require('../../config/picpilot-config');
var Network=require('../Network');
var Logger=require('../util/Logger');
var Validator=require('../util/Validator');

var Commands={
  checkConnection: function(){ //to make sure the data relay connection exists first (otherwise we'll prob get weird errors)
    if(Network.connections['data_relay']){
      return true;
    }
    else{
      Logger.warn('Cannot send command as the data_relay connection has not yet been established');
      return false;
    }
  },
  sendProtectedCommand:function(command){
    Network.connections['data_relay'].write(command+':'+picpilot_config.command_password+'\r\n');
  },
  sendCommand: function(command, value){
    Network.connections['data_relay'].write(command+':'+value+'\r\n');
  },
  sendRoll: function(roll){
    if(this.checkConnection()){
      if(Validator.isValidRoll(roll)){
        this.sendCommand('set_rollAngle',roll);
      }
      else{
        Logger.error('Command to not sent since invalid roll value detected! Roll:'+roll);
      }
    }
  },
  sendPitch: function(pitch){
    if(this.checkConnection()){
      if(Validator.isValidPitch(pitch)){
        this.sendCommand('set_pitchAngle',pitch);
      }
      else{
        Logger.error('Command to not sent since invalid pitch value detected! Pitch:'+pitch);
      }
    }
  },
  sendHeading: function(heading){
    if(this.checkConnection()){
      if(Validator.isValidHeading(heading)){
        this.sendCommand('set_heading',heading);
      }
      else{
        Logger.error('Command to not sent since invalid heading value detected! Heading:'+heading);
      }
    }
  }
}

module.exports=Commands;