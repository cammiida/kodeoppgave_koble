/* eslint-disable class-methods-use-this */
import db from "../db/db";

class UrlsController {
  getLongUrl(req, res) {
    if (!req.query.shortUrl) {
      return res.status(400).send({
        success: "false",
        message: "shortUrl is required"
      });
    }

    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(
      ""
    );
    const base = alphabet.length;

    const shortUrl = req.query.shortUrl;
    let shortCode = shortUrl.split("/");

    shortCode = shortCode[shortCode.length - 1].trim();

    let digits = [];
    for (let c in shortCode) {
      digits.push(alphabet.indexOf(shortCode[c]));
    }

    let power = 0;
    let id = 0;
    digits.forEach(value => {
      id += value * Math.pow(base, power);
      power++;
    });

    db.map(url => {
      if (url.id === id) {
        return res.status(200).send({
          success: "true",
          message: "longUrl found from shortUrl",
          shortUrl: shortUrl,
          longUrl: url.longUrl
        });
      }
    });

    return res.status(404).send({
      success: "false",
      message: "longUrl not found"
    });
  }

  generateShortUrl(req, res) {
    if (!req.body.longUrl) {
      return res.status(400).send({
        success: "false",
        message: "longUrl is required"
      });
    }

    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(
      ""
    );
    const base = alphabet.length;
    const longUrl = req.body.longUrl;

    let id;
    db.map(url => {
      if (url.longUrl === longUrl) {
        id = url.id;
      }
    });

    let tempId = id;
    if (!tempId) {
      tempId = db.length + 1;
      //tempId = 12873251;
    }

    let num = tempId;
    let s = "";
    while (num > 0) {
      s += alphabet[num % base];
      num = Math.floor(num / base);
    }

    s = s.split("").join("");

    const shortUrl = "http://koble.jobs/" + s;

    if (!id) {
      const url = {
        id: tempId,
        longUrl
      };

      db.push(url);

      res.status(201).send({
        success: "true",
        message: "Created entry for longUrl and made shortUrl",
        shortUrl,
        longUrl
      });
    }

    res.status(201).send({
      success: "true",
      message: "Found entry for longUrl and made shortUrl",
      shortUrl,
      longUrl
    });
  }

  getAllUrls(req, res) {
    return res.status(200).send({
      success: "true",
      message: "urls derived successfully",
      urls: db
    });
  }
}

const urlController = new UrlsController();
export default urlController;
