(function () {

    "use strict";

    var SPEEDS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 10, 20],
        SPEED_KEY = "Backquote",
        SEEK_KEY_MAPPINGS = {
            "Digit0": 0, "Digit1": 1, "Digit2": 2, "Digit3": 3, "Digit4": 4,
            "Digit5": 5, "Digit6": 6, "Digit7": 7, "Digit8": 8, "Digit9": 9,
            "Numpad0": 0, "Numpad1": 1, "Numpad2": 2, "Numpad3": 3, "Numpad4": 4,
            "Numpad5": 5, "Numpad6": 6, "Numpad7": 7, "Numpad8": 8, "Numpad9": 9
        };

    function inputActive(element) {
        var tag = element.tagName.toLowerCase();
        return tag === "input" || tag === "textarea" || element.isContentEditable;
    }

    function fadeout(element, startOpacity) {
        var op = startOpacity;
        var timer = setInterval(function () {
            if (op <= 0.1) {
                clearInterval(timer);
                element.style.display = "none";
            }
            element.style.opacity = op;
            op -= op * 0.1;
        }, 50);
    }

    function displayText(speed, boundingElement) {
        var elementId = "youtube-extension-text-box",
            element = document.getElementById(elementId);

        if (!element) {
            boundingElement.insertAdjacentHTML(
                "afterbegin",
                '<div id="' + elementId + '">' + speed + 'x</div>'
            );
            element = document.getElementById(elementId);
        } else {
            element.innerHTML = speed + "x";
        }

        element.style.display = "block";
        element.style.opacity = 0.8;
        setTimeout(function () {
            fadeout(element, 0.8);
        }, 1500);
    }

    window.addEventListener("keyup", function (e) {
        var video = document.getElementsByTagName("video")[0],
            mediaElement = document.getElementById("movie_player"),
            activeElement = document.activeElement;

        if (!video || !mediaElement) {
            return;
        }

        if (inputActive(activeElement)) {
            return;
        }

        // Speed controls: ` to increase, ctrl+` to decrease
        if (e.code === SPEED_KEY) {
            var current = video.playbackRate;
            var i;
            if (e.ctrlKey) {
                // Find the next lower speed
                for (i = SPEEDS.length - 1; i >= 0; i--) {
                    if (SPEEDS[i] < current) {
                        video.playbackRate = SPEEDS[i];
                        break;
                    }
                }
            } else {
                // Find the next higher speed
                for (i = 0; i < SPEEDS.length; i++) {
                    if (SPEEDS[i] > current) {
                        video.playbackRate = SPEEDS[i];
                        break;
                    }
                }
            }
            displayText(video.playbackRate, mediaElement);
            return;
        }

        // Don't override seek keys if the player or its children are focused
        if (mediaElement.contains(activeElement)) {
            return;
        }

        // Number keys: seek to percentage of video
        if (SEEK_KEY_MAPPINGS[e.code] !== undefined) {
            video.currentTime = (SEEK_KEY_MAPPINGS[e.code] / 10) * video.duration;
        }
    });

}());
