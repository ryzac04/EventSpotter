
/**
 * Utility function to format messages.
 * 
 * @param {any} message
 * @returns {string[]} - array of messages.
 */

const formatMessages = (message) => {
    let messagesArray = [];

    if (Array.isArray(message)) {
        messagesArray = message.flat();
    } else {
        messagesArray = [message];
    }

    return messagesArray.flatMap((msg) =>
        typeof msg === "string" ? msg.split(". ") : msg
    );
};

export { formatMessages };