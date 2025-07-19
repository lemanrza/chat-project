import { getAll } from "../services/userService";
export const getUsers = async (_, res, next) => {
    try {
        const users = await getAll();
        res.status(200).json({
            message: "Users retrieved seccessfully!",
            data: users,
        });
    }
    catch (error) {
        next(error);
    }
};
