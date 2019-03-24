import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";

class UrlConverter extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();

    this.state = { shortUrl: "", longUrl: "", errorMessage: "" };
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
      .then(res =>
        this.setState({
          shortUrl: res.shortUrl,
          longUrl: res.longUrl,
          errorMessage: res.errorMessage
        })
      );
  }

  getLongUrl() {
    const url = `/api/v1/url?shortUrl=${this.input.current.value}`;
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(res =>
        this.setState({
          shortUrl: res.shortUrl,
          longUrl: res.longUrl,
          errorMessage: res.errorMessage
        })
      );
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.input.current.value.includes("www.")) {
      const tempValue = this.input.current.value.split("www.")[1];
      this.input.current.value = tempValue;
    } else if (this.input.current.value.includes("://")) {
      const tempValue = this.input.current.value.split("://")[1];
      this.input.current.value = tempValue;
    }
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
          <FormControl
            style={{
              margin: "10vh",
              display: "flex",
              flexWrap: "wrap"
            }}
          >
            <InputLabel htmlFor="my-input">
              {this.props.longUrl ? "Input long url" : "Input short url"}
            </InputLabel>
            <Input
              id="my-input"
              aria-describedby="my-helper-text"
              inputRef={this.input}
              startAdornment={
                <InputAdornment position="start">http://</InputAdornment>
              }
            />
            <FormHelperText style={{ color: "red" }}>
              {this.state.errorMessage}
            </FormHelperText>
          </FormControl>
          <Button
            onClick={this.handleSubmit}
            variant="contained"
            color="primary"
          >
            Convert URL
          </Button>

          <p>
            Short Url:{" "}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href={this.state.shortUrl}
            >
              {this.state.shortUrl}
            </a>
          </p>
          <p>
            Long Url:{" "}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href={this.state.longUrl}
            >
              {this.state.longUrl}
            </a>
          </p>
        </Typography>
      </React.Fragment>
    );
  }
}

export default UrlConverter;
