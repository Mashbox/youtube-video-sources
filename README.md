# YouTube Video Source
This is an example script to pull a YouTube video source that you can then use to process with the Clarify API.

YouTube offers an undocumented endpoint (http://www.youtube.com/get_video_info) outside of it's core API with raw information on the various streams available for a specific video in a plain text format. You can query this endpoint for the information and parse through the data to extract the media URL.

This example parses a URL to extract the YouTube ID, then queryies the YouTube endpoint to recieve raw text information, parses it for only MP4 streams and returns the name of the video and a URL to the highest quality stream.

View the Example.html file for a live demonstration.

### Usage ###

you must instantiate the YouTubeMedia class and pass in the URL as a parameter.

```
var yt = new YouTubeMedia("http://www.youtube.com/watch?v=ID")
```

You can then request the sources and it returns a jQuery promise with the data.

```
yt.getSource().done(function (video) {
    // do something here
});
```
