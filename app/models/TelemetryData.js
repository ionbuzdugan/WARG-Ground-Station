/**
 * @author Serge Babayan
 * @module models/TelemetryData
 * @requires util
 * @requires events
 * @requires config/advanced-config
 * @copyright Waterloo Aerial Robotics Group 2016
 * @licence https://raw.githubusercontent.com/UWARG/WARG-Ground-Station/master/LICENSE
 * @description Data model that stores the current and past telemetry states of the aircraft. Inherits off of the node EventEmitter,
 * so it can emit data events to other modules
 * @extends EventEmitter
 * @see http://docs.uwarg.com/picpilot/datalink/
 */

var util = require('util');
var advanced_config = require('../../config/advanced-config');
var EventEmitter = require('events');
var _ = require('underscore');

/**
 * When a new data packet has been received on the data relay connection
 * @event TelemetryData:data_received
 * @property {Object} data - The received data from the data relay connection. Data is in the same format as `TelemetryData.current_state`
 */

/**
 * When a new data packet has been received on the data relay connection
 * @event TelemetryData:aircraft_position
 * @property {Object} data - Information on the position of the aircraft
 */

/**
 * When a new data packet has been received on the data relay connection
 * @event TelemetryData:aircraft_orientation
 * @property {Object} data - Information on the orientation of the aircraft
 */

/**
 * When a new data packet has been received on the data relay connection
 * @event TelemetryData:aircraft_gains
 * @property {Object} data - Current aircraft gains information
 */

/**
 * When a new data packet has been received on the data relay connection
 * @event TelemetryData:aircraft_status
 * @property {Object} data - Current aircraft status information
 */

/**
 * When a new data packet has been received on the data relay connection
 * @event TelemetryData:aircraft_channels
 * @property {Object} data - Information about the channel inputs and outputs of the picpilot
 */

var TelemetryData = function () {
  /**
   * @var headers {Array}
   * An array of headers in the order that the groundstation will be receiving them, as specified from the data relay
   * @example
   * console.log(TelemetryData.headers)
   * ['lat', 'lon', 'time', ...]
   */
  this.headers = [];

  /**
   * @var received {Array}
   * All [{time, data}] received from data relay station (one item per transmission, increasing index more recent)
   * @example
   * console.log(TelemetryData.received)
   * [
   *  {
   *    time: 126549876,
   *    data: [34, 5656, 234, 123, ..]
   *  }
   *  ...
   * ]
   */
  this.received = [];

  /**
   * @var current_state {Hash}
   * Current flight state. In the format of a hash, where the keys are the header names, and the values are the data
   * @example
   * console.log(TelemetryData.current_state)
   * {
   *  lat: 45.45455,
   *  lon: 324234,
   *  time: 234324324,
   *  ...
   * }
   */
  this.current_state = {};

  /**
   * @var state_history {Array}
   * All past flight states. Unlike the `received` property, the contents of the array are hashes in the same form as `current_state`
   */
  this.state_history = [];

  /**
   * @var sent {Array}
   * All [{time, data}] data sent to the data relay station (one item per transmission, increasing index more recent)
   */
  this.sent = [];

  /**
   * Converts a springfield version of headers (separated by commas) into an array and sets it as its headers.
   * Will also perform a trim() on each of the header values.
   * @function setHeadersFromString
   * @param {String} headers_string
   * @example
   * TelemetryData.setHeadersFromString('header1,header2, header3, header4');
   * console.log(TelemetryData.headers);
   * //Outputs: ['header1', 'header2', 'header3', 'header4']
   */
  this.setHeadersFromString = function (headers_string) {
    this.headers = headers_string.split(",").map(function (str) {
      return str.trim();
    });
  };

  /**
   * Takes in a packet object and emits each one with its own payload. Packet object should be in the same format as
   * the PacketTypes model, only the value being the value of the actual header.
   * @function emitPackets
   * @param {Object} packets A key value pair of the packet name and its data payload
   * @example <caption> Usage example </caption>
   * var packets = {
   *    packet_name: {
   *      packet_data1: 'packet_value1',
   *      packet_data2: 'packet_value2'
   *    }
   *    packet_name2: {
   *        ...
   *    }
   * }
   * //this will emit a 'packet_name' and 'packet_name2' events each with their respective data
   * TelemetryData.emitPackets(packets);
   */
  this.emitPackets = function (packets) {
    _.each(packets, function (packet_data, packet_name) {
      this.emit(packet_name, packet_data);
    });
  };

  EventEmitter.call(this);
};

//give TelemetryData the ability to emit and listen to events
util.inherits(TelemetryData, EventEmitter);

var telemetry_data_instance = new TelemetryData();
telemetry_data_instance.setMaxListeners(advanced_config.get('telemetrydata_max_listeners'));

module.exports = telemetry_data_instance;