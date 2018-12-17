var Medium = require("../../db/model/medium");
var _ = require("lodash");
var jwt = require("jsonwebtoken");
var helper = require("./helper/medium_helper");
var middleware = require("../middleware/user_middleware");

get = function(req, res) {
  const params = _.pick(req.query, [
    "url",
    "type",
    "_creator",
    "_section",
    "attributes"
  ]);
  Medium.find(params)
    .populate("_creator", "-password")
    .populate("_section")
    .then(media => {
      let sortedMedia = _.orderBy(media, ["created_at","pinned"], ["desc"]);
      res.status(200).send({
        status: true,
        message: "Media Retreived succesfully",
        data: {
          media: sortedMedia
        }
      });
    });
};

//object ,type,model,uid
post = function(req, res, next) {
  middleware.anyMemberForMedia(req, res, next).then(function(user) {
    req.body.user = user;

    console.log(req.body.user);

    let template = null;

    if (req.file != null && req.file.destination != null) {
      template = `${req.file.destination}${req.file.filename}`;
    }

    let mediumParams = _.pick(req.body, ["type", "_section"]);
    const mediumAttributes = _.pick(req.body, [
      "title",
      "description",
      "width",
      "height"
    ]);

    mediumParams.attributes = mediumAttributes;

    mediumParams.url = template;
    mediumParams._creator = req.body.user._id;
    let statusCode = 1001;

    console.log(user.type);
    if (user.type == "Moderator" || user.type == "Admin") {
      statusCode = 1004;
      mediumParams.status = statusCode;
    } else {
      mediumParams.status = statusCode;
    }

    new Medium(mediumParams)
      .save()
      .then(medium => {
        console.log(medium);
        helper
          .afterPost(medium, mediumParams, "Medium", medium._creator)
          .then(status => {
            if (status) {
              res.status(201).send({
                status: true,
                message:
                  "Media has been uploaded and waiting for approved , and all admins and moderators are reported",
                data: {
                  medium: medium
                }
              });
            } else {
              res
                .send(400)
                .send({ status: false, message: "Something happened" });
            }
          });
      })
      .catch(err => {
        res.status(406).send(err);
      });
  });
};

update = function(req, res, next) {
  middleware.adminOrModeratorForMedia(req, res, next).then(function(user) {
    req.body.user = user;

    let template = null;

    const medium_id = _.pick(req.body, ["_id"]);
    const updatedData = _.pick(req.body, ["status", "note"]);

    console.log(typeof updatedData.status);

    Medium.findById(medium_id).then(medium => {
      if (updatedData.status == 1002 || updatedData.status == 1003) {
        if (updatedData.status == 1002) updatedData.status = 1004;
        console.log("Medium Creator:" + medium);

        Medium.findOneAndUpdate(medium_id, { $set: updatedData }, { new: true })
          .then(medium => {
            if (updatedData.status == 1004) updatedData.status = 1002;

            console.log(updatedData.status);

            helper
              .afterPost(medium, updatedData, "Medium", user._id)
              .then(updateStatus => {
                if (updateStatus) {
                  if (updatedData.status == 1002) updatedData.status = 1004;

                  if (medium.status == 1004) {
                    helper
                      .afterPost(medium, updatedData, "Medium", medium._creator)
                      .then(updateStatus2 => {
                        if (updateStatus2 == true) {
                          res.status(201).send(medium);
                        } else {
                          res.send(400).send({
                            status: false,
                            message: "Something happened After Publish Image"
                          });
                        }
                      });
                  } else {
                    res.status(201).send(medium);
                  }
                } else {
                  res
                    .send(400)
                    .send({ status: false, message: "Something happened" });
                }
              });
          })
          .catch(err => {
            console.log("Catch Error:" + err);
            res.status(400).send({ type: updatedData.status, message: err });
          });
      } else {
        res.status(400).send({ message: "Shit happens" });
      }
    });
  });
};

pinned = function(req, res, next) {
  middleware.adminOrModeratorForMedia(req, res, next).then(function(user) {
    req.body.user = user;

    const medium_id = _.pick(req.body, ["_id"]);
    // const updatedData = _.pick(req.body, ["pinned"]);

//    console.log(typeof updatedData.status);

    Medium.findById(medium_id).then(medium => {
      Medium.findOneAndUpdate(
        medium_id,
        { $set: { pinned: !medium.pinned } },
        { new: true }
      )
        .then(medium => { res.send(medium)})
        .catch(error => {
          res.status(500).send({ error: "Error" });
        });
    });
  });
};

module.exports.get = get;
module.exports.post = post;
module.exports.update = update;
module.exports.helper = helper;
module.exports.pinned = pinned;
