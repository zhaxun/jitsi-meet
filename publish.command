cd `dirname $0`

./android/scripts/release-sdk.sh /tmp/repo

cp -r /private/tmp/repo/org/jitsi/ /Users/bz/Documents/GitHub/IM_Client_Android/repository/org/jitsi/