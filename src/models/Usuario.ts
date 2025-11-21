import mongoose, { Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export enum Role {
  ADMIN = "administrador",
  AVALIADOR = "avaliador",
  COORDENADOR = "coordenador",
}

export interface UsuarioI {
  nome: string;
  email: string;
  senha: string;
  data_nascimento: string;
  telefone: string;
  tokenUnico:string;
  refreshtoken:string;
  accesstoken:string;
  papel: Role;
}

class Usuario {
  public model: Model<UsuarioI>;

  constructor() {
    const userSchema = new mongoose.Schema<UsuarioI>(
      {
        nome: { type: String },
        email: { type: String },
        senha: { type: String },
        data_nascimento: { type: String},
        telefone: { type: String },
        papel: { type: String, enum: Object.values(Role) },
        tokenUnico: { type: String, select: false },
        refreshtoken: { type: String, select: false },
        accesstoken: { type: String, select: false },
      },
      {
        timestamps: true,
        versionKey: false,
      }
    );

    userSchema.plugin(mongoosePaginate);

    this.model = mongoose.model<UsuarioI>("Usuario", userSchema);
  }
}

export default new Usuario().model;
