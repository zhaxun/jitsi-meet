// @flow

import { IconSwitchCamera, IconSwitchCameraFront, IconSwitchCameraBack } from '../../icons';
import { MEDIA_TYPE, toggleCameraFacingMode } from '../../media';

import AbstractButtonLabel from './AbstractButtonLabel';
import type { Props } from './AbstractButtonLabel';

/**
 * An abstract implementation of a button for toggling video mute.
 */
export default class AbstractCameraSwitchButton<P : Props, S : *>
    extends AbstractButtonLabel<P, S> {

    icon = IconSwitchCameraFront;
    toggledIcon = IconSwitchCameraBack;

    /**
     * Handles clicking / pressing the button, and toggles the video mute state
     * accordingly.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        this._toggleCamera();
        this.props.dispatch(toggleCameraFacingMode());
    }

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        // console.error("AbstractCameraSwitchButton::_isCameraFront = ", this.props._isCameraFront)
        return !this._isCameraFront();
    }
    _isCameraFront(){

    }
    _toggleCamera(){

    }
}
