# My Addon

This example demonstrates an addon that wants to add some cpi-side capabilities for its tests.

Note, only capabilities or function that are not common to all addons should be added in this approach.

## how to add an addon
in order to add an create your own folder under `cpi-side/addons-utils` and add your addon there. \
Then, add the addon file, and name it to be unique and the same as the folder name.

If you need some services, you can add them in the `services` folder under your addon folder. 

## publishing

To make sure that your addon will be published, you need to add it to the `CPISide` array in the `addon-config.json` file.

## debugging
If you want to debug your addon, you need to replace the `FileName` in the `debugger-config.json` file with the name of your addon file.


