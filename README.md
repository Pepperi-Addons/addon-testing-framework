# Addon Testing Framework
A framework and an addon for creating addons tests


## Installation

#### System Requirements
`node --version` > 12.0.0

`npm --version` > 6.0.0

#### Install by running 
``` bash
npm init @pepperi-addons
```

## Project structure
The following is an overview of the project structure. 

### Main Folders
|Folder | Description |
| :--- | :--- |
| .vscode | Vscode tasks & launch |
| framework | Typescript source files of the testing framework |
| server-side | A typescript node.js app for writing an addon API |

#### Framework
##### Service Container
 Is responsible for managing the services of the framework.
 Each service only has one instance and is initialized when it is first requested.
 Services can be added to the container by calling the get method.
 Services must inherit from the BaseService class to be added to the container.
 There is a teardown method which will be called when the tests are finished.

 He is pre-loaded with:
 - `UuidGenerator`: generates UUIDs.
 - `SchemesGenerator`: generates schemes.
 - `ResourceManagerService`: handles creating and cleaning up resources, available resource types:
     - `AdalTableResource`: ADAL resource (table).

## Debugging

### Framework
The best way to debug framework changes is to use `npm pack` to create a local package and install it on an addon that uses the framework - then debug as you would normally debug an addon.

## CPI Tests
To enable tests on the CPI side, the included addon must be installed on the target distributor.

## Contributions
This project is far from being complete and is missing tooling, documentation, examples and more.
Feel free to open PRs to improve on those aspects.