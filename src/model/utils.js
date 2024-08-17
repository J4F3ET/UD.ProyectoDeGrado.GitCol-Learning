export const defaultRepository = async (key) => {
    return {
        commits:'[]',
        information:{
            head: null,
            repository:`origin${key}`,
        }
    }
};
