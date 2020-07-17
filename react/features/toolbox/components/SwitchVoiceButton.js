// @flow

import _ from 'lodash';
import { createToolbarEvent, VIDEO_MUTE, sendAnalytics } from '../../analytics';
import { appNavigate } from '../../app/actions';
import { disconnect } from '../../base/connection';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import { AbstractSwitchVoiceButton } from '../../base/toolbox';
import type { AbstractButtonProps } from '../../base/toolbox';
import {
    VIDEO_MUTISM_AUTHORITY,
    setVideoMuted
} from '../../base/media';
import { setAudioOnly } from '../../base/audio-only';
import { NativeModules } from 'react-native';
const { AudioMode } = NativeModules;
/**
 * The type of the React {@code Component} props of {@link SwitchVoiceButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

const deviceInfoMap = {
    BLUETOOTH: {
        text: 'audioDevices.bluetooth',
        type: 'BLUETOOTH'
    },
    EARPIECE: {
        text: 'audioDevices.phone',
        type: 'EARPIECE'
    },
    HEADPHONES: {
        text: 'audioDevices.headphones',
        type: 'HEADPHONES'
    },
    SPEAKER: {
        text: 'audioDevices.speaker',
        type: 'SPEAKER'
    }
};

/**
 * Component that renders a toolbar button for leaving the current conference.
 *
 * @extends AbstractHangupButton
 */
class SwitchVoiceButton extends AbstractSwitchVoiceButton<Props, *> {

    accessibilityLabel = 'toolbar.accessibilityLabel.switchtovoiceonly';
    label = '切到语音通话';
    tooltip = '切到语音通话';
    state = {
        /**
         * Available audio devices, it will be set in
         * {@link #getDerivedStateFromProps()}.
         */
        devices: [],
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
     * Initializes a new SwitchVoiceButton instance.
     *
     * @param {Props} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);
        // Trigger an initial update.
        AudioMode.updateDeviceList && AudioMode.updateDeviceList();
    }

    /**
     * 切换语音通话，开启听筒
     *
     * @override
     * @param {boolean} videoMuted - Whether video should be muted or not.
     * @protected
     * @returns {void}
     */
    _setVideoMuted(videoMuted: boolean) {
        sendAnalytics(createToolbarEvent(VIDEO_MUTE, { enable: videoMuted }));
        if (this.props._audioOnly) {
            this.props.dispatch(
                setAudioOnly(false, /* ensureTrack */ true));
        }
        const mediaType = this.props._videoMediaType;

        this.props.dispatch(
            setVideoMuted(
                videoMuted,
                mediaType,
                VIDEO_MUTISM_AUTHORITY.USER,
                /* ensureTrack */ true));

        this.closeSpeakerVoice();
  
        // FIXME: The old conference logic still relies on this event being
        // emitted.
        typeof APP === 'undefined'
            || APP.UI.emitEvent(UIEvents.VIDEO_MUTED, videoMuted, true);
    }

    closeSpeakerVoice(){
        const { devices } = this.state;
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
           _devices: state['features/mobile/audio-mode'].devices
       };
   }
export default translate(connect(_mapStateToProps)(SwitchVoiceButton));
