#### mocha-tnv
- run your tests on multiple processes
- run your tests with query magic


### Usage
````
node_modules/mocha-tnv/bin/tnv
node_modules/mocha-tnv/bin/tnv --config=test/tnv.json
node_modules/mocha-tnv/bin/tnv --config=test/tnv.json --query=login
node_modules/mocha-tnv/bin/tnv --config=test/tnv.json --query=login --folder=user
node_modules/mocha-tnv/bin/tnv --config=test/tnv.json --folder=user

ln -S /usr/bin/tnv .../node_modules/mocha-tnv/bin/tnv [optional]
````



### TODO's
- add log level
- add remote flag
- write tests
- add as npm package (add deps before)