import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from '../utils/dynamodbClient';

import { v4 as uuid } from 'uuid';

interface ICreateTodo {
    title: string;
    deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {

    const { id: user_id } = event.pathParameters;

    const { title, deadline } = JSON.parse(event.body) as ICreateTodo;

    let id = uuid();

    await document.put({
        TableName: 'todos',
        Item: {
            id,
            user_id,
            title,
            done: false,
            deadline: new Date(deadline)
        }
    }).promise();

    const response = await document.query({
        TableName: 'todos',
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": id
        }
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify(response.Items[0])
    }
}
