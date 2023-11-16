const createTimestamp = (date: Date) => Math.floor(date.getTime() / 1000);

const encodeStringWithoutPadding = (stringToEncode: string) => {
  // const encodedString = window.btoa(stringToEncode);
  const encodedString = Buffer.from(stringToEncode, "utf8").toString("base64");

  // const encodedStringWithPaddingRemoved = encodedString.replaceAll("=", ""); // Remove base64 encoding padding.
  const encodedStringWithPaddingRemoved = encodedString.split("=").join(""); // Remove base64 encoding padding.

  return encodedStringWithPaddingRemoved;
};

const username = process.env.PLAYWRIGHT_USERNAME;

export const createToken = ({
  authTime,
  iotTopic
}: {
  authTime: Date;
  iotTopic: string;
}) => {
  const stringifiedHeader = JSON.stringify({
    alg: "HS256",
    typ: "JWT"
  });

  const validitySeconds = 60 * 60;

  const stringifiedPayload = JSON.stringify({
    auth_time: createTimestamp(authTime),
    exp: createTimestamp(authTime) + validitySeconds,
    "cognito:username": username,
    "chorus:IotTopic": iotTopic
  });

  const signature = "__SIGNATURE__"; // The authenticity of the token isn't important as we're mocking Cognito.

  const token = `${encodeStringWithoutPadding(
    stringifiedHeader
  )}.${encodeStringWithoutPadding(
    stringifiedPayload
  )}.${encodeStringWithoutPadding(signature)}`;

  return token;
};
