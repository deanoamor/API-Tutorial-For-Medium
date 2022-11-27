//import route admin pada routes\admin.route.js
const adminRoute = require('./admin.route');

//import route item pada routes\item.route.js
const itemRoute = require('./item.route');

module.exports = function(app,urlApi){
    //route admin
    app.use(urlApi,adminRoute);

    //route item
    app.use(urlApi,itemRoute);
}