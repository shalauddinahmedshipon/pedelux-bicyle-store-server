import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join((process.cwd(), '.env')),
});

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  node_env: process.env.NODE_ENV,
  bcrypt_solt: process.env.BCRYPT_SOLT,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  access_token_expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  client_side_base_url: process.env.CLIENT_SIDE_BASE_URL,
  sp: {
    sp_endpoint: process.env.SP_ENDPOINT,
    sp_username: process.env.SP_USERNAME,
    sp_password: process.env.SP_PASSWORD,
    sp_prefix: process.env.SP_PREFIX,
    sp_return_url: process.env.SP_RETURN_URL,
  },
};
