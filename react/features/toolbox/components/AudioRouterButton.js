// @flow
import _ from 'lodash';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import { AbstractAudioRouterButton } from '../../base/toolbox';
import type { AbstractButtonProps } from '../../base/toolbox';
import {
    Icon,
    IconDeviceBluetooth,
    IconDeviceEarpiece,
    IconDeviceHeadphone,
    IconDeviceSpeaker
} from '../../base/icons';
import { NativeModules } from 'react-native';
const { AudioMode } = NativeModules;

/**
 * Type definition for a single entry in the device list.
 */
type Device = {

    /**
     * Name of the icon which will be rendered on the right.
     */
    icon: Object,

    /**
     * True if the element is selected (will be highlighted in blue),
     * false otherwise.
     */
    selected: boolean,

    /**
     * Text which will be rendered in the row.
     */
    text: string,

    /**
     * Device type.
     */
    type: string,

    /**
     * Unique device ID.
     */
    uid: ?string
};

/**
 * "Raw" device, as returned by native.
 */
type RawDevice = {

    /**
     * Display name for the device.
     */
    name: ?string,

    /**
     * is this device selected?
     */
    selected: boolean,

    /**
     * Device type.
     */
    type: string,

    /**
     * Unique device ID.
     */
    uid: ?string
};

/**
 * {@code AudioRouterButton}'s React {@code Component} prop types.
 */
type Props = AbstractButtonProps & {
    /**
     * Object describing available devices.
     */
    _devices: Array<RawDevice>,
    
    /**
     * Used for hiding the dialog when the selection was completed.
     */
    dispatch: Function,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function
};

/**
 * {@code AudioRouterButton}'s React {@code Component} state types.
 */
type State = {

    /**
     * Array of available devices.
     */
    devices: Array<Device>
};
const deviceInfoMap = {
    BLUETOOTH: {
        icon: IconDeviceBluetooth,
        text: 'audioDevices.bluetooth',
        type: 'BLUETOOTH'
    },
    EARPIECE: {
        icon: IconDeviceEarpiece,
        text: 'audioDevices.phone',
        type: 'EARPIECE'
    },
    HEADPHONES: {
        icon: IconDeviceHeadphone,
        text: 'audioDevices.headphones',
        type: 'HEADPHONES'
    },
    SPEAKER: {
        icon: IconDeviceSpeaker,
        text: 'audioDevices.speaker',
        type: 'SPEAKER'
    }
};
/**
 * Component that renders a toolbar button for toggling video mute.
 *
 * @extends AbstractAudioRouterButton
 */
class AudioRouterButton extends AbstractAudioRouterButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.switchcamera';
    label = '免提';
    tooltip = '免提';

    state = {
        /**
         * Available audio devices, it will be set in
         * {@link #getDerivedStateFromProps()}.
         */
        devices: [],
        audioSpeak : false
    };
    /**
     * Implements React's {@link Component#getDerivedStateFromProps()}.
     *
     * @inheritdoc
     */
    static getDerivedStateFromProps(props: Props) {
        const { _devices: devices } = props;

        if (!devices) {
            return null;
        }

        const audioDevices = [];

        for (const device of devices) {
            const infoMap = deviceInfoMap[device.type];
            const text = device.type === 'BLUETOOTH' && device.name ? device.name : infoMap.text;

            if (infoMap) {
                const info = {
                    ...infoMap,
                    selected: Boolean(device.selected),
                    text: props.t(text),
                    uid: device.uid
                };

                audioDevices.push(info);
            }
        }

        // Make sure devices is alphabetically sorted.
        return {
            devices: _.sortBy(audioDevices, 'text')
        };
    }

    /**
     * Initializes a new {@code AudioRouterButton} instance.
     *
     * @param {Props} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        // Trigger an initial update.
        AudioMode.updateDeviceList && AudioMode.updateDeviceList();
    }

    /**
     * Registers the keyboard shortcut that toggles the video muting.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        this.closeSpeakerVoice();
        typeof APP === 'undefined'
            || APP.keyboardshortcut.registerShortcut(
                'V',
                null,
                this._onKeyboardShortcut,
                'keyboardShortcuts.videoMute');
    }

    /**
     * Unregisters the keyboard shortcut that toggles the video muting.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        typeof APP === 'undefined'
            || APP.keyboardshortcut.unregisterShortcut('V');
    }

    _handleClick() {
        const { devices } = this.state;
        if(devices.length > 1){
            let selectDevice;
            devices.forEach(device => {
                const { icon, selected, text } = device;
                if(selected){

                }else{
                    selectDevice = device; 
                }
            })
            AudioMode.setAudioDevice(selectDevice.uid || selectDevice.type);
            
        }
        this.setState({ audioSpeak: !this.state.audioSpeak });
    }

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.state.audioSpeak;
    }

    closeSpeakerVoice(){
        const { devices } = this.state;
        // console.error("closeSpeakerVoice", devices)
        if(devices.length > 1){
            let selectDevice;
            for(let i=0; i<devices.length; i++){
                if(devices[i].type == deviceInfoMap.HEADPHONES.type){
                    selectDevice = devices[i]
                    break;
                }
                if(devices[i].type == deviceInfoMap.EARPIECE.type){
                    selectDevice = devices[i]
                }
            }
            AudioMode.setAudioDevice(selectDevice.uid || selectDevice.type);
            this.setState({ audioSpeak : false });
        }
    }
}


/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code VideoMuteButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _audioOnly: boolean,
 *     _videoMuted: boolean
 * }}
 */
function _mapStateToProps(state): Object {
    return {
        _devices: state['features/mobile/audio-mode'].devices,
        audioSpeak:true
    };
}

export default translate(connect(_mapStateToProps)(AudioRouterButton));
