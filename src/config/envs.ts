import "dotenv/config"
import * as joi from "joi"

interface EnvVars { 
    PORT: number
    DATABASE_URL: string,
    PAGE: number, 
    LIMIT: number,
    NATS_SERVERS: string[],
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(), 
    PAGE: joi.number().required(),
    LIMIT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
})
.unknown(true)

const { error, value } = envsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
})

if ( error ) { 
    throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    databaseUrl: envVars.DATABASE_URL,
    page: envVars.PAGE,
    limit: envVars.LIMIT,
    natsServers: envVars.NATS_SERVERS
}