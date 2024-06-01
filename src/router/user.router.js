import { Router } from "express";
import { createUser, loginUser ,logoutUser} from "../controller/user.controller.js";
const router = Router();

router.route("/regester").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);


export default router;