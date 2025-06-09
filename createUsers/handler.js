const aws = require("aws-sdk")
const { randomUUID } = require("crypto")

let dynamoDBClientParams = {}

if (process.env.IS_OFFLINE) {
    dynamoDBClientParams =  {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        accessKeyId: 'DEFAULTACCESSKEY',  // needed if you don't have aws credentials at all in env
        secretAccessKey: 'DEFAULTSECRET' // needed if you don't have aws credentials at all in env
    }
}

const dynamodb = new aws.DynamoDB.DocumentClient(dynamoDBClientParams)

const createUsers = async (event, context) => {
    try {
        const id = randomUUID();
        const userBody = JSON.parse(event.body);
        userBody.pk = id;

        const params = {
            TableName: "usersTable",
            Item: userBody
        };

        console.log("Item to put:", params.Item);

        await dynamodb.put(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ user: params.Item })
        };
    } catch (err) {
        console.error("DynamoDB put error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error", error: err.message })
        };
    }
};

module.exports = {
    createUsers
}