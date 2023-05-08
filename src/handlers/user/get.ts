import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda"
import { getUser } from "../../data/user"

export const main: APIGatewayProxyHandler = async (event: any) => {
    console.log("events:: ", event)

    const { username } = event.pathParameters
    console.log("username: ", username)
    const user = await getUser(username)
    console.log("user response:: ", user)

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            user
        })
    }

    return response
}
