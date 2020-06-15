local st = require "util.stanza";
local is_feature_allowed = module:require "util".is_feature_allowed;
local token_util = module:require "token/util".new(parentCtx);

local accepted_rayo_iq_token_issuers = module:get_option_string("accepted_rayo_iq_token_issuers");

-- filters jibri iq in case of requested from jwt authenticated session that
-- has features in the user context, but without feature for recording
module:hook("pre-iq/full", function(event)
    local stanza = event.stanza;
    if stanza.name == "iq" then
        local jibri = stanza:get_child('jibri', 'http://jitsi.org/protocol/jibri');
        if jibri then
            local session = event.origin;
            local token = session.auth_token;

            if jibri.attr.action == 'start' then
                if accepted_rayo_iq_token_issuers then
                    local app_data = jibri.attr.app_data;
                    local errorReason = '';
                    if app_data then
                        app_data = json.decode(app_data);
                        module:log("debug","jibri app data found %s",inspect(app_data));

                        if app_data.token then
                            local session = {};
                            session.auth_token = app_data.token;
                            local verified, reason = token_util:process_and_verify_token(session, accepted_rayo_iq_token_issuers);
                            if verified then
                                return nil; -- this will proceed with dispatching the stanza
                            end
                            errorReason = reason;
                        end
                    end

                    log("warn", "not a valid token %s", tostring(errorReason));
                    session.send(st.error_reply(stanza, "auth", "forbidden"));
                    return true;
                end

                if token == nil
                    or not is_feature_allowed(session,
                    (jibri.attr.recording_mode == 'file' and 'recording' or 'livestreaming')
                ) then
                    module:log("info",
                        "Filtering jibri start recording, stanza:%s", tostring(stanza));
                    session.send(st.error_reply(stanza, "auth", "forbidden"));
                    return true;
                end
            end
        end
    end
end);
