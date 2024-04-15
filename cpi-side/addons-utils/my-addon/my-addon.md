# My Addon
This example demonstrates an addon that wants to add some cpi-side capabilities for its tests.

Note, only capabilities or function that are not common to all addons should be added in this approach.

## how to add an addon
in order to add an addon, create a folder under `cpi-side/addons-utils` with your addon name. \
Then, add the addon file, the file name should to be unique, the same as the folder name and add the `-cpi` suffix.\
for example, if the addon name is `my-addon`, the file name should be `my-addon-cpi.js`.

If you need some services, you can add them in the `services` folder under your addon folder. 

Addon Heirarchy for the example:
```
cpi-side 
│
└───addons-utils
│   │
│   └───my-addon
│       │   my-addon-cpi.js
│       │
│       └───services
│           │   my-service.js
│           │   ...
```

## publishing
To make sure that your addon will be published, you need to add it to the `CPISide` array in the `addon-config.json` file.\
Make 

## debugging
If you want to debug your addon, you need to replace the `FileName` in the `debugger-config.json` file with the name of your addon file.


