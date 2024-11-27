exports.isValidId = (param_id) => {
    const validId = Number(param_id);

    return (!isNaN(validId) && param_id.length <= 15);
}