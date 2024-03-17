const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const status = require("http-status");

const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: [true, "enter valide email please .."],
      required: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw { message: "enter valide email .. " };
          // throw new Error("enter valide email .. ");
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 6,
      required: true,
      validate(value) {
        if (value.length < 6) {
          throw { message: "enter valide password .. " };
          // throw new Error("enter valide password .. ");
        }
      },
    },
    role: {
      type: String,
      default: "EMPLOYEE",
      required: true,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

adminSchema.methods.toJSON = function () {
  const admin = this.toObject(); // this will return a clone object so we can delete from that

  delete admin.password;

  return admin;
};

adminSchema.methods.createResetToken = function () {
  const resettoken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 5 * 60 * 1000; // expires in 5 min
  return resettoken;
};
adminSchema.methods.getAuthToken = function () {
  const admin = this;
  const accessToken = jwt.sign(
    { _id: admin._id.toString() },
    process.env.ADMIN_ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5m", // in case it takes some seconds delay
    }
  );
  const refreshToken = jwt.sign(
    { _id: admin._id.toString() },
    process.env.ADMIN_REFRESH_TOKEN_SECRET,
    {
      expiresIn: "2d", // in case it takes some seconds delay
    }
  );
  return { accessToken, refreshToken };
};
adminSchema.methods.getAccessToken = function () {
  const admin = this;
  const accessToken = jwt.sign(
    { _id: admin._id },
    process.env.ADMIN_ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5m", // in case it first expires
    }
  );
  return accessToken;
};

adminSchema.statics.findbyCredentials = async function (email, password) {
  const admin = await Admin.findOne({ email });
  if (admin == null) {
    throw {
      status: status.UNAUTHORIZED,
      message: "Invalide login details",
    };
  }
  const compare = await bcrypt.compare(password, admin.password);
  if (!compare) {
    throw {
      status: status.UNAUTHORIZED,
      message: "Invalide password",
    };
  }
  return admin;
};

adminSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }
  next();
});
const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
