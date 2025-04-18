/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.AppToHW = (function() {

    /**
     * Properties of an AppToHW.
     * @exports IAppToHW
     * @interface IAppToHW
     * @property {number|null} [RPMPreset] AppToHW RPMPreset
     * @property {boolean|null} [Immobolize] AppToHW Immobolize
     * @property {boolean|null} [MotorType] AppToHW MotorType
     * @property {number|null} [devMode] AppToHW devMode
     */

    /**
     * Constructs a new AppToHW.
     * @exports AppToHW
     * @classdesc Represents an AppToHW.
     * @implements IAppToHW
     * @constructor
     * @param {IAppToHW=} [properties] Properties to set
     */
    function AppToHW(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * AppToHW RPMPreset.
     * @member {number|null|undefined} RPMPreset
     * @memberof AppToHW
     * @instance
     */
    AppToHW.prototype.RPMPreset = null;

    /**
     * AppToHW Immobolize.
     * @member {boolean|null|undefined} Immobolize
     * @memberof AppToHW
     * @instance
     */
    AppToHW.prototype.Immobolize = null;

    /**
     * AppToHW MotorType.
     * @member {boolean|null|undefined} MotorType
     * @memberof AppToHW
     * @instance
     */
    AppToHW.prototype.MotorType = null;

    /**
     * AppToHW devMode.
     * @member {number|null|undefined} devMode
     * @memberof AppToHW
     * @instance
     */
    AppToHW.prototype.devMode = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * AppToHW _RPMPreset.
     * @member {"RPMPreset"|undefined} _RPMPreset
     * @memberof AppToHW
     * @instance
     */
    Object.defineProperty(AppToHW.prototype, "_RPMPreset", {
        get: $util.oneOfGetter($oneOfFields = ["RPMPreset"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * AppToHW _Immobolize.
     * @member {"Immobolize"|undefined} _Immobolize
     * @memberof AppToHW
     * @instance
     */
    Object.defineProperty(AppToHW.prototype, "_Immobolize", {
        get: $util.oneOfGetter($oneOfFields = ["Immobolize"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * AppToHW _MotorType.
     * @member {"MotorType"|undefined} _MotorType
     * @memberof AppToHW
     * @instance
     */
    Object.defineProperty(AppToHW.prototype, "_MotorType", {
        get: $util.oneOfGetter($oneOfFields = ["MotorType"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * AppToHW _devMode.
     * @member {"devMode"|undefined} _devMode
     * @memberof AppToHW
     * @instance
     */
    Object.defineProperty(AppToHW.prototype, "_devMode", {
        get: $util.oneOfGetter($oneOfFields = ["devMode"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new AppToHW instance using the specified properties.
     * @function create
     * @memberof AppToHW
     * @static
     * @param {IAppToHW=} [properties] Properties to set
     * @returns {AppToHW} AppToHW instance
     */
    AppToHW.create = function create(properties) {
        return new AppToHW(properties);
    };

    /**
     * Encodes the specified AppToHW message. Does not implicitly {@link AppToHW.verify|verify} messages.
     * @function encode
     * @memberof AppToHW
     * @static
     * @param {IAppToHW} message AppToHW message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AppToHW.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.RPMPreset != null && Object.hasOwnProperty.call(message, "RPMPreset"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.RPMPreset);
        if (message.Immobolize != null && Object.hasOwnProperty.call(message, "Immobolize"))
            writer.uint32(/* id 2, wireType 0 =*/16).bool(message.Immobolize);
        if (message.MotorType != null && Object.hasOwnProperty.call(message, "MotorType"))
            writer.uint32(/* id 3, wireType 0 =*/24).bool(message.MotorType);
        if (message.devMode != null && Object.hasOwnProperty.call(message, "devMode"))
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.devMode);
        return writer;
    };

    /**
     * Encodes the specified AppToHW message, length delimited. Does not implicitly {@link AppToHW.verify|verify} messages.
     * @function encodeDelimited
     * @memberof AppToHW
     * @static
     * @param {IAppToHW} message AppToHW message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AppToHW.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AppToHW message from the specified reader or buffer.
     * @function decode
     * @memberof AppToHW
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {AppToHW} AppToHW
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AppToHW.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.AppToHW();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.RPMPreset = reader.uint32();
                    break;
                }
            case 2: {
                    message.Immobolize = reader.bool();
                    break;
                }
            case 3: {
                    message.MotorType = reader.bool();
                    break;
                }
            case 4: {
                    message.devMode = reader.int32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an AppToHW message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof AppToHW
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {AppToHW} AppToHW
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AppToHW.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AppToHW message.
     * @function verify
     * @memberof AppToHW
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AppToHW.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.RPMPreset != null && message.hasOwnProperty("RPMPreset")) {
            properties._RPMPreset = 1;
            if (!$util.isInteger(message.RPMPreset))
                return "RPMPreset: integer expected";
        }
        if (message.Immobolize != null && message.hasOwnProperty("Immobolize")) {
            properties._Immobolize = 1;
            if (typeof message.Immobolize !== "boolean")
                return "Immobolize: boolean expected";
        }
        if (message.MotorType != null && message.hasOwnProperty("MotorType")) {
            properties._MotorType = 1;
            if (typeof message.MotorType !== "boolean")
                return "MotorType: boolean expected";
        }
        if (message.devMode != null && message.hasOwnProperty("devMode")) {
            properties._devMode = 1;
            if (!$util.isInteger(message.devMode))
                return "devMode: integer expected";
        }
        return null;
    };

    /**
     * Creates an AppToHW message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof AppToHW
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {AppToHW} AppToHW
     */
    AppToHW.fromObject = function fromObject(object) {
        if (object instanceof $root.AppToHW)
            return object;
        var message = new $root.AppToHW();
        if (object.RPMPreset != null)
            message.RPMPreset = object.RPMPreset >>> 0;
        if (object.Immobolize != null)
            message.Immobolize = Boolean(object.Immobolize);
        if (object.MotorType != null)
            message.MotorType = Boolean(object.MotorType);
        if (object.devMode != null)
            message.devMode = object.devMode | 0;
        return message;
    };

    /**
     * Creates a plain object from an AppToHW message. Also converts values to other types if specified.
     * @function toObject
     * @memberof AppToHW
     * @static
     * @param {AppToHW} message AppToHW
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AppToHW.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (message.RPMPreset != null && message.hasOwnProperty("RPMPreset")) {
            object.RPMPreset = message.RPMPreset;
            if (options.oneofs)
                object._RPMPreset = "RPMPreset";
        }
        if (message.Immobolize != null && message.hasOwnProperty("Immobolize")) {
            object.Immobolize = message.Immobolize;
            if (options.oneofs)
                object._Immobolize = "Immobolize";
        }
        if (message.MotorType != null && message.hasOwnProperty("MotorType")) {
            object.MotorType = message.MotorType;
            if (options.oneofs)
                object._MotorType = "MotorType";
        }
        if (message.devMode != null && message.hasOwnProperty("devMode")) {
            object.devMode = message.devMode;
            if (options.oneofs)
                object._devMode = "devMode";
        }
        return object;
    };

    /**
     * Converts this AppToHW to JSON.
     * @function toJSON
     * @memberof AppToHW
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AppToHW.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for AppToHW
     * @function getTypeUrl
     * @memberof AppToHW
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    AppToHW.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/AppToHW";
    };

    return AppToHW;
})();

$root.HWToApp = (function() {

    /**
     * Properties of a HWToApp.
     * @exports IHWToApp
     * @interface IHWToApp
     * @property {number|null} [Bus_Current] HWToApp Bus_Current
     * @property {number|null} [SOC] HWToApp SOC
     * @property {number|null} [RPM] HWToApp RPM
     * @property {number|null} [Torque] HWToApp Torque
     * @property {string|null} [GPS] HWToApp GPS
     * @property {number|null} [GPSSize] HWToApp GPSSize
     * @property {number|null} [Net_Strength] HWToApp Net_Strength
     * @property {number|null} [Device_Temp] HWToApp Device_Temp
     * @property {number|null} [Motor_Temp] HWToApp Motor_Temp
     * @property {number|null} [Bus_Voltage] HWToApp Bus_Voltage
     * @property {number|null} [Throttle] HWToApp Throttle
     */

    /**
     * Constructs a new HWToApp.
     * @exports HWToApp
     * @classdesc Represents a HWToApp.
     * @implements IHWToApp
     * @constructor
     * @param {IHWToApp=} [properties] Properties to set
     */
    function HWToApp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * HWToApp Bus_Current.
     * @member {number} Bus_Current
     * @memberof HWToApp
     * @instance
     */
    HWToApp.prototype.Bus_Current = 0;

    /**
     * HWToApp SOC.
     * @member {number} SOC
     * @memberof HWToApp
     * @instance
     */
    HWToApp.prototype.SOC = 0;

    /**
     * HWToApp RPM.
     * @member {number} RPM
     * @memberof HWToApp
     * @instance
     */
    HWToApp.prototype.RPM = 0;

    /**
     * HWToApp Torque.
     * @member {number} Torque
     * @memberof HWToApp
     * @instance
     */
    HWToApp.prototype.Torque = 0;

    /**
     * HWToApp GPS.
     * @member {string} GPS
     * @memberof HWToApp
     * @instance
     */
    HWToApp.prototype.GPS = "";

    /**
     * HWToApp GPSSize.
     * @member {number} GPSSize
     * @memberof HWToApp
     * @instance
     */
    HWToApp.prototype.GPSSize = 0;

    /**
     * HWToApp Net_Strength.
     * @member {number} Net_Strength
     * @memberof HWToApp
     * @instance
     */
    HWToApp.prototype.Net_Strength = 0;

    /**
     * HWToApp Device_Temp.
     * @member {number} Device_Temp
     * @memberof HWToApp
     * @instance
     */
    HWToApp.prototype.Device_Temp = 0;

    /**
     * HWToApp Motor_Temp.
     * @member {number} Motor_Temp
     * @memberof HWToApp
     * @instance
     */
    HWToApp.prototype.Motor_Temp = 0;

    /**
     * HWToApp Bus_Voltage.
     * @member {number} Bus_Voltage
     * @memberof HWToApp
     * @instance
     */
    HWToApp.prototype.Bus_Voltage = 0;

    /**
     * HWToApp Throttle.
     * @member {number} Throttle
     * @memberof HWToApp
     * @instance
     */
    HWToApp.prototype.Throttle = 0;

    /**
     * Creates a new HWToApp instance using the specified properties.
     * @function create
     * @memberof HWToApp
     * @static
     * @param {IHWToApp=} [properties] Properties to set
     * @returns {HWToApp} HWToApp instance
     */
    HWToApp.create = function create(properties) {
        return new HWToApp(properties);
    };

    /**
     * Encodes the specified HWToApp message. Does not implicitly {@link HWToApp.verify|verify} messages.
     * @function encode
     * @memberof HWToApp
     * @static
     * @param {IHWToApp} message HWToApp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    HWToApp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.Bus_Current != null && Object.hasOwnProperty.call(message, "Bus_Current"))
            writer.uint32(/* id 1, wireType 5 =*/13).float(message.Bus_Current);
        if (message.SOC != null && Object.hasOwnProperty.call(message, "SOC"))
            writer.uint32(/* id 2, wireType 5 =*/21).float(message.SOC);
        if (message.RPM != null && Object.hasOwnProperty.call(message, "RPM"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.RPM);
        if (message.Torque != null && Object.hasOwnProperty.call(message, "Torque"))
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.Torque);
        if (message.GPS != null && Object.hasOwnProperty.call(message, "GPS"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.GPS);
        if (message.GPSSize != null && Object.hasOwnProperty.call(message, "GPSSize"))
            writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.GPSSize);
        if (message.Net_Strength != null && Object.hasOwnProperty.call(message, "Net_Strength"))
            writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.Net_Strength);
        if (message.Device_Temp != null && Object.hasOwnProperty.call(message, "Device_Temp"))
            writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.Device_Temp);
        if (message.Motor_Temp != null && Object.hasOwnProperty.call(message, "Motor_Temp"))
            writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.Motor_Temp);
        if (message.Bus_Voltage != null && Object.hasOwnProperty.call(message, "Bus_Voltage"))
            writer.uint32(/* id 10, wireType 5 =*/85).float(message.Bus_Voltage);
        if (message.Throttle != null && Object.hasOwnProperty.call(message, "Throttle"))
            writer.uint32(/* id 11, wireType 5 =*/93).float(message.Throttle);
        return writer;
    };

    /**
     * Encodes the specified HWToApp message, length delimited. Does not implicitly {@link HWToApp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof HWToApp
     * @static
     * @param {IHWToApp} message HWToApp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    HWToApp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a HWToApp message from the specified reader or buffer.
     * @function decode
     * @memberof HWToApp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {HWToApp} HWToApp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    HWToApp.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.HWToApp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.Bus_Current = reader.float();
                    break;
                }
            case 2: {
                    message.SOC = reader.float();
                    break;
                }
            case 3: {
                    message.RPM = reader.uint32();
                    break;
                }
            case 4: {
                    message.Torque = reader.int32();
                    break;
                }
            case 5: {
                    message.GPS = reader.string();
                    break;
                }
            case 6: {
                    message.GPSSize = reader.uint32();
                    break;
                }
            case 7: {
                    message.Net_Strength = reader.uint32();
                    break;
                }
            case 8: {
                    message.Device_Temp = reader.uint32();
                    break;
                }
            case 9: {
                    message.Motor_Temp = reader.uint32();
                    break;
                }
            case 10: {
                    message.Bus_Voltage = reader.float();
                    break;
                }
            case 11: {
                    message.Throttle = reader.float();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a HWToApp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof HWToApp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {HWToApp} HWToApp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    HWToApp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a HWToApp message.
     * @function verify
     * @memberof HWToApp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    HWToApp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.Bus_Current != null && message.hasOwnProperty("Bus_Current"))
            if (typeof message.Bus_Current !== "number")
                return "Bus_Current: number expected";
        if (message.SOC != null && message.hasOwnProperty("SOC"))
            if (typeof message.SOC !== "number")
                return "SOC: number expected";
        if (message.RPM != null && message.hasOwnProperty("RPM"))
            if (!$util.isInteger(message.RPM))
                return "RPM: integer expected";
        if (message.Torque != null && message.hasOwnProperty("Torque"))
            if (!$util.isInteger(message.Torque))
                return "Torque: integer expected";
        if (message.GPS != null && message.hasOwnProperty("GPS"))
            if (!$util.isString(message.GPS))
                return "GPS: string expected";
        if (message.GPSSize != null && message.hasOwnProperty("GPSSize"))
            if (!$util.isInteger(message.GPSSize))
                return "GPSSize: integer expected";
        if (message.Net_Strength != null && message.hasOwnProperty("Net_Strength"))
            if (!$util.isInteger(message.Net_Strength))
                return "Net_Strength: integer expected";
        if (message.Device_Temp != null && message.hasOwnProperty("Device_Temp"))
            if (!$util.isInteger(message.Device_Temp))
                return "Device_Temp: integer expected";
        if (message.Motor_Temp != null && message.hasOwnProperty("Motor_Temp"))
            if (!$util.isInteger(message.Motor_Temp))
                return "Motor_Temp: integer expected";
        if (message.Bus_Voltage != null && message.hasOwnProperty("Bus_Voltage"))
            if (typeof message.Bus_Voltage !== "number")
                return "Bus_Voltage: number expected";
        if (message.Throttle != null && message.hasOwnProperty("Throttle"))
            if (typeof message.Throttle !== "number")
                return "Throttle: number expected";
        return null;
    };

    /**
     * Creates a HWToApp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof HWToApp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {HWToApp} HWToApp
     */
    HWToApp.fromObject = function fromObject(object) {
        if (object instanceof $root.HWToApp)
            return object;
        var message = new $root.HWToApp();
        if (object.Bus_Current != null)
            message.Bus_Current = Number(object.Bus_Current);
        if (object.SOC != null)
            message.SOC = Number(object.SOC);
        if (object.RPM != null)
            message.RPM = object.RPM >>> 0;
        if (object.Torque != null)
            message.Torque = object.Torque | 0;
        if (object.GPS != null)
            message.GPS = String(object.GPS);
        if (object.GPSSize != null)
            message.GPSSize = object.GPSSize >>> 0;
        if (object.Net_Strength != null)
            message.Net_Strength = object.Net_Strength >>> 0;
        if (object.Device_Temp != null)
            message.Device_Temp = object.Device_Temp >>> 0;
        if (object.Motor_Temp != null)
            message.Motor_Temp = object.Motor_Temp >>> 0;
        if (object.Bus_Voltage != null)
            message.Bus_Voltage = Number(object.Bus_Voltage);
        if (object.Throttle != null)
            message.Throttle = Number(object.Throttle);
        return message;
    };

    /**
     * Creates a plain object from a HWToApp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof HWToApp
     * @static
     * @param {HWToApp} message HWToApp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    HWToApp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.Bus_Current = 0;
            object.SOC = 0;
            object.RPM = 0;
            object.Torque = 0;
            object.GPS = "";
            object.GPSSize = 0;
            object.Net_Strength = 0;
            object.Device_Temp = 0;
            object.Motor_Temp = 0;
            object.Bus_Voltage = 0;
            object.Throttle = 0;
        }
        if (message.Bus_Current != null && message.hasOwnProperty("Bus_Current"))
            object.Bus_Current = options.json && !isFinite(message.Bus_Current) ? String(message.Bus_Current) : message.Bus_Current;
        if (message.SOC != null && message.hasOwnProperty("SOC"))
            object.SOC = options.json && !isFinite(message.SOC) ? String(message.SOC) : message.SOC;
        if (message.RPM != null && message.hasOwnProperty("RPM"))
            object.RPM = message.RPM;
        if (message.Torque != null && message.hasOwnProperty("Torque"))
            object.Torque = message.Torque;
        if (message.GPS != null && message.hasOwnProperty("GPS"))
            object.GPS = message.GPS;
        if (message.GPSSize != null && message.hasOwnProperty("GPSSize"))
            object.GPSSize = message.GPSSize;
        if (message.Net_Strength != null && message.hasOwnProperty("Net_Strength"))
            object.Net_Strength = message.Net_Strength;
        if (message.Device_Temp != null && message.hasOwnProperty("Device_Temp"))
            object.Device_Temp = message.Device_Temp;
        if (message.Motor_Temp != null && message.hasOwnProperty("Motor_Temp"))
            object.Motor_Temp = message.Motor_Temp;
        if (message.Bus_Voltage != null && message.hasOwnProperty("Bus_Voltage"))
            object.Bus_Voltage = options.json && !isFinite(message.Bus_Voltage) ? String(message.Bus_Voltage) : message.Bus_Voltage;
        if (message.Throttle != null && message.hasOwnProperty("Throttle"))
            object.Throttle = options.json && !isFinite(message.Throttle) ? String(message.Throttle) : message.Throttle;
        return object;
    };

    /**
     * Converts this HWToApp to JSON.
     * @function toJSON
     * @memberof HWToApp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    HWToApp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for HWToApp
     * @function getTypeUrl
     * @memberof HWToApp
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    HWToApp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/HWToApp";
    };

    return HWToApp;
})();

module.exports = $root;
