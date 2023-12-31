Array.prototype.sum = function () {
    return this.reduce((a, b) => a + b, 0)
};

Array.prototype.remove = function (v) {
    let i = this.indexOf(v);
    if (i > -1) this.splice(i, 1);
}

Array.prototype.unique = function () {
    return this.filter((e, i) => this.indexOf(e) == i);
}

import { sort } from 'timsort';
Array.prototype.qsort = function (cmp) {
    sort(this, cmp);
    return this;
}

Array.prototype.trans = function () {
    return this[0].map((x, i) => this.map(x => x[i]));
}

Array.prototype.min = function () {
    return Math.min(...this);
}

Array.prototype.max = function () {
    return Math.max(...this);
}

Array.prototype.findIndexes = function (f) {
    return this.map(f).map((e, i) => e ? i : null).filter(e => e != null);
}

Array.prototype.pushIf = function (each, f) {
    const index = this.findIndexes(f);
    if (index.length == 0) this.push(each);
    else {
        this[index[0]] = each;
        index.slice(1).forEach(i => {
            this.splice(i, 1);
        })
    }
}

Math.avg = (d) => {
    return Math.round(d?.sum() / d?.length);
}

Math.std = (d, k) => {
    let mean = Math.avg(d);
    let diff = d?.map(e => (e - mean) * (e - mean)).sum();
    return Math.round(mean + k * Math.sqrt(diff / d?.length));
}

Math.randInt = () => {
    return parseInt(Math.random() * 1000);
}


/**
 * React에서 Object에 prototype function을 만들면 안된다.
 *
 * 그러면 아래 오류 뜨게됨
 * Error occurred prerendering page "/404". Read more: https://nextjs.org/docs/messages/prerender-error TypeError: e.replace is not a function
 */
// Object.prototype.deepdeep = function (b) {
//     const merge = (a, b) => {
//         return Object.entries(b).reduce((o, [k, v]) => {
//             o[k] = v && typeof v === 'object'
//                 ? merge(o[k] = o[k] || (Array.isArray(v) ? [] : {}), v)
//                 : v;
//             return o;
//         }, a);
//     }
//     return [{}, this, b].reduce(merge);
// }