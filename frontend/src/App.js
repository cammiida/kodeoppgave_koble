import React, { Component } from "react";

//import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import NoSsr from "@material-ui/core/NoSsr";
import Tab from "@material-ui/core/Tab";

import UrlConverter from "./components/UrlConverter";

function LinkTab(props) {
  return (
    <Tab component="a" onClick={event => event.preventDefault()} {...props} />
  );
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

class App extends Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;

    return (
      <NoSsr>
        <div className="App" style={{ textAlign: "center" }}>
          <AppBar position="static" color="default">
            <Tabs
              variant="fullWidth"
              value={value}
              onChange={this.handleChange}
              indicatorColor="primary"
            >
              <LinkTab label="Generate Short Url" href="page1" />
              <LinkTab label="Get Long Url" href="page2" />
            </Tabs>
          </AppBar>
          {value === 0 && <UrlConverter longUrl />}
          {value === 1 && <UrlConverter shortUrl />}
        </div>
      </NoSsr>
    );
  }
}

export default withStyles(styles)(App);
