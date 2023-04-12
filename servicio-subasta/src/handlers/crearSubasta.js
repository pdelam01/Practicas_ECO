import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';

//Instanciamos el cliente de DynamoDB
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function crearSubasta(event, context) {
  //Recogemos lo ue se nos envía en el cuerpo de la petición POST
  const {title} = JSON.parse(event.body);

  //Creamos una variable con la fecha actual
  const now = new Date();

  //Creamos un objeto con los datos de la subasta
  const subasta = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
  };

  //Insertamos el objeto en la tabla de DynamoDB
  await dynamodb.put({
    TableName: process.env.NOMBRE_TABLA_SUBASTAS,
    Item: subasta,
  }).promise();

  //Devolvemos el objeto subasta
  return {
    statusCode: 201,
    body: JSON.stringify({subasta}),
  };
}

export const handler = crearSubasta;