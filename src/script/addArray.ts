export function addArray(obj: Object | Array<Object>, cb: (ctx: any) => void) {
  if (obj instanceof Array)
    obj.forEach((item) => {
      cb(item);
    });
  else cb(obj);
}
