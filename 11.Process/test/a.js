let total = 0;
for (let i = 0; i < 100000; i++) {
  total += i;
}
// console.log(total);
process.stdout.write(total + ''); // write的参数只能是 String or Bugger