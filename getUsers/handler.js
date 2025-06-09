const aws = require("aws-sdk")

let dynamoDBClientParams = {}

if (process.env.IS_OFFLINE) {
    dynamoDBClientParams =  {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        accessKeyId: 'DEFAULTACCESSKEY',  // needed if you don't have aws credentials at all in env
        secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
    }
}

const dynamodb = new aws.DynamoDB.DocumentClient(dynamoDBClientParams)

const getUsers = async (event, context) => {
    const userId = event.pathParameters.id;

    const params = {
        TableName: 'usersTable',
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
            ':pk': userId
        }
    };

    try {
        const res = await dynamodb.query(params).promise();

        if (!res.Items || res.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found' })
            };
        }

        const user = res.Items[0];

        return {
            statusCode: 200,
            body: JSON.stringify({
                userId: user.pk,
                nombre: user.name
            })
        };
    } catch (err) {
        console.error('DynamoDB query error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};

module.exports = {
    getUsers
}