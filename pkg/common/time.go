package common

import "time"

// GetUTCTimeInMillis return time.now in miliseconds (UTC).
func GetUTCTimeInMillis() int64 {
	// now in utc
	now := time.Now().UTC()

	// convert to miliseconds
	return now.UnixNano() / int64(time.Millisecond)
}
