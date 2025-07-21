type ProfileData = {
  firstName: string;
  lastName: string;
};

class User {
  username: string;
  email: string;
  password: string;
  profile: ProfileData;

  constructor(
    profile: ProfileData,
    username: string,
    email: string,
    password: string
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.profile = profile;
  }
}

export default User;
