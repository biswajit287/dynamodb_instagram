import { APIGatewayProxyHandler } from "aws-lambda"
import { Photo } from "../../data/photo"
import { commentOnPhoto } from "../../data/comment"

export const main: APIGatewayProxyHandler = async (event: any) => {
    const { username, photoId } = event.pathParameters;
    const photo = new Photo(username, "", photoId);
    console.log('event:: ', event.body);
    
    const { commentingUsername, content } = JSON.parse(event.body);
    const comment = await commentOnPhoto(photo, commentingUsername, content);

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            comment
        })
    }

    return response
}
