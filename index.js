// Bit decomposition
const bits = function (I) {
  return i;
};

// Bitwise XOR
const xor = function (x, y) {
  return z;
};

// IO send
const give = function (tag, msg) {
  return;
};

// IO receive
const get = function (tag) {
  return msg;
};

// PRF of length m
const F = function (k, x) {
  return x;
};

// KDF of length t
const KDF = function () {
  return k;
};

// 1-out-of-2 OT sending
const send_from_2 = function (X_1, X_2) {
  return;
};

// 1-out-of-2 OT receiving
const receive_from_2 = function (I) {
  return X_I;
};

// 1-out-of-2 OT sending
const send_from_N = function (X, N) {
  const l = Math.ceil(Math.log2(N));  // N = 2^l

  let K = Array(l);
  for (let j = 1; j <= l; j++) {
    K[j] = Array(2);
    for (let b = 0; b <= 1; b++) {
      K[j][b] = KDF();  // {K_{j}}^{b}
    }
  }

  let Y = Array(N);
  for (let I = 1; I <= N; I++) {
    let i = bits(I);  // l bits of I

    let Y[I] = X[I];  // Array(m);
    for (let j = 1; j <= l; j++) {
      let i_j = i[j];
      let K_j = K[j];
      let Kj_ij = K_j[i_j];  // {K_{j}}^{i_j}
      Y[I] = xor(Y[I], F(Kj_ij, I));
    }
  }

  for (let j = 1; j <= l; j++) {
    let K_j = K[j];
    send_from_2(K_j[0], K_j[1]);
  }

  for (let I = 1; I <= N; I++) {
    give(I, Y[I]);  // reveal Y_I
  }
};

// 1-out-of-2 OT receiving
const receive_from_N = function (I, N) {
  const l = Math.ceil(Math.log2(N));  // N = 2^l
  const i = bits(I);  // l bits of I

  let K = Array(l);
  for (let j = 1; j <= l; j++) {
    let i_j = i[j];  // bit j=i_j of I
    K[j] = receive_from_2(i_j);  // pick {K_{j}}^{b} which is also {K_{j}}^{i_j}
  }

  for (let pI = 1; pI <= N; pI++) {
    let pY_pI = get(pI);
    if (pI === I) {
      Y_I = pY_pI;
    }
  }

  let X_I = Y_I;  // Array(m);
  for (let j = 1; j <= l; j++) {
    let Kj_ij = K[j];  // {K_{j}}^{i_j}
    X_I = xor(X_I, F(Kj_ij, I));
  }

  return X_I;
};

module.exports = {
  send: send_from_N,
  receive: receive_from_N
};
