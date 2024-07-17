
export const useLocalStorage = () => {
    const setItem = (key: string, value: string) => {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error(error);
        }
    };

    const removeItem = (key: string) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(error);
        }
    };

    const getItem = (key: string) => {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error(error);
        }
    };

    return {
        setItem,
        removeItem,
        getItem,
    }
};