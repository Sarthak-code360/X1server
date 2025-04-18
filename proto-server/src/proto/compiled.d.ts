import * as $protobuf from "protobufjs";
import Long = require("long");
/** Properties of an AppToHW. */
export interface IAppToHW {

    /** AppToHW RPMPreset */
    RPMPreset?: (number|null);

    /** AppToHW Immobolize */
    Immobolize?: (boolean|null);

    /** AppToHW MotorType */
    MotorType?: (boolean|null);

    /** AppToHW devMode */
    devMode?: (number|null);
}

/** Represents an AppToHW. */
export class AppToHW implements IAppToHW {

    /**
     * Constructs a new AppToHW.
     * @param [properties] Properties to set
     */
    constructor(properties?: IAppToHW);

    /** AppToHW RPMPreset. */
    public RPMPreset?: (number|null);

    /** AppToHW Immobolize. */
    public Immobolize?: (boolean|null);

    /** AppToHW MotorType. */
    public MotorType?: (boolean|null);

    /** AppToHW devMode. */
    public devMode?: (number|null);

    /** AppToHW _RPMPreset. */
    public _RPMPreset?: "RPMPreset";

    /** AppToHW _Immobolize. */
    public _Immobolize?: "Immobolize";

    /** AppToHW _MotorType. */
    public _MotorType?: "MotorType";

    /** AppToHW _devMode. */
    public _devMode?: "devMode";

    /**
     * Creates a new AppToHW instance using the specified properties.
     * @param [properties] Properties to set
     * @returns AppToHW instance
     */
    public static create(properties?: IAppToHW): AppToHW;

    /**
     * Encodes the specified AppToHW message. Does not implicitly {@link AppToHW.verify|verify} messages.
     * @param message AppToHW message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IAppToHW, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified AppToHW message, length delimited. Does not implicitly {@link AppToHW.verify|verify} messages.
     * @param message AppToHW message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IAppToHW, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an AppToHW message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns AppToHW
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): AppToHW;

    /**
     * Decodes an AppToHW message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns AppToHW
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): AppToHW;

    /**
     * Verifies an AppToHW message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an AppToHW message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns AppToHW
     */
    public static fromObject(object: { [k: string]: any }): AppToHW;

    /**
     * Creates a plain object from an AppToHW message. Also converts values to other types if specified.
     * @param message AppToHW
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: AppToHW, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this AppToHW to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for AppToHW
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a HWToApp. */
export interface IHWToApp {

    /** HWToApp Bus_Current */
    Bus_Current?: (number|null);

    /** HWToApp SOC */
    SOC?: (number|null);

    /** HWToApp RPM */
    RPM?: (number|null);

    /** HWToApp Torque */
    Torque?: (number|null);

    /** HWToApp GPS */
    GPS?: (string|null);

    /** HWToApp GPSSize */
    GPSSize?: (number|null);

    /** HWToApp Net_Strength */
    Net_Strength?: (number|null);

    /** HWToApp Device_Temp */
    Device_Temp?: (number|null);

    /** HWToApp Motor_Temp */
    Motor_Temp?: (number|null);

    /** HWToApp Bus_Voltage */
    Bus_Voltage?: (number|null);

    /** HWToApp Throttle */
    Throttle?: (number|null);
}

/** Represents a HWToApp. */
export class HWToApp implements IHWToApp {

    /**
     * Constructs a new HWToApp.
     * @param [properties] Properties to set
     */
    constructor(properties?: IHWToApp);

    /** HWToApp Bus_Current. */
    public Bus_Current: number;

    /** HWToApp SOC. */
    public SOC: number;

    /** HWToApp RPM. */
    public RPM: number;

    /** HWToApp Torque. */
    public Torque: number;

    /** HWToApp GPS. */
    public GPS: string;

    /** HWToApp GPSSize. */
    public GPSSize: number;

    /** HWToApp Net_Strength. */
    public Net_Strength: number;

    /** HWToApp Device_Temp. */
    public Device_Temp: number;

    /** HWToApp Motor_Temp. */
    public Motor_Temp: number;

    /** HWToApp Bus_Voltage. */
    public Bus_Voltage: number;

    /** HWToApp Throttle. */
    public Throttle: number;

    /**
     * Creates a new HWToApp instance using the specified properties.
     * @param [properties] Properties to set
     * @returns HWToApp instance
     */
    public static create(properties?: IHWToApp): HWToApp;

    /**
     * Encodes the specified HWToApp message. Does not implicitly {@link HWToApp.verify|verify} messages.
     * @param message HWToApp message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IHWToApp, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified HWToApp message, length delimited. Does not implicitly {@link HWToApp.verify|verify} messages.
     * @param message HWToApp message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IHWToApp, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a HWToApp message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns HWToApp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): HWToApp;

    /**
     * Decodes a HWToApp message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns HWToApp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): HWToApp;

    /**
     * Verifies a HWToApp message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a HWToApp message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns HWToApp
     */
    public static fromObject(object: { [k: string]: any }): HWToApp;

    /**
     * Creates a plain object from a HWToApp message. Also converts values to other types if specified.
     * @param message HWToApp
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: HWToApp, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this HWToApp to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for HWToApp
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}
