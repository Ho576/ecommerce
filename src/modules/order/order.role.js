import { roles } from "../../middleware/auth.js";


export const endPoints = {
    create:[roles.User],
    get:[roles.Admin, roles.User],
    delete:[roles.Admin, roles.User],
}