const utilService = {
    login: (options = {}) => {
        let a = options.arr || [];
        let b = [3,2,4,6];
        let c = Array.from(new Set([...a, ...b]));
        console.log(c);
    },
    logout: () => {
        console.log('logout');
    }
}

export default utilService;