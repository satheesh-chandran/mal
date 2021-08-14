const pr_str = function (value) {
  // if (Array.isArray(value)) {
  //   return '(' + value.map(pr_str).join(' ') + ')';
  // }
  return value.toString();
};

module.exports = pr_str;
