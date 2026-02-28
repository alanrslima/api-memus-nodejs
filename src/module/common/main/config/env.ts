import * as dotenv from "dotenv";
dotenv.config();

type EnvConfig = {
  description: string;
  required?: boolean;
  defaultValue?: string;
};

const envVariables: Record<string, EnvConfig> = {
  NODE_ENV: {
    description:
      "Ambiente da aplicação. Valores suportados = development | staging | production",
    required: true,
  },
  PORT: {
    description: "Porta que a api irá utilizar",
    required: false,
    defaultValue: "3000",
  },
  MYSQL_HOST: {
    description: "Host do banco de dados Mysql",
    required: true,
  },
  MYSQL_USER: {
    description: "Usuário do banco de dados Mysql",
    required: true,
  },
  MYSQL_PASSWORD: {
    description: "Senha do banco de dados Mysql",
    required: true,
  },
  MYSQL_DATABASE: {
    description: "Nome do database do banco de dados Mysql",
    required: true,
  },
  MYSQL_PORT: {
    description: "Porta do banco de dados Mysql",
    required: false,
    defaultValue: "3306",
  },
  JWT_SECRET: {
    description: "Chave privada para os tokens JWT",
    required: true,
  },
  R2_STORAGE_ACCESS_KEY_ID: {
    description: "ID Chave de acesso para storage Cloudfare R2",
    required: true,
  },
  R2_STORAGE_SECRET_ACCESS_KEY: {
    description: "Chave secreta de acesso para storage Cloudfare R2",
    required: true,
  },
  STRIPE_SECRET_KEY: {
    description: "Chave secreta Stripe",
    required: true,
  },
  READ_MEDIA_EXPIRES_IN: {
    description:
      "Tempo em segundos para expiração de leitura de uma midia privada",
    required: false,
    defaultValue: "3600",
  },
  STRIPE_ENDPOINT_SECRET: {
    description: "Secret para endpoint webhook Stripe",
    required: true,
  },
  GOOGLE_CLIENT_ID: {
    description: "ID de cliente do Google Auth",
    required: true,
  },
  GOOGLE_CLIENT_SECRET: {
    description: "Secret ID do Google Auth",
    required: true,
  },
  OPEN_ID_WEB_REDIRECT_URI: {
    description: "Uri de redirecionamento open id web",
    required: true,
  },
  SENTRY_DSN: {
    description: "DSN de conexão com Sentry",
  },
};

const envsMapper: { [key in keyof typeof envVariables]: string } = {} as {
  [key in keyof typeof envVariables]: string;
};

Object.keys(envVariables).forEach((key) => {
  const config = envVariables[key];
  const value = process.env[key];

  if (!value?.length) {
    if (config.required) {
      throw new Error(
        `Expected env variable "${key}" not found. Description: ${config.description}`,
      );
    }
    if (config.defaultValue !== undefined) {
      envsMapper[key as keyof typeof envVariables] = config.defaultValue;
    }
    return;
  }
  envsMapper[key as keyof typeof envVariables] = value;
});

export const env = Object.freeze(envsMapper);
