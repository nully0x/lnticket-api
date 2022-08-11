const jwt_secret:string = process.env.jwt_secret;
const lnurl_host:string = process.env.lnurl_host;

const CONST = {
  jwt_secret,
  lnurl_host,
};

module.exports = CONST;
