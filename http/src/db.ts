import neo4j, { driver, Driver } from "neo4j-driver";

const uri = process.env.NEO4J_URI as string;
const username = process.env.NEO4J_USERNAME as string;
const password = process.env.NEO4J_PASSWORD as string;

class Graphdb {
  static driver: Driver | null = null;
  static session = null;

  static getDriver() {
    if (!this.driver) {
      this.driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
    }
    return this.driver;
  }

  static async getSession() {
    if (!this.session) {
      try {
        //@ts-ignore
        this.session = await this.getDriver().session();
      } catch (e) {
        console.log(e);
      }
    }
    return this.session;
  }

  static async creatUser(username: string, id: string) {
    try {
      const driver = Graphdb.getDriver();
      const g = await driver.executeQuery(`CREATE (u: User { mongoId: $id, username: $username })`, { id, username });
      return g;
    } catch (err) {
      console.log(err)
    }
  }
}

export default Graphdb;
