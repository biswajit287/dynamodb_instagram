import { Item } from "./base"
import { DynamoDB } from "aws-sdk"
import { getClient } from "./client"

export class User extends Item {
    username: string | undefined
    name: string
    followerCount: number
    followingCount: number

    constructor(username: string | undefined, name?: string, followerCount?: number, followingCount?: number) {
        super()
        this.username = username
        this.name = name || ""
        this.followerCount = followerCount || 0
        this.followingCount = followingCount || 0
    }

    static fromItem(item?: DynamoDB.AttributeMap): User {
        if (!item) throw new Error("No User Found!")

        return new User(item.username.S, item.name.S, Number(item.followerCount.N), Number(item.followingCount.N))
    }

    get pk(): string {
        return `USER#${this.username}`
    }

    get sk(): string {
        return `USER#${this.username}`
    }

    toItem(): Record<string, any> {
        return {
            ...this.keys(),
            username: { S: this.username },
            name: { S: this.name },
            followerCount: { N: this.followerCount.toString() },
            followingCount: { N: this.followingCount.toString() }
        }
    }
}

export const createUser = async (user: User): Promise<User> => {
    const client = getClient()
    const tableName = process.env.TABLE_NAME || "photos"
    try {
        await client
            .putItem({
                TableName: tableName,
                Item: user.toItem(),
                ConditionExpression: "attribute_not_exists(PK)"
            })
            .promise()
        return user
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getUser = async (username: string): Promise<User> => {
    const client = getClient()
    const tableName = process.env.TABLE_NAME || "photos"
    const user = new User(username, "")

    try {
        const resp = await client
            .getItem({
                TableName: tableName,
                Key: user.keys()
            })
            .promise()

        return User.fromItem(resp.Item)
    } catch (error) {
        console.log(error)
        throw error
    }
}
