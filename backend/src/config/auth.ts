export default {
  jwt: {
    admin_secret: process.env.ADMIN_SECRET,
    secret: process.env.APP_SECRET,
    expiresIn: '1d',
  },
};
