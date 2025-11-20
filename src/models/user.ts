import mongoose, { Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

enum Role {
  ADMIN = "admin",
  CANDIDATO = "candidato",
  AVALIADOR = "avaliador",
  COORDENADOR = "coordenador",
}

export interface UserI {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: Role;
}

class User {
  public model: Model<UserI>;

  constructor() {
    const userSchema = new mongoose.Schema<UserI>(
      {
        name: { type: String },
        email: { type: String },
        password: { type: String },
        phoneNumber: { type: String },
        role: { type: String, enum: Object.values(Role) },
      },
      {
        timestamps: true,
        versionKey: false,
      }
    );

    userSchema.plugin(mongoosePaginate);

    this.model =
      mongoose.models.users || mongoose.model<UserI>("users", userSchema);
  }
}

export default new User().model;
