// @flow

import { IconAudio } from '../../icons';

import AbstractButtonLabel from './AbstractButtonLabel';
import type { Props } from './AbstractButtonLabel';

/**
 * An abstract implementation of a button for disconnecting a conference.
 */
export default class AbstractSwitchVoiceButton<P : Props, S: *>
    extends AbstractButtonLabel<P, S> {

    icon = IconAudio;

    /**
     * Handles clicking / pressing the button, and disconnects the conference.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        this._setVideoMuted(true);
    }
    /**
     * Helper function to perform the actual setting of the video mute / unmute
     * action.
     *
     * @param {boolean} videoMuted - Whether video should be muted or not.
     * @protected
     * @returns {void}
     */
    _setVideoMuted(videoMuted: boolean) { // eslint-disable-line no-unused-vars
        // To be implemented by subclass.
    }
}
