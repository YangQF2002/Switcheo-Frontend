// Using iterative approach
var sum_to_n_a = function (n) {
  currSum = 0;
  for (let i = 1; i <= n; i++) {
    currSum += i;
  }
  return currSum;
};

// Using math formula
// Sum to n is a special AP with first term 1 and common difference 1
var sum_to_n_b = function (n) {
  numerator = n * (n + 1);
  denominator = 2;
  return numerator / denominator;
};

// Using recursive approach
var sum_to_n_c = function (n) {
  if ((n == 0) | (n == 1)) {
    return n;
  }
  return n + sum_to_n_c(n - 1);
};
