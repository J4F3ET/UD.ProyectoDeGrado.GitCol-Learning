export const defaultRepository = (key) => {
    return {
        commits:[],
        information:{
            head: "",
            repository:`cloud-${key}`,
        }
    }
};
