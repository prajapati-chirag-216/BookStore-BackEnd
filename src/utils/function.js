function setAccessTokenCookie(res, accessToken) {
  const accessTokenCookieOptions = {
    expires: new Date(Date.now() + 1000 * 60 * 5),
    httpOnly: true,
    sameSite: "None",
    secure: true,
  };
  res.cookie("accessToken", accessToken, accessTokenCookieOptions);
}

function setRefreshTokenCookie(res, refreshToken) {
  const refreshTokenCookieOptions = {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    httpOnly: true,
    sameSite: "None",
    secure: true,
  };
  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
}
module.exports = {
  setAccessTokenCookie,
  setRefreshTokenCookie,
};
