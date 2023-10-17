process.stdin.setEncoding("utf8");
process.stdin.on("data", data => {
    process.stdout.write(data.replace("./", "at "));
});


