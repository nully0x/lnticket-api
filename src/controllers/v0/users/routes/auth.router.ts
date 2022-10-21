const { prisma } = require("../../../../../prisma");
const LnurlAuthService = require("../../../../utils/lnauthservice");
const {
  createHash,
  associateTokenToHash,
} = require("../../../../utils/lnauthservice");
import { Router, Request, Response } from "express";
const jose = require("jose");
const { jwt_secret } = require("../../../../utils/const");

const router = Router();

router.get(
  "/get-login-url",
  async (req: Request, res: Response): Promise<unknown> => {
    try {
      const data = await LnurlAuthService.generateAuthUrl();

      const session_token: Buffer = await new jose.SignJWT({
        hash: data.secretHash,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5min")
        .sign(Buffer.from(jwt_secret, "utf-8"));
      return res.status(200).json({ ...data, session_token });
    } catch (error) {
      throw new Error(error);
    }
  }
);

router.get("/login", async (req: Request, res: Response) => {
  const { tag, k1, sig, key } = req.query;

  if (tag !== "login")
    return res
      .status(400)
      .json({ status: "ERROR", reason: "Invalid Tag Provided" });
  // Verify login params
  try {
    await LnurlAuthService.verifySig(sig, k1, key);
  } catch (error) {
    return res
      .status(400)
      .json({ status: "ERROR", reason: "Invalid Signature" });
  }

  try {
    //Create user if not already existing
    const user = await prisma.user.findFirst({ where: { pubKey: key } });
    if (user === null) {
      await prisma.user.create({
        data: {
          pubKey: key,
          name: key,
          avatar: `https://avatars.dicebear.com/api/bottts/${key}.svg`,
        },
      });
    }

    // calc the hash of k1
    const hash = createHash(k1);

    // generate the auth jwt token
    const hour = 3600000;
    const maxAge = 30 * 24 * hour;

    const authToken = await new jose.SignJWT({ pubKey: key })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(maxAge)
      //TODO: Set audience, issuer
      .sign(Buffer.from(jwt_secret, "utf-8"));

    // associate the auth token with the hash in the db
    await associateTokenToHash(hash, authToken);

    return res.status(200).json({ status: "OK" });
  } catch (error) {
    return res
      .status(400)
      .json({
        status: "ERROR",
        reason: "Unexpected error happened, please try again",
      });
  }
});

export const AuthRouter: Router = router;
