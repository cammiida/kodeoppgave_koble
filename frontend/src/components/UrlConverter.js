import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";

class UrlConverter extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();

    this.state = { shortUrl: "", longUrl: "" };
  }

  generateShortUrl() {
    const body = { longUrl: this.input.current.value };
    fetch("/api/v1/url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(res => {
        console.log(res);
        this.setState({ shortUrl: res.shortUrl, longUrl: res.longUrl });
      });
  }

  getLongUrl() {
    const url = `/api/v1/url?shortUrl=${this.input.current.value}`;
    console.log(url);
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(res => {
        console.log(res);
        this.setState({ shortUrl: res.shortUrl, longUrl: res.longUrl });
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.props.longUrl) {
      return this.generateShortUrl();
    } else if (this.props.shortUrl) {
      return this.getLongUrl();
    }
  }

  render() {
    return (
      <React.Fragment>
        <Typography component="div">
          <FormControl>
            <InputLabel htmlFor="my-input">
              {this.props.longUrl ? "Input long url" : "Input short url"}
            </InputLabel>
            <Input
              id="my-input"
              aria-describedby="my-helper-text"
              inputRef={this.input}
            />
            <Button onClick={this.handleSubmit}>Submit</Button>
          </FormControl>

          <p>Short Url: {this.state.shortUrl}</p>
          <p>Long Url: {this.state.longUrl}</p>
        </Typography>
      </React.Fragment>
    );
  }
}

export default UrlConverter;
