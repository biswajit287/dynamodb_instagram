import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda"
import { User, createUser, getUser } from "../../data/user"

export const main: APIGatewayProxyHandler = async (event: any) => {
    const { username, name } = event.pathParameters
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
