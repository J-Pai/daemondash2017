var pattern = /^\+\d \(\d{3}\) \d{3}-\d{4}$/;
var match = pattern.exec("+1    (111) 111-1111");
console.log(match);
