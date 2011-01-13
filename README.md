[SSL Everywhere](https://www.nearinfinity.com/home/ssl-everywhere.html) is a Safari web browser extension developed by [Near Infinity](https://www.nearinfinity.com) to force SSL encryption for many of today's popular websites. The extension leverages work done by the [Electronic Frontier Foundation's]() (EFF) [HTTPS Everywhere]() extension for Firefox.

You can learn more about SSL Everywhere on the [SSL Everywhere home page](https://www.nearinfinity.com/home/opensource/ssl-everywhere.html).

Building
========
Follow these steps to build the extension and try it on your own computer.

The rule files borrowed from HTTPS Everywhere are included as XML files. However, to use them with SSL Everywhere they first need to be converted to JavaScript. The project includes a Rakefile with tasks for building all the files needed for the Safari extension. If you don't have Ruby installed, please see the [download and installation instructions](http://www.ruby-lang.org/en/downloads/) from the Ruby language web site.

Once you have Ruby setup, you'll need to install a few gems

    gem install rake  # Note: this is likely already installed
    gem install json
    gem install plist

After successfully installing those gems, you can generate the JavaScript rule files and several other files simply by running the following command from the root of the project

    rake build

Once you've completed these steps you can install the extension as described in the [Safari Extension Development Guide](http://developer.apple.com/library/safari/#documentation/Tools/Conceptual/SafariExtensionGuide/Introduction/Introduction.html).

Contributing
============

You'll need a basic understanding of how to develop extensions for the Safari web browser. Apple has excellent documentation that should [get you started](http://developer.apple.com/library/safari/#documentation/Tools/Conceptual/SafariExtensionGuide/Introduction/Introduction.html) quickly. Then, just follow the instructions below to get the source code and start contributing.

### Forking the project into your github account
You can fork this project within github, as described on [help.github.com](http://help.github.com/forking/). This fork will show up on your own github profile, and can be checked out to your local machine. You don't need a webserver on there, or run any project-specific scripts.

### Updating your project fork
You should update your own repository every now and then from "upstream" (the original repository), to ensure you make any changes on the most recent version of files. See "[Pulling in upstream changes](http://help.github.com/forking/#pulling_in_upstream_changes)" on help.github.com.

### Committing changes back through "pull requests"
See "[Pull requests](http://help.github.com/pull-requests/)" on help.github.com.

### Merging in "pull requests"
This only needs to be done by maintainers of the original repository. Merging back pull requests can either be done [straight on github](http://github.com/chillu/silverstripe-doc-restructuring/forkqueue) (for simple cases), or through git pull commands (see [guide](http://github.com/guides/pull-requests)).

Credits
=======
Special thanks to Michael Flarup for allowing us to use his beautiful Safari World icon for this project. You can find more of his excellent work at [PixelResort](http://pixelresort.com/).
