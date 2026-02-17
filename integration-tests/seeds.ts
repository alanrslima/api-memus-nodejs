// import {MysqlDatabase} from '../src/modules/nvg-node-common';
// import {availablePermissions} from '../src/modules/nvg-node-auth';
// import {randomUUID} from 'node:crypto';

import { MysqlDataSource } from "../src/module/common";
import { Plan } from "../src/module/memory/domain/entity/plan";
import { requester } from "./helpers-integration";

async function createAdminRole(): Promise<{ id: string }> {
  // const id = randomUUID();
  // const allPermissions = Object.keys(availablePermissions).map((key) => key);
  // await MysqlDatabase.getInstance().query(
  //   `INSERT INTO cas_grupospermissoes (IDGrupoPermissao, IDInstituicao, Nome, Permissoes) VALUES (?,?,?,?)`,
  //   [id, 475, "admin", JSON.stringify(allPermissions)]
  // );
  // return { id };
  return { id: "123" };
}

async function createAdminUser(roleId: string) {
  await requester("auth/sign-up", "POST", {
    email: "johndoe@email.com",
    password: "123456",
    name: "John Doe",
  });
  // await MysqlDatabase.getInstance().query(
  //   `INSERT INTO cas_usuarios (IDLogin, Senha, IDInstituicao, NumCooperativa, IDUnidadeInst, IDUsuario, NomeCompleto, NomeTratamento, IDGrupoPermissao) VALUES (?,?,?,?,?,?,?,?,?)`,
  //   [
  //     "Navega4133_00",
  //     "1ED442AA8A9E37D5827D2D63B0FC1AA2",
  //     475,
  //     4133,
  //     0,
  //     3,
  //     "John Doe",
  //     "John",
  //     roleId,
  //   ]
  // );
}

// async function createParameters() {
//   await MysqlDatabase.getInstance().query(
//     `INSERT INTO cas_parametrovalor (IDInstituicao, IDParametro, Valor) VALUES (?,?,?)`,
//     [475, 77, 1],
//   );
// }

export async function runSeeds() {
  try {
    // await MysqlDatabase.getInstance().connect();
    const createdRole = await createAdminRole();
    await createAdminUser(createdRole.id);
    // await createParameters();
  } catch (error) {
    console.error(error);
  } finally {
    // await MysqlDatabase.getInstance().disconnect();
  }
}
