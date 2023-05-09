import { ulid } from "ulid"
import { Item } from "./base"
import { DynamoDB } from "aws-sdk"
import { Photo } from "./photo"
import { getClient } from "./client"
import { executeTransactWrite } from "./utils"

export class Comment extends Item {
    commentingUsername: string
    photoId: string
    commentId: string
    content: string

    constructor(commentingUsername: string, photoId: string, content: string, commentId: string = ulid()) {
        super()
        this.commentingUsername = commentingUsername
        this.photoId = photoId
        this.commentId = commentId
        this.content = content
    }

    static fromItem(item?: DynamoDB.AttributeMap): Comment {
        if (!item) throw new Error("No Comments!")
        return new Comment(
            item.commentingUsername.S || "",
            item.photoId.S || "",
            item.content.S || "",
            item.commentId.S
        )
    }

    get pk(): string {
        return `PC#${this.photoId}`
    }

    get sk(): string {
        return `COMMENT#${this.commentId}`
    }

    toItem(): Record<string, any> {
        return {
            ...this.keys(),
            commentingUsername: { S: this.commentingUsername },
            photoId: { S: this.photoId },
            content: { S: this.content },
            commentId: { S: this.commentId }
        }
    }
}

export const commentOnPhoto = async (photo: Photo, commentingUsername: string, content: string): Promise<Comment> => {
    const client = getClient()
    const comment = new Comment(commentingUsername, photo.photoId, content)

    try {
        await executeTransactWrite({
            client,
            params: {
                TransactItems: [
                    {
                        Put: {
                            TableName: process.env.TABLE_NAME || "",
                            Item: comment.toItem(),
                            ConditionExpression: "attribute_not_exists(PK)"
                        }
                    },
                    {
                        Update: {
                            TableName: process.env.TABLE_NAME || "",
                            Key: photo.keys(),
                            ConditionExpression: "attribute_exists(PK)",
                            UpdateExpression: "SET #commentCount = #commentCount+ :inc",
                            ExpressionAttributeNames: {
                                "#commentCount": "commentCount"
                            },
                            ExpressionAttributeValues: {
                                ":inc": { N: "1" }
                            }
                        }
                    }
                ]
            }
        })
        return comment
    } catch (error) {
        console.log("Error on photo comment:: ", error)
        throw error
    }
}

export const listCommentsForPhoto = async (photoId: string): Promise<Comment[]> => {
    const client = getClient()
    const comment = new Comment("", photoId, "")

    try {
        const response = await client
            .query({
                TableName: process.env.TABLE_NAME || "",
                KeyConditionExpression: "PK = :pk",
                ExpressionAttributeValues: {
                    ":pk": { S: comment.pk }
                },
                ScanIndexForward: false
            })
            .promise()

        return response.Items?.map((item) => Comment.fromItem(item)) || []
    } catch (error) {
        console.log("Comment list error:: ", error)
        throw error
    }
}
