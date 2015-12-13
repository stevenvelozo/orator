# Change Log
--
#### 2015-03-06: Steven Velozo
* Initial Code Dump

#### 2015-03-09: Steven Velozo
* Test coverage, worked out kinks

#### 2015-03-25
* Added matrix for enabling Restify Native Modules
* Changed the nodegrind module to optional so we can run in Windows (no dtrace/c++ there)

#### 2015-03-27
* Added a property for accessing Restify Native Modules
* Added the FullResponse restify parser

#### 2015-12-12
* Added a simple mechanism for adding static routes
* Added static formatter configuration for legacy ie and CSS
* Changed web server to be lazily loaded the first time the webServer object is accessed, so raw settings can be twiddled outside the config file
