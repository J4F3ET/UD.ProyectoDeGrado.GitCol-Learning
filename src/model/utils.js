export const defaultRepository = async (key) => {
    return {
        commits:[],
        information:{
            head: "master",
            repository:`cloud-${key}`,
        }
    }
};
