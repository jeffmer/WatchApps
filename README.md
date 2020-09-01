Espruino App Loader (and Apps)
==============================

**THIS IS BETA:** We're still trying things out, so there isn't a great
app selection and things are liable to change.

[![Build Status](https://travis-ci.org/espruino/EspruinoApps.svg?branch=master)](https://travis-ci.org/espruino/EspruinoApps)

<!-- * Try the **release version** at [espruino.com/apps](https://espruino.com/apps) -->
* Try the **development version** at [github.io](https://espruino.github.io/EspruinoApps/)

**All software (including apps) in this repository is MIT Licensed - see [LICENSE](LICENSE)** By
submitting code to this repository you confirm that you are happy with it being MIT licensed,
and that it is not licensed in another way that would make this impossible.

## How does it work?

* A list of apps is in `apps.json`
* Each element references an app in `apps/<id>` which is uploaded
* When it starts, EspruinoAppLoader checks the JSON and compares
it with the files it sees in storage.
* To upload an app, EspruinoAppLoader checks the files that are
listed in `apps.json`, loads them, and sends them over Web Bluetooth.

## Credits

The majority of icons used for these apps are from [Icons8](https://icons8.com/) - we have a commercial license but icons are also free for Open Source projects.
