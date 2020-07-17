// @flow

import UIEvents from '../../../../service/UI/UIEvents';
import {
    ACTION_SHORTCUT_TRIGGERED,
    VIDEO_MUTE,
    createShortcutEvent,
    sendAnalytics
} from '../../analytics';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import { AbstractCameraSwitchButton } from '../../base/toolbox';
import type { AbstractButtonProps } from '../../base/toolbox';
import { getLocalVideoType, isLocalVideoTrackMuted } from '../../base/tracks';

declare var APP: Object;

/**
 * The type of the React {@code Component} props of {@link VideoMuteButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
}

/**
 * Component that renders a toolbar button for toggling video mute.
 *
 * @extends AbstractCameraSwitchButton
 */
class CameraSwitchButton extends AbstractCameraSwitchButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.switchcamera';
    label = '切换摄像头';
    tooltip = '切换摄像头';
    state = {
        /**
         * Whether video button is disabled or not.
         */
        cameraFront: true,
    };
    /**
     * Initializes a new {@code CameraSwitchButton} instance.
     *
     * @param {Props} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);
        // Bind event handlers so they are only bound once per instance.
        this._onKeyboardShortcut = this._onKeyboardShortcut.bind(this);
    }

    /**
     * Registers the keyboard shortcut that toggles the video muting.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
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

    _onKeyboardShortcut: () => void;

    /**
     * Creates an analytics keyboard shortcut event and dispatches an action to
     * toggle the video muting.
     *
     * @private
     * @returns {void}
     */
    _onKeyboardShortcut() {
        sendAnalytics(
            createShortcutEvent(
                VIDEO_MUTE,
                ACTION_SHORTCUT_TRIGGERED,
                { enable: !this._isVideoMuted() }));

        super._handleClick();
    }
    _toggleCamera(){
        this.setState({cameraFront:!this.state.cameraFront});
    }
    _isCameraFront(){
        return this.state.cameraFront;
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
    const { enabled: audioOnly } = state['features/base/audio-only'];
    const tracks = state['features/base/tracks'];

    return {
        _cameraFront: true
    };
}

export default translate(connect(_mapStateToProps)(CameraSwitchButton));
