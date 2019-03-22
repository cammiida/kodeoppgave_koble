/* eslint-disable class-methods-use-this */
import db from "../db/db";

class UrlsController {
  getAllUrls(req, res) {
    return res.status(200).send({
      success: "true",
      message: "urls derived successfully",
      urls: db
    });
  }

  getUrl(req, res) {
    const id = parseInt(req.params.id, 10);

    db.map(url => {
      if (url.id === id) {
        return res.status(200).send({
          success: "true",
          message: "url derived successfully",
          url
        });
      }
    });

    return res.satus(404).send({
      success: "false",
      message: "url does not exist"
    });
  }

  createUrl(req, res) {
    if (!req.body.longUrl) {
      return res.status(400).send({
        success: "false",
        message: "longUrl is required"
      });
    }

    console.log("req: ", req);

    const url = {
      id: db.length + 1,
      shortUrl: req.body.shortUrl,
      longUrl: req.body.longUrl
    };

    db.push(url);
    return res.status(201).send({
      success: "true",
      message: "url successfully created"
    });
  }

  updateUrl(req, res) {
    const id = parseInt(req.params.id, 10);
    let urlFound;
    let itemIndex;
    db.map((url, index) => {
      if (url.id === id) {
        urlFound = url;
        itemIndex = index;
      }
    });

    if (!urlFound) {
      return res.status(404).send({
        success: "false",
        message: "url not found"
      });
    }

    if (!req.body.longUrl && !req.body.shortUrl) {
      return res.status(400).send({
        success: "false",
        message: "longUrl or shortUrl is required"
      });
    }

    const newUrl = {
      id: urlFound.id,
      shortUrl: req.body.shortUrl || urlFound.shortUrl,
      longUrl: req.body.longUrl || urlFound.longUrl
    };

    db.splice(itemIndex, 1, newUrl);

    return res.status(201).send({
      success: "true",
      message: "url updated successfully",
      newUrl
    });
  }

  deleteUrl(req, res) {
    const id = parseInt(req.params.id, 10);
    let urlFound;
    let itemIndex;
    db.map((url, index) => {
      if (url.id === id) {
        urlFound = url;
        itemIndex = index;
      }
    });

    if (!urlFound) {
      return res.status(404).send({
        success: "false",
        message: "url not found"
      });
    }
    db.splice(itemIndex, 1);

    return res.status(200).send({
      success: "true",
      message: "url deleted successfully"
    });
  }
}

const urlController = new UrlsController();
export default urlController;
