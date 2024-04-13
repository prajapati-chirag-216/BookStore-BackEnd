const jwt = require("jsonwebtoken");
const Admin = require("../model/admin.modal");
const status = require("http-status");
const roles = require("../utils/roles");

const adminAuth = (role) => {
  return async (req, res, next) => {
    const accessToken = req.cookies["adminAccessToken"];
    const refreshToken = req.cookies["adminRefreshToken"];
    let data;
    if (refreshToken) {
      let accessTokenDecoded;
      if (accessToken) {
        accessTokenDecoded = jwt.verify(
          accessToken,
          process.env.ADMIN_ACCESS_TOKEN_SECRET
        );
      }
      const refreshTokenDecoded = jwt.verify(
        refreshToken,
        process.env.ADMIN_REFRESH_TOKEN_SECRET
      );
      if (
        accessTokenDecoded &&
        refreshTokenDecoded &&
        accessTokenDecoded._id === refreshTokenDecoded._id
      ) {
        data = await Admin.findOne({
          _id: accessTokenDecoded._id,
        });
        const isAllowed = roles[data.role.toUpperCase()].find(
          (val) => val === role
        );
        if (!isAllowed) {
          throw {
            status: status.UNAUTHORIZED,
            message: "Unauthorized access",
          };
        }
        req.admin = data;
      } else if (refreshTokenDecoded) {
        throw {
          status: status.FORBIDDEN,
          message: "invalid access",
        };
      }
    } else {
      throw {
        status: status.UNAUTHORIZED,
        message: "You need to login",
      };
    }
    next();
  };
};

const verifyAdmin = async (req, res, next) => {
  const accessToken = req.cookies["adminAccessToken"];
  const refreshToken = req.cookies["adminRefreshToken"];
  let data;
  if (refreshToken) {
    let accessTokenDecoded;
    if (accessToken) {
      accessTokenDecoded = jwt.verify(
        accessToken,
        process.env.ADMIN_ACCESS_TOKEN_SECRET
      );
    }
    const refreshTokenDecoded = jwt.verify(
      refreshToken,
      process.env.ADMIN_REFRESH_TOKEN_SECRET
    );
    if (
      accessTokenDecoded &&
      refreshTokenDecoded &&
      accessTokenDecoded._id === refreshTokenDecoded._id
    ) {
      data = await Admin.findOne({
        _id: accessTokenDecoded._id,
      });
      req.admin = data;
    } else if (refreshTokenDecoded) {
      throw {
        status: status.FORBIDDEN,
        message: "invalid access",
      };
    }
  } else {
    req.admin = data;
  }
  next();
};

const verifyAdminRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies["adminRefreshToken"];
  let data;
  if (refreshToken) {
    const refreshTokenDecoded = jwt.verify(
      refreshToken,
      process.env.ADMIN_REFRESH_TOKEN_SECRET
    );
    if (refreshTokenDecoded) {
      data = await Admin.findOne({
        _id: refreshTokenDecoded._id,
      });
      req.admin = data;
    }
  } else {
    throw {
      status: status.FORBIDDEN,
      message: "Unauthorized access",
    };
  }
  next();
};

module.exports = { adminAuth, verifyAdmin, verifyAdminRefreshToken };
