import mongoose from "mongoose";
import seed_inscricao from "./seed_inscricao";
import seed_usuario from "./seed_usuario";

async function main() {
  try {
    await seed_inscricao();
    await seed_usuario();

    console.log("Seed finalizado com sucesso!")
  } catch (err) {
    console.log(`Erro encontrado ${err}`)
  }finally{
    mongoose.connection.close()
    process.exit(0);
  }
}

main();