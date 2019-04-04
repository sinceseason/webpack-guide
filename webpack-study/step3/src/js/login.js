import '../css/style.css'

console.log('this is login js');

let login = (options = {}) => {
    Object.assign({}, options.obj)
    let a = options.arr || [1,2,3,8];
    let b = [3,2,4,6];
    let c = Array.from(new Set([...a, ...b]));
    console.log("c===", c)
};

login({
    obj: {a: 1}
});