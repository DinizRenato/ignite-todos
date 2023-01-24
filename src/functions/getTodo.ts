import { APIGatewayProxyHandler } from 'aws-lambda';
import { document } from '../utils/dynamodbClient';

export const handler: APIGatewayProxyHandler = async (event) => {

    const { id } = event.pathParameters;

    const response = await document.query({
        TableName: 'todos',
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": id
        }
    }).promise();

    const todo = response.Items[0];

    if (todo) {
        return {
            statusCode: 200,
            body: JSON.stringify(todo)
        }
    }

    return {
        statusCode: 404,
        body: JSON.stringify({
            message: "Todo not found"
        })
    };

};
