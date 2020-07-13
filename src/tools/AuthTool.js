module.exports = {
  getUser(userininterest) {
    return {
      username: userininterest.username,
      email: userininterest.email,
      name: userininterest.name,
    };
  },
};
