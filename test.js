//THis is cool
const regex = new RegExp("(\\w+)\//+((?:\\w+)(?:-?\\w+)+).html","g");
const str = `//www.cartoonnetwork.com//games//ren-stimpy.html`;
let m;
//A cool comment for NodeJS file

while ((m = regex.exec(str)) !== null) {
    //// This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    //// The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`);
    });
}
//Fixed a bug that Jared Found!
//ABC
//Found another
