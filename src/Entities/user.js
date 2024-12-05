export class User {
    constructor(
        id = null,
        username,
        password = null,
        fullname = '',
        email = '',
        profilePicture = null,
        dateJoined = new Date().toISOString(),
        lastLogin = new Date().toISOString(),
        tasks = []
    ) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.fullname = fullname;
        this.email = email;
        this.profilePicture = profilePicture;
        this.dateJoined = dateJoined;
        this.lastLogin = lastLogin;
        this.tasks = tasks;
    }

    static fromJson(json) {
        return new User(
            json.userId,
            json.username,
            null, // We don't store password in frontend
            json.fullname,
            json.email,
            json.profilePicture,
            json.dateJoined,
            json.lastLogin,
            json.tasks?.map(task => Todo.fromJson(task)) || []
        );
    }

    toJson() {
        return {
            userId: this.id,
            username: this.username,
            fullname: this.fullname,
            email: this.email,
            profilePicture: this.profilePicture,
            dateJoined: this.dateJoined,
            lastLogin: this.lastLogin,
            tasks: this.tasks.map(task => task.toJson())
        };
    }
}
