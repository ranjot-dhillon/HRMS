import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: "True" },
  email: { type: String, required: "True" },
  password: { type: String, required: "True" },
  role: { type: String, enum: ["admin", "employee"], required: "True" },
  firstLogin: { type: Boolean, default: true },
  profileImage: { type: String,default:"https://res.cloudinary.com/dnxz8qgy3/image/upload/v1758874816/employees/b2rh4r2mkkyrzyxdw2d7.webp" },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", UserSchema);

export default User;
