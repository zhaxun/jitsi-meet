// @flow

import { IconSwitchAudioSpeak, IconSwitchAudioPhone } from '../../icons';
import { MEDIA_TYPE, toggleCameraFacingMode } from '../../media';

import AbstractButtonLabel from './AbstractButtonLabel';
import type { Props } from './AbstractButtonLabel';

/**
 * An abstract implementation of a button for toggling video mute.
 */
export default class AbstractAudioRouterButton<P : Props, S : *>
    extends AbstractButtonLabel<P, S> {

    icon = IconSwitchAudioSpeak;
    toggledIcon = IconSwitchAudioPhone;

    /**
     * Handles clicking / pressing the button, and toggles the video mute state
     * accordingly.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
    }

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return false;
    }
}
