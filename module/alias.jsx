import path from 'path';

var o;
if (process.platform == 'linux') {
    o = path.resolve('.');
} else {
    o = path.resolve('.');
}

const adict = {
    "@": o,
    "$": path.join(o, "public"),
    "#": path.join(o, "data", "pred"),
    "&": path.join(o, "data", "stock"),
    "_": path.join(o, "data", "meta"),
}
export default function encode(url) {
    url = url.split('/').filter(e => e);
    url = url.map(e => String(adict[e] ? adict[e] : e));
    return path.join(...url);
}