
/**
 * Utility function to handle error messages
 * 
 * @param {any} error - The error object or message.
 * @returns {string[]} - Array of error messages.
 */

const formatErrorMessages = (error) => {
    let errorMessages = [];

    if (Array.isArray(error)) {
        errorMessages = error.flat();
    } else {
        errorMessages = [error];
    }

    return errorMessages.flatMap((err) =>
        typeof err === "string" ? err.split(". ") : err
    );
};

export { formatErrorMessages };
