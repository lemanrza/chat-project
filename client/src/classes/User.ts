type ProfileData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  location: string;
};

class User {
  username: string;
  email: string;
  password: string;
  profile: ProfileData;
  hobbies: string[];

  constructor(
    profile: ProfileData,
    username: string,
    email: string,
    password: string,
    hobbies: string[] = []
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.profile = profile;
    this.hobbies = hobbies;
  }
}

export default User;
