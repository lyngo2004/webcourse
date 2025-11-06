class DatabaseService{
    connect(){
        throw new Error("Method 'connect()' must be implemented."); 
    }

    getUserData(userId){
        throw new Error("Method 'getUserData()' must be implemented.");
    }
}

class MySQLDatabaseService extends DatabaseService{
    connect(){
        return "Connected to MySQL Database";
    }

    getUserData(userId){
        console.log (`Fetched user data for user ID: ${userId} from MySQL Database`);
        return { id: userId, name: "Alice (MySQL)" };
    }
}

class SQLServerDatabaseService extends DatabaseService{
    connect(){
        return "Connected to SQL Server Database";
    }

    getUserData(userId){
        console.log (`Fetched user data for user ID: ${userId} from SQL Server Database`);
        return { id: userId, name: "Bob (SQL Server)" };
    }

    closeSQLServerConnection(){
        return "Closed SQL Server Database connection";
    }
}

class PostgreSQLDatabaseService extends DatabaseService{
    connect(){
        return "Connected to PostgreSQL Database";
    }

    getUserData(userId){
        console.log (`Fetched user data for user ID: ${userId} from PostgreSQL Database`);
        return { id: userId, name: "Charlie (PostgreSQL)" };
    }

    rollbackTransaction(){
        return "Rolled back PostgreSQL transaction";
    }
}

class UserManager{
    constructor(databaseService){
        this.databaseService = databaseService;
    }

    connectToDatabase(){
        console.log(this.databaseService.connect());
    }

    fetchUserData(userId){
        return this.databaseService.getUserData(userId);
    }
}

const mySQLDatabaseService = new MySQLDatabaseService();
const userManagerMySQL = new UserManager(mySQLDatabaseService);
userManagerMySQL.connectToDatabase();
userManagerMySQL.fetchUserData(1);

const sqlServerDatabaseService = new SQLServerDatabaseService();
const userManagerSQLServer = new UserManager(sqlServerDatabaseService);
userManagerSQLServer.connectToDatabase();
userManagerSQLServer.fetchUserData(2);
console.log(sqlServerDatabaseService.closeSQLServerConnection());

const postgreSQLDatabaseService = new PostgreSQLDatabaseService();
const userManagerPostgreSQL = new UserManager(postgreSQLDatabaseService);
userManagerPostgreSQL.connectToDatabase();
userManagerPostgreSQL.fetchUserData(3);
console.log(postgreSQLDatabaseService.rollbackTransaction());