import neo4j, { Driver } from "neo4j-driver";
import { Connection } from "./models/connection";

const uri = "neo4j+s://d345d9d6.databases.neo4j.io"
const username = "neo4j"
const password = "v8GWo1rbQpBvvFy-yCsV5C4NkIN34rEpaST3Lvb27gI"

class Graphdb {
  static driver: Driver | null = null;
  static session = null;

  static getDriver() {
    if (!this.driver) {
      console.log(username, password, uri)
      this.driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
    }
    return this.driver;
  }

  static async creatUser(username: string, id: string, doby: number, gender: string, college: string, company: string, imageUrl: string) {
    const driver = Graphdb.getDriver();
    const g = await driver.executeQuery(`CREATE (u: User { mongoId: $id, username: $username, doby: $doby, gender: $gender, college: $college, company: $company, imageUrl: $imageUrl })`, { id, username, doby, gender, college, company, imageUrl });
    return g;
  }

  static async usersWithNoCurrentUser(id: string) {
    const driver = Graphdb.getDriver();
    const result = await driver.executeQuery(`MATCH (cu: User { mongoId: $id }) MATCH (ou: User) WHERE NOT (cu)-[:LIKE|:DISLIKE] -> (ou) AND cu <> ou RETURN ou`, { id });
    const users = result.records.map((record) => record.get("ou").properties);
    return users;
  }

  static async userWithNoCurrentUser(id: string) {
    const driver = Graphdb.getDriver();
    const result = await driver.executeQuery(`MATCH (cu: User { mongoId: $id }) MATCH (ou: User) WHERE NOT (cu)-[:LIKE|:DISLIKE] -> (ou) AND cu <> ou RETURN ou LIMIT 1`, { id });
    const user = result.records.map((record) => record.get("ou").properties);
    return user;
  }

  static async likeUser(id: string, userId: string) {
    const driver = Graphdb.getDriver();
    const result = await driver.executeQuery(`MATCH (cu: User { mongoId: $id }) MATCH (ou: User { mongoId: $userId }) CREATE (cu)-[:LIKE]->(ou)`, { id, userId });
    // add a connection in relational db
    const connection = new Connection({
      from: id,
      to: userId,
      status: "pending"
    });
    connection.save();
    return result;
  }

  static async dislikeUser(id: string, userId: string) {
    const driver = Graphdb.getDriver();
    const result = await driver.executeQuery(`MATCH (cu: User { mongoId: $id }) MATCH (ou: User { mongoId: $userId }) CREATE (cu)-[:DISLIKE]->(ou)`, { id, userId });
    return result;
  }
}

export default Graphdb;
