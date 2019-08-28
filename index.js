/**
 *  @akvijayk
 */
var express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const editJsonFile = require("edit-json-file");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );

  // intercept OPTIONS method
  if ("OPTIONS" == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};
app.use(allowCrossDomain);
app.use(express.static(path.join(__dirname, "build")));
//setting middleware
//app.use(express.static(__dirname + "build")); //Serves resources from public folder
app.listen(3000, function() {
  console.log("listening on port 3000");
});
/** This method takes the products details list from the JSON file and serves as the GET Endpoint */
let file = editJsonFile("./products.json");
app.get("/products/getProductList", (req, res) => {
  let key = req.query.key;

  if (file.get("prodcutCollections") != undefined) {
    const finalJson = file.get("prodcutCollections");
    if (key != undefined) {
      var result = [];
      for (let i in finalJson) {
        if (key === finalJson[i].name) {
          result.push(finalJson[i]);
          console.log(result);
          res.json(result);
        }
      }
    } else {
      res.json(finalJson);
    }
  } else {
    res.status(400);
    res.send("Products does not exist");
  }
});
