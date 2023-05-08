import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda"
import { User, createUser, getUser } from "../../data/user"

export const main: APIGatewayProxyHandler = async (event: any) => {
    console.log("events:: ", event)

    const { username, name } = JSON.parse(event.body)
    const user = new User(username, name)
    await createUser(user)

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            user
        })
    }

    return response
}
