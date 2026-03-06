export const errorResponse = (res, status, message) => {
    return res.status(status).json({ error: message });
};
