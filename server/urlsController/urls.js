/* eslint-disable class-methods-use-this */
import db from "../db/db";

class UrlsController {
  getLongUrl(req, res) {
    let responseObject;
    if (!req.query.shortUrl) {
      res.statusCode = 400;
      responseObject = {
        success: "false",
        errorMessage: "Short URL is required."
      };
    } else if (!req.query.shortUrl.startsWith("koble.jobs/")) {
      res.statusCode = 400;
      responseObject = {
        success: "false",
        errorMessage: "Short URL needs to start with 'koble.jobs/'."
      };
    } else if (req.query.shortUrl.split("koble.jobs/")[1].length < 1) {
      res.statusCode = 400;
      responseObject = {
        success: "false",
        errorMessage:
          "Short URL needs to start with 'koble.jobs/' and contain URL code."
      };
    }

    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(
      ""
    );
    const base = alphabet.length;

    const shortUrl = req.query.shortUrl;
    const shortCodeArray = shortUrl.split("/");

    // Find shortCode
    let shortCode;
    if (!shortCodeArray[shortCodeArray - 1]) {
      shortCode = shortCodeArray[shortCodeArray.length - 2].trim();
    } else {
      shortCode = shortCodeArray[shortCodeArray.length - 1].trim();
    }

    // Find index of each letter in shortCode
    let digits = [];
    for (let c in shortCode) {
      digits.push(alphabet.indexOf(shortCode[c]));
    }

    // Multiply each index with 62 to the power of their respective
    // place in the digits array and add all to get the original id
    let power = 0;
    let id = 0;
    digits.forEach(value => {
      id += value * Math.pow(base, power);
      power++;
    });

    // Find entry in database with the calculated id
    let found = false;
    db.map(url => {
      if (url.id === id) {
        found = true;
        res.statusCode = 200;
        responseObject = {
          success: "true",
          message: "Long URL found from short URL.",
          shortUrl: shortUrl,
          longUrl: url.longUrl
        };
      }
    });

    // If no entry found in db, return 404 not found
    if (!found) {
      console.log();
      res.statusCode = 404;
      responseObject = {
        success: "false",
        errorMessage: "Long URL not found."
      };
    }

    res.send(responseObject);
  }

  generateShortUrl(req, res) {
    let longUrl = req.body.longUrl;
    let responseObject;
    if (!longUrl) {
      res.statusCode = 400;
      responseObject = {
        success: "false",
        errorMessage: "Long URL is required."
      };
    } else if (!longUrl.startsWith("koble.co/companies/koble/postings/")) {
      res.statusCode = 400;
      responseObject = {
        success: "false",
        errorMessage:
          "Long URL needs to start with 'koble.co/companies/koble/postings/'."
      };
    } else if (
      longUrl.split("koble.co/companies/koble/postings/")[1].length < 1
    ) {
      res.statusCode = 400;
      responseObject = {
        success: "false",
        errorMessage:
          "Long URL needs to start with 'koble.co/companies/koble/postings/' and contain URL code."
      };
    } else {
      if (longUrl[longUrl.length - 1] !== "/") {
        longUrl += "/";
      }
      const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(
        ""
      );
      const base = alphabet.length;

      // Find id in db of long url specified
      let id;
      db.map(url => {
        if (url.longUrl === longUrl) {
          id = url.id;
        }
      });

      // If no entry found, set id to be the next id in the db
      let tempId = id;
      if (!tempId) {
        tempId = db.length + 1;
      }

      // Find the modulo of num with 62, find the corresponding
      // letter in the alphabet, and add it to the code string.
      // Then dividing num with 62.
      // Repeat until num is 0.
      let num = tempId;
      let s = "";
      while (num > 0) {
        s += alphabet[num % base];
        num = Math.floor(num / base);
      }

      // Add code string to first part of url
      const shortUrl = "koble.jobs/" + s;

      // If there was no entry in the database, make new entry object and add to db.
      if (!id) {
        const url = {
          id: tempId,
          longUrl
        };

        db.push(url);
        res.statusCode = 201;
        responseObject = {
          success: "true",
          message: "Created entry for long URL and made short URL.",
          shortUrl,
          longUrl
        };
      } else {
        // If there was an entry in the db for the longUrl, return 200
        res.statusCode = 200;
        responseObject = {
          success: "true",
          message: "Found entry for long URL and made short URL.",
          shortUrl,
          longUrl
        };
      }
    }

    res.send(responseObject);
  }

  // Get all entries in the db
  getAllUrls(req, res) {
    return res.status(200).json({
      success: "true",
      message: "URLs derived successfully.",
      urls: db
    });
  }
}

const urlController = new UrlsController();
export default urlController;
