//Useful and commonly used validation functions used throughout the app
var Validator={
  isValidNumber:function(number){
    if(typeof number!=='undefined' && number!==null && !isNaN(number)){
      return true;
    }
  },
  isValidPitch: function(pitch){
    if(this.isValidNumber(pitch) && Number(pitch)>=-180 && Number(pitch)<=180){
      return true;
    }
    return false
  },
  isValidRoll: function(roll){
    if(this.isValidNumber(roll) && Number(roll)>=-180 && Number(roll)<=180){
      return true;
    }
    return false
  },
  isValidYaw: function(yaw){
    if(this.isValidNumber(yaw)){
      return true;
    }
    return false;
  },
  isValidHeading: function(heading){
    if(this.isValidNumber(heading) && Number(heading)>=0 && Number(heading)<=360){
      return true;
    }
    return false
  },
  isValidSpeed: function(speed){
    if(this.isValidNumber(speed) && Number(speed)>=0){
      return true;
    }
    return false;
  },
  isValidAltitude: function(altitude){
    if(this.isValidNumber(altitude) && Number(altitude)>=0){
      return true;
    }
    return false;
  },
  isValidThrottle: function(throttle){
    if(this.isValidNumber(throttle) && Number(throttle)>=0 && Number(throttle)<=100){
      return true;
    }
    return false;
  },
  isValidFlap: function(flap){
    if(this.isValidNumber(flap)){
      return true;
    }
    return false;
  },
  isValidLatitude:function(lat){
    if(this.isValidNumber(lat)){
      return true;
    }
    return false;
  },
  isValidLongitude: function(lon){
    if(this.isValidNumber(lon)){
      return true;
    }
    return false;
  }
};

module.exports=Validator;