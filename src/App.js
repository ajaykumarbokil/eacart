import React, { Component } from "react";
import logo from "./eaLogo.png";
import "./App.css";
//Used MaterialUI Components to Design the Custom Fields
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Autocomplete from "./components/AutoComplete";
import { getCards } from "./util/RestUtil";
import { withStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const StyledBadge = withStyles(theme => ({
  badge: {
    top: "50%",
    right: -3,
    // The border color match the background color.
    border: `2px solid ${
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[900]
    }`
  }
}))(Badge);
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));
//TitleBar - Top NAV Bar
function TitleBar(props) {
  const classes = useStyles();
  console.info(JSON.stringify(props));

  //Containts the Badge UI Code
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <img src={logo} className="_logo" />
          </Typography>
          <IconButton aria-label="cart">
            <StyledBadge badgeContent={props.count} color="primary">
              <ShoppingCartIcon />
            </StyledBadge>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
//Cards List -> Stateless Components Which can be iterable
function CardsList(props) {
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }
  return (
    <div>
      <div className="card" style={{ width: "18rem" }}>
        <img src={props.data.imageURL} className="card-img-top" alt="..." />
        <div className="card-body">
          <p className="card-text">{props.data.name}</p>
          <div>
            <button
              className="addtocart"
              onClick={() => {
                props.handler(props.data.name);
                handleClickOpen(props.data.name);
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Thank you!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            "{props.data.name}" has been added to the cart successfully.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
// Main APP
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClear: false, //Flag to control Clear
      categoryList: [], // Product array which gets updated on every request
      badgeCount: 0, //Bade Count
      masterProdArray: [], // Master array which holds the Products list
      masterNameArray: [], // Master array which holds the dropdown list
      cards: []
    };
  }

  // Change handler to update the existing cardsArray with the response from the Service
  changeHandler = value => {
    //Calling Rest API Hosted with Search Key in the Same APP
    let prodArray = getCards(value);
    prodArray.then(response => {
      let nameArray = [];
      for (let resjson of response) {
        nameArray.push(resjson.name);
      }
      this.setState({
        categoryList: nameArray,
        isClear: false,
        cards: response
      });
    });
  };

  //Clearing the new  product list with masterlist.
  clear = () => {
    this.setState({
      categoryList: this.state.masterNameArray,
      isClear: true,
      cards: this.state.masterProdArray
    });
  };

  //Updating the badge count with previous state value
  updatebadge = count => {
    this.setState({
      badgeCount: this.state.badgeCount + 1
    });
  };

  //This method includes the Update BadeCount & clear Function callback
  render() {
    return (
      <div class="container">
        <div class="row">
          <div class="col">
            <TitleBar count={this.state.badgeCount} />
          </div>
        </div>
        <div class="row">
          <div class="col" />
          <div class="col">
            <Autocomplete
              suggestions={this.state.categoryList}
              onChange={this.changeHandler}
              clear={this.clear}
              flag={this.state.isClear}
            />
            <button className="clear" onClick={this.clear}>
              Clear
            </button>
          </div>
          <div class="col" />
        </div>
        <div class="row">
          {this.state.cards.map(data => (
            <div class="col">
              <CardsList data={data} handler={this.updatebadge} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  //Loading the Products on reder
  componentDidMount() {
    //Calling Rest API Hosted in the Same APP
    fetch("http://localhost:3000/products/getProductList")
      .then(response => response.json())
      .then(prodArray => {
        let nameArray = [];
        for (let resjson of prodArray) {
          nameArray.push(resjson.name);
        }
        this.setState({
          masterProdArray: prodArray,
          masterNameArray: nameArray,
          categoryList: nameArray,
          cards: prodArray
        });
      });
  }
}

export default App;
