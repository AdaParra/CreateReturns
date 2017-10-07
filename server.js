var express = require('express'),
  app = express(),
  port = 8080,
  appDirectory = __dirname + '/webapp',
  launchUrl = 'http://localhost:' + port + appDirectory;

  /**Para la correr la app con el sdk local
  	*sdkDirectory = __dirname + '/sdk',
  	*sdkURL = 'http://localhost:' + port + sdkDirectory;
  	*app.use('/sdk', express.static(sdkDirectory));
  **/

app.use('/webapp', express.static(appDirectory));

// start server
app.listen(port);

// log to server console
console.log("SAPUI5 app webapp running at\n  => " + launchUrl +
  " \nCTRL + C to shutdown");

/**Para usar la App correr en el navegador http://localhost:3000/FirstWeight
	* Debe tener en la misma carpeta el modulo express node_modules **/
